//**************** imports ****************//
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

//**************** regex patterns ****************//
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
	},
});

//**************** encrypt password before saving user****************//
userSchema.pre('save', async function (next) {
   if (!this.isModified('password')) {
		return next();
	}
	this.password = await bcrypt.hash(this.password, 12);
	next();
});

userSchema.pre('save', function (next) {
	if (!this.isModified('password') || this.isNew) {
		return next();
	}
	this.passwordChangedAt = Date.now() - 1000;
	next();
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

//**************** compares passwordChangedAt ****************//
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

//**************** generate password reset token ****************//
userSchema.methods.generatePasswordResetToken = function () {
	//**************** generate the token ****************//
	const resetToken = crypto.randomBytes(32).toString('hex');

	//**************** hash and set to passwordResetToken ****************//
	this.passwordResetToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex');

	console.log({ resetToken }, `passwordResetToken: ${this.passwordResetToken}`);

	//**************** set passwordResetToken to expire ****************//
	this.passwordResetExpires = Date.now() + 30 * 60 * 1000;

	//*********** return the resetToken (non encrypted token) **********//
	return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
