import mongoose from "mongoose";

//constants
const DATABASE_URL = process.env.DATABASE_URL;
const DATABASE_NAME = process.env.DATABASE_NAME;

const connectToDatabase = async () => {
	try {
		const res = await mongoose.connect(`${DATABASE_URL}/${DATABASE_NAME}?replicaSet=rs0`);
		console.log(`Database sucessfully connected : `, res.connection.host);
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export default connectToDatabase;
