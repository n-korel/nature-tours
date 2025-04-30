import express from 'express';
import { getOverview, getTour, getLoginForm } from '../controllers/viewsController.js';
import { protect } from '../controllers/authController.js';

const router = express.Router();

router.get('/', getOverview);

router.get('/tour/:slug', protect, getTour);

router.get('/login', getLoginForm);

export default router;
