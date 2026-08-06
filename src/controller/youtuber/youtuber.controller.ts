import { NextFunction, Request, Response } from "express";
import errResponse, { emptyInputValidatorHanlder } from "../../utils/errResponse";
import { Youtuber } from "../../models/youtuber-model/youtuber.model";
import { Code } from "../../models/dev-code.model";
import sucResponse from "../../utils/sucResponse";
import { sendOnBoardEmailYoutuber } from "../../services/email.service";
import createFolderInStorageBucket from "../../services/create.folder.gcp";
import mongoose from "mongoose";
import { createTeam, linkYoutuberTeam } from "../../services/team.utils";
import { SubscriptionTypeEnum } from "../../types/subscription.types";

/*
  Endpoint : /api/youtuber/code/signup
  Working  : Creates Account of Youtuber 
  Category : API Controller
*/

export const signup = async (req: Request, res: Response, next: NextFunction) => {
	// ---- creating transaction for account creation ----
	const accountCreationSession = await mongoose.startSession();

	try {
		const { name, email, password, username, role, code } = req.body;
		emptyInputValidatorHanlder({ name, email, password, username, role, code }, res);

		const regex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,20}$/;
		if (!regex.test(password)) {
			throw new errResponse(
				"Password must be 8-20 characters long and include at least 1 uppercase letter, 1 lowercase letter, 1 digit, 1 special character, and no spaces.",
				400
			);
		}

		accountCreationSession.startTransaction();

		const youtuber = await Youtuber.create(
			[
				{
					name,
					username,
					password,
					email,
					role,
					subscriptionPlan: SubscriptionTypeEnum.DEV_CODE
				}
			],
			{ session: accountCreationSession }
		);

		//Get Code from db and update it
		await Code.updateOne(
			{
				email,
				code
			},
			{
				redeemed: true
			},
			{ session: accountCreationSession }
		);

		const team = await createTeam(youtuber[0]._id, youtuber[0].username);
		await linkYoutuberTeam(youtuber[0].username, team._id);

		// ---- call external services ----

		const bucketResponse = await createFolderInStorageBucket(username);
		if (!bucketResponse) throw new errResponse("Internal Server Error", 500);

		accountCreationSession.commitTransaction();
		// ---- account creation transaction end ----

		//Notfiy
		await sendOnBoardEmailYoutuber(youtuber);
		res.json(new sucResponse(true, 200, "Account Created Successfully"));
	} catch (error) {
		await accountCreationSession.abortTransaction();
		next(error);
	}
};
