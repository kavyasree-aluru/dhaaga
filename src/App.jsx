import { useState, useContext, createContext, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import Explore from "./pages/Explore";
import CraftStory from "./pages/CraftStory";
import CulturalMap from "./pages/Map";
import Impact from "./pages/Impact";
import Artisan from "./pages/Artisan";
import ArtisanInfo from "./pages/ArtisanInfo";
import Auth from "./pages/Auth";
import Logistics from "./pages/Logistics";
import Orders from "./pages/Orders";
import Verify from "./pages/Verify";

// Context for modal state
const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

const getStoredUser = () => {
  try {
    const saved = localStorage.getItem("dhaaga-user");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const getStoredToken = () => sessionStorage.getItem("dhaaga-token") || localStorage.getItem("dhaaga-token");

const clearAuthSession = () => {
  sessionStorage.removeItem("dhaaga-token");
  localStorage.removeItem("dhaaga-token");
  localStorage.removeItem("dhaaga-user");
  window.dispatchEvent(new Event("dhaaga-auth-state"));
};

// Navbar component
function Navbar() {
  const navigate = useNavigate();
  const { setShowJoinModal, setEmailSubmitted } = useModal();
  const [currentUser, setCurrentUser] = useState(() => getStoredUser());

  useEffect(() => {
    const syncUser = () => setCurrentUser(getStoredUser());
    const onAuthStateChanged = () => setCurrentUser(getStoredUser());

    window.addEventListener("storage", syncUser);
    window.addEventListener("dhaaga-auth-state", onAuthStateChanged);
    syncUser();

    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("dhaaga-auth-state", onAuthStateChanged);
    };
  }, []);

  const handleAuthClick = (event) => {
    event.preventDefault();
    if (currentUser) {
      navigate("/orders");
      return;
    }
    navigate("/auth");
  };

  const handleSignOut = () => {
    clearAuthSession();
    setCurrentUser(null);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div
        className="logo"
        onClick={() => navigate("/")}
        style={{ cursor: "pointer" }}
      >
        DHAAGA
      </div>

      <div className="nav-links">
        <a href="/" onClick={(e) => { e.preventDefault(); navigate("/"); }}>Home</a>
        <a href="/explore" onClick={(e) => { e.preventDefault(); navigate("/explore"); }}>Explore</a>
        <a href="/impact" onClick={(e) => { e.preventDefault(); navigate("/impact"); }}>Impact</a>
        <a href="/map" onClick={(e) => { e.preventDefault(); navigate("/map"); }}>Cultural Map</a>
        <a href="/artisan-info" onClick={(e) => { e.preventDefault(); navigate("/artisan-info"); }}>For Artisans</a>
        <a href="/orders" onClick={(e) => { e.preventDefault(); navigate("/orders"); }}>My Orders</a>
        <a href="/auth" onClick={handleAuthClick}>{currentUser ? `Hi, ${currentUser.name?.split(" ")[0] || "there"}` : "Sign In"}</a>
        {currentUser && (
          <button
            type="button"
            onClick={handleSignOut}
            style={{
              background: "transparent",
              border: "1px solid #3d2314",
              color: "#3d2314",
              borderRadius: "999px",
              padding: "8px 12px",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            Sign Out
          </button>
        )}
      </div>

      {!currentUser && (
        <button
          className="nav-button"
          onClick={() => {
            setEmailSubmitted(false);
            setShowJoinModal(true);
          }}
        >
          Join DHAAGA
        </button>
      )}
    </nav>
  );
}

function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <div className="site-footer-logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>DHAAGA</div>
          <p>
            Discover. Preserve. Support India's living heritage — one
            craft, one artisan, one story at a time.
          </p>
        </div>

        <div className="site-footer-menu">
          <h4>EXPLORE</h4>
          <ul>
            <li><a onClick={() => navigate("/explore")}>Crafts &amp; Artisans</a></li>
            <li><a onClick={() => navigate("/map")}>Cultural Map</a></li>
            <li><a onClick={() => navigate("/artisan-info")}>For Artisans</a></li>
            <li><a onClick={() => navigate("/artisan")}>Register your craft</a></li>
          </ul>
        </div>

        <div className="site-footer-focus">
          <h4>CURRENT FOCUS</h4>
          <p>
            Craft traditions of Telangana and Andhra Pradesh: Nirmal,
            Kondapalli, Cheriyal, Kalamkari and Mangalagiri.
          </p>
        </div>
      </div>

      <div className="site-footer-bottom">
        <span>© 2026 DHAAGA · Built to keep living heritage visible.</span>
      </div>
    </footer>
  );
}

// Modal component
function JoinModal() {
  const { showJoinModal, setShowJoinModal, emailSubmitted, setEmailSubmitted } = useModal();
  const navigate = useNavigate();
  const [joinError, setJoinError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!showJoinModal) return null;

  return (
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
                const email = localStorage.getItem("dhaaga-join-email");
                setShowJoinModal(false);
                setEmailSubmitted(false);
                if (email) {
                  navigate(`/auth?mode=register&email=${encodeURIComponent(email)}`);
                  return;
                }
                navigate("/explore");
              }}
              className="primary-button"
              style={{ width: "100%", padding: "10px", cursor: "pointer" }}
            >
              Continue to Sign Up →
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
              onSubmit={async (e) => {
                e.preventDefault();
                const emailValue = e.target.email.value.trim();
                if (!emailValue) return;

                setJoinError("");
                setIsSubmitting(true);

                try {
                  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000";
                  const response = await fetch(`${apiBase}/api/newsletter`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: emailValue }),
                  });

                  const data = await response.json().catch(() => ({}));
                  if (!response.ok) {
                    throw new Error(data?.message || "Unable to subscribe right now.");
                  }

                  localStorage.setItem("dhaaga-join-email", emailValue);
                  setEmailSubmitted(true);
                } catch (error) {
                  setJoinError(error.message || "Unable to subscribe right now.");
                } finally {
                  setIsSubmitting(false);
                }
              }}
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <input
                required
                name="email"
                type="email"
                placeholder="Enter your email"
                style={{ padding: "10px", border: "1px solid #ccc" }}
              />
              {joinError && (
                <p style={{ margin: 0, color: "#b11f1f", fontSize: "13px" }}>{joinError}</p>
              )}
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button
                  type="submit"
                  className="primary-button"
                  disabled={isSubmitting}
                  style={{ flex: 1, padding: "10px", cursor: isSubmitting ? "not-allowed" : "pointer", opacity: isSubmitting ? 0.7 : 1 }}
                >
                  {isSubmitting ? "Subscribing..." : "Subscribe"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowJoinModal(false);
                    setJoinError("");
                    setEmailSubmitted(false);
                  }}
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
}

// Layout wrapper for pages with navbar
function LayoutWithNavbar({ children }) {
  return (
    <div className="app">
      <Navbar />
      {children}
      <Footer />
      <JoinModal />
    </div>
  );
}

// Layout for story page (no navbar)
function LayoutStory({ children }) {
  return (
    <div className="app">
      {children}
      <JoinModal />
    </div>
  );
}

// Home page
function Home() {
  const navigate = useNavigate();

  return (
    <div className="app">
      <Navbar />

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
              onClick={() => navigate("/explore")}
            >
              Explore Heritage →
            </button>

            <button
              className="secondary-button"
              onClick={() => navigate("/artisan")}
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

          <div className="craft-card">
            <p className="card-label">CRAFT OF THE DAY</p>

            <h2>Nirmal Wooden Toys</h2>

            <p>📍 Nirmal, Telangana</p>

            <button
              onClick={() => navigate("/story?craft=nirmal")}
            >
              Discover the Story →
            </button>
          </div>
        </section>
      </main>

      <Footer />
      <JoinModal />
    </div>
  );
}

// App with routing
function AppRoutes() {
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  return (
    <ModalContext.Provider
      value={{ showJoinModal, setShowJoinModal, emailSubmitted, setEmailSubmitted }}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/explore"
          element={
            <LayoutWithNavbar>
              <Explore />
            </LayoutWithNavbar>
          }
        />
        <Route
          path="/impact"
          element={
            <LayoutWithNavbar>
              <Impact />
            </LayoutWithNavbar>
          }
        />
        <Route
          path="/map"
          element={
            <LayoutWithNavbar>
              <CulturalMap />
            </LayoutWithNavbar>
          }
        />
        <Route
          path="/artisan-info"
          element={
            <LayoutWithNavbar>
              <ArtisanInfo />
            </LayoutWithNavbar>
          }
        />
        <Route
          path="/auth"
          element={
            <LayoutWithNavbar>
              <Auth />
            </LayoutWithNavbar>
          }
        />
        <Route
          path="/logistics"
          element={
            <LayoutWithNavbar>
              <Logistics />
            </LayoutWithNavbar>
          }
        />
        <Route
          path="/orders"
          element={
            <LayoutWithNavbar>
              <Orders />
            </LayoutWithNavbar>
          }
        />
        <Route
          path="/artisan"
          element={
            <LayoutWithNavbar>
              <Artisan />
            </LayoutWithNavbar>
          }
        />
        <Route
          path="/story"
          element={
            <LayoutStory>
              <CraftStory />
            </LayoutStory>
          }
        />
        <Route
          path="/story/:id"
          element={
            <LayoutStory>
              <CraftStory />
            </LayoutStory>
          }
        />
        <Route
          path="/verify/:id"
          element={
            <LayoutWithNavbar>
              <Verify />
            </LayoutWithNavbar>
          }
        />
      </Routes>
    </ModalContext.Provider>
  );
}

// Main App component
export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
