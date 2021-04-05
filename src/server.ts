import 'reflect-metadata';
import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';
import './database';
import AppError from './errors/AppError';
import uploadConfig from './config/upload';
import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost:27017/tmp', { useNewUrlParser: true });

import routes from './routes';

const app = express();
app.use('/files', express.static(uploadConfig.tmpFolder));
app.use(cors());
app.use(express.json());
app.use(routes);

app.use(
	(err: Error, request: Request, response: Response, next: NextFunction) => {
		if (err instanceof AppError) {
			return response.status(err.statusCode).json({
				status: 'error',
				message: err.message,
			});
		}
		console.error(err);
		return response.status(500).json({
			status: 'error',
			message: 'Internal server error',
		});
	},
);
app.listen(3344, () => {
	console.log('🚀 server started traveler-backend on port 3344');
});