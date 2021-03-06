import multer, { StorageEngine } from 'multer';
import path from 'path';
import crypto from 'crypto';
// import { S3 } from 'aws-sdk';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp', 'uploads');

interface IUploadConfig {
	driver: 's3' | 'disk';

	tmpFolder: string;
	uploadsFolder: string;

	multer: {
		storage: StorageEngine;
	};
	config: {
		disk: {};
		aws: {
			bucket: string;
		};
	};
}

export default {
	driver: process.env.STORAGE_DRIVER,

	tmpFolder,
	uploadsFolder: path.resolve(tmpFolder, 'uploads'),

	multer: {
		storage: multer.diskStorage({
			destination: tmpFolder,
			filename(request, file, callback) {
				const fileHash = crypto.randomBytes(10).toString('hex');
				const fileName = `${fileHash}-${file.originalname}`;
				return callback(null, fileName);
			},
		}),
	},
	config: {
		disk: {},
		aws: {
			bucket: 'app-barbers',
		},
	},
} as IUploadConfig;
