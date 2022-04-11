const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');

const userSchema = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	isAdmin: { type: Boolean, required: true, default: false},
	verified: { type: Boolean, default: false },
});

userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_LIFETIME,
	});
	return token;
};

const User = mongoose.model('User', userSchema);

const validate = data => {
	const schema = Joi.object({
		fullName: Joi.string().required().label('Name'),
		email: Joi.string().email().required().label('Email'),
		password: passwordComplexity().required().label('Password'),
	});
	return schema.validate(data);
};

module.exports = { User, validate };
