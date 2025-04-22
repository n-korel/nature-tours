import express from 'express';
import {
	signup,
	login,
	forgotPassword,
	resetPassword,
	updatePassword,
	protect,
} from '../controllers/authController.js';
import {
	getAllUsers,
	createUser,
	getUser,
	updateUser,
	deleteUser,
	updateMe,
	deleteMe,
} from '../controllers/userController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

router.patch('/updateMyPassword', protect, updatePassword);

router.patch('/updateMe', protect, updateMe);
router.delete('/deleteMe', protect, deleteMe);

router.route('/').get(getAllUsers).post(createUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default router;
