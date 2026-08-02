import jwt from "jsonwebtoken";

//constants
const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRY = process.env.JWT_EXPIRY;

const generateToken = (id: string, role: string) => {
	const key = JWT_SECRET as string;

	const token = jwt.sign({ _id: id, role: role }, key, {
		expiresIn: Number(JWT_EXPIRY)
	});

	return token;
};

export { generateToken };
