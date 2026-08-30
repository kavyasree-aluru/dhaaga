import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "leaflet/dist/leaflet.css";
import L from "leaflet";

import { normalizeCraftCategory } from "../lib/craftCategories";
import "../App.css";
import nirmalImage from "../assets/nirmal-toys.jpg";
import kondapalliImage from "../assets/kondapalli-toys.jpg";
import cheriyalImage from "../assets/cheriyal-paintings.jpg";
import kalamkariImage from "../assets/kalamkari.jpg";

const API_URL = import.meta.env.VITE_API_URL || "/api";
const API_ORIGIN = API_URL.replace(/\/api\/?$/, "");

const getImageUrl = (image, craftType) => {
  if (!image) {
    const fallback = {
      "Wood Craft": nirmalImage,
      Painting: cheriyalImage,
      Textile: kalamkariImage,
    };

    return fallback[craftType] || nirmalImage;
  }

  if (/^(https?:|data:|blob:)/i.test(image)) return image;
  return `${API_ORIGIN}${image.startsWith("/") ? image : `/${image}`}`;
};

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

function MapFocus({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) map.flyTo(position, 8, { duration: 0.8 });
  }, [map, position]);

  return null;
}

function CulturalMap() {
  const navigate = useNavigate();
  const [selectedCraft, setSelectedCraft] = useState(null);
  const [registeredArtisans, setRegisteredArtisans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const loadNearArtisans = async () => {
      try {
        const nearResponse = await fetch(`${API_URL}/artisans/near?lng=78.5&lat=17.5&maxKm=2000`);
        if (!nearResponse.ok) {
          throw new Error("Nearby artisans endpoint unavailable");
        }
        const nearResult = await nearResponse.json();
        setRegisteredArtisans(nearResult.artisans || []);
      } catch (error) {
        try {
          const fallbackResponse = await fetch(`${API_URL}/artisans`);
          if (!fallbackResponse.ok) throw new Error("Unable to load artisan locations");
          const fallbackResult = await fallbackResponse.json();
          setRegisteredArtisans(fallbackResult.artisans || []);
        } catch (fallbackError) {
          setLoadError(fallbackError.message || error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadNearArtisans();
  }, []);

  const staticCrafts = [
    {
      id: "nirmal",
      name: "Nirmal Wooden Toys",
      location: "Nirmal, Telangana",
      position: [19.096, 78.344],
      type: "Wood Craft",
      image: nirmalImage,
    },
    {
      id: "kondapalli",
      name: "Kondapalli Toys",
      location: "Kondapalli, Andhra Pradesh",
      position: [16.619, 80.544],
      type: "Wood Craft",
      image: kondapalliImage,
    },
    {
      id: "cheriyal",
      name: "Cheriyal Paintings",
      location: "Cheriyal, Telangana",
      position: [18.106, 79.263],
      type: "Painting",
      image: cheriyalImage,
    },
    {
      id: "kalamkari",
      name: "Kalamkari",
      location: "Machilipatnam, Andhra Pradesh",
      position: [16.187, 81.138],
      type: "Textile",
      image: kalamkariImage,
    },
  ];

  const liveCrafts = registeredArtisans
    .filter((artisan) => artisan.isApproved !== false && artisan.isHidden !== true)
    .map((artisan) => {
      const category = normalizeCraftCategory(artisan.craftType);
      const coords = artisan.location?.coordinates;
      const isValidPoint = Array.isArray(coords) && coords.length >= 2 && coords.every((value) => Number.isFinite(value));
      const fallbackPosition = {
        "Wood Craft": [19.096, 78.344],
        Painting: [18.106, 79.263],
        Textile: [16.187, 81.138],
        "Palm-Leaf Weaving & Eco Art": [16.4308, 80.5684],
        Pottery: [17.4, 78.6],
      }[category] || [17.5, 78.5];

      return {
        id: artisan._id,
        name: artisan.name,
        location: [artisan.location?.village, artisan.location?.district, artisan.location?.state]
          .filter(Boolean)
          .join(", ") || "Location not provided",
        position: isValidPoint && coords[0] !== 0 && coords[1] !== 0
          ? [coords[1], coords[0]]
          : fallbackPosition,
        type: category,
        image: getImageUrl(artisan.profilePhoto, category),
      };
    });

  const crafts = liveCrafts.length > 0 ? liveCrafts : staticCrafts;

  return (
    <div className="map-page">
      <section className="map-header">
        <p className="eyebrow">
          DISCOVER INDIA'S CRAFT LANDSCAPE
        </p>

        <h1>
          A map of
          <br />
          <em>living heritage.</em>
        </h1>

        <p>
          Explore traditional crafts across India and discover
          where their stories begin.
        </p>
      </section>

      <section className="map-container-section">

        <div className="map-info">
          <h2>Crafts across India</h2>

          <p>
            Select a location to discover the craft, region and
            cultural story connected to it.
          </p>

          {loadError && <p style={{ color: "#8b4b31", marginBottom: "12px" }}>{loadError}</p>}

          <div className="map-craft-list">
            {isLoading ? <p>Loading artisan locations...</p> : crafts.map((craft) => (
              <button
                className={`map-craft-item ${selectedCraft?.id === craft.id ? "selected" : ""}`}
                key={craft.id || craft.name}
                type="button"
                onClick={() => setSelectedCraft(craft)}
                aria-pressed={selectedCraft?.id === craft.id}
              >
                <img src={craft.image} alt="" />
                <span>{craft.type}</span>
                <h3>{craft.name}</h3>
                <p>{craft.location}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="map-wrapper">
          <MapContainer
            center={[17.5, 78.5]}
            zoom={5}
            scrollWheelZoom={true}
            className="actual-map"
          >
            <MapFocus position={selectedCraft?.position} />

            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {!isLoading && crafts.map((craft) => (
              <Marker
                key={craft.id || craft.name}
                position={craft.position}
                eventHandlers={{ click: () => setSelectedCraft(craft) }}
              >
                <Popup>
                  <img src={craft.image} alt={craft.name} style={{ width: "160px", height: "90px", objectFit: "cover" }} />
                  <strong>{craft.name}</strong>
                  <br />
                  {craft.location}
                  <br />
                  <br />
                  <button
                    onClick={() => navigate(`/story/${craft.id}`)}
                    style={{ background: "#b85334", color: "white", border: "none", padding: "8px 16px", borderRadius: "4px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}
                  >
                    Discover Story →
                  </button>
                </Popup>
              </Marker>
            ))}

          </MapContainer>
        </div>

      </section>

    </div>
  );
}

export default CulturalMap;