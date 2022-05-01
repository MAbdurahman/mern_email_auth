const express = require('express');
const {
	getAllUsers,
	createUser,
	getSingleUser,
	updateUser,
	deleteUser,
	updateMyProfile,
	deleteMyProfile
} = require('../controllers/userController');
const {
	signInUser,
	signUpUser,
	forgotPassword,
	resetPassword,
	updatePassword,
} = require('./../controllers/authController');
const {
	isAuthenticatedUser,
	isAuthorizedUser,
} = require('./../middlewares/authMiddlewares');

//**************** variables ****************//
const router = express.Router();

//**************** auth routes ****************//
router.route('/sign-up').post(signUpUser);
router.route('/sign-in').post(signInUser);
router.route('/forgot-password').post(forgotPassword);
router.route('/reset-password/:token').patch(resetPassword);
router.route('/update-my-password').patch(isAuthenticatedUser, updatePassword);
//**************** user routes ****************//
router.route('/update-my-profile').patch(isAuthenticatedUser, updateMyProfile);
router.route('/delete-my-profile').delete(isAuthenticatedUser, deleteMyProfile);


router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getSingleUser).patch(updateUser).delete(deleteUser);

module.exports = router;
