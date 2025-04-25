import express from 'express';
import { protect, restrictTo } from '../controllers/authController.js';
import {
	createReview,
	getAllReviews,
	deleteReview,
	updateReview,
	setTourUserIds,
	getReview,
} from '../controllers/reviewController.js';

const router = express.Router({ mergeParams: true });

// only after this middleware (protect), all bottom routes are protected (sequence middleware)
router.use(protect);

router.route('/').get(getAllReviews).post(restrictTo('user'), setTourUserIds, createReview);

router
	.route('/:id')
	.get(getReview)
	.patch(restrictTo('user', 'admin'), updateReview)
	.delete(restrictTo('user', 'admin'), deleteReview);

export default router;
