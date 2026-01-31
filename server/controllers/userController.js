import Directory from "../models/directoryModel.js";
import User from "../models/userModel.js";
import mongoose, { Types } from "mongoose";
import crypto from "node:crypto";
import bcrypt from "bcrypt";
import { sendOtp } from "../services/sendOtp.js";
import Sesion from "../models/sesionModel.js";
import Otp from "../models/otpModel.js";
import redisClient from "../config/redis.js";

export const mySecretKey = "mystoredrive$#@#$";
// export const register = async (req, res, next) => {
//   const { name, email, password } = req.body;
//   const hashedPassword = await bcrypt.hash(password, 10);
//   // const session = await mongoose.startSession();

//   // const salt = crypto.randomBytes(16);
//   // const hashedPassword = crypto.pbkdf2Sync(
//   //   password,
//   //   salt,
//   //   100000,
//   //   32,
//   //   "sha256"
//   // );

//   //withou bcrypt hash our password
//   // const hashedPassword = crypto
//   //   .createHash("sha256")
//   //   .update(password)
//   //   .digest("hex");
//   try {
//     const rootDirId = new Types.ObjectId();
//     const userId = new Types.ObjectId();

//     // session.startTransaction();

//     await Directory.insertOne(
//       {
//         _id: rootDirId,
//         name: `root-${email}`,
//         parentDirId: null,
//         userId,
//       }
//       // { session }
//     );
//     await sendOtp(email);
//     await User.insertOne(
//       {
//         _id: userId,
//         name,
//         email,
//         password: hashedPassword,
//         rootDirId,
//       }
//       // { session }
//     );

//     // session.commitTransaction();

//     res.status(200).json({
//       sucess: true,
//       message: "otp send on your mail",
//     });
//   } catch (err) {
//     // session.abortTransaction();
//     if (err.code === 121) {
//       res
//         .status(400)
//         .json({ error: "Invalid input, please enter valid details" });
//     } else if (err.code === 11000) {
//       if (err.keyValue.email) {
//         return res.status(409).json({
//           error: "This email already exists",
//           message:
//             "A user with this email address already exists. Please try logging in or use a different email.",
//         });
//       }
//     } else {
//       next(err);
//     }
//   }
// };

export const register = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    // 1️⃣ Check duplicate email
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ error: "Email exists" });

    // 2️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ Create user & root directory
    const userId = new Types.ObjectId();
    const rootDirId = new Types.ObjectId();

    await Directory.insertOne({
      _id: rootDirId,
      name: `root-${email}`,
      parentDirId: null,
      userId,
    });

    await User.insertOne({
      _id: userId,
      name,
      email,
      password: hashedPassword,
      rootDirId,
      isVerified: false,
    });

    await sendOtp(email);

    res.status(200).json({ success: true, message: "OTP sent to your email" });
  } catch (err) {
    next(err);
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // const isValid = await bcrypt.compare(password, user.password);
  // if (!isValid) {
  //   return res.status(401).json({ error: "Invalid credentials" });
  // }

  const sessionId = crypto.randomUUID();
  const key = `session:${sessionId}`;
  console.log("sesio id", sessionId);

  // await redisClient.json.set(key, "$", {
  //   userId: user._id.toString(),
  //   rootDirId: user.rootDirId,
  // });
  await redisClient.hSet(key, {
    userId: user._id.toString(),
    rootDirId: user.rootDirId.toString(),
  });
  const clientRedis = await redisClient.expire(key, 60 * 60 * 24 * 7);
  console.log("redis-client", clientRedis);

  res.cookie("sid", sessionId, {
    httpOnly: true,
    signed: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    sameSite: "none",
  });

  res.status(200).json({
    success: true,
    message: "logged in",
  });
};

// export const login = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ error: "Invalid Credentials" });
//     }
//     console.log("user", user);

//     // const [salt, savedPassword] = user.password.split(".");
//     //without bcrypt compare our password
//     // const newEnterdPassword = crypto
//     //   .createHash("sha256")
//     //   .update(password)
//     //   .digest("hex");
//     // const newEnterdPassword = crypto
//     //   .pbkdf2Sync(password, Buffer.from(salt, "base64url"), 100000, 32, "sha256")
//     //   .toString("base64url");
//     // console.log(newEnterdPassword);
//     // console.log(savedPassword);

//     //todo
//     // const isValidPassword = await bcrypt.compare(password, user.password);
//     // if (!isValidPassword) {
//     //   return res.status(404).json({ error: "Invalid password" });
//     // }

//     //sesion in db store
//     // const allSesions = await Sesion.find({ userId: user.id });

//     // if (allSesions.length >= 2) {
//     //   await allSesions[0].deleteOne();
//     // }
//     // const userSesion = await Sesion.create({
//     //   userId: user._id,
//     // });

//     // const signature = crypto
//     //   .createHash("sha256")
//     //   .update(mySecretKey)
//     //   .update(cookiePayload)
//     //   .update(mySecretKey)
//     //   .digest("base64url");
//     // const signedCookie = `${Buffer.from(cookiePayload).toString("base64url")}.${signature}`;
//     //session store on redis
//     const sesionID = crypto.randomUUID();

//     const redisKey = `session:${sesionID}`;

//     const val = await redisClient.json.set(redisKey, "$", {
//       userId: user._id,
//       rootDirId: user.rootDirId,
//     });
//     console.log("value", val);

//     const sesionExpiry = 60 * 1000 * 60 * 24 * 7;
//     await redisClient.expire(redisKey, sesionExpiry / 1000);
//     res.cookie("sid", sesionID, {
//       httpOnly: true,
//       // maxAge: 10 * 1000,
//       signed: true,
//       maxAge: sesionExpiry,
//     });
//     res.json({ message: "logged in" });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).lean();

    res.status(200).json({
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const { sid } = req.signedCookies;
    await redisClient.del(`session:${sid}`);
    res.clearCookie("sid");
    res.status(204).end();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const logoutAll = async (req, res) => {
  try {
    const userId = req.user._id;
    await Sesion.deleteMany({ userId });
    res.clearCookie("sid");
    res.status(200).json({ message: "Logout  successfully from all devices" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const sendotp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(500).json({ message: "user not found not this email" });
    }
    await sendOtp(email);
    res.status(200).json({ message: "Email sent on your email" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const otpRecord = await Otp.findOne({ email });
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const now = new Date();
    if (otpRecord.expiresAt < now) {
      await Otp.deleteOne({ email });
      return res.status(400).json({ message: "OTP expired" });
    }

    // Compare plain text
    if (otpRecord.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isVerified = true;
    await user.save();

    await Otp.deleteOne({ email });

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("OTP verify error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
