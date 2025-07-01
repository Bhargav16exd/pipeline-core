import { OTP, Otp } from "../models/otp.model";


//Generates OTP
export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function saveOtp(email: string, otp: string){

  //Creates OTP Expiry
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 5 minutes

  await Otp.deleteMany({ email });

  //Save OTP Into Data base
  const OTP = await Otp.create({ email, otp, expiresAt });

  return OTP
  
}

export async function verifyOtp(
  email: string,
  inputOtp: string
): Promise<boolean> {

  //Get OTP Record from Database
  const record = await Otp.findOne({ email });
  if (!record) return false;
  if (record.expiresAt < new Date()) return false;

  if(record.otp != inputOtp){
    return false
  }

  record.verified = true
  await record.save()

  return true;
}
