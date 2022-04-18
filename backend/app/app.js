//**************** imports ****************//
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

//**************** setting up config file ****************//
if (process.env.NODE_ENV !== 'PRODUCTION')
	require('dotenv').config({ path: 'backend/config/config.env' });
//**************** variables ****************//
const app = express();

//**************** middleware****************//
if (process.env.NODE_ENV !== 'PRODUCTION') {
	app.use(morgan('dev'));
}
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
	req.requestTime = new Date().toISOString();
	next();
})
//**************** import all routes ****************//
const userRoutes = require('./../routes/userRoutes');
const authRoutes = require('./../routes/authRoutes');
//**************** app routes ****************//
app.get('/api/v1', (req, res) => {
	res.status(200).json({
		requestAt: req.requestTime,
		app: 'mern_email_auth',
		message: 'Welcome to MERN Email Auth!',
	});
});
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes);

//**************** handle errors middleware ****************//

module.exports = app;
