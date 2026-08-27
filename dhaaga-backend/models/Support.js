import mongoose from "mongoose";

const supportSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["buy", "support", "commission", "inquiry"], required: true },
    craft: { type: mongoose.Schema.Types.ObjectId, ref: "Craft" },
    artisan: { type: mongoose.Schema.Types.ObjectId, ref: "Artisan", required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    contactName: String,
    contactEmail: String,
    contactPhone: String,
    message: String,
    amount: Number,
    status: {
      type: String,
      enum: ["pending", "accepted", "declined", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Support", supportSchema);
