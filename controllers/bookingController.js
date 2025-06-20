import Stripe from 'stripe';
import Tour from '../models/tourModel.js';
import catchAsync from '../utils/catchAsync.js';
import Booking from '../models/bookingModel.js';
import { createOne, deleteOne, getAll, getOne, updateOne } from './handlerFactory.js';
import User from '../models/userModel.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const getCheckoutSesion = catchAsync(async (req, res, next) => {
	try {
		const tour = await Tour.findById(req.params.tourId);
		if (!tour) {
			return res.status(404).json({ status: 'fail', message: 'Tour not found' });
		}

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			mode: 'payment',
			success_url: `${process.env.FRONTEND_URL}/tours/${tour.slug}/booking?success=true`,
			cancel_url: `${process.env.FRONTEND_URL}/tours/${tour.slug}/booking?canceled=true`,
			customer_email: req.user.email,
			client_reference_id: req.params.tourId,
			line_items: [
				{
					price_data: {
						currency: 'usd',
						unit_amount: tour.price * 100,
						product_data: {
							name: `${tour.name} Tour`,
							description: tour.summary,
							images: [`${process.env.FRONTEND_URL}/img/tours/${tour.imageCover}`],
						},
					},
					quantity: 1,
				},
			],
		});

		res.status(200).json({
			status: 'success',
			session,
		});
	} catch (err) {
		return res.status(500).json({ status: 'error', message: 'Could not create Stripe session' });
	}
});

const createBookingCheckout = async (session) => {
	const tour = session.client_reference_id;
	const user = (await User.findOne({ email: session.customer_email })).id;

	const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
		limit: 1,
	});

	const price = lineItems.data[0].amount_total
		? lineItems.data[0].amount_total / 100
		: lineItems.data[0].price.unit_amount / 100;

	await Booking.create({ tour, user, price });
};

export const webhookCheckout = (req, res, next) => {
	const signature = req.headers['stripe-signature'];

	let event;
	try {
		event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
	} catch (err) {
		return res.status(400).send(`Webhook error: ${err.message}`);
	}

	if (event.type === 'checkout.session.completed') {
		createBookingCheckout(event.data.object);
	}

	res.status(200).json({ received: true });
};

export const getMyToursBooking = catchAsync(async (req, res, next) => {
	const bookings = await Booking.find({ user: req.user.id }).populate('tour');

	const tours = bookings.map((booking) => booking.tour);

	res.status(200).json({
		status: 'success',
		results: tours.length,
		data: {
			tours,
		},
	});
});

export const createBooking = createOne(Booking);
export const getBooking = getOne(Booking);
export const getAllBooking = getAll(Booking);
export const updateBooking = updateOne(Booking);
export const deleteBooking = deleteOne(Booking);
