const express = require('express');
const { signUpUser, verifyUser } = require('./../controllers/userControllers');

//**************** variables ****************//
const router = express.Router();

//**************** auth routes ****************//
router.route('/sign-up').post(signUpUser);
router.route('/:id/verify-user/:token').get(verifyUser);

module.exports = router;