const express = require('express');
const {
	resendLink,
	resetPassword,
	signInUser,
	sendPasswordLink,
	verifyPasswordLink,
} = require('./../controllers/authControllers');

//**************** variables ****************//
const router = express.Router();

//**************** auth routes ****************//
router.route('/resend-link').post(resendLink);
router.route('/sign-in').post(signInUser);
router.route('/send-password-link').post(sendPasswordLink);
router.route('/:id/:token').get(verifyPasswordLink);
router.route('/reset-password/:id/:token').post(resetPassword);

module.exports = router;
