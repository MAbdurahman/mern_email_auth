const express = require('express');
const { resendLink } = require('./../controllers/authControllers');


//**************** variables ****************//
const router = express.Router();

//**************** auth routes ****************//
router.route('/resend-link').post(resendLink);

module.exports = router;

