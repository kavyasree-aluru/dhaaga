import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const email = process.argv[2];
if (!email) {
  console.error("Usage: npm run make-admin -- user@example.com");
  process.exit(1);
}

await connectDB();
const user = await User.findOneAndUpdate({ email: email.toLowerCase() }, { role: "admin" }, { new: true });
if (!user) {
  console.error(`No user found for ${email}`);
  await mongoose.disconnect();
  process.exit(1);
}

console.log(`${user.email} is now an admin. Sign in again to refresh your token.`);
await mongoose.disconnect();
