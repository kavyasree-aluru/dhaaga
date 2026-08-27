import { useEffect, useState } from "react";

import nirmalImage from "../assets/nirmal-toys.jpg";
import kondapalliImage from "../assets/kondapalli-toys.jpg";
import cheriyalImage from "../assets/cheriyal-paintings.jpg";
import kalamkariImage from "../assets/kalamkari.jpg";
import { apiRequest } from "../lib/api";

const API_URL = import.meta.env.VITE_API_URL || "/api";

const stories = {
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
    artisan: "Lakshmi & Family",
    artisanLocation: "Nirmal, Telangana",
    artisanDescription:
      "A small family workshop keeping traditional wooden toy-making alive through generations.",
    experience: "25+ Years",
    craftType: "Wood Carving",
    image: nirmalImage,
    tags: ["Handcrafted", "Traditional", "Telangana"],
  },

  kondapalli: {
    name: "Kondapalli",
    craft: "Toys",
    location: "Kondapalli · Andhra Pradesh",
    category: "WOOD CRAFT",
    summary:
      "Hand-carved wooden figures reflecting local life, traditions and stories from Andhra Pradesh.",
    story1:
      "Kondapalli toys are handcrafted wooden figures made by skilled artisans in Kondapalli, Andhra Pradesh. The craft is known for its distinctive characters and colourful designs.",
    story2:
      "From village scenes to mythological figures, each toy captures elements of local culture and everyday life while preserving traditional woodworking techniques.",
    artisan: "Ravi & Family",
    artisanLocation: "Kondapalli, Andhra Pradesh",
    artisanDescription:
      "A family workshop continuing the traditional art of carving and painting Kondapalli toys.",
    experience: "30+ Years",
    craftType: "Wood Carving",
    image: kondapalliImage,
    tags: ["Hand-carved", "Traditional", "Andhra Pradesh"],
  },

  cheriyal: {
    name: "Cheriyal",
    craft: "Paintings",
    location: "Cheriyal · Telangana",
    category: "PAINTING",
    summary:
      "Narrative scroll paintings that preserve Telangana's storytelling traditions through vivid art.",
    story1:
      "Cheriyal paintings are traditional narrative scrolls from Telangana. Artists use bold colours and expressive figures to visually tell stories from folklore, mythology and village life.",
    story2:
      "The paintings historically travelled with storytellers, turning visual art into a powerful way of preserving cultural memory and passing stories from one generation to another.",
    artisan: "Srinivas Family",
    artisanLocation: "Cheriyal, Telangana",
    artisanDescription:
      "A traditional painting family preserving the storytelling heritage of Cheriyal through handmade scroll art.",
    experience: "20+ Years",
    craftType: "Scroll Painting",
    image: cheriyalImage,
    tags: ["Hand-painted", "Narrative Art", "Telangana"],
  },

  kalamkari: {
    name: "Kalamkari",
    craft: "Textiles",
    location: "Machilipatnam · Andhra Pradesh",
    category: "TEXTILE",
    summary:
      "Hand-painted and block-printed textiles carrying stories inspired by mythology, nature and Indian culture.",
    story1:
      "Kalamkari is a traditional textile art involving hand painting and block printing on fabric. Artisans create detailed designs inspired by mythology, nature and Indian cultural traditions.",
    story2:
      "The process requires patience and precision, with patterns built through multiple stages of drawing, dyeing and printing. Each textile reflects the skill and creativity of its maker.",
    artisan: "Meera & Family",
    artisanLocation: "Machilipatnam, Andhra Pradesh",
    artisanDescription:
      "A family workshop keeping traditional Kalamkari techniques alive through handmade textile art.",
    experience: "28+ Years",
    craftType: "Hand Printing",
    image: kalamkariImage,
    tags: ["Hand-painted", "Textile Art", "Andhra Pradesh"],
  },
};

function CraftStory() {
  const [showCollection, setShowCollection] = useState(false);
  const [requested, setRequested] = useState(false);
  const [supportError, setSupportError] = useState("");
  const [registeredStory, setRegisteredStory] = useState(null);

  const params = new URLSearchParams(window.location.search);
  const craftId = params.get("craft") || "nirmal";

  useEffect(() => {
    if (stories[craftId]) return undefined;

    fetch(`${API_URL}/artisans/${craftId}`)
      .then((response) => {
        if (!response.ok) throw new Error("Artisan profile not found");
        return response.json();
      })
      .then(({ artisan }) => {
        const location = [artisan.location?.village, artisan.location?.district, artisan.location?.state]
          .filter(Boolean)
          .join(" · ") || "India";
        const artisanLocation = [artisan.location?.village, artisan.location?.district, artisan.location?.state]
          .filter(Boolean)
          .join(", ") || "Location not provided";
        const profileStory = artisan.bio?.en || "This artisan is preserving a living craft tradition through handmade work.";

        setRegisteredStory({
          name: artisan.name,
          craft: artisan.craftType,
          location,
          category: artisan.craftType.toUpperCase(),
          summary: profileStory,
          story1: profileStory,
          story2: `${artisan.name} has ${artisan.yearsOfExperience || 0} years of experience creating ${artisan.craftType}. Their work carries the knowledge and identity of their community.`,
          artisan: artisan.name,
          artisanId: artisan._id,
          artisanLocation,
          artisanDescription: profileStory,
          experience: `${artisan.yearsOfExperience || 0} Years`,
          craftType: artisan.craftType,
          image: artisan.profilePhoto || null,
          tags: [artisan.craftType, "Handcrafted", artisan.location?.state || "India"],
        });
      })
      .catch(() => setRegisteredStory(null));

    return undefined;
  }, [craftId]);

  const story = stories[craftId] || registeredStory || stories.nirmal;

  return (
    <div className="story-page">

      {/* TOP NAVIGATION */}

      <nav className="story-navbar">
        <a href="/" className="story-logo">
          DHAAGA
        </a>

        <div className="story-nav-links">
          <a href="/">Home</a>
          <a href="/explore">Explore</a>
          <a href="/map">Cultural Map</a>
        </div>

        <button className="story-nav-button">
          Join DHAAGA
        </button>
      </nav>


      {/* HERO */}

      <section className="story-hero">

        <div className="story-image">

          {story.image ? (
            <img
              src={story.image}
              alt={`${story.name} ${story.craft}`}
            />
          ) : (
            <div className="story-image-placeholder">{story.craft}</div>
          )}

          <div className="story-image-label">
            {story.category}
          </div>

        </div>


        <div className="story-intro">

          <p className="story-location">
            {story.location}
          </p>

          <h1>
            {story.name}
            <br />
            <em>{story.craft}</em>
          </h1>

          <p className="story-summary">
            {story.summary}
          </p>

          {/* CRAFT TAGS */}

          <div className="story-tags">
            {story.tags.map((tag) => (
              <span key={tag}>
                {tag}
              </span>
            ))}
          </div>

        </div>

      </section>


      {/* STORY CONTENT */}

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

          <p>
            {story.story1}
          </p>

          <p>
            {story.story2}
          </p>

          <p>
            DHAAGA helps bring these stories into the spotlight
            so that local crafts and the people behind them are
            not forgotten.
          </p>

        </div>


        {/* ARTISAN CARD */}

        <aside className="artisan-card">

          <p className="artisan-label">
            THE ARTISAN
          </p>

          <div className="artisan-avatar">
            {story.artisan.charAt(0)}
          </div>

          <h3>
            {story.artisan}
          </h3>

          <p className="artisan-location">
            {story.artisanLocation}
          </p>

          <p className="artisan-description">
            {story.artisanDescription}
          </p>

          <div className="artisan-details">

            <div>
              <strong>CRAFT</strong>
              <span>{story.craftType}</span>
            </div>

            <div>
              <strong>EXPERIENCE</strong>
              <span>{story.experience}</span>
            </div>

          </div>


          {/* SUPPORT BUTTON */}

          <button
            className="support-button"
            onClick={() => {
              setShowCollection(true);
              setRequested(false);
            }}
          >
            ♡ Support this Artisan
          </button>


          {/* SUPPORT / CRAFT COLLECTION MODAL */}

          {showCollection && (
            <div className="support-overlay">

              <div className="support-modal">

                <button
                  className="close-support"
                  onClick={() => setShowCollection(false)}
                >
                  ×
                </button>

                <p className="artisan-label">
                  SUPPORT THE CRAFT
                </p>

                <h2>
                  Support {story.artisan}
                </h2>

                <p>
                  Help keep traditional craftsmanship alive by
                  discovering and supporting handmade work from
                  this artisan.
                </p>


                {/* PRODUCT / CRAFT CARD */}

                <div className="collection-card">

                  <div className="collection-image">
                    {story.craft}
                  </div>

                  <div className="collection-info">

                    <h3>
                      Handmade {story.craft}
                    </h3>

                    <p>
                      Crafted by {story.artisan}
                    </p>

                    <span>
                      Authentic · Handmade · Traditional
                    </span>

                    <button
                      className="support-buy-button"
                      onClick={async () => {
                        setSupportError("");
                        if (!story.artisanId) {
                          setRequested(true);
                          return;
                        }

                        try {
                          await apiRequest("/support", {
                            method: "POST",
                            body: JSON.stringify({
                              type: "support",
                              artisanId: story.artisanId,
                              contactName: "DHAAGA visitor",
                              message: `Interest in Handmade ${story.craft}`,
                            }),
                          });
                          setRequested(true);
                        } catch (error) {
                          setSupportError(error.message);
                        }
                      }}
                    >
                      {requested
                        ? "✓ Request Sent"
                        : "Request to Buy →"}
                    </button>

                  </div>

                </div>


                {/* REQUEST CONFIRMATION */}

                {requested && (
                  <p className="request-message">
                    Thank you! Your interest has been recorded.
                    The artisan's craft deserves to be discovered.
                  </p>
                )}
                {supportError && <p className="request-message">{supportError}</p>}

              </div>

            </div>
          )}

        </aside>

      </section>


      {/* CULTURAL SIGNIFICANCE */}

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

            <h3>
              Preserve
            </h3>

            <p>
              Documenting traditional crafts helps preserve
              knowledge that could otherwise disappear.
            </p>
          </div>


          <div>
            <span>02</span>

            <h3>
              Recognize
            </h3>

            <p>
              Giving artisans visibility helps their work
              receive the recognition it deserves.
            </p>
          </div>


          <div>
            <span>03</span>

            <h3>
              Connect
            </h3>

            <p>
              Connecting people directly with artisans creates
              opportunities for sustainable income.
            </p>
          </div>

        </div>

      </section>


      {/* FOOTER */}

      <footer className="story-footer">

        <div className="story-logo">
          DHAAGA
        </div>

        <p>
          Discover. Preserve. Support India's living heritage.
        </p>

      </footer>

    </div>
  );
}

export default CraftStory;