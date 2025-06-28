// import { Request, Response, NextFunction } from "express";
import { Otp } from "../models/otp.model";

const checkEmailVerified = async (req: any, res: any, next: any) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const user = await Otp.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.verified !== true) {
      return res.status(403).json({ message: "Email is not verified." });
    }

    next();
  } catch (error) {
    console.error("Email verification middleware error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export default checkEmailVerified;
