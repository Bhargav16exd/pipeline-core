import fs from "fs";
import {
	MINIO_ENDPOINT,
	MINIO_PORT,
	MINIO_PUBLIC_BUCKET_NAME,
	minIOClient
} from "./init.minio.bucket";

export const uploadFileToObjectStore = async (file: Express.Multer.File): Promise<string> => {
	await minIOClient.fPutObject(`${MINIO_PUBLIC_BUCKET_NAME}`, file.originalname, file.path);

	const objectUrl =
		`http://${MINIO_ENDPOINT}:${MINIO_PORT}` +
		`/${MINIO_PUBLIC_BUCKET_NAME}` +
		`/${encodeURIComponent(file.originalname)}`;

	fs.unlinkSync(`${file.destination}/${file.originalname}`);
	return objectUrl;
};
