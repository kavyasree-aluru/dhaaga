import { useState } from "react";
import "./App.css";
import Explore from "./pages/Explore";
import CraftStory from "./pages/CraftStory";
import CulturalMap from "./pages/Map";
import Artisan from "./pages/Artisan";
import ArtisanInfo from "./pages/ArtisanInfo";
import Auth from "./pages/Auth";

function App() {
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const path = window.location.pathname;

  const renderNavbar = () => (
    <nav className="navbar">
      <div
        className="logo"
        onClick={() => (window.location.href = "/")}
        style={{ cursor: "pointer" }}
      >
        DHAAGA
      </div>

      <div className="nav-links">
        <a href="/">Home</a>
        <a href="/explore">Explore</a>
        <a href="/map">Cultural Map</a>
        <a href="/artisan-info">For Artisans</a>
        <a href="/auth">Sign In</a>
      </div>

      <button
        className="nav-button"
        onClick={() => {
          setEmailSubmitted(false);
          setShowJoinModal(true);
        }}
      >
        Join DHAAGA
      </button>
    </nav>
  );

  const renderModal = () => (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "#fcf8f2",
          padding: "30px",
          borderRadius: "8px",
          maxWidth: "400px",
          width: "90%",
          color: "#3d2314",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}
      >
        {emailSubmitted ? (
          <div style={{ textAlign: "center" }}>
            <h2 style={{ margin: "0 0 10px 0", color: "#3d2314" }}>
              You're In! 🎉
            </h2>
            <p
              style={{
                fontSize: "14px",
                lineHeight: "1.5",
                marginBottom: "20px",
              }}
            >
              Welcome to the DHAAGA community. We've sent a welcome email with
              our latest heritage stories and artisan spotlights.
            </p>
            <button
              onClick={() => {
                setShowJoinModal(false);
                setEmailSubmitted(false);
                window.location.href = "/explore";
              }}
              className="primary-button"
              style={{ width: "100%", padding: "10px", cursor: "pointer" }}
            >
              Explore Stories →
            </button>
          </div>
        ) : (
          <>
            <h2 style={{ margin: "0 0 10px 0", color: "#3d2314" }}>
              Join the Movement
            </h2>
            <p
              style={{
                fontSize: "14px",
                lineHeight: "1.5",
                marginBottom: "20px",
              }}
            >
              Become part of the DHAAGA community to receive updates on local
              artisans, cultural stories, and newly documented heritage crafts.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setEmailSubmitted(true);
              }}
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <input
                required
                type="email"
                placeholder="Enter your email"
                style={{ padding: "10px", border: "1px solid #ccc" }}
              />
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button
                  type="submit"
                  className="primary-button"
                  style={{ flex: 1, padding: "10px", cursor: "pointer" }}
                >
                  Subscribe
                </button>
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    cursor: "pointer",
                    background: "transparent",
                    border: "1px solid #3d2314",
                    color: "#3d2314",
                  }}
                >
                  Close
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );

  if (path === "/explore") {
    return (
      <div className="app">
        {renderNavbar()}
        <Explore />
        {showJoinModal && renderModal()}
      </div>
    );
  }

  if (path === "/map") {
    return (
      <div className="app">
        {renderNavbar()}
        <CulturalMap />
        {showJoinModal && renderModal()}
      </div>
    );
  }

  if (path === "/artisan-info") {
    return (
      <div className="app">
        {renderNavbar()}
        <ArtisanInfo />
        {showJoinModal && renderModal()}
      </div>
    );
  }

  if (path === "/auth") {
    return (
      <div className="app">
        {renderNavbar()}
        <Auth />
        {showJoinModal && renderModal()}
      </div>
    );
  }

  if (path === "/artisan") {
    return (
      <div className="app">
        {renderNavbar()}
        <Artisan />
        {showJoinModal && renderModal()}
      </div>
    );
  }

  if (path === "/story" || path.startsWith("/story/")) {
    return (
      <div className="app">
        <CraftStory />
        {showJoinModal && renderModal()}
      </div>
    );
  }

  return (
    <div className="app">
      {renderNavbar()}
      {showJoinModal && renderModal()}

      <main className="hero">
        <section className="hero-content">
          <p className="eyebrow">EVERY CRAFT CARRIES A STORY</p>

          <h1>
            Discover the
            <br />
            <em>hands behind</em>
            <br />
            India's heritage.
          </h1>

          <p className="hero-description">
            DHAAGA connects overlooked artisans, local crafts and cultural
            stories with people who want to discover, preserve and support
            India's living heritage.
          </p>

          <div className="hero-buttons">
            <button
              className="primary-button"
              onClick={() => {
                window.location.href = "/explore";
              }}
            >
              Explore Heritage →
            </button>

            <button
              className="secondary-button"
              onClick={() => {
                window.location.href = "/artisan";
              }}
            >
              Become an Artisan
            </button>
          </div>
        </section>

        <section className="hero-image">
          {/* Earthy Decorative Background Pattern for Nirmal Toys */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "#2e1b10",
              backgroundImage: `radial-gradient(#b85334 1px, transparent 1px), radial-gradient(#d4a373 1px, #2e1b10 1px)`,
              backgroundSize: "40px 40px",
              backgroundPosition: "0 0, 20px 20px",
              opacity: 0.22,
            }}
          />

          {/* Heritage Craft Motif Artwork Overlay */}
          <div
            style={{
              position: "absolute",
              top: "10%",
              left: "50%",
              transform: "translateX(-50%)",
              opacity: 0.25,
              pointerEvents: "none",
            }}
          >
            <svg width="220" height="220" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="45" stroke="#fcf8f2" strokeWidth="1.5" strokeDasharray="3 3" />
              <path d="M50 20 C35 35 35 65 50 80 C65 65 65 35 50 20 Z" fill="#b85334" />
              <circle cx="50" cy="50" r="12" fill="#d4a373" />
            </svg>
          </div>

          <div className="craft-card" style={{ backdropFilter: "blur(2px)", backgroundColor: "rgba(46, 27, 16, 0.85)", padding: "24px", borderTop: "1px solid #b85334" }}>
            <p className="card-label" style={{ color: "#d4a373", letterSpacing: "1.5px", fontSize: "11px" }}>CRAFT OF THE DAY</p>

            <h2 style={{ color: "#fcf8f2", fontFamily: "serif", fontSize: "28px", margin: "6px 0" }}>Nirmal Wooden Toys</h2>

            <p style={{ color: "#e6d5c3", fontSize: "14px", margin: "0 0 16px 0" }}>📍 Nirmal, Telangana</p>

            <button
              onClick={() => {
                window.location.href = "/story?craft=nirmal";
              }}
              style={{
                backgroundColor: "#b85334",
                color: "#ffffff",
                border: "none",
                padding: "10px 18px",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "13px"
              }}
            >
              Discover the Story →
            </button>
          </div>
        </section>
      </main>

      <section className="intro-strip">
        <div>
          <strong>DISCOVER</strong>
          <span>Overlooked crafts & artisans</span>
        </div>

        <div>
          <strong>DOCUMENT</strong>
          <span>Stories passed through generations</span>
        </div>

        <div>
          <strong>AUTHENTICATE</strong>
          <span>Origin & artisan provenance</span>
        </div>

        <div>
          <strong>CONNECT</strong>
          <span>People with living heritage</span>
        </div>
      </section>
    </div>
  );
}

export default App;