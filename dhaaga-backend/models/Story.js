import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    craft: { type: mongoose.Schema.Types.ObjectId, ref: "Craft" },
    artisan: { type: mongoose.Schema.Types.ObjectId, ref: "Artisan", required: true },
    title: { type: String, required: true },
    body: {
      en: { type: String, default: "" },
      te: { type: String, default: "" },
      hi: { type: String, default: "" },
      ta: { type: String, default: "" },
    },
    coverImage: { type: String },
    sourceAudio: { type: String }, // original voice interview this story came from
  },
  { timestamps: true }
);

export default mongoose.model("Story", storySchema);
