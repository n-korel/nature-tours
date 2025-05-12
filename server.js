import mongoose from 'mongoose';
import config from './config.js';
import app from './app.js';

process.on('unhandledException', (err) => {
	console.log('UNHANDLED EXCEPTION!');
	console.log(err.name, err.message);
	process.exit(1);
});

const DB = config.DATABASE.replace('<PASSWORD>', config.DATABASE_PASSWORD);

mongoose
	.connect(DB, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
	})
	.then(() => console.log('DB connection successful'));

const server = app.listen(config.PORT, () => {
	console.log(`App running on port ${config.PORT}...`);
});

process.on('unhandledRejection', (err) => {
	console.log('UNHANDLED REJECTION!');
	console.log(err.name, err.message);
	server.close(() => {
		process.exit(1);
	});
});

process.on('SIGTERM', () => {
	console.log('SIGTERM RECEIVED. Shutting down gracefully');
	server.close(() => {
		console.log('Process termnated!');
		process.exit(0);
	});
});
