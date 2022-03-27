//**************** imports ****************//
const app = require('./app/app');
const dotenv = require('dotenv');
const colors = require('colors');
const connectDatabase = require('./config/databaseConfig');

//**************** configuration setup ****************//
dotenv.config({ path: 'backend/config/config.env' });
colors.enable();
//**************** variables ****************//
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV;

//**************** connect to database ****************//
connectDatabase();

//**************** app listening ****************//
const server = app.listen(PORT, () => {
	console.log(
		`The server is listening at - http://127.0.0.1:${PORT} in ${NODE_ENV} mode🔥`
			.yellow
	);
});
