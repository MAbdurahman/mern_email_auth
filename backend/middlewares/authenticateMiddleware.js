const User = require('./../models/userModel');
const AppErrorHandler = require('./../utils/appErrorHandler');
const catchAsyncHandler = require('../utils/catchAsyncHandler');
const jwt = require('jsonwebtoken');

/*===============================================================
      checks authentication of user
==================================================================*/
exports.isAuthenticated = catchAsyncHandler(async (req, res, next) => {
	//*************** if there is a token, get it ****************//
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		token = req.headers.authorization.split(' ')[1];
	} else if (req.cookies.jwt) {
		token = req.cookies.jwt;
	}

	if (!token) {
		return next(new AppErrorHandler('Sign in to access this resource!', 401));
	}

	//**************** verify token ****************//
	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

	//**************** check if user exists ****************//
	const currentUser = await User.findById(decoded.id);
	if (!currentUser) {
		return next(new AppErrorHandler('Current user does not exist!', 401));
	}
	//**************** check if user changed password ****************//
	if (currentUser.changedPasswordAfter(decoded.iat)) {
		return next(new AppError('Password changed! Sign in again!', 401));
	}

	//**************** grant access to route ****************//
	req.user = currentUser;
	res.locals.user = currentUser;
	next();
});
