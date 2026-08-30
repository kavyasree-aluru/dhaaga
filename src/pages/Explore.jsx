import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { CANONICAL_CRAFT_CATEGORIES, normalizeCraftCategory } from "../lib/craftCategories";
import nirmalImage from "../assets/nirmal-toys.jpg";
import kondapalliImage from "../assets/kondapalli-toys.jpg";
import cheriyalImage from "../assets/cheriyal-paintings.jpg";
import kalamkariImage from "../assets/kalamkari.jpg";

const API_URL = import.meta.env.VITE_API_URL || "/api";
const API_ORIGIN = API_URL.replace(/\/api\/?$/, "");

const potteryImage = "https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?auto=format&fit=crop&w=900&q=80";
const palmLeafImage = "https://images.unsplash.com/photo-1756806525261-db4d4d126be8?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fHw%3D";

const fallbackImages = {
  "Textile": kalamkariImage,
  "Wood Craft": nirmalImage,
  "Painting": cheriyalImage,
  "Pottery": potteryImage,
  "Palm-Leaf Weaving & Eco Art": palmLeafImage,
};

const getFallbackImage = (craftType = "") => {
  const normalizedType = String(craftType || "").trim();
  const category = normalizeCraftCategory(normalizedType);
  return fallbackImages[category] || nirmalImage;
};

const getImageUrl = (image, craftType) => {
  if (!image) return getFallbackImage(craftType);

  const normalizedImage = String(image).replace(/\\/g, "/");
  if (/^(https?:|data:|blob:)/i.test(normalizedImage)) return normalizedImage;

  const cleanPath = normalizedImage.startsWith("/") ? normalizedImage : `/${normalizedImage}`;
  return `${API_ORIGIN}${cleanPath}`;
};

function Explore() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [registeredArtisans, setRegisteredArtisans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setSelectedCategory("All");
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/artisans`)
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load registered artisans");
        return response.json();
      })
      .then((result) => setRegisteredArtisans(result.artisans || []))
      .catch((error) => {
        console.error("Failed to fetch artisans:", error.message);
        // Continue gracefully with empty artisans list
      })
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
    {
      id: "pottery",
      name: "Terracotta Craft",
      location: "Thanjavur, Tamil Nadu",
      category: "Pottery",
      description:
        "Hand-thrown clay forms shaped from mud and earth, preserving everyday utility and ritual objects.",
      image: potteryImage,
    },
    {
      id: "palm-leaf",
      name: "Palm-Leaf Weaving & Eco Art",
      location: "Mysuru, Karnataka",
      category: "Palm-Leaf Weaving & Eco Art",
      description:
        "Natural weaving traditions using coconut tree leaves and eco-friendly fibers passed down through generations.",
      image: palmLeafImage,
    },
  ];

  const demoProfiles = [
    {
      id: "demo-kalamkari-1",
      name: "Kalamkari Heritage Collective",
      craftType: "Textile",
      category: "Textile",
      location: { village: "Machilipatnam", district: "Krishna", state: "Andhra Pradesh" },
      bio: { en: "Hand-painted and block-printed textile art inspired by classical Indian storytelling." },
      yearsOfExperience: 28,
      contactNumber: "+91 98765 1111",
      profilePhoto: kalamkariImage,
      isApproved: true,
      isHidden: false,
      isDemo: true,
    },
    {
      id: "demo-kalamkari-2",
      name: "Srikalahasti Kalamkari House",
      craftType: "Textile",
      category: "Textile",
      location: { village: "Srikalahasti", district: "Tirupati", state: "Andhra Pradesh" },
      bio: { en: "A family-run textile studio preserving natural dye and hand-print techniques." },
      yearsOfExperience: 22,
      contactNumber: "+91 98765 2222",
      profilePhoto: kalamkariImage,
      isApproved: true,
      isHidden: false,
      isDemo: true,
    },
    {
      id: "demo-kalamkari-3",
      name: "Telangana Textile Circle",
      craftType: "Textile",
      category: "Textile",
      location: { village: "Warangal", district: "Warangal", state: "Telangana" },
      bio: { en: "Textile storytellers weaving regional motifs into modern hand-crafted fabrics." },
      yearsOfExperience: 19,
      contactNumber: "+91 98765 3333",
      profilePhoto: kalamkariImage,
      isApproved: true,
      isHidden: false,
      isDemo: true,
    },
    {
      id: "demo-nirmal-1",
      name: "Nirmal Toy Makers Guild",
      craftType: "Wood Craft",
      category: "Wood Craft",
      location: { village: "Nirmal", district: "Nirmal", state: "Telangana" },
      bio: { en: "A multigenerational woodcraft studio shaping colourful toys with local stories and natural finishes." },
      yearsOfExperience: 25,
      contactNumber: "+91 98765 4444",
      profilePhoto: nirmalImage,
      isApproved: true,
      isHidden: false,
      isDemo: true,
    },
    {
      id: "demo-kondapalli-1",
      name: "Kondapalli Heritage Makers",
      craftType: "Wood Craft",
      category: "Wood Craft",
      location: { village: "Kondapalli", district: "Krishna", state: "Andhra Pradesh" },
      bio: { en: "Hand-carved wooden figures representing stories, people, and everyday life in Andhra Pradesh." },
      yearsOfExperience: 21,
      contactNumber: "+91 98765 5555",
      profilePhoto: kondapalliImage,
      isApproved: true,
      isHidden: false,
      isDemo: true,
    },
    {
      id: "demo-cheriyal-1",
      name: "Cheriyal Storytellers",
      craftType: "Painting",
      category: "Painting",
      location: { village: "Cheriyal", district: "Suryapet", state: "Telangana" },
      bio: { en: "Narrative painters preserving Telangana's storytelling tradition through hand-painted scrolls." },
      yearsOfExperience: 31,
      contactNumber: "+91 98765 6666",
      profilePhoto: cheriyalImage,
      isApproved: true,
      isHidden: false,
      isDemo: true,
    },
    {
      id: "demo-cheriyal-2",
      name: "Nizamabad Scroll Artists",
      craftType: "Painting",
      category: "Painting",
      location: { village: "Nizamabad", district: "Nizamabad", state: "Telangana" },
      bio: { en: "Traditional scroll painters continuing centuries-old storytelling through motion and colour." },
      yearsOfExperience: 18,
      contactNumber: "+91 98765 7777",
      profilePhoto: cheriyalImage,
      isApproved: true,
      isHidden: false,
      isDemo: true,
    },
    {
      id: "demo-palm-1",
      name: "Eco Weaving Circle",
      craftType: "Palm-Leaf Weaving & Eco Art",
      category: "Palm-Leaf Weaving & Eco Art",
      location: { village: "Mysuru", district: "Mysuru", state: "Karnataka" },
      bio: { en: "Handwoven eco art made from coconut tree leaves and natural fibres, preserving sustainable village craft traditions." },
      yearsOfExperience: 17,
      contactNumber: "+91 98765 8888",
      profilePhoto: palmLeafImage,
      isApproved: true,
      isHidden: false,
      isDemo: true,
    },
    {
      id: "demo-pottery-1",
      name: "Terracotta Makers Guild",
      craftType: "Pottery",
      category: "Pottery",
      location: { village: "Thanjavur", district: "Thanjavur", state: "Tamil Nadu" },
      bio: { en: "Handcrafted pottery shaped from mud, clay and earth, preserving traditional ceramic making and rustic utility forms." },
      yearsOfExperience: 20,
      contactNumber: "+91 98765 9999",
      profilePhoto: potteryImage,
      isApproved: true,
      isHidden: false,
      isDemo: true,
    },
  ];

  // NOTE: we no longer silently drop specific names here — every registered
  // artisan returned by the API is treated as visible unless the API itself
  // marks them hidden/unapproved. Previously this filtered out anyone whose
  // name matched a hardcoded test list, which is why some submitted profiles
  // never showed up.
  const seenArtisanKeys = new Set();

  const buildArtisanKey = (artisan) => {
    const keyParts = [
      artisan?.name,
      artisan?.craftType,
      artisan?.contactNumber,
      artisan?.phone,
      artisan?.location?.village,
      artisan?.location?.district,
      artisan?.location?.state,
      artisan?.bio?.en,
      artisan?.bio?.te,
    ]
      .filter(Boolean)
      .map((value) => String(value).trim().replace(/\s+/g, " ").toLowerCase());

    return keyParts.length ? keyParts.join("|") : String(artisan?._id || "unknown-artisan");
  };

  const dedupeArtisans = (artisans) => {
    const uniqueArtisans = new Map();

    artisans.forEach((artisan) => {
      const canonicalName = String(artisan?.name || "").trim().toLowerCase();
      const canonicalCategory = normalizeCraftCategory(artisan?.craftType || artisan?.category || "");
      const key = `${canonicalName}|${canonicalCategory}`;

      if (!key || !canonicalName) {
        uniqueArtisans.set(`${Math.random().toString(36).slice(2)}|${Math.random().toString(36).slice(2)}`, artisan);
        return;
      }

      const current = uniqueArtisans.get(key);
      if (!current) {
        uniqueArtisans.set(key, artisan);
        return;
      }

      const currentScore = [
        current?.contactNumber || current?.phone,
        current?.location?.village,
        current?.location?.district,
        current?.location?.state,
        current?.bio?.en,
        current?.yearsOfExperience,
      ].filter(Boolean).length;

      const nextScore = [
        artisan?.contactNumber || artisan?.phone,
        artisan?.location?.village,
        artisan?.location?.district,
        artisan?.location?.state,
        artisan?.bio?.en,
        artisan?.yearsOfExperience,
      ].filter(Boolean).length;

      if (nextScore > currentScore) {
        uniqueArtisans.set(key, artisan);
      }
    });

    return [...uniqueArtisans.values()];
  };

  const normalizedProfiles = [...registeredArtisans, ...demoProfiles].filter((artisan) => {
    if (!artisan) return false;
    if (artisan.isHidden === true || artisan.isApproved === false) return false;
    return Boolean(artisan.name || artisan._id || artisan.id);
  });

  const registeredCrafts = dedupeArtisans(normalizedProfiles).reduce((allArtisans, artisan) => {
    const artisanKey = buildArtisanKey(artisan);
    if (seenArtisanKeys.has(artisanKey)) return allArtisans;
    seenArtisanKeys.add(artisanKey);

    const craftCategory = normalizeCraftCategory(artisan.craftType || artisan.category || "");
    if (!craftCategory || craftCategory === "Other") {
      return allArtisans;
    }

    allArtisans.push({
      id: artisan._id || artisan.id,
      name: artisan.name,
      location: [artisan.location?.village, artisan.location?.district, artisan.location?.state]
        .filter(Boolean)
        .join(", ") || "Location not provided",
      category: craftCategory,
      description: artisan.bio?.en || artisan.description || "A registered DHAAGA artisan preserving a living craft tradition.",
      yearsOfExperience: artisan.yearsOfExperience || 15,
      contactNumber: artisan.contactNumber || artisan.phone || "",
      image: getImageUrl(artisan.profilePhoto || artisan.image, craftCategory),
      isRegistered: Boolean(artisan._id || artisan.id),
      isDemo: Boolean(artisan.isDemo),
    });

    return allArtisans;
  }, []);

  const allCrafts = [...registeredCrafts, ...crafts];

  const sortedRegisteredCrafts = [...registeredCrafts].sort((a, b) => a.name.localeCompare(b.name));
  const allCraftsSorted = [...sortedRegisteredCrafts, ...crafts];

  const categories = [
    { id: "All", label: "All" },
    ...CANONICAL_CRAFT_CATEGORIES.map((category) => ({ id: category, label: category === "Textile" ? "Textiles" : category })),
    ...registeredCrafts
      .map((craft) => craft.category)
      .filter((category) => !CANONICAL_CRAFT_CATEGORIES.includes(category))
      .filter((category, index, all) => all.findIndex((item) => item === category) === index)
      .map((category) => ({ id: category, label: category })),
  ];

  const categoryCounts = new Map();
  registeredCrafts.forEach((craft) => {
    const craftCategory = normalizeCraftCategory(craft.category);
    if (craftCategory && craftCategory !== "Other") {
      categoryCounts.set(craftCategory, (categoryCounts.get(craftCategory) || 0) + 1);
    }
  });

  // Build one summary card per category (used for the "All" view) so the
  // same craft type isn't repeated once per artisan. Each card aggregates
  // how many registered artisans belong to that category.
  const categoryCards = categories
    .filter((cat) => cat.id !== "All")
    .map((cat) => {
      const registeredInCategory = registeredCrafts.filter((craft) => normalizeCraftCategory(craft.category) === cat.id);
      const demoInCategory = crafts.find((craft) => normalizeCraftCategory(craft.category) === cat.id);
      const representative = demoInCategory || registeredInCategory[0];
      const artisanCount = categoryCounts.get(cat.id) || registeredInCategory.length;

      return {
        id: cat.id,
        category: cat.id,
        label: cat.label,
        image: representative?.image || getFallbackImage(cat.id),
        fallbackCraftId: demoInCategory?.id,
        artisanCount,
      };
    })
    .filter((card) => card.fallbackCraftId || registeredCrafts.some((craft) => normalizeCraftCategory(craft.category) === card.id));

  const filteredCrafts = allCraftsSorted
    .filter((craft) => normalizeCraftCategory(craft.category) === selectedCategory)
    .reduce((items, craft) => {
      const craftKey = [
        String(craft?.name || craft?.label || "").trim().toLowerCase(),
        String(craft?.category || craft?.craftType || "").trim().toLowerCase(),
        String(craft?.location || "").trim().toLowerCase(),
        String(craft?.contactNumber || craft?.phone || "").replace(/\D/g, ""),
      ].join("|");

      if (!craftKey) {
        items.push(craft);
        return items;
      }

      if (items.some((item) => {
        const itemKey = [
          String(item?.name || item?.label || "").trim().toLowerCase(),
          String(item?.category || item?.craftType || "").trim().toLowerCase(),
          String(item?.location || "").trim().toLowerCase(),
          String(item?.contactNumber || item?.phone || "").replace(/\D/g, ""),
        ].join("|");

        return itemKey === craftKey;
      })) {
        return items;
      }

      items.push(craft);
      return items;
    }, []);

  const categoryDisplayCrafts = selectedCategory === "All"
    ? categoryCards
    : [...registeredCrafts.filter((craft) => normalizeCraftCategory(craft.category) === selectedCategory), ...crafts.filter((craft) => normalizeCraftCategory(craft.category) === selectedCategory)]
        .reduce((items, craft) => {
          const key = craft.id || `${craft.name || craft.label}-${craft.category}`;
          if (!items.some((item) => (item.id || `${item.name || item.label}-${item.category}`) === key)) {
            items.push(craft);
          }
          return items;
        }, []);

  const displayCrafts = selectedCategory === "All"
    ? categoryCards
    : categoryDisplayCrafts.length > 0
      ? categoryDisplayCrafts
      : (() => {
          const fallbackCategoryCrafts = demoProfiles.filter((artisan) => normalizeCraftCategory(artisan.craftType || artisan.category || "") === selectedCategory);
          return fallbackCategoryCrafts.map((artisan) => ({
            id: artisan.id,
            name: artisan.name,
            category: normalizeCraftCategory(artisan.craftType || artisan.category || ""),
            location: [artisan.location?.village, artisan.location?.district, artisan.location?.state].filter(Boolean).join(", ") || "Location not provided",
            description: artisan.bio?.en || "A DHAAGA artisan preserving a living craft tradition.",
            yearsOfExperience: artisan.yearsOfExperience || 15,
            contactNumber: artisan.contactNumber || "",
            image: getImageUrl(artisan.profilePhoto, normalizeCraftCategory(artisan.craftType || artisan.category || "")),
          }));
        })();

  const totalRegisteredArtisans = registeredCrafts.length;
  const categoriesCount = categoryCards.length;

  const filterOptions = categories;

  return (
    <div className="explore-page">
      <section className="craft-section">
        <div className="section-heading">
          <h2>Explore Crafts</h2>

          <div className="filters">
            {filterOptions.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={selectedCategory === cat.id ? "active" : ""}
                onClick={() => setSelectedCategory(cat.id)}
                onMouseEnter={() => setHoveredCategory(cat.id)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {selectedCategory === "All" && (
          <div className="explore-landing">
            <div className="explore-landing-copy">
              <p className="eyebrow">Craft Heritage Collection</p>
              <h3>Discover living traditions across India.</h3>
              <p>
                Explore handcrafted art forms, artisan stories, and the communities preserving them through generations.
              </p>
            </div>
            <div className="explore-metrics" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "13px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b4d3a" }}>
                Living traditions
              </span>
            </div>
          </div>
        )}

        <div style={{
          margin: "20px auto 0",
          maxWidth: "1000px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
          textAlign: "center",
          background: "#f5e9dd",
          border: "1px solid #e3c7a5",
          borderRadius: "14px",
          padding: "18px 22px",
          color: "#3d2314"
        }}>
          <p style={{ margin: 0, fontSize: "15px", lineHeight: "1.5" }}>
            See how DHAAGA turns heritage into fair livelihoods and measurable impact.
          </p>
          <button
            type="button"
            onClick={() => navigate("/impact")}
            style={{
              background: "#3d2314",
              color: "#fcf8f2",
              border: "none",
              borderRadius: "999px",
              padding: "10px 18px",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            View Impact →
          </button>
        </div>

        <div className="craft-showcase">
          <div className="craft-grid">
            {isLoading && <p className="empty-state">Loading registered artisans...</p>}

            {!isLoading && displayCrafts.length === 0 && (
              <p className="empty-state">No artisans found in this category yet.</p>
            )}

            {!isLoading &&
              displayCrafts.map((craft) => {
                const isCategorySummary = selectedCategory === "All";

                if (isCategorySummary) {
                  return (
                    <article className="craft-item" key={craft.id}>
                      <div className="craft-image">
                        <img
                          src={craft.image}
                          alt={craft.label}
                          onError={(event) => {
                            event.currentTarget.onerror = null;
                            event.currentTarget.src = getFallbackImage(craft.category || craft.label);
                          }}
                        />
                        <span>{craft.category || craft.label}</span>
                      </div>

                      <div className="craft-info">
                        <h3>{craft.label}</h3>
                        <span>Explore artisans preserving this living craft tradition.</span>
                        <button type="button" onClick={() => setSelectedCategory(craft.category)}>
                          View artisans →
                        </button>
                      </div>
                    </article>
                  );
                }

                return (
                  <article className="craft-item" key={craft.id}>
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
                      <p className="craft-location">{craft.location || "Craft heritage"}</p>
                      <h3>{craft.name}</h3>
                      {craft.yearsOfExperience > 0 && (
                        <p className="craft-meta">{craft.yearsOfExperience} years of experience</p>
                      )}
                      {craft.contactNumber && (
                        <p className="craft-contact">Contact: {craft.contactNumber}</p>
                      )}
                      <span>{craft.description}</span>
                      <button type="button" onClick={() => navigate(`/story?artisan=${craft.id}`)}>
                        Discover the Story →
                      </button>
                    </div>
                  </article>
                );
              })}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Explore;