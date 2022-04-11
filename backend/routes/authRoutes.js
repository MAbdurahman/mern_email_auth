const express = require('express');
const { resendLink, signInUser } = require('./../controllers/authControllers');


//**************** variables ****************//
const router = express.Router();

//**************** auth routes ****************//
router.route('/resend-link').post(resendLink);
router.route('/sign-in').post(signInUser);

module.exports = router;

