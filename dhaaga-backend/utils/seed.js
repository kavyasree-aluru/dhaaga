import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";
import Artisan from "../models/Artisan.js";
import mongoose from "mongoose";

dotenv.config();
await connectDB();

const run = async () => {
  await User.deleteMany({ email: /@demo\.dhaaga/ });

  const demoProfiles = [
    {
      user: { name: "Sita Narayana", email: "nirmal@demo.dhaaga", password: "password123" },
      artisan: {
        name: "Nirmal Toy Makers",
        craftType: "Wooden Toys",
        contactNumber: "+91 98765 43210",
        bio: {
          en: "A Nirmal workshop shaping painted wooden toys with traditional motifs and hand-finished detailing.",
          te: "నిర్మల్‌లో ఉన్న కలప బొమ్మల వర్క్‌షాప్ బహుళ సాంప్రదాయ మోట్‌లను ఉపయోగించి చేతివ్రాయిత కళను కొనసాగిస్తోంది.",
        },
        yearsOfExperience: 25,
        location: {
          type: "Point",
          coordinates: [77.93, 19.1],
          village: "Nirmal",
          district: "Nirmal",
          state: "Telangana",
        },
      },
    },
    {
      user: { name: "Ramesh Vara", email: "kondapalli@demo.dhaaga", password: "password123" },
      artisan: {
        name: "Kondapalli Carvers",
        craftType: "Wood Craft",
        contactNumber: "+91 99887 12345",
        bio: {
          en: "Carvers preserving Andhra Pradesh's Kondapalli toy tradition through meticulous hand carving and colour work.",
          te: "కోండపల్లి చెక్క బాలల కళను బాగా కత్తిరించి, రంగులు వేసి కొనసాగిస్తున్న కళాకారులు.",
        },
        yearsOfExperience: 21,
        location: {
          type: "Point",
          coordinates: [80.63, 16.62],
          village: "Kondapalli",
          district: "Krishna",
          state: "Andhra Pradesh",
        },
      },
    },
    {
      user: { name: "Anitha Yadav", email: "cheriyal@demo.dhaaga", password: "password123" },
      artisan: {
        name: "Cheriyal Scroll House",
        craftType: "Narrative Paintings",
        contactNumber: "+91 97654 88776",
        bio: {
          en: "Traditional storytellers painting scroll narratives that keep Telangana's oral culture visible in colour.",
          te: "చేరియల్ స్క్రోల్‌లను చిత్రించి, తెలంగాణ కథల సంప్రదాయాన్ని రంగుల్లో కొనసాగిస్తున్న కళాకారులు.",
        },
        yearsOfExperience: 31,
        location: {
          type: "Point",
          coordinates: [79.96, 17.55],
          village: "Cheriyal",
          district: "Suryapet",
          state: "Telangana",
        },
      },
    },
    {
      user: { name: "Harini Sridhar", email: "kalamkari@demo.dhaaga", password: "password123" },
      artisan: {
        name: "Machilipatnam Kalamkari Circle",
        craftType: "Kalamkari Textile",
        contactNumber: "+91 98450 33310",
        bio: {
          en: "A textile studio preserving painted and block-printed motifs rooted in Andhra's heritage storytelling.",
          te: "కలంకారీ జాడలో ఎర్ర, నీలం రంగులు తడివెచ్చి, ఆంధ్రప్రదేశ్ కథలను పండించే బొమ్మల నెయ్యిక్కలు.",
        },
        yearsOfExperience: 22,
        location: {
          type: "Point",
          coordinates: [81.13, 16.19],
          village: "Machilipatnam",
          district: "Krishna",
          state: "Andhra Pradesh",
        },
      },
    },
  ];

  for (const profile of demoProfiles) {
    const user = await User.create({
      name: profile.user.name,
      email: profile.user.email,
      password: profile.user.password,
      role: "artisan",
      preferredLanguage: "te",
    });

    const artisan = await Artisan.create({
      user: user._id,
      ...profile.artisan,
      verified: true,
    });

    user.artisanProfile = artisan._id;
    await user.save();

    console.log(`Seeded demo artisan: ${profile.user.email} / ${profile.user.password}`);
  }

  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
