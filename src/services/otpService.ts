import { Otp } from "../models/otp.model";
import { Document } from "mongoose";

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function saveOtp(email: string, otp: string): Promise<void> {
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
  await Otp.deleteMany({ email });
  await Otp.create({ email, otp, expiresAt });
}

export async function verifyOtp(
  email: string,
  inputOtp: string
): Promise<boolean> {
  const record = await Otp.findOne({ email });
  if (!record) return false;
  if (record.expiresAt < new Date()) return false;
  return record.otp == inputOtp;
}
