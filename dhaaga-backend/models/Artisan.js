import mongoose from "mongoose";

// A single field translated into multiple regional languages.
// e.g. { en: "I have woven silk for 20 years", te: "...", hi: "..." }
const multilingualTextSchema = new mongoose.Schema(
  {
    en: { type: String, default: "" },
    te: { type: String, default: "" }, // Telugu
    hi: { type: String, default: "" }, // Hindi
    ta: { type: String, default: "" }, // Tamil
  },
  { _id: false }
);

const artisanSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    name: { type: String, required: true, trim: true },
    craftType: { type: String, required: true, trim: true }, // e.g. "Kalamkari", "Cheriyal painting"
    contactNumber: { type: String, trim: true },
    bio: multilingualTextSchema,
    yearsOfExperience: { type: Number, default: 0 },

    // Item 6: image/file storage
    profilePhoto: { type: String }, // file path / URL
    photos: [{ type: String }],
    audioInterviews: [
      {
        url: { type: String, required: true },
        language: { type: String, default: "auto" },
        transcript: multilingualTextSchema,
        structuredProfile: { type: mongoose.Schema.Types.Mixed }, // AI-extracted structured data
        processedAt: { type: Date },
      },
    ],

    // Item 10: geo-location, GeoJSON Point for $near queries
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0],
      },
      village: String,
      district: String,
      state: { type: String, default: "Telangana" },
    },

    verified: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

artisanSchema.index({ location: "2dsphere" });

export default mongoose.model("Artisan", artisanSchema);
