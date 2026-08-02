//Package Imports
import express, { NextFunction, Request, urlencoded } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import { google } from "googleapis";
import session from "express-session";
import rateLimit from "express-rate-limit";

//Infile Imports
import otpRouter from "./routes/otp.router";
import clientRouter from "./routes/client.router";
import teamRouter from "./routes/team.router";
import videoRouter from "./routes/video.router";
import ytRouter from "./routes/yt.router";
import editorRouter from "./routes/editor.router";
import adminRouter from "./routes/admin.router";
import { createServer } from "http";
import { Server } from "socket.io";
import { latest } from "./socket/socket";

//config
dotenv.config();

//constants
const ORIGIN_URL = process.env.ORIGIN_URL;
const SESSION_SECRET_KEY = process.env.SESSION_SECRET_KEY;
const RATE_LIIMITER_WINDOW = process.env.RATE_LIIMITER_WINDOW;
const RATE_LIIMITER_MAX_REQUEST = process.env.RATE_LIIMITER_MAX_REQUEST;

const app = express();
const socketApp = createServer(app);
const io = new Server(socketApp, {
	cors: {
		origin: ORIGIN_URL,
		credentials: true
	}
});

//middlewares
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
app.use(express.json());
app.use(
	cors({
		credentials: true,
		origin: ORIGIN_URL
	})
);

app.use(
	session({
		secret: SESSION_SECRET_KEY,
		resave: false,
		saveUninitialized: false
	})
);

//init OAuth2Client
const oauth2Client = new google.auth.OAuth2(
	process.env.CLIENT_ID,
	process.env.CLIENT_SECRET,
	process.env.REDIRECT_URL
);

//Rate Limiter
const limiter = rateLimit({
	windowMs: Number(RATE_LIIMITER_WINDOW),
	max: Number(RATE_LIIMITER_MAX_REQUEST)
});

//Rate Limiter Middleware
app.use(limiter);

app.use("/api/otp", otpRouter);
app.use("/api/youtuber", clientRouter);
app.use("/api/editor", editorRouter);
app.use("/api/team", teamRouter);
app.use("/api/video", videoRouter);
app.use("/api/yt", ytRouter);
app.use("/api/admin", adminRouter);

// Error Handler
app.use((err: any, _: Request, res: any, next: NextFunction) => {
	const statusCode = err.statusCode || 500;
	const message = err.message || "Something went wrong";
	const error = err;

	res.status(statusCode).json({
		statusCode,
		message,
		error
	});
});

export { io, socketApp, oauth2Client };

export default app;
