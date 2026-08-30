import dotenv from "dotenv";
import mongoose from "mongoose";
import Artisan from "../models/Artisan.js";
import { connectDB } from "../config/db.js";

dotenv.config();

const run = async () => {
  await connectDB();

  const artisans = await Artisan.find({}).sort({ createdAt: 1 });
  const groups = new Map();

  for (const artisan of artisans) {
    const phone = (artisan.contactNumber || "").trim();
    const name = (artisan.name || "").trim();
    const craftType = (artisan.craftType || "").trim();

    const key = phone
      ? `phone:${phone.toLowerCase()}`
      : `name:${name.toLowerCase()}|craft:${craftType.toLowerCase()}`;

    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(artisan);
  }

  let removed = 0;
  for (const group of groups.values()) {
    if (group.length < 2) continue;

    const keep = group.reduce((preferred, current) => {
      if (!preferred) return current;
      if (current.verified && !preferred.verified) return current;
      if (current.createdAt < preferred.createdAt) return current;
      return preferred;
    }, null);

    const deleteIds = group.filter((artisan) => String(artisan._id) !== String(keep._id)).map((artisan) => artisan._id);

    if (deleteIds.length === 0) continue;

    await Artisan.deleteMany({ _id: { $in: deleteIds } });
    removed += deleteIds.length;
    console.log(`Kept ${keep._id} and removed duplicates: ${deleteIds.join(", ")}`);
  }

  console.log(`Cleanup complete. Removed ${removed} duplicate artisan records.`);
  await mongoose.disconnect();
};

run().catch((error) => {
  console.error("Dedupe failed:", error);
  process.exit(1);
});
