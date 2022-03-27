const mongoose = require('mongoose');
const colors = require('colors');

const connectDatabase = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log(
			`MongoDB connected to ${conn.connection.host} with mongoose`.blue
				.italic
		);
	} catch (error) {
		console.error(`Error: ${error.message}`.red);
		process.exit(1);
	}
};

module.exports = connectDatabase;
