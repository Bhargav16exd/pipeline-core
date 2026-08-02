import mongoose, { Types } from "mongoose";
import { EditorModelType } from "./editor.model.types";

const editorSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true
		},
		username: {
			type: String,
			unique: true,
			required: true
		},
		email: {
			type: String,
			required: true
		},
		profile: {
			type: String,
			required: true
		},
		role: {
			type: String,
			default: "EDITOR",
			required: true
		},
		password: {
			type: String,
			required: true,
			select: false
		},
		isInTeam: {
			type: Boolean
		},
		teamId: {
			type: Types.ObjectId,
			ref: "Team"
		}
	},
	{
		timestamps: true
	}
);

const Editor = mongoose.model<EditorModelType>("Editor", editorSchema);

export { Editor, editorSchema };
