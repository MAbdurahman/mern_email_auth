const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');

const name_pattern =
	/^([a-zA-Z-]{2,}\s[a-zA-z]{1,}'?-?[a-zA-Z]{1,}\s?([a-zA-Z]{1,})?)$/i;
const email_pattern =
	/^[!A-Z0-9#$&?*^~_%+-]+(\.[A-Z0-9!_%+-^]+)*?@[A-Z0-9-]+([A-Z0-9.-])*\.[A-Z]{2,}$/i;

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		required: [true, 'First and last name is required!'],
		minlength: [4, 'Name must be at least 4 characters!'],
		maxLength: [32, 'Name cannot exceed 32 characters!'],
		match: [name_pattern, 'Enter first and last name!'],
	},
	email: {
		type: String,
		trim: true,
		lowercase: true,
		required: [true, 'Email is required!'],
		unique: [true, 'Email already exists!'],
		match: [email_pattern, 'Enter a valid email!'],
	},
	password: {
		type: String,
		required: [true, 'Password is required!'],
		minlength: [8, 'Password must be at least 8 characters!'],
		select: false,
	},
	role: {
		type: String,
		enum: ['user', 'admin'],
		default: 'user',
	},
	active: {
		type: Boolean,
		default: true,
		select: false,
	},
	passwordChangedAt: Date,
	passwordResetToken: String,
	passwordResetExpires: Date,
	createdAt: {
		type: Date,
		default: Date.now,
	}
});

userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_LIFETIME,
	});
	return token;
};
//**************** encrypt password before saving user****************//
userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		next();
	}
	this.password = await bcrypt.hash(this.password, 12);
});

//**************** compare user password ****************//
userSchema.methods.comparePasswords = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

//**************** generate jsonwebtoken ****************//
userSchema.methods.generateJSONWebToken = function () {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_LIFETIME,
	});
};
//**************** changed password after ****************//
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
	if (this.passwordChangedAt) {
		const changedTimestamp = parseInt(
			this.passwordChangedAt.getTime() / 1000,
			10
		);

		return JWTTimestamp < changedTimestamp;
	}

	//****** false means password has not changed ******//
	return false;
};

const User = mongoose.model('User', userSchema);



const validate = data => {
	const schema = Joi.object({
		name: Joi.string().required().label('Name'),
		email: Joi.string().email().required().label('Email'),
		password: passwordComplexity().required().label('Password'),
	});
	return schema.validate(data);
};

module.exports = { User, validate };
