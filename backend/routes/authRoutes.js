const express = require('express');
const { resendLink, signInUser, sendPasswordLink } = require('./../controllers/authControllers');


//**************** variables ****************//
const router = express.Router();

//**************** auth routes ****************//
router.route('/resend-link').post(resendLink);
router.route('/sign-in').post(signInUser);
router.route('/send-password-link').post(sendPasswordLink);

module.exports = router;

