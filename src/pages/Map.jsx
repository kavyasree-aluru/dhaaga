import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import { useEffect, useState } from "react";

import "leaflet/dist/leaflet.css";
import L from "leaflet";

import "../App.css";
import nirmalImage from "../assets/nirmal-toys.jpg";
import kondapalliImage from "../assets/kondapalli-toys.jpg";
import cheriyalImage from "../assets/cheriyal-paintings.jpg";
import kalamkariImage from "../assets/kalamkari.jpg";

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
  const [selectedCraft, setSelectedCraft] = useState(null);
  const crafts = [
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
    {
      id: "lakshmi-devi",
      name: "Lakshmi Devi",
      location: "Mangalagiri, Andhra Pradesh",
      position: [16.4308, 80.5684],
      type: "Handloom Weaving",
      image: "https://houseofleela.com/cdn/shop/articles/mangalgiri.webp?v=1708747087",
    },
  ];

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

          <div className="map-craft-list">
            {crafts.map((craft) => (
              <button
                className={`map-craft-item ${selectedCraft?.id === craft.id ? "selected" : ""}`}
                key={craft.name}
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

            {crafts.map((craft) => (
              <Marker
                key={craft.name}
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
                  <a href={`/story?craft=${craft.id}`}>
                    Discover Story →
                  </a>
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