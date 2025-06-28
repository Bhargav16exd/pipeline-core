const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    verified: { type: Boolean, required: false },
  },
  { timestamps: true }
);

export const Otp = mongoose.model("Otp", otpSchema);
