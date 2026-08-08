import * as Minio from "minio";

const BUCKET_NAME = process.env.MINIO_BUCKET_NAME;
const BUCKET_TYPE = process.env.MINIO_BUCKET_TYPE;

const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY || "";
const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY || "";
const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT || "";
const MINIO_PORT = process.env.MINIO_PORT || "";

const MINIO_PUBLIC_BUCKET_NAME = `${BUCKET_NAME}.${BUCKET_TYPE}`;

const minIOClient = new Minio.Client({
	endPoint: MINIO_ENDPOINT,
	port: Number(MINIO_PORT),
	useSSL: false,
	accessKey: MINIO_ACCESS_KEY,
	secretKey: MINIO_SECRET_KEY
});

const initMinioBucket = async () => {
	const isBucketExist = await minIOClient.bucketExists(MINIO_PUBLIC_BUCKET_NAME);
	if (!isBucketExist) {
		await minIOClient.makeBucket(MINIO_PUBLIC_BUCKET_NAME, "ap-south-1");
		const publicPolicy = {
			Version: "2012-10-17",
			Statement: [
				{
					Sid: "PublicReadGetObject",
					Effect: "Allow",
					Principal: "*",
					Action: ["s3:GetObject"],
					Resource: "arn:aws:s3:::pipeline.public/*"
				}
			]
		};
		await minIOClient.setBucketPolicy(MINIO_PUBLIC_BUCKET_NAME, JSON.stringify(publicPolicy));
	}
};

export { initMinioBucket, minIOClient, MINIO_PUBLIC_BUCKET_NAME, MINIO_ENDPOINT, MINIO_PORT };
