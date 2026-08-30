import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";

import { normalizeCraftCategory } from "../lib/craftCategories";
import nirmalImage from "../assets/nirmal-toys.jpg";
import kondapalliImage from "../assets/kondapalli-toys.jpg";
import cheriyalImage from "../assets/cheriyal-paintings.jpg";
import kalamkariImage from "../assets/kalamkari.jpg";

import { apiRequest } from "../lib/api";

const API_URL = import.meta.env.VITE_API_URL || "/api";
const API_ORIGIN = API_URL.replace(/\/api\/?$/, "");

const staticStories = {
  nirmal: {
    name: "Nirmal",
    craft: "Wooden Toys",
    location: "Nirmal · Telangana",
    category: "WOOD CRAFT",
    summary:
      "A traditional craft shaped by skilled hands, natural materials and stories passed through generations.",
    story1:
      "Nirmal wooden toys are a traditional craft from Nirmal, Telangana. Artisans carefully shape and paint wooden figures using techniques passed through generations.",
    story2:
      "Each piece reflects the culture and artistic identity of the region. What may look like a simple handmade object carries the knowledge, patience and creativity of the artisan who made it.",
    artisan: "Nirmal Toy Makers",
    artisanLocation: "Nirmal, Telangana",
    artisanDescription:
      "A skilled workshop preserving the carved toy traditions of Telangana through hand-finished storytelling forms.",
    experience: "25+ Years",
    craftType: "Wood Carving",
    image: nirmalImage,
    tags: ["Handmade", "Wood Craft", "Telangana"],
  },

  kondapalli: {
    name: "Kondapalli",
    craft: "Toys",
    location: "Kondapalli · Andhra Pradesh",
    category: "WOOD CRAFT",
    summary:
      "Colourful handcrafted toys shaped from soft local wood and painted by skilled artisans.",
    story1:
      "Kondapalli toys are handcrafted wooden figures made by artisans in Kondapalli, Andhra Pradesh. The craft is known for its distinctive figures, bright colours and traditional themes.",
    story2:
      "Artisans carefully carve, assemble and paint each piece by hand. The knowledge of selecting wood, shaping figures and applying colours is passed from one generation to another.",
    artisan: "Kondapalli Artisans",
    artisanLocation: "Kondapalli, Andhra Pradesh",
    artisanDescription:
      "Artisans preserving one of Andhra Pradesh's best-known traditional toy-making practices.",
    experience: "Generations",
    craftType: "Wood Carving",
    image: kondapalliImage,
    tags: ["Handmade", "Wood Craft", "Andhra Pradesh"],
  },

  cheriyal: {
    name: "Cheriyal",
    craft: "Paintings",
    location: "Cheriyal · Telangana",
    category: "PAINTING",
    summary:
      "Narrative paintings that preserve Telangana's storytelling traditions through colour and form.",
    story1:
      "Cheriyal paintings are traditional narrative paintings from Telangana. They were historically used by storytelling communities to visually represent stories from mythology and local traditions.",
    story2:
      "The paintings use bold colours, expressive figures and distinctive visual styles. Each artwork carries cultural knowledge that connects present-day communities with earlier generations.",
    artisan: "Cheriyal Artists",
    artisanLocation: "Cheriyal, Telangana",
    artisanDescription:
      "Traditional artists continuing Telangana's storytelling heritage through hand-painted works.",
    experience: "Generations",
    craftType: "Narrative Painting",
    image: cheriyalImage,
    tags: ["Hand-painted", "Storytelling", "Telangana"],
  },

  kalamkari: {
    name: "Kalamkari",
    craft: "Textile Art",
    location: "Machilipatnam · Andhra Pradesh",
    category: "TEXTILE",
    summary:
      "Hand-painted and block-printed textile art rooted in traditional Indian storytelling.",
    story1:
      "Kalamkari is a traditional textile art associated with Andhra Pradesh and Telangana. Artisans create detailed patterns using hand painting and block printing techniques.",
    story2:
      "Natural dyes, detailed line work and traditional motifs give Kalamkari its distinctive character. The craft connects artistic practice with regional history and storytelling.",
    artisan: "Kalamkari Artisans",
    artisanLocation: "Andhra Pradesh",
    artisanDescription:
      "Traditional textile artists keeping hand-painted Kalamkari techniques alive.",
    experience: "Generations",
    craftType: "Hand Printing",
    image: kalamkariImage,
    tags: ["Hand-painted", "Textile Art", "Andhra Pradesh"],
  },
};

function imageUrl(image, fallback) {
  if (!image) return fallback;

  if (/^(https?:|data:|blob:)/i.test(image)) {
    return image;
  }

  return `${API_ORIGIN}${image.startsWith("/") ? image : `/${image}`}`;
}

async function resolveStaticArtisanId(story) {
  if (!story?.artisan) return null;

  try {
    const result = await apiRequest("/artisans");
    const artisans = Array.isArray(result?.artisans) ? result.artisans : [];

    const storyName = (story.artisan || "").toLowerCase();
    const storyCraft = (story.craft || "").toLowerCase();

    const match = artisans.find((artisan) => {
      const artisanName = (artisan.name || "").toLowerCase();
      const artisanCraft = (artisan.craftType || "").toLowerCase();

      const normalizedNameMatch =
        artisanName.includes(storyName) || storyName.includes(artisanName);
      const craftMatch =
        artisanCraft.includes(storyCraft) || storyCraft.includes(artisanCraft);

      return normalizedNameMatch || craftMatch;
    });

    return match?._id || null;
  } catch {
    return null;
  }
}

function resolveStoryFromIdSeed(value) {
  const raw = String(value || "").toLowerCase();

  if (!raw) return null;

  if (/(kalamkari|textile|loom|fabric)/.test(raw)) return staticStories.kalamkari;
  if (/(cheriyal|painting|scroll|narrative)/.test(raw)) return staticStories.cheriyal;
  if (/(kondapalli|wood|toy|carv)/.test(raw)) return staticStories.kondapalli;
  if (/(nirmal)/.test(raw)) return staticStories.nirmal;

  return null;
}

function CraftStory() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const queryCraft = searchParams.get("craft");
  const queryArtisan = searchParams.get("artisan");

  const routeKey = id || queryCraft || queryArtisan;
  const staticKey = routeKey && staticStories[routeKey] ? routeKey : null;

  const [story, setStory] = useState(
    staticKey ? staticStories[staticKey] : null
  );

  const [loading, setLoading] = useState(
    Boolean(id || queryArtisan || queryCraft)
  );

  const [error, setError] = useState("");
  const [showCollection, setShowCollection] = useState(false);
  const [requested, setRequested] = useState(false);
  const [supportError, setSupportError] = useState("");
  const [buyForm, setBuyForm] = useState({
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    line1: "",
    city: "",
    state: "",
    postalCode: "",
  });

  useEffect(() => {
    let cancelled = false;

    const loadStory = async () => {
      if (!id && !queryArtisan && !queryCraft) {
        const fallbackStory = staticStories.nirmal;
        setStory({ ...fallbackStory, artisanId: null });
        const artisanId = await resolveStaticArtisanId(fallbackStory);
        if (!cancelled) {
          setStory({ ...fallbackStory, artisanId });
        }
        setLoading(false);
        return;
      }

      if (queryArtisan) {
        const demoFallback = resolveStoryFromIdSeed(queryArtisan);
        if (demoFallback && !cancelled) {
          setStory({ ...demoFallback, artisanId: queryArtisan });
          setLoading(false);
          return;
        }
      }

      if (staticKey && !id && !queryArtisan && !queryCraft) {
        const fallbackStory = staticStories[staticKey];
        setStory({ ...fallbackStory, artisanId: null });
        const artisanId = await resolveStaticArtisanId(fallbackStory);
        if (!cancelled) {
          setStory({ ...fallbackStory, artisanId });
        }
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        let result;

        if (id) {
          if (staticStories[id]) {
            const fallbackStory = staticStories[id];
            setStory({ ...fallbackStory, artisanId: null });
            const artisanId = await resolveStaticArtisanId(fallbackStory);
            if (!cancelled) {
              setStory({ ...fallbackStory, artisanId });
            }
            setLoading(false);
            return;
          }

          const demoFallback = resolveStoryFromIdSeed(id);
          if (demoFallback && !cancelled) {
            setStory({ ...demoFallback, artisanId: id });
            setLoading(false);
            return;
          }

          result = await apiRequest(`/crafts/${id}`);

          const craft = result.craft;
          const artisan =
            typeof craft.artisan === "object"
              ? craft.artisan
              : null;

          const location = [
            artisan?.location?.village,
            artisan?.location?.district,
            artisan?.location?.state,
          ]
            .filter(Boolean)
            .join(" · ") || "India";

          const artisanLocation = [
            artisan?.location?.village,
            artisan?.location?.district,
            artisan?.location?.state,
          ]
            .filter(Boolean)
            .join(", ") || "Location not provided";

          const bio =
            artisan?.bio?.en ||
            "This artisan is preserving a living craft tradition through handmade work.";

          const storyResponse = await fetch(
            `${API_URL}/stories?craft=${craft._id}`
          );

          let storyData = null;

          if (storyResponse.ok) {
            const data = await storyResponse.json();
            storyData = data.stories?.[0] || null;
          }

          setStory({
            name: artisan?.name || "DHAAGA Artisan",
            craft: craft.title,
            location,
            category: (
              craft.craftType || "TRADITIONAL CRAFT"
            ).toUpperCase(),

            summary:
              craft.description ||
              bio,

            story1:
              storyData?.body?.en ||
              craft.description ||
              bio,

            story2:
              storyData?.body?.te ||
              `${artisan?.name || "The artisan"} has ${
                artisan?.yearsOfExperience || 0
              } years of experience creating ${
                craft.craftType
              }. Their work carries the knowledge and identity of their community.`,

            artisan:
              artisan?.name || "DHAAGA Artisan",

            artisanId:
              artisan?._id,

            artisanLocation,

            artisanDescription: bio,

            experience:
              artisan?.yearsOfExperience > 0
                ? `${artisan.yearsOfExperience} Years`
                : "Traditional Practice",

            craftType:
              craft.craftType || "Traditional Craft",

            image: imageUrl(
              craft.images?.[0],
              getStaticFallback(craft.craftType)
            ),

            tags: [
              craft.craftType,
              "Handcrafted",
              artisan?.location?.state || "India",
            ].filter(Boolean),

            craftId: craft._id,
          });

        } else if (queryArtisan || (queryCraft && !staticKey)) {
          const artisanId = queryArtisan || queryCraft;
          const demoFallback = resolveStoryFromIdSeed(artisanId);
          if (demoFallback && !cancelled) {
            setStory({ ...demoFallback, artisanId });
            setLoading(false);
            return;
          }

          result = await apiRequest(`/artisans/${artisanId}`);

          const artisan = result.artisan;

          const location = [
            artisan.location?.village,
            artisan.location?.district,
            artisan.location?.state,
          ]
            .filter(Boolean)
            .join(" · ") || "India";

          const artisanLocation = [
            artisan.location?.village,
            artisan.location?.district,
            artisan.location?.state,
          ]
            .filter(Boolean)
            .join(", ") || "Location not provided";

          const bio =
            artisan.bio?.en ||
            "This artisan is preserving a living craft tradition through handmade work.";

          setStory({
            name: artisan.name,
            craft: artisan.craftType,
            location,
            category: normalizeCraftCategory(artisan.craftType).toUpperCase(),
            summary: bio,
            story1: bio,
            story2:
              `${artisan.name} has ${
                artisan.yearsOfExperience || 0
              } years of experience creating ${
                artisan.craftType
              }. Their work carries the knowledge and identity of their community.`,
            artisan: artisan.name,
            artisanId: artisan._id,
            artisanLocation,
            artisanDescription: bio,
            experience:
              artisan.yearsOfExperience > 0
                ? `${artisan.yearsOfExperience} Years`
                : "Traditional Practice",
            craftType: artisan.craftType,
            image: imageUrl(
              artisan.profilePhoto,
              getStaticFallback(artisan.craftType)
            ),
            tags: [
              artisan.craftType,
              "Handcrafted",
              artisan.location?.state || "India",
            ].filter(Boolean),
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.message ||
              "Unable to load this craft."
          );

          const fallbackStory = resolveStoryFromIdSeed(queryArtisan || queryCraft || id) || staticStories.kalamkari;
          if (!story) {
            setStory({ ...fallbackStory, artisanId: queryArtisan || queryCraft || id || null });
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadStory();

    return () => {
      cancelled = true;
    };
  }, [id, queryArtisan, queryCraft]);

  const getStaticFallback = (type = "") => {
    const normalized = type.toLowerCase();

    if (normalized.includes("kalam")) return kalamkariImage;
    if (normalized.includes("cheriyal")) return cheriyalImage;
    if (normalized.includes("kondapalli")) return kondapalliImage;

    return nirmalImage;
  };

  const currentStory = story || staticStories.nirmal;

  const requestSupport = async () => {
    setSupportError("");

    const currentUser = (() => {
      try {
        const saved = localStorage.getItem("dhaaga-user");
        return saved ? JSON.parse(saved) : null;
      } catch {
        return null;
      }
    })();

    if (!currentUser) {
      setSupportError("Please sign in to support this artisan.");
      navigate("/auth?mode=login");
      return;
    }

    const finalName = (buyForm.contactName || currentUser.name || "Customer").trim();
    const finalEmail = (buyForm.contactEmail || currentUser.email || "").trim();
    const finalPhone = (buyForm.contactPhone || currentUser.phone || "").trim();
    const finalAddress = {
      line1: buyForm.line1.trim(),
      city: buyForm.city.trim(),
      state: buyForm.state.trim(),
      postalCode: buyForm.postalCode.trim(),
    };

    if (!finalName || !finalEmail || !finalPhone || !finalAddress.line1 || !finalAddress.city || !finalAddress.state || !finalAddress.postalCode) {
      setSupportError("Please fill in your name, email, phone number, and delivery address before requesting a purchase.");
      return;
    }

    const validArtisanId =
      currentStory?.artisanId && /^[0-9a-fA-F]{24}$/.test(String(currentStory.artisanId))
        ? currentStory.artisanId
        : undefined;

    try {
      await apiRequest("/support", {
        method: "POST",
        body: JSON.stringify({
          type: "buy",
          artisanId: validArtisanId,
          artisanName: currentStory.artisan || "Traditional Artisan",
          craftType: currentStory.craftType || currentStory.craft || "Traditional Craft",
          contactName: finalName,
          contactEmail: finalEmail,
          contactPhone: finalPhone,
          deliveryAddress: finalAddress,
          message: `Buy request for Handmade ${currentStory.craft}`,
        }),
      });

      setRequested(true);
      setBuyForm({
        contactName: "",
        contactEmail: "",
        city: "",
        state: "",
        postalCode: "",
        line1: "",
        contactPhone: "",
      });

      if (currentUser) {
        navigate("/orders");
      }
    } catch (err) {
      setSupportError(err.message || "Unable to send request right now.");
    }
  };

  if (loading) {
    return (
      <div
        style={{
          padding: "100px 20px",
          textAlign: "center",
          color: "#3d2314",
        }}
      >
        <h2>Loading craft story...</h2>
        <p>Connecting to DHAAGA's heritage database.</p>
      </div>
    );
  }

  return (
    <div className="story-page">
      <nav className="story-navbar">
        <Link to="/" className="story-logo">
          DHAAGA
        </Link>

        <div className="story-nav-links">
          <Link to="/">Home</Link>
          <Link to="/explore">Explore</Link>
          <Link to="/map">Cultural Map</Link>
        </div>

        <button
          className="story-nav-button"
          onClick={() => navigate("/artisan-info")}
        >
          Join DHAAGA
        </button>
      </nav>

      {error && (
        <div
          style={{
            margin: "20px auto",
            maxWidth: "900px",
            padding: "12px 18px",
            background: "#f5efe6",
            borderRadius: "8px",
            color: "#7b5a40",
          }}
        >
          Showing the heritage collection while the live
          record is unavailable.
        </div>
      )}

      <section className="story-hero">
        <div className="story-image">
          {currentStory.image ? (
            <img
              src={currentStory.image}
              alt={`${currentStory.name} ${currentStory.craft}`}
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = nirmalImage;
              }}
            />
          ) : (
            <div className="story-image-placeholder">
              {currentStory.craft}
            </div>
          )}

          <div className="story-image-label">
            {currentStory.category}
          </div>
        </div>

        <div className="story-intro">
          <p className="story-location">
            {currentStory.location}
          </p>

          <h1>
            {currentStory.name}
            <br />
            <em>{currentStory.craft}</em>
          </h1>

          <p className="story-summary">
            {currentStory.summary}
          </p>

          <div className="story-tags">
            {currentStory.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="story-content">
        <div className="story-main">
          <p className="story-eyebrow">
            THE STORY BEHIND THE CRAFT
          </p>

          <h2>
            More than a craft.
            <br />
            <em>A piece of heritage.</em>
          </h2>

          <p>{currentStory.story1}</p>

          <p>{currentStory.story2}</p>

          <p>
            DHAAGA helps bring these stories into the spotlight
            so that local crafts and the people behind them are
            not forgotten.
          </p>
        </div>

        <aside className="artisan-card">
          <p className="artisan-label">
            THE ARTISAN
          </p>

          <div className="artisan-avatar">
            {currentStory.artisan.charAt(0)}
          </div>

          <h3>{currentStory.artisan}</h3>

          <p className="artisan-location">
            {currentStory.artisanLocation}
          </p>

          <p className="artisan-description">
            {currentStory.artisanDescription}
          </p>

          <div className="artisan-details">
            <div>
              <strong>CRAFT</strong>
              <span>{currentStory.craftType}</span>
            </div>

            <div>
              <strong>EXPERIENCE</strong>
              <span>{currentStory.experience}</span>
            </div>
          </div>

          <button
            className="support-button"
            onClick={() => {
              setShowCollection(true);
              setRequested(false);
              setSupportError("");
            }}
          >
            ♡ Support this Artisan
          </button>

          {showCollection && (
            <div className="support-overlay">
              <div className="support-modal">
                <button
                  className="close-support"
                  onClick={() =>
                    setShowCollection(false)
                  }
                >
                  ×
                </button>

                <p className="artisan-label">
                  SUPPORT THE CRAFT
                </p>

                <h2>
                  Support {currentStory.artisan}
                </h2>

                <p>
                  Help keep traditional craftsmanship alive
                  by discovering and supporting handmade work
                  from this artisan.
                </p>

                <div className="collection-card">
                  <div className="collection-image">
                    {currentStory.craft}
                  </div>

                  <div className="collection-info">
                    <h3>
                      Handmade {currentStory.craft}
                    </h3>

                    <p>
                      Crafted by {currentStory.artisan}
                    </p>

                    <span>
                      Authentic-support · Handmade · Traditional
                    </span>

                    {!requested && (
                      <div className="support-form-grid">
                        <input
                          className="support-input"
                          type="text"
                          placeholder="Full name"
                          value={buyForm.contactName}
                          onChange={(event) => setBuyForm((previous) => ({ ...previous, contactName: event.target.value }))}
                        />
                        <input
                          className="support-input"
                          type="email"
                          placeholder="Email address"
                          value={buyForm.contactEmail}
                          onChange={(event) => setBuyForm((previous) => ({ ...previous, contactEmail: event.target.value }))}
                        />
                        <input
                          className="support-input"
                          type="tel"
                          placeholder="Phone number"
                          value={buyForm.contactPhone}
                          onChange={(event) => setBuyForm((previous) => ({ ...previous, contactPhone: event.target.value }))}
                        />
                        <input
                          className="support-input"
                          type="text"
                          placeholder="Address line 1"
                          value={buyForm.line1}
                          onChange={(event) => setBuyForm((previous) => ({ ...previous, line1: event.target.value }))}
                        />
                        <div className="support-form-row">
                          <input
                            className="support-input"
                            type="text"
                            placeholder="City"
                            value={buyForm.city}
                            onChange={(event) => setBuyForm((previous) => ({ ...previous, city: event.target.value }))}
                          />
                          <input
                            className="support-input"
                            type="text"
                            placeholder="State"
                            value={buyForm.state}
                            onChange={(event) => setBuyForm((previous) => ({ ...previous, state: event.target.value }))}
                          />
                        </div>
                        <input
                          className="support-input"
                          type="text"
                          placeholder="Postal code"
                          value={buyForm.postalCode}
                          onChange={(event) => setBuyForm((previous) => ({ ...previous, postalCode: event.target.value }))}
                        />
                      </div>
                    )}

                    <button
                      className="support-buy-button"
                      onClick={requestSupport}
                    >
                      {requested
                        ? "✓ Request Sent"
                        : "Request to Buy →"}
                    </button>
                  </div>
                </div>

                {requested && (
                  <p className="request-message">
                    Thank you! Your interest has been
                    recorded. The artisan's craft deserves to
                    be discovered.
                  </p>
                )}

                {supportError && (
                  <p className="request-message">
                    {supportError}
                  </p>
                )}
              </div>
            </div>
          )}
        </aside>
      </section>

      <section className="heritage-section">
        <p className="story-eyebrow">
          WHY IT MATTERS
        </p>

        <h2>
          Keeping a tradition
          <br />
          <em>alive.</em>
        </h2>

        <div className="heritage-grid">
          <div>
            <span>01</span>
            <h3>Preserve</h3>
            <p>
              Documenting traditional crafts helps preserve
              knowledge that could otherwise disappear.
            </p>
          </div>

          <div>
            <span>02</span>
            <h3>Recognize</h3>
            <p>
              Giving artisans visibility helps their work
              receive the recognition it deserves.
            </p>
          </div>

          <div>
            <span>03</span>
            <h3>Connect</h3>
            <p>
              Connecting people directly with artisans creates
              opportunities for sustainable income.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}

export default CraftStory;
