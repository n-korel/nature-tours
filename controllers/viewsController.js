import Booking from '../models/bookingModel.js';
import Tour from '../models/tourModel.js';
import User from '../models/userModel.js';
import AppError from '../utils/appError.js';
// import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

export const alerts = (req, res, next) => {
	const { alert } = req.query;
	if (alert === 'booking') {
		res.locals.alert =
			"Your booking was successful! Please check your email for a confirmation. If your booking doesn't show up here immdiatly, please come back later.";
	}
	next();
};

export const getOverview = catchAsync(async (req, res, next) => {
	// 1. Get tour data from colletction
	const tours = await Tour.find();

	// 2. Build template
	// 3. Render that template using tour data from 1.
	res.status(200).render('overview', {
		title: 'All Tours',
		tours,
	});
});

export const getTour = catchAsync(async (req, res, next) => {
	// 1. Get tour data from colletction
	const tour = await Tour.findOne({ slug: req.params.slug }).populate({
		path: 'reviews',
		fields: 'review rating user',
	});

	if (!tour) {
		return next(new AppError('There is no tour with that name.', 404));
	}

	// 2. Build template
	// 3. Render that template using tour data from 1.

	res.status(200).render('tour', {
		title: `${tour.name} tour`,
		tour,
	});
});

export const getLoginForm = (req, res) => {
	res.status(200).render('login', {
		title: 'Log into your account',
	});
};

export const getAccount = (req, res) => {
	res.status(200).render('account', {
		title: 'Your account',
	});
};

export const getMyTours = catchAsync(async (req, res, next) => {
	// 1. Find all bookings
	const bookings = await Booking.find({ user: req.user.id });

	// 2. Find tours with the returned IDs
	const tourIDs = bookings.map((el) => el.tour);
	const tours = await Tour.find({ _id: { $in: tourIDs } });

	res.status(200).render('overview', {
		title: 'My Tours',
		tours,
	});
});

export const updateUserData = catchAsync(async (req, res, next) => {
	const updatedUser = await User.findByIdAndUpdate(
		req.user.id,
		{
			name: req.body.name,
			email: req.body.email,
		},
		{
			new: true,
			runValidators: true,
		},
	);

	res.status(200).render('account', {
		title: 'Your account',
		user: updatedUser,
	});
});
