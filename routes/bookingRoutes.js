import express from 'express';
import { protect, restrictTo } from '../controllers/authController.js';
import {
	createBooking,
	deleteBooking,
	getAllBooking,
	getBooking,
	getCheckoutSesion,
	getMyToursBooking,
	updateBooking,
} from '../controllers/bookingController.js';

const router = express.Router();

router.use(protect);

router.get('/checkout-session/:tourId', getCheckoutSesion);

router.get('/my-tours', getMyToursBooking);

router.use(restrictTo('admin', 'lead-guide'));

router.route('/').get(getAllBooking).post(createBooking);

router.route('/:id').get(getBooking).patch(updateBooking).delete(deleteBooking);

export default router;
