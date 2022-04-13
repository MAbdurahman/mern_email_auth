const { User } = require('./../models/userModel');
const Token = require('./../models/tokenModel');
const sendEmail = require('./../utils/sendEmail');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');

/*============================================================
         SignIn(POST) -> api/v1/auth/sign-in
===============================================================*/
exports.signInUser = async (req, res) => {
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
			return res
				.status(409)
				.send({ message: 'Email Does Not Exist!' });

		let token = await Token.findOne({ userId: user._id });
		if (!token) {
			token = await new Token({
				userId: user._id,
				token: crypto.randomBytes(32).toString('hex'),
			}).save();
		}

		const url = `${process.env.BASE_URL}/password-reset/${user._id}/${token.token}/`;
		await sendEmail(user.email, 'Password Reset', url);

		res.status(200).send({
			message: 'Password reset link sent to your email!',
		});
	} catch (error) {
		res.status(500).send({ message: 'Internal Server Error!' });
	}
};
