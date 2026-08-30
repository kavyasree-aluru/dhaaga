import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "/api";
const API_ORIGIN = API_URL.replace(/\/api\/?$/, "");

import { useNavigate } from "react-router-dom";

function Verify() {
  const navigate = useNavigate();
  const [provenance, setProvenance] = useState(null);
  const [isValid, setIsValid] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const getPublicIdFromUrl = () => {
    const parts = window.location.pathname.split("/");
    return parts[parts.length - 1];
  };

  useEffect(() => {
    const publicId = getPublicIdFromUrl();
    if (!publicId) {
      setError("No verification code provided");
      setIsLoading(false);
      return;
    }

    fetch(`${API_URL}/provenance/verify/${publicId}`, {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache" }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Invalid or expired verification code");
        return res.json();
      })
      .then((data) => {
        setProvenance(data.provenance);
        setIsValid(data.isValid);
        setError("");
      })
      .catch((err) => {
        setError(err.message || "Failed to verify craft provenance");
        setProvenance(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fcf8f2",
      }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "18px", color: "#3d2314", marginBottom: "20px" }}>
            Verifying craft authenticity...
          </p>
          <div style={{
            width: "40px",
            height: "40px",
            border: "3px solid #e8ded2",
            borderTop: "3px solid #3d2314",
            borderRadius: "50%",
            margin: "0 auto",
            animation: "spin 0.8s linear infinite"
          }} />
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fcf8f2",
        padding: "20px"
      }}>
        <div style={{
          textAlign: "center",
          maxWidth: "500px",
          padding: "40px",
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}>
          <div style={{
            fontSize: "48px",
            marginBottom: "20px"
          }}>⚠️</div>
          <h1 style={{ color: "#3d2314", marginBottom: "10px" }}>Verification Failed</h1>
          <p style={{ color: "#666", lineHeight: "1.6", marginBottom: "20px" }}>
            {error}
          </p>
          <button
            onClick={() => navigate("/explore")}
            style={{
              padding: "12px 24px",
              backgroundColor: "#3d2314",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600"
            }}
          >
            Back to Explore →
          </button>
        </div>
      </div>
    );
  }

  if (!provenance) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fcf8f2"
      }}>
        <p style={{ color: "#666" }}>No provenance data found</p>
      </div>
    );
  }

  const { artisan, craft, hashChain, createdAt } = provenance;
  const craftImage = craft?.images?.[0] || "https://via.placeholder.com/300";
  const craftImageUrl = /^(https?:|data:|blob:)/i.test(craftImage)
    ? craftImage
    : `${API_ORIGIN}${craftImage.startsWith("/") ? craftImage : `/${craftImage}`}`;

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#fcf8f2",
      padding: "40px 20px",
      paddingTop: "100px"
    }}>
      <div style={{
        maxWidth: "700px",
        margin: "0 auto",
        backgroundColor: "#fff",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        overflow: "hidden"
      }}>
        {/* Header with Authenticity Badge */}
        <div style={{
          background: isValid
            ? "linear-gradient(135deg, #2d5016 0%, #4a7c2c 100%)"
            : "linear-gradient(135deg, #8b0000 0%, #dc143c 100%)",
          color: "#fff",
          padding: "40px 20px",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "64px", marginBottom: "15px" }}>
            {isValid ? "✓" : "✗"}
          </div>
          <h1 style={{ margin: "0 0 10px 0", fontSize: "32px", fontWeight: "700" }}>
            {isValid ? "Authentic Craft ✓" : "Verification Failed"}
          </h1>
          <p style={{ margin: "0", fontSize: "16px", opacity: 0.95 }}>
            {isValid
              ? "This craft's origin and artisan have been verified through our blockchain-based provenance system."
              : "This craft could not be verified. Please check the verification code."}
          </p>
        </div>

        {/* Main Content */}
        <div style={{ padding: "40px" }}>
          {/* Craft Details */}
          {craft && (
            <div style={{ marginBottom: "40px" }}>
              <h2 style={{
                color: "#3d2314",
                fontSize: "20px",
                marginBottom: "20px",
                fontWeight: "600"
              }}>
                Craft Details
              </h2>
              <div style={{
                display: "grid",
                gridTemplateColumns: "150px 1fr",
                gap: "20px",
                alignItems: "start"
              }}>
                <img
                  src={craftImageUrl}
                  alt={craft.title}
                  style={{
                    width: "150px",
                    height: "150px",
                    borderRadius: "8px",
                    objectFit: "cover"
                  }}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/150";
                  }}
                />
                <div>
                  <h3 style={{ margin: "0 0 10px 0", color: "#3d2314" }}>
                    {craft.title}
                  </h3>
                  {craft.price && (
                    <p style={{
                      margin: "5px 0",
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "#2d5016"
                    }}>
                      ₹{craft.price}
                    </p>
                  )}
                  <p style={{ margin: "5px 0", color: "#666", fontSize: "14px" }}>
                    Verified on {new Date(createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Artisan Details */}
          {artisan && (
            <div style={{
              backgroundColor: "#f9f6f1",
              padding: "20px",
              borderRadius: "8px",
              marginBottom: "40px"
            }}>
              <h2 style={{
                color: "#3d2314",
                fontSize: "20px",
                marginBottom: "15px",
                fontWeight: "600"
              }}>
                Artisan Profile
              </h2>
              <div style={{ display: "grid", gap: "10px" }}>
                <div>
                  <label style={{ color: "#666", fontSize: "12px", fontWeight: "600" }}>
                    NAME
                  </label>
                  <p style={{ margin: "5px 0 0 0", color: "#3d2314", fontSize: "16px", fontWeight: "500" }}>
                    {artisan.name}
                  </p>
                </div>
                <div>
                  <label style={{ color: "#666", fontSize: "12px", fontWeight: "600" }}>
                    CRAFT TYPE
                  </label>
                  <p style={{ margin: "5px 0 0 0", color: "#3d2314", fontSize: "16px", fontWeight: "500" }}>
                    {artisan.craftType}
                  </p>
                </div>
                {artisan.location && (
                  <div>
                    <label style={{ color: "#666", fontSize: "12px", fontWeight: "600" }}>
                      LOCATION
                    </label>
                    <p style={{ margin: "5px 0 0 0", color: "#3d2314", fontSize: "16px", fontWeight: "500" }}>
                      {[artisan.location.village, artisan.location.district, artisan.location.state]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>
                )}
                {artisan.verified && (
                  <div style={{
                    marginTop: "10px",
                    padding: "8px 12px",
                    backgroundColor: "#2d5016",
                    color: "#fff",
                    borderRadius: "4px",
                    fontSize: "13px",
                    fontWeight: "600",
                    textAlign: "center"
                  }}>
                    ✓ VERIFIED ARTISAN
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Hash Chain (Blockchain-style) */}
          {hashChain && hashChain.length > 0 && (
            <div style={{
              backgroundColor: "#f0f0f0",
              padding: "20px",
              borderRadius: "8px",
              marginBottom: "40px",
              fontFamily: "monospace"
            }}>
              <h2 style={{
                color: "#3d2314",
                fontSize: "20px",
                marginBottom: "15px",
                fontWeight: "600"
              }}>
                Provenance Chain
              </h2>
              <p style={{
                color: "#666",
                fontSize: "12px",
                marginBottom: "15px",
                lineHeight: "1.5"
              }}>
                Each step in this craft's journey is cryptographically verified:
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                {hashChain.map((event, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "12px",
                      backgroundColor: "#fff",
                      borderRadius: "4px",
                      borderLeft: "4px solid #3d2314"
                    }}
                  >
                    <div style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#3d2314",
                      marginBottom: "5px"
                    }}>
                      {idx + 1}. {event.type?.toUpperCase() || "EVENT"}
                    </div>
                    {event.description && (
                      <p style={{
                        margin: "5px 0",
                        fontSize: "12px",
                        color: "#666"
                      }}>
                        {event.description}
                      </p>
                    )}
                    <div style={{
                      fontSize: "10px",
                      color: "#999",
                      marginTop: "5px",
                      wordBreak: "break-all"
                    }}>
                      Hash: {event.hash?.substring(0, 24)}...
                    </div>
                    <div style={{
                      fontSize: "10px",
                      color: "#999",
                      marginTop: "3px"
                    }}>
                      {new Date(event.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trust & Ethics Note */}
          <div style={{
            backgroundColor: "#e8f5e9",
            padding: "20px",
            borderRadius: "8px",
            borderLeft: "4px solid #2d5016"
          }}>
            <h3 style={{ color: "#2d5016", marginTop: "0", marginBottom: "10px" }}>
              🔐 Privacy & Consent
            </h3>
            <p style={{
              margin: "0",
              fontSize: "13px",
              color: "#1b5e20",
              lineHeight: "1.5"
            }}>
              This artisan's data is shared with their explicit consent and community ownership. 
              DHAAGA prioritizes artisan dignity and cultural sovereignty above profit.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          backgroundColor: "#f9f6f1",
          padding: "20px 40px",
          textAlign: "center",
          borderTop: "1px solid #e8ded2"
        }}>
          <button
            onClick={() => navigate("/explore")}
            style={{
              padding: "10px 20px",
              backgroundColor: "#3d2314",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600"
            }}
          >
            Back to Explore →
          </button>
          <p style={{
            margin: "15px 0 0 0",
            fontSize: "12px",
            color: "#999"
          }}>
            Powered by DHAAGA's blockchain provenance system
          </p>
        </div>
      </div>
    </div>
  );
}

export default Verify;
