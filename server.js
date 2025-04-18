import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app.js';

process.on('unhandledException', (err) => {
	console.log('UNHANDLED EXCEPTION!');
	console.log(err.name, err.message);
	process.exit(1);
});

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
	.connect(DB, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
	})
	.then(() => console.log('DB connection successful'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
	console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
	console.log('UNHANDLED REJECTION!');
	console.log(err.name, err.message);
	server.close(() => {
		process.exit(1);
	});
});
