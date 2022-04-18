const { User, validate } = require('./../models/userModel');
const Token = require('./../models/tokenModel');
const sendEmail = require('./../utils/sendEmail');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

/*=========================================================
      SignUp User(POST) -> api/v1/users/sign-up
============================================================*/
exports.signUpUser = async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		let user = await User.findOne({ email: req.body.email });
		if (user)
			return res
				.status(409)
				.send({ message: 'Email Already Exist!' });

		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashPassword = await bcrypt.hash(req.body.password, salt);

		user = await new User({ ...req.body, password: hashPassword }).save();

		const token = await new Token({
			userId: user._id,
			token: crypto.randomBytes(32).toString('hex'),
		}).save();

		const url = `${process.env.BASE_URL}/auth/${user.id}/verify-user/${token.token}`;
		await sendEmail(user.email, 'Verify Email', url);

		res.status(201).send({
			message: 'Please verify, the email sent!'
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: 'Internal Server Error' });
	}
};

/*===============================================================
      VerifyUser(GET) -> api/v1/users/:id/verify-user/:token
==================================================================*/
exports.verifyUser = async( req, res ) => {
   try {
		const user = await User.findOne({ _id: req.params.id });
		if (!user) return res.status(400).send({ message: 'Invalid Link!' });

		const token = await Token.findOne({
			userId: user._id,
			token: req.params.token,
		});
		if (!token) return res.status(400).send({ message: 'Invalid Link!' });

		await User.updateOne({ _id: user._id, verified: true });
		await token.remove();

		res.status(200).send({ message: 'Email Verified Successfully!' });

	} catch (error) {
		res.status(500).send({ message: 'Internal Server Error!' });
	}
}


/*===============================================================
      getAllUsers(GET) -> api/v1/users/
==================================================================*/
exports.getAllUsers = async (req, res) => {
	const users = await User.find({});

	//**************** send response ****************//
	res.status(200).json({
		status: 'success',
		results: users.length,
		data: {
			users,
		},
	});
}
/*===============================================================
      createUser(POST) -> api/v1/users/
==================================================================*/
exports.createUser = async (req, res) => {
	//**************** send response ****************//
	res.status(500).json({
		status: 'error',
		results: null,
		message: 'This route has not been defined!',
		data: {},
	});
}
/*===============================================================
      getSingleUser(GET) -> api/v1/users/:id
==================================================================*/
exports.getSingleUser = async (req, res) => {
	//**************** send response ****************//
	res.status(500).json({
		status: 'error',
		results: null,
		message: 'This route has not been defined!',
		data: {},
	});
}
/*===============================================================
      updateUser(PATCH) -> api/v1/users/:id
==================================================================*/
exports.updateUser = async (req, res) => {
	//**************** send response ****************//
	res.status(500).json({
		status: 'error',
		results: null,
		message: 'This route has not been defined!',
		data: {},
	});
};
/*===============================================================
      deleteUser(DELETE) -> api/v1/users/:id
==================================================================*/
exports.deleteUser = async (req, res) => {
	//**************** send response ****************//
	res.status(500).json({
		status: 'error',
		results: null,
		message: 'This route has not been defined!',
		data: {},
	});
};
/*===============================================================
      VerifyUser(GET) -> api/v1/users/:id/verify-user/:token
==================================================================*/