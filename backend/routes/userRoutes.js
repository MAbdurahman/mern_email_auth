const express = require('express');
const { getAllUsers, signUpUser, verifyUser } = require('./../controllers/userControllers');

//**************** variables ****************//
const router = express.Router();

//**************** user routes ****************//
router.route('/sign-up').post(signUpUser);
router.route('/:id/verify-user/:token').get(verifyUser);
router.route('/all-users').get(getAllUsers);

module.exports = router;