import express from 'express';
import {
	aliasTopTours,
	getAllTours,
	getTour,
	createTour,
	updateTour,
	deleteTour,
	getTourStats,
	getMonthlyPlan,
} from '../controllers/tourController.js';
import { protect } from '../controllers/authController.js';

const router = express.Router();

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

router.route('/tour-stats').get(getTourStats);

router.route('/monthly-plan/:year').get(getMonthlyPlan);

router.route('/').get(protect, getAllTours).post(createTour);

router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

export default router;
