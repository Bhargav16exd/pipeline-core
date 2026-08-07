import dotenv from "dotenv";
import { Youtuber } from "../models/youtuber-model/youtuber.model";

dotenv.config();

async function initAdmin() {
	const account = await Youtuber.findOne({ username: process.env.ADMIN_USERNAME });

	if (!account) {
		const admin = {
			username: process.env.ADMIN_USERNAME,
			email: process.env.ADMIN_EMAIL,
			role: "YOUTUBER",
			password: process.env.ADMIN_PASSWORD,
			isInTeam: false,
			subscriptionPlan: "DEV_CODE"
		};
		//await Youtuber.create({ ...admin });
	}
}

export { initAdmin };
