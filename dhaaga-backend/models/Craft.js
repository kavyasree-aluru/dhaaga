import mongoose from "mongoose";

const craftSchema = new mongoose.Schema(
  {
    artisan: { type: mongoose.Schema.Types.ObjectId, ref: "Artisan", required: true },
    title: { type: String, required: true, trim: true },
    craftType: { type: String, required: true }, // Kalamkari, Cheriyal, Kondapalli toys, Nirmal...
    description: { type: String, default: "" },
    price: { type: Number, default: 0 },
    materials: [{ type: String }],

    // Item 6: image storage
    images: [{ type: String, required: true }],

    // Item 9: computer vision — populated by /api/ai/classify-image
    visionTags: [{ type: String }], // e.g. ["hand-painted", "cheriyal-style", "wood-panel"]
    visionVerified: { type: Boolean, default: false }, // does the image match the claimed craftType?
    visionConfidence: { type: Number },

    // Item 11: provenance link
    provenance: { type: mongoose.Schema.Types.ObjectId, ref: "Provenance" },

    // Item 12: QR code
    qrCodeUrl: { type: String },

    stock: { type: Number, default: 1 },
    status: { type: String, enum: ["draft", "published", "sold_out"], default: "draft" },

    // Item 14: offline sync bookkeeping
    clientTempId: { type: String }, // id the offline client generated before syncing
    syncedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

craftSchema.index({ title: "text", description: "text", craftType: "text" });

export default mongoose.model("Craft", craftSchema);
