import mongoose from "mongoose";
import crypto from "crypto";

// Each event is hash-chained to the previous one so the history for a craft
// can be verified as untampered (a lightweight version of a provenance ledger).
const eventSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["created", "material_sourced", "in_progress", "completed", "verified", "sold", "shipped"],
      required: true,
    },
    description: { type: String },
    actor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    timestamp: { type: Date, default: Date.now },
    prevHash: { type: String, default: "" },
    hash: { type: String, required: true },
  },
  { _id: false }
);

const provenanceSchema = new mongoose.Schema(
  {
    craft: { type: mongoose.Schema.Types.ObjectId, ref: "Craft", required: true, unique: true },
    artisan: { type: mongoose.Schema.Types.ObjectId, ref: "Artisan", required: true },
    events: [eventSchema],
    publicId: { type: String, unique: true }, // used in the public verification URL / QR code
  },
  { timestamps: true }
);

provenanceSchema.methods.addEvent = function ({ type, description, actor }) {
  const prevHash = this.events.length ? this.events[this.events.length - 1].hash : "";
  const timestamp = new Date();
  const payload = `${prevHash}|${type}|${description || ""}|${timestamp.toISOString()}`;
  const hash = crypto.createHash("sha256").update(payload).digest("hex");
  this.events.push({ type, description, actor, timestamp, prevHash, hash });
  return this.events[this.events.length - 1];
};

provenanceSchema.methods.verifyChain = function () {
  let prevHash = "";
  for (const ev of this.events) {
    const payload = `${prevHash}|${ev.type}|${ev.description || ""}|${new Date(ev.timestamp).toISOString()}`;
    const expected = crypto.createHash("sha256").update(payload).digest("hex");
    if (expected !== ev.hash) return false;
    prevHash = ev.hash;
  }
  return true;
};

export default mongoose.model("Provenance", provenanceSchema);
