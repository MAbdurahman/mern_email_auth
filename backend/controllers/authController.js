const { User } = require('../models/userModel');
const Token = require('../models/tokenModel');
const sendEmail = require('../utils/sendEmail');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const passwordComplexity = require('joi-password-complexity');

const AppErrorHandler = require('./../utils/appErrorHandler');
const catchAsyncHandler = require('../utils/catchAsyncHandler');

/*============================================================
         SignIn(POST) -> api/v1/auth/sign-in
===============================================================*/
exports.signInUserTwo = async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const user = await User.findOne({ email: req.body.email });
		if (!user)
			return res.status(401).send({ message: 'Invalid Email or Password!' });

		const validPassword = await bcrypt.compare(
			req.body.password,
			user.password
		);
		if (!validPassword)
			return res.status(401).send({ message: 'Invalid Email or Password!' });

		const token = user.generateAuthToken();
		res.status(200).send({ data: token, message: 'Successfully Signed In!' });
	} catch (error) {
		res.status(500).send({ message: 'Internal Server Error!' });
	}
};

/*============================================================
         ResendLink(POST) -> api/v1/auth/resend-link 
===============================================================*/
exports.resendLink = async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const user = await User.findOne({ email: req.body.email });
		if (!user)
			return res.status(401).send({ message: 'Invalid Email or Password!' });

		const validPassword = await bcrypt.compare(
			req.body.password,
			user.password
		);
		if (!validPassword)
			return res.status(401).send({ message: 'Invalid Email or Password!' });

		if (!user.verified) {
			let token = await Token.findOne({ userId: user._id });
			if (!token) {
				token = await new Token({
					userId: user._id,
					token: crypto.randomBytes(32).toString('hex'),
				}).save();
				const url = `${process.env.BASE_URL}/users/${user.id}/verify-user/${token.token}`;
				await sendEmail(user.email, 'Verify Email', url);
			}

			return res
				.status(400)
				.send({ message: 'Please verify, the email sent!' });
		}

		const token = user.generateAuthToken();
		res.status(200).send({ data: token, message: 'Signed in successfully!' });
	} catch (error) {
		res.status(500).send({ message: 'Internal Server Error!' });
	}
};

const validate = data => {
	const schema = Joi.object({
		email: Joi.string().email().required().label('Email'),
		password: Joi.string().required().label('Password'),
	});
	return schema.validate(data);
};

/*===============================================================
   sendPasswordLink(POST) -> api/v1/auth/send-password-link
==================================================================*/
exports.sendPasswordLink = async (req, res) => {
	try {
		const emailSchema = Joi.object({
			email: Joi.string().email().required().label('Email'),
		});
		const { error } = emailSchema.validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		let user = await User.findOne({ email: req.body.email });
		if (!user)
			return res.status(409).send({ message: 'Email Does Not Exist!' });

		let token = await Token.findOne({ userId: user._id });
		if (!token) {
			token = await new Token({
				userId: user._id,
				token: crypto.randomBytes(32).toString('hex'),
			}).save();
		}

		const url = `${process.env.BASE_URL}/reset-password/${user._id}/${token.token}/`;
		await sendEmail(user.email, 'Password Reset', url);

		res.status(200).send({
			message: 'Password reset link sent to your email!',
		});
	} catch (error) {
		res.status(500).send({ message: 'Internal Server Error!' });
	}
};

/*========================================================================
   verifyPasswordLink(POST) -> api/v1/auth/:id/:token
===========================================================================*/
exports.verifyPasswordLink = async (req, res) => {
	try {
		const user = await User.findOne({ _id: req.params.id });
		if (!user) return res.status(400).send({ message: 'Invalid Link!' });

		const token = await Token.findOne({
			userId: user._id,
			token: req.params.token,
		});
		if (!token) return res.status(400).send({ message: 'Invalid Link!' });

		res.status(200).send('Valid Url');
	} catch (error) {
		res.status(500).send({ message: 'Internal Server Error!' });
	}
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
/*===============================================================
   signInUser(POST) -> api/v1/users/sign-in
==================================================================*/
exports.signInUser = catchAsyncHandler(async (req, res, next) => {
	const { email, password } = req.body;

	//**************** check if email and password is entered by the user ****************//
	if (!email || !password) {
		return next(new AppErrorHandler('Please enter email & password!', 400));
	}
	//**************** check if user is in database ****************//
	const user = await User.findOne({ email }).select('+password');

	if (!user) {
		return next(new AppErrorHandler('Invalid Email or Password!', 401));
	}
   //**************** checks if password is correct ****************//
	const isPasswordCorrect = await user.comparePasswords(password);

	if (!isPasswordCorrect) {
		return next(new AppErrorHandler('Invalid Email or Password', 401));
	}

	const token = user.generateJSONWebToken();
	
	res.status(200).json({
		status: 'Success',
		token
	})
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
