const User = require('../models/userModel');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const AppErrorHandler = require('./../utils/appErrorHandler');
const catchAsyncHandler = require('../utils/catchAsyncHandler');


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

	const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_LIFETIME,
	});
	res.status(201).json({
		status: 'Success',
		token,
		data: {
			user: newUser,
		},
	});
});
/*=====================================================================
   signInUser(POST) -> api/v1/users/sign-in
========================================================================*/
exports.signInUser = catchAsyncHandler(async (req, res, next) => {
	const { email, password } = req.body;

	//**************** check if email and password is entered by the user ****************//
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

	const token = user.generateJSONWebToken();
	
	res.status(200).json({
		status: 'Success',
		token
	})
});
/*===========================================================================
   forgotPassword(POST) -> api/v1/users/forgot-password
==============================================================================*/
exports.forgotPassword = catchAsyncHandler (async (req, res, next) => {
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
			message: message
		});

		res.status(200).json({
			status: 'success',
			message: `Email sent to ${user.email}`
		})

	} catch (error) {
		user.resetPasswordToken = undefined;
		user.resetPasswordExpires = undefined;
		await user.save({ validateBeforeSave: false });

		return next(new AppErrorHandler('Error sending email! Try again later.', 500));
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
	//**************** setup new password ****************//
	user.password = req.body.password;
	user.passwordResetToken = undefined;
	user.passwordResetExpires = undefined;
	
	await user.save();

	//******** update changedPasswordAt property for the user ********//

	//**************** sign in user, send JWT ****************//
	const jwtToken = user.generateJSONWebToken();
	//**************** send response ****************//
	res.status(200).json({
		status: 'Success',
		token: jwtToken,
	});
});

/*========================================================================
   updatePassword(PATCH) -> api/v1/users/update-my-password
===========================================================================*/
exports.updatePassword = catchAsyncHandler(async (req, res, next) => {
	//**************** send response ****************//
	res.status(500).json({
		status: 'error',
		results: null,
		message: 'This route has not been defined!',
		data: {},
	});
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
exports.resetPassword = async (req, res) => {
	try {
		const passwordSchema = Joi.object({
			password: passwordComplexity().required().label('Password'),
		});
		const { error } = passwordSchema.validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const user = await User.findOne({ _id: req.params.id });
		if (!user) return res.status(400).send({ message: 'Invalid Link!' });

		const token = await Token.findOne({
			userId: user._id,
			token: req.params.token,
		});
		if (!token) return res.status(400).send({ message: 'Invalid Link!' });

		if (!user.verified) user.verified = true;

		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashPassword = await bcrypt.hash(req.body.password, salt);

		user.password = hashPassword;
		await user.save();
		await token.remove();

		res.status(200).send({ message: 'Password Reset Successfully!' });
	} catch (error) {
		res.status(500).send({ message: 'Internal Server Error!' });
	}
};
