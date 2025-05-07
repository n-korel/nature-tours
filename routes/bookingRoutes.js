import express from 'express';
import { protect } from '../controllers/authController.js';
import getCheckoutSesion from '../controllers/bookingController.js';

const router = express.Router();

router.get('/checkout-session/:tourId', protect, getCheckoutSesion);

export default router;
