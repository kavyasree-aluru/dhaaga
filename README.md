# DHAAGA

### Discover. Preserve. Support India's living heritage.

DHAAGA is a voice-friendly cultural discovery platform connecting people with traditional Indian crafts and the artisans who keep them alive. Explore craft stories, locate regional traditions on an interactive map, and register artisan profiles with voice-assisted form filling.

## Highlights

- Explore Nirmal, Kondapalli, Cheriyal, Kalamkari, and Mangalagiri traditions
- Interactive cultural map with craft-specific markers and story links
- Voice-assisted artisan registration in English, Telugu, and Hindi
- Artisan profiles with image uploads and backend API integration
- Provenance, QR, support, and offline sync API foundations

## Stack

**Frontend:** React, Vite, React Router, React Leaflet  
**Backend:** Node.js, Express, MongoDB, Mongoose  
**Services:** JWT authentication, Multer uploads, Claude, Whisper

## Run Locally

Install both applications, configure the backend environment, and start MongoDB:

```powershell
npm install
npm install --prefix dhaaga-backend
Copy-Item dhaaga-backend\.env.example dhaaga-backend\.env
```

Set `MONGODB_URI` and `JWT_SECRET` in `dhaaga-backend\.env`, then run:

```powershell
npm run dev
```

The frontend runs at `http://localhost:5173` and the API health check is at `http://localhost:5000/api/health`.

## Deploy

Deploy the frontend as a static Vite site with build command `npm run build` and publish directory `dist`.
Set `VITE_API_URL` to the deployed backend URL ending in `/api`.
Deploy `dhaaga-backend` as a Node service with start command `npm start`, and configure the variables from `dhaaga-backend/.env.example`.
Use MongoDB Atlas or another hosted MongoDB instance for production; local disk uploads are suitable for demos but not durable production storage.
