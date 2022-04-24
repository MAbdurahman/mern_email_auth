const User = require('./../models/userModel');
const AppErrorHandler = require('./../utils/appErrorHandler');
const catchAsyncHandler = require('../utils/catchAsyncHandler');
const jwt = require('jsonwebtoken');

/*===============================================================
      checks authorization of user
==================================================================*/
exports.isAuthorized = (...roles) => {
	return (req, res, next) => {
		//**************** roles['admin', 'other']. role='user'****************//
		if (!roles.includes(req.user.role)) {
			return next(
				new AppErrorHandler(
					`Role (${req.user.role}) is not allowed to access this resource`,
					403
				)
			);
		}

		next();
	};
};