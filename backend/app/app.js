//**************** imports ****************//
const express = require('express');
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

//**************** import all routes ****************//

//**************** app routes ****************//
app.get('/api/v1', (req, res) => {
	res.send('Welcome MERN Email Auth!');
});

//**************** handle errors middleware ****************//

module.exports = app;
