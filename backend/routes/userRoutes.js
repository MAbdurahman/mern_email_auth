const express = require('express');
const {
	getAllUsers,
	createUser,
	getSingleUser,
	updateUser,
	deleteUser,
	signUpUser,
	verifyUser,
} = require('../controllers/userController');

//**************** variables ****************//
const router = express.Router();

//**************** user routes ****************//
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getSingleUser).patch(updateUser).delete(deleteUser);

//**************** old user routes ****************//
router.route('/sign-up').post(signUpUser);
router.route('/:id/verify-user/:token').get(verifyUser);
router.route('/all-users').get(getAllUsers);

module.exports = router;
