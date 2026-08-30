import mongoose from "mongoose";

const supportSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["buy", "support", "commission", "inquiry"], required: true },
    clientTempId: { type: String, index: true },
    craft: { type: mongoose.Schema.Types.ObjectId, ref: "Craft" },
    artisan: { type: mongoose.Schema.Types.ObjectId, ref: "Artisan", required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    contactName: String,
    contactEmail: String,
    contactPhone: String,
    message: String,
    amount: Number,
    deliveryAddress: {
      line1: String,
      city: String,
      state: String,
      postalCode: String,
    },
    deliveryPartner: String,
    trackingNumber: String,
    shipmentStatus: {
      type: String,
      enum: ["pending", "confirmed", "dispatched", "in_transit", "delivered", "cancelled"],
      default: "pending",
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Support", supportSchema);
