import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";
import Artisan from "../models/Artisan.js";
import mongoose from "mongoose";

dotenv.config();
await connectDB();

const run = async () => {
  await User.deleteMany({ email: /@demo\.dhaaga/ });

  const user = await User.create({
    name: "Lakshmi Devi",
    email: "lakshmi@demo.dhaaga",
    password: "password123",
    role: "artisan",
    preferredLanguage: "te",
  });

  const artisan = await Artisan.create({
    user: user._id,
    name: "Lakshmi Devi",
    craftType: "Kalamkari",
    bio: { en: "Third-generation Kalamkari artist from Srikalahasti.", te: "" },
    yearsOfExperience: 22,
    location: {
      type: "Point",
      coordinates: [79.7, 13.75], // Srikalahasti approx
      village: "Srikalahasti",
      district: "Tirupati",
      state: "Andhra Pradesh",
    },
    verified: true,
  });

  user.artisanProfile = artisan._id;
  await user.save();

  console.log("Seeded demo artisan: lakshmi@demo.dhaaga / password123");
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
