# DHAAGA Backend

Node.js + Express + MongoDB backend for the DHAAGA artisan/craft platform.
Built to plug straight into the existing React (Vite) frontend.

## Quick start

```bash
cd dhaaga-backend
npm install
cp .env.example .env       # then fill in your real values
# make sure MongoDB is running locally, or point MONGODB_URI at Atlas
npm run seed                # optional: creates a demo artisan
npm run dev                 # starts on http://localhost:5000
```

Required env vars (see `.env.example`):
- `MONGODB_URI` — your MongoDB connection string
- `JWT_SECRET` — any long random string
- `ANTHROPIC_API_KEY` — for translation, profile structuring, and craft-image classification
- `OPENAI_API_KEY` — for Whisper speech-to-text on voice interviews (Claude's API doesn't accept raw audio, so Whisper transcribes first, then Claude structures/translates the text)

## How each backend item is implemented

| # | Item | Where |
|---|------|-------|
| 1 | Backend/API | `server.js` — Express app, connects React frontend to DB and services |
| 2 | Database | MongoDB via Mongoose — `models/` (User, Artisan, Craft, Story, Provenance, Support) |
| 3 | Artisan registration | `POST /api/artisans` — `controllers/artisanController.js` |
| 4 | Craft management | `POST/GET/PUT/DELETE /api/crafts` — `controllers/craftController.js` |
| 5 | Authentication | JWT-based, `controllers/authController.js` + `middleware/auth.js` (`protect`, `authorize`) |
| 6 | Image/file storage | `multer` disk storage in `middleware/upload.js`, served from `/uploads` — swap for S3 later |
| 7 | AI service (voice → text) | `POST /api/ai/artisans/:id/interview` — Whisper transcribes, Claude structures (`utils/ai.js`) |
| 8 | Multilingual processing | Same AI service outputs en/te/hi; standalone `POST /api/ai/translate` too |
| 9 | Computer Vision | `POST /api/ai/crafts/:id/classify` — Claude vision tags/verifies craft photos |
| 10 | Geo-location | GeoJSON `Point` on Artisan model + `GET /api/artisans/near?lng=&lat=` (2dsphere index) for the Cultural Map |
| 11 | Provenance system | `models/Provenance.js` — hash-chained event ledger, `controllers/provenanceController.js` |
| 12 | QR generation | `POST /api/qr/:craftId` — `utils/qrGenerator.js`, links to the provenance verification page |
| 13 | Support/market system | `models/Support.js` + `controllers/supportController.js` — buy/support/commission requests |
| 14 | Offline sync | `POST /api/sync` — `controllers/syncController.js`, idempotent batch processing keyed by `clientTempId` |

## API overview

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

POST   /api/artisans                 (multipart: profilePhoto)
GET    /api/artisans
GET    /api/artisans/:id
GET    /api/artisans/near?lng=&lat=&maxKm=
PUT    /api/artisans/:id
PATCH  /api/artisans/:id/verify      (admin)

POST   /api/crafts                   (multipart: images[])
GET    /api/crafts
GET    /api/crafts/:id
PUT    /api/crafts/:id
DELETE /api/crafts/:id

POST   /api/stories                  (multipart: coverImage)
GET    /api/stories
GET    /api/stories/:id

POST   /api/ai/artisans/:id/interview  (multipart: audio)
POST   /api/ai/crafts/:id/classify
POST   /api/ai/translate

GET    /api/provenance/:craftId
GET    /api/provenance/verify/:publicId   (public, what the QR code opens)
POST   /api/provenance/:craftId/events

POST   /api/qr/:craftId

POST   /api/support
GET    /api/support/artisan/:artisanId
PATCH  /api/support/:id/status

POST   /api/sync
```

Auth: send `Authorization: Bearer <token>` for any protected route (token returned from register/login).

## Connecting the existing React frontend

In the `dhaaga` frontend, add an `.env`:
```
VITE_API_URL=http://localhost:5000/api
```
Then replace any hard-coded/mock artisan or craft data in `src/pages/*.jsx` with `fetch(`${import.meta.env.VITE_API_URL}/crafts`)` etc. The frontend project currently has no API calls at all — every page (`Explore.jsx`, `Artisan.jsx`, `Map.jsx`, `CraftStory.jsx`, `ArtisanInfo.jsx`) is using static/local data, so wiring these up is the main integration step.

## Notes & next steps

- File storage is local disk for now (fine for a demo/hackathon). Swap `middleware/upload.js`'s `diskStorage` for `multer-s3` when you need production durability.
- The provenance "ledger" is a simple SHA-256 hash chain stored in MongoDB — good enough to detect tampering, not a blockchain.
- Offline sync assumes the frontend queues actions (in IndexedDB or similar) while offline and flushes them through `POST /api/sync` on reconnect. Large files (photos/audio) should still be uploaded directly once connectivity returns, since this endpoint is for JSON payloads only.
- Run `npm run seed` any time to reset a demo artisan account: `lakshmi@demo.dhaaga` / `password123`.
