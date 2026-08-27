import { useEffect, useState } from "react";

import nirmalImage from "../assets/nirmal-toys.jpg";
import kondapalliImage from "../assets/kondapalli-toys.jpg";
import cheriyalImage from "../assets/cheriyal-paintings.jpg";
import kalamkariImage from "../assets/kalamkari.jpg";

const API_URL = import.meta.env.VITE_API_URL || "/api";
const API_ORIGIN = API_URL.replace(/\/api\/?$/, "");
const lakshmiReferenceImage = "https://houseofleela.com/cdn/shop/articles/mangalgiri.webp?v=1708747087";

const fallbackImages = {
  nirmal: nirmalImage,
  kondapalli: kondapalliImage,
  cheriyal: cheriyalImage,
  kalamkari: kalamkariImage,
};

const getFallbackImage = (craftType = "") => {
  const normalizedType = craftType.toLowerCase();
  return Object.entries(fallbackImages).find(([key]) => normalizedType.includes(key))?.[1] || nirmalImage;
};

const getImageUrl = (image, craftType) => {
  if (!image) return getFallbackImage(craftType);
  if (/^(https?:|data:|blob:)/i.test(image)) return image;
  return `${API_ORIGIN}${image.startsWith("/") ? image : `/${image}`}`;
};

function Explore() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [registeredArtisans, setRegisteredArtisans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/artisans`)
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load registered artisans");
        return response.json();
      })
      .then((result) => setRegisteredArtisans(result.artisans || []))
      .catch((error) => setLoadError(error.message))
      .finally(() => setIsLoading(false));
  }, []);

  const crafts = [
    {
      id: "nirmal",
      name: "Nirmal Wooden Toys",
      location: "Nirmal, Telangana",
      category: "Wood Craft",
      description:
        "Traditional handcrafted toys carrying generations of Nirmal's artistic heritage.",
      image: nirmalImage,
    },
    {
      id: "kondapalli",
      name: "Kondapalli Toys",
      location: "Kondapalli, Andhra Pradesh",
      category: "Wood Craft",
      description:
        "Hand-carved wooden figures representing stories, people and everyday life.",
      image: kondapalliImage,
    },
    {
      id: "cheriyal",
      name: "Cheriyal Paintings",
      location: "Cheriyal, Telangana",
      category: "Painting",
      description:
        "Narrative scroll paintings rooted in Telangana's storytelling traditions.",
      image: cheriyalImage,
    },
    {
      id: "kalamkari",
      name: "Kalamkari",
      location: "Machilipatnam, Andhra Pradesh",
      category: "Textile",
      description:
        "Hand-painted and block-printed textiles inspired by Indian mythology and nature.",
      image: kalamkariImage,
    },
  ];

  const registeredCrafts = registeredArtisans
    .filter((artisan) => !["manikanta", "mahi"].includes(artisan.name?.trim().toLowerCase()))
    .map((artisan) => ({
      id: artisan._id,
      name: artisan.name,
      location: [artisan.location?.village, artisan.location?.district, artisan.location?.state]
        .filter(Boolean)
        .join(", ") || "Location not provided",
      category: artisan.craftType,
      description: artisan.bio?.en || "A registered DHAAGA artisan preserving a living craft tradition.",
      yearsOfExperience: artisan.yearsOfExperience,
      contactNumber: artisan.contactNumber,
      image: artisan.name?.trim().toLowerCase() === "lakshmi devi"
        ? lakshmiReferenceImage
        : getImageUrl(artisan.profilePhoto, artisan.craftType),
      isRegistered: true,
    }));

  const allCrafts = [...registeredCrafts, ...crafts];
  const categories = [
    { id: "All", label: "All" },
    { id: "Textile", label: "Textiles" },
    { id: "Wood Craft", label: "Wood Craft" },
    { id: "Painting", label: "Painting" },
    ...registeredCrafts
      .filter((craft) => !["Textile", "Wood Craft", "Painting"].includes(craft.category))
      .map((craft) => ({ id: craft.category, label: craft.category }))
      .filter((category, index, all) => all.findIndex((item) => item.id === category.id) === index),
  ];

  const filteredCrafts =
    selectedCategory === "All"
      ? allCrafts
      : allCrafts.filter((craft) => craft.category === selectedCategory);

  const getButtonStyle = (categoryId) => {
    const isActive = selectedCategory === categoryId;
    const isHovered = hoveredCategory === categoryId;

    return {
      padding: "8px 18px",
      borderRadius: "20px",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s ease-in-out",
      backgroundColor: isActive || isHovered ? "#3d2314" : "#e8ded2",
      color: isActive || isHovered ? "#ffffff" : "#3d2314",
      border: "1px solid #3d2314",
    };
  };

  return (
    <div className="explore-page">
      <section className="explore-header">
        <p className="eyebrow">DISCOVER INDIA'S LIVING HERITAGE</p>

        <h1>
          Find the
          <br />
          <em>hands behind</em>
          <br />
          the craft.
        </h1>

        <p>
          Explore traditional crafts, discover their origins and meet the
          artisans keeping these traditions alive.
        </p>
      </section>

      <section className="craft-section">
        <div className="section-heading">
          <h2>Explore Crafts</h2>

          <div className="filters" style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                onMouseEnter={() => setHoveredCategory(cat.id)}
                onMouseLeave={() => setHoveredCategory(null)}
                style={getButtonStyle(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="craft-grid">
          {isLoading && <p>Loading registered artisans...</p>}
          {loadError && <p>{loadError}</p>}
          {!isLoading && !loadError && filteredCrafts.length === 0 && <p>No artisans found in this category yet.</p>}
          {filteredCrafts.map((craft) => (
            <div className="craft-item" key={craft.name}>
              <div className="craft-image">
                <img
                  src={craft.image}
                  alt={craft.name}
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = getFallbackImage(craft.category);
                  }}
                />
                <span>{craft.category}</span>
              </div>

              <div className="craft-info">
                <p>{craft.location}</p>

                <h3>{craft.name}</h3>

                {!craft.isRegistered && <span>{craft.description}</span>}
                {craft.isRegistered && craft.yearsOfExperience > 0 && (
                  <p style={{ margin: "10px 0 0", fontSize: "13px", fontWeight: "600" }}>
                    {craft.yearsOfExperience} years of experience
                  </p>
                )}
                {craft.isRegistered && craft.contactNumber && (
                  <p style={{ margin: "5px 0 0", fontSize: "13px" }}>
                    Contact: {craft.contactNumber}
                  </p>
                )}

                <button
                  onClick={() => {
                    window.location.href = `/story?craft=${craft.id}`;
                  }}
                >
                  Discover the Story →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Explore;