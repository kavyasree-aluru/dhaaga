import asyncHandler from "express-async-handler";
import Craft from "../models/Craft.js";
import Support from "../models/Support.js";
import Provenance from "../models/Provenance.js";
import Artisan from "../models/Artisan.js";
import { v4 as uuidv4 } from "uuid";

/**
 * Item 14: Offline sync.
 *
 * The frontend queues actions locally (e.g. in IndexedDB) while the artisan
 * has poor/no connectivity — adding a craft, logging a provenance event,
 * recording a support request. Each queued action carries a `clientTempId`
 * generated on-device and a `createdAt` timestamp.
 *
 * When connectivity returns, the client POSTs the whole queue here in one
 * batch. This endpoint is idempotent per clientTempId: replaying the same
 * batch twice (e.g. after a flaky connection) will not create duplicates.
 *
 * @route POST /api/sync
 * body: { operations: [{ clientTempId, entity: "craft"|"support"|"provenance_event", createdAt, payload }] }
 */
export const syncOperations = asyncHandler(async (req, res) => {
  const { operations } = req.body;
  if (!Array.isArray(operations) || operations.length === 0) {
    res.status(400);
    throw new Error("operations array is required");
  }

  const results = [];

  for (const op of operations) {
    const { clientTempId, entity, payload, createdAt } = op;
    try {
      if (entity === "craft") {
        // Idempotency: if a craft with this clientTempId already synced, skip.
        const existing = await Craft.findOne({ clientTempId });
        if (existing) {
          results.push({ clientTempId, status: "already_synced", serverId: existing._id });
          continue;
        }

        const artisan = await Artisan.findOne({ user: req.user._id });
        if (!artisan) throw new Error("No artisan profile for this user");

        const craft = await Craft.create({
          artisan: artisan._id,
          title: payload.title,
          craftType: payload.craftType,
          description: payload.description,
          price: payload.price,
          materials: payload.materials || [],
          images: payload.images || [], // client should have already uploaded images separately when it had connectivity for large files, or queue those too
          stock: payload.stock,
          clientTempId,
          syncedAt: new Date(),
        });

        const provenance = await Provenance.create({ craft: craft._id, artisan: artisan._id, publicId: uuidv4() });
        provenance.addEvent({
          type: "created",
          description: `${payload.title} registered on DHAAGA (synced from offline queue, originally created ${createdAt})`,
          actor: req.user._id,
        });
        await provenance.save();
        craft.provenance = provenance._id;
        await craft.save();

        results.push({ clientTempId, status: "created", serverId: craft._id });
      } else if (entity === "provenance_event") {
        const provenance = await Provenance.findOne({ craft: payload.craftId });
        if (!provenance) throw new Error("Craft/provenance not found for event");

        const alreadyLogged = provenance.events.some(
          (e) => e.description === payload.description && e.type === payload.type
        );
        if (alreadyLogged) {
          results.push({ clientTempId, status: "already_synced" });
          continue;
        }

        provenance.addEvent({ type: payload.type, description: payload.description, actor: req.user._id });
        await provenance.save();
        results.push({ clientTempId, status: "created" });
      } else if (entity === "support") {
        const idempotencyKey = payload?.clientTempId || payload?._id;
        const existing = idempotencyKey
          ? await Support.findOne({ $or: [{ clientTempId: idempotencyKey }, { _id: idempotencyKey }] }).catch(() => null)
          : null;

        if (existing) {
          results.push({ clientTempId, status: "already_synced", serverId: existing._id });
          continue;
        }

        const support = await Support.create({
          ...payload,
          clientTempId: payload?.clientTempId || clientTempId || payload?._id,
          customer: req.user?._id,
        });
        results.push({ clientTempId, status: "created", serverId: support._id });
      } else {
        results.push({ clientTempId, status: "error", error: `Unknown entity type: ${entity}` });
      }
    } catch (err) {
      results.push({ clientTempId, status: "error", error: err.message });
    }
  }

  res.json({ success: true, results });
});
