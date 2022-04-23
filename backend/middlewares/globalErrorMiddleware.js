const AppErrorHandler = require('./../utils/appErrorHandler');

const handleCastErrorDB = err => {
	const message = `Invalid ${err.path}: ${err.value}.`;
	return new AppErrorHandler(message, 400);
};

const handleDuplicateFieldsDB = err => {
	const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
	console.log(value);

	const message = `Duplicate field value: ${value}. Use another value!`;
	return new AppErrorHandler(message, 400);
};

const handleJWTError = () =>
	new AppErrorHandler('Invalid Token! Sign in again!', 401);

const handleJWTExpiredError = () =>
	new AppErrorHandler('Token has expired! Sign in again!', 401);

const handleValidationErrorDB = err => {
	const errors = Object.values(err.errors).map(el => el.message);

	const message = `Invalid input data. ${errors.join('. ')}`;
	return new AppErrorHandler(message, 400);
};

const sendErrorDev = (err, res) => {
	res.status(err.statusCode).json({
		status: err.status,
		error: err,
		message: err.message,
		stack: err.stack,
	});
};

const sendErrorProd = (err, res) => {
	//******* Operational, trusted error: send message to client********//
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
		});

		//****** programming or unknown error: don't leak error details'******//
	} else {
		//**************** Log error ****************//
		console.error('ERROR 💥', err);

		//****** send a generic error message ******//
		res.status(500).json({
			status: 'error',
			message: 'Internal Server Error!',
		});
	}
};

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';

	if (process.env.NODE_ENV === 'DEVELOPMENT') {
		sendErrorDev(err, res);
	} else if (process.env.NODE_ENV === 'PRODUCTION') {
		let error = { ...err };

		if (error.name === 'CastError') error = handleCastErrorDB(error);
		if (error.code === 11000) error = handleDuplicateFieldsDB(error);
		if (error.name === 'ValidationError')
			error = handleValidationErrorDB(error);
		if (error.name === 'JsonWebTokenError') error = handleJWTError();
		if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

		sendErrorProd(error, res);
	}
};
