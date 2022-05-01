const User = require('../models/userModel');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const AppErrorHandler = require('./../utils/appErrorHandler');
const catchAsyncHandler = require('../utils/catchAsyncHandler');

/*===============================================================
         createAndSendToken function
==================================================================*/
const createAndSendToken = (user, statusCode, res) => {
	const token = user.generateJSONWebToken();
	res.status(statusCode).json({
		status: 'Success',
		token,
		data: {
			user,
		},
	});
};

/*===============================================================
	signUpUser(POST) -> api/v1/users/sign-up
==================================================================*/
exports.signUpUser = catchAsyncHandler(async (req, res, next) => {
	const { name, email, password } = req.body;

	const newUser = await User.create({
		name,
		email,
		password,
	});

	createAndSendToken(newUser, 201, res);
});
/*=====================================================================
   signInUser(POST) -> api/v1/users/sign-in
========================================================================*/
exports.signInUser = catchAsyncHandler(async (req, res, next) => {
	const { email, password } = req.body;

	//********** check if email and password is entered by the user **********//
	if (!email || !password) {
		return next(new AppErrorHandler('Please enter email & password!', 400));
	}
	//**************** check if user is in database ****************//
	const user = await User.findOne({ email }).select('+password');

	if (!user) {
		return next(new AppErrorHandler('Invalid email or password!', 401));
	}
	//**************** checks if password is correct ****************//
	const isPasswordCorrect = await user.comparePasswords(password);

	if (!isPasswordCorrect) {
		return next(new AppErrorHandler('Invalid email or password', 401));
	}

	createAndSendToken(user, 200, res);
});
/*===========================================================================
   forgotPassword(POST) -> api/v1/users/forgot-password
==============================================================================*/
exports.forgotPassword = catchAsyncHandler(async (req, res, next) => {
	//**************** get user based on email in database ****************//
	const user = await User.findOne({ email: req.body.email });
	if (!user) {
		return next(new AppErrorHandler('User not found with this email!', 404));
	}
	//**************** generate random resetPasswordToken ****************//
	const resetToken = user.generatePasswordResetToken();
	await user.save({ validateBeforeSave: false });

	//**************** send token to user's email ****************//
	try {
		const resetURL = `${req.protocol}://${req.get(
			'host'
		)}/api/v1/users/reset-password/${resetToken}`;

		const message = `To reset your password, click the URL\n ${resetURL} \nIf you did not request a password reset, please ignore this email!`;

		await sendEmail({
			email: user.email,
			subject: 'Email Auth Password Reset',
			message: message,
		});

		res.status(200).json({
			status: 'Success',
			message: `Email sent to ${user.email}`,
		});
	} catch (error) {
		user.resetPasswordToken = undefined;
		user.resetPasswordExpires = undefined;
		await user.save({ validateBeforeSave: false });

		return next(
			new AppErrorHandler('Error sending email! Try again later.', 500)
		);
	}
});
/*===========================================================================
   resetPassword(PATCH) -> api/v1/users/reset-password/:token
==============================================================================*/
exports.resetPassword = catchAsyncHandler(async (req, res, next) => {
	//******** get user based on the token (hash url token) ********//
	const passwordResetToken = crypto
		.createHash('sha256')
		.update(req.params.token)
		.digest('hex');

	const user = await User.findOne({
		passwordResetToken,
		passwordResetExpires: { $gt: Date.now() },
	});

	//*** if token has not expired, and there is user, set the new password ***//
	if (!user) {
		return next(new AppErrorHandler('Invalid or Expired Token!', 400));
	}
	//**************** set new password ****************//
	user.password = req.body.password;
	user.passwordResetToken = undefined;
	user.passwordResetExpires = undefined;

	await user.save();

	/*=====================================================================
         update changedPasswordAt property for the user is preformed
			by the pre 'save' method in the userSchema
===========================================================================*/
	createAndSendToken(user, 200, res);
});

/*========================================================================
   updatePassword(PATCH) -> api/v1/users/update-my-password
===========================================================================*/
exports.updatePassword = catchAsyncHandler(async (req, res, next) => {
	//********** get the user from the database collection **********//
	const user = await User.findById(req.user.id).select('+password');

	//***** check if enteredPassword is same as current password******//
	if (!(await user.comparePasswords(req.body.passwordCurrent))) {
		return next(
			new AppErrorHandler('Current password entered incorrect!', 401)
		);
	}

	/*=================================================================================
         current password is correct, so update with new password
	====================================================================================*/
	user.password = req.body.password;

	/*=================================================================================
      NOTE: findByIdAndUpdate -> pre 'save' functions does not encrypt password
	====================================================================================*/
	await user.save();

	//*********** get jsonwebtoken, to sign in, and send response ***********//
	createAndSendToken(user, 200, res);
});

/*===============================================================
   resetPassword(POST) -> api/v1/auth/:id/:token
==================================================================*/
/*===============================================================
   resetPassword(POST) -> api/v1/auth/:id/:token
==================================================================*/
/*===============================================================
   resetPassword(POST) -> api/v1/auth/:id/:token
==================================================================*/
/*===============================================================
   resetPassword(POST) -> api/v1/auth/:id/:token
==================================================================*/
/*===============================================================
   resetPassword(POST) -> api/v1/auth/:id/:token
==================================================================*/
/*===============================================================
   resetPassword(POST) -> api/v1/auth/:id/:token
==================================================================*/
/*===============================================================
   resetPassword(POST) -> api/v1/auth/:id/:token
==================================================================*/
/*===============================================================
   resetPassword(POST) -> api/v1/auth/:id/:token
==================================================================*/
/*===============================================================
   resetPassword(POST) -> api/v1/auth/:id/:token
==================================================================*/
/*===============================================================
   resetPassword(POST) -> api/v1/auth/:id/:token
==================================================================*/
