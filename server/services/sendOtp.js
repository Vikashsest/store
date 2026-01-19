import dotenv from "dotenv";
dotenv.config();
import Otp from "../models/otpModel.js";

// EMAIL_USER=
// EMAIL_PASS=jnrb mmff wmdy kwmn
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "viku81021@gmail.com",
//     pass: "jnrb mmff wmdy kwmn",
//   },
// });

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: true,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

import { Resend } from "resend";
console.log("proces", process.env.RESEND_API_KEY);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOtp(email) {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.findOneAndUpdate(
      { email },
      { otp, createdAt: new Date() },
      { upsert: true, new: true },
    );
    await resend.emails.send({
      from: "Your App <onboarding@resend.dev>",
      to: email,
      subject: "Your OTP for Email Verification",
      html: `<h2>Your OTP is ${otp}</h2>`,
    });

    // await transporter.sendMail({
    //   from: `Verfiy email <viku81021@gmail.com>`,
    //   to: email,
    //   subject: "Your OTP for Email Verification",
    //   html: `
    //     <h2>Email Verification</h2>
    //     <p>Your OTP is:</p>
    //     <h1>${otp}</h1>
    //     <p>This OTP is valid for 5 minutes.</p>
    //   `,
    // });
    return true;
  } catch (error) {
    console.error("OTP send error:", error);

    throw new Error("Failed to send OTP");
  }
}
