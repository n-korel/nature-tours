import express from 'express';
import {
	signup,
	login,
	forgotPassword,
	resetPassword,
	updatePassword,
	protect,
	restrictTo,
	logout,
} from '../controllers/authController.js';
import {
	getAllUsers,
	createUser,
	getUser,
	updateUser,
	deleteUser,
	updateMe,
	deleteMe,
	getMe,
} from '../controllers/userController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

// only after this middleware (protect), all bottom routes are protected (sequence middleware)
router.use(protect);

router.patch('/updateMyPassword', updatePassword);

router.get('/me', getMe, getUser);
router.patch('/updateMe', updateMe);
router.delete('/deleteMe', deleteMe);

// only after this, all bottom routes need to be the admin (sequence middleware)
router.use(restrictTo('admin'));

router.route('/').get(getAllUsers).post(createUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default router;
