import express from 'express';
import { protect, restrictTo } from '../controllers/authController.js';
import { createReview, getAllReviews } from '../controllers/reviewController.js';

const router = express.Router();

router.route('/').get(getAllReviews).post(protect, restrictTo('user'), createReview);

export default router;
