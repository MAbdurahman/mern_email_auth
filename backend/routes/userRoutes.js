const express = require('express');
const {
	getAllUsers,
	createUser,
	getSingleUser,
	updateUser,
	deleteUser,
} = require('../controllers/userController');
const {
	signInUser,
	signUpUser,
	forgotPassword,
	resetPassword,
	updatePassword,
} = require('./../controllers/authController');
const isAuthenticated = require('./../middlewares/authenticateMiddleware');
const isAuthorized = require('./../middlewares/authorizeMiddleware');

//**************** variables ****************//
const router = express.Router();

//**************** auth routes ****************//
router.route('/sign-up').post(signUpUser);
router.route('/sign-in').post(signInUser);
router.route('/forgot-password').post(forgotPassword);
router.route('/reset-password/:token').patch(resetPassword);
router.route('/update-my-password').patch(updatePassword);
//**************** user routes ****************//
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getSingleUser).patch(updateUser).delete(deleteUser);

//**************** old user routes ****************//
/* router.route('/sign-up').post(signUpUser); */
/* router.route('/:id/verify-user/:token').get(verifyUser); */
/* router.route('/all-users').get(getAllUsers); */

module.exports = router;
