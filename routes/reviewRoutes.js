import express from 'express';
import { protect, restrictTo } from '../controllers/authController.js';
import { createReview, getAllReviews, deleteReview } from '../controllers/reviewController.js';

const router = express.Router({ mergeParams: true });

router.route('/').get(getAllReviews).post(protect, restrictTo('user'), createReview);
router.route('/:id').delete(deleteReview);

export default router;
