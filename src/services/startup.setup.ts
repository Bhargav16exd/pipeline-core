import { Storage } from "@google-cloud/storage";
import ListenToSocket from "../socket/socket";
import initQueues from "./init.queues";
import initWorker from "./upload.status.worker";
import {
	BUCKET_NAME,
	CLOUD_CORS_METHODS,
	CLOUD_CORS_RESPONSE_HEADERS,
	DEV_ENV,
	DEV_ENV_ORIGIN,
	ENVIRONMENT,
	LOCAL_ENV_ORIGIN,
	PROD_ENV,
	PROD_ENV_ORIGIN
} from "../constants";
import { initMinioBucket } from "./init.minio.bucket";

//FUNCTION SETUP CLOUD CORS CONFIGRATION BASED ON ENVIRONMENT
async function setCloudCorsConfig() {
	let ORIGIN = LOCAL_ENV_ORIGIN;

	//@ts-ignore
	if (ENVIRONMENT === DEV_ENV) {
		ORIGIN = DEV_ENV_ORIGIN;
	}
	//@ts-ignore
	else if (ENVIRONMENT === PROD_ENV) {
		ORIGIN = PROD_ENV_ORIGIN;
	}

	const storage = new Storage();

	await storage.bucket(BUCKET_NAME).setCorsConfiguration([
		{
			maxAgeSeconds: 3600,
			method: CLOUD_CORS_METHODS,
			origin: [ORIGIN],
			responseHeader: CLOUD_CORS_RESPONSE_HEADERS
		}
	]);
}

//THIS FUNCTION SETUP ALL REQUIRED COMPONENTS ON SERVER STARTUP
async function startupSetup() {
	await initQueues();
	initWorker();
	await ListenToSocket();
	await setCloudCorsConfig();
	await initMinioBucket();
}

export { startupSetup };
