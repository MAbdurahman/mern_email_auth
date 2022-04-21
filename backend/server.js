//**************** imports ****************//
const app = require('./app/app');
const dotenv = require('dotenv');
const colors = require('colors');
const connectDatabase = require('./config/databaseConfig');

//**************** handling Uncaught exceptions ****************//
process.on('uncaughtException', err => {
	console.log(`ERROR: ${err.name} -> ${err.message}`.red);
	console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...'.red);
	process.exit(1);
});

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
//**************** handling unhandled promise rejection ****************//
process.on('unhandledRejection', err => {
	console.log(`ERROR: ${err.name} -> ${err.message}`.red);
	console.log('UNHANDLED REJECTION! 💥 Shutting down the server...'.red);
	server.close(() => {
		process.exit(1);
	});
});