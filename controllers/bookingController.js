import Stripe from 'stripe';
import Tour from '../models/tourModel.js';
import catchAsync from '../utils/catchAsync.js';
import Booking from '../models/bookingModel.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const getCheckoutSesion = catchAsync(async (req, res, next) => {
	// 1. Get the currently booked tour
	const tour = await Tour.findById(req.params.tourId);

	// 2. Create checkout session
	const session = await stripe.checkout.sessions.create({
		payment_method_types: ['card'],
		mode: 'payment',
		success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
		cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
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
						images: [`https://natours.dev/img/tours/${tour.imageCover}`],
					},
				},
				quantity: 1,
			},
		],
	});

	// 3. Create session as response
	res.status(200).json({
		status: 'success',
		session,
	});
});

export const createBookingCheckout = catchAsync(async (req, res, next) => {
	// the temporary method, because it's unsecure, everyone can make bookings without paying
	const { tour, user, price } = req.query;

	if (!tour && !user && !price) {
		return next();
	}
	await Booking.create({ tour, user, price });

	res.redirect(req.originalUrl.split('?')[0]);
});
