import app, { socketApp } from "./app";
import { exit } from "process";
import { startupSetup } from "./services/startup.setup";
import connectToDatabase from "./database/db";

//constants
const APPLICATION_PORT = process.env.APPLICATION_PORT;
const WEBSOCKET_PORT = process.env.WEBSOCKET_PORT;

connectToDatabase()
	.then(() => {
		app.listen(APPLICATION_PORT, () => {
			console.log(`Server is up and running on PORT : ${APPLICATION_PORT}`);
		});

		socketApp.listen(WEBSOCKET_PORT, () => {
			console.log(`Socket Server is up and Running on PORT : ${WEBSOCKET_PORT}`);
		});

		//Perform Setup
		startupSetup();
	})
	.catch((err) => {
		console.log(`Some unexpected error has occured while connecting to DB : ${err}`);
		exit(1);
	});
