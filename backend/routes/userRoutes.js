const express = require('express');
const {
	getAllUsers,
	createUser,
	getSingleUser,
	updateUser,
	deleteUser,
} = require('../controllers/userController');
const { signInUser, signUpUser } = require('./../controllers/authController');

//**************** variables ****************//
const router = express.Router();

//**************** auth routes ****************//
router.route('/sign-up').post(signUpUser);
router.route('/sign-in').post(signInUser);
//**************** user routes ****************//
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getSingleUser).patch(updateUser).delete(deleteUser);

//**************** old user routes ****************//
/* router.route('/sign-up').post(signUpUser); */
/* router.route('/:id/verify-user/:token').get(verifyUser); */
/* router.route('/all-users').get(getAllUsers); */

module.exports = router;
