import dotenv from 'dotenv';

dotenv.config({ path: './config.env' });

const config = {
	NODE_ENV: process.env.NODE_ENV,
	DATABASE: process.env.DATABASE,
	DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
	PORT: process.env.PORT || 3000,
};

export default config;
