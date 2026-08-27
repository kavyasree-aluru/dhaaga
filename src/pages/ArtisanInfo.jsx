import { useEffect, useState } from "react";

function ArtisanInfo() {
  const [language, setLanguage] = useState(() => ["en", "te", "hi"].includes(localStorage.getItem("dhaaga-language")) ? localStorage.getItem("dhaaga-language") : "en");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const guidance = {
    en: "Partner with DHAAGA. Simple, safe, and built for traditional creators. Speak and register to share your craft story.",
    te: "DHAAGAతో చేరండి. సంప్రదాయ సృష్టికర్తల కోసం సరళమైన మరియు సురక్షితమైన వేదిక. మీ కళా కథను పంచుకోవడానికి మాట్లాడి నమోదు చేసుకోండి.",
    hi: "DHAAGA से जुड़ें। पारंपरिक रचनाकारों के लिए सरल और सुरक्षित मंच। अपनी शिल्प कहानी साझा करने के लिए बोलकर पंजीकरण करें।",
  };

  const selectLanguage = (event) => {
    const selectedLanguage = event.target.value;
    setLanguage(selectedLanguage);
    localStorage.setItem("dhaaga-language", selectedLanguage);
  };

  const togglePageSpeech = () => {
    if (!("speechSynthesis" in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const speech = new SpeechSynthesisUtterance(
      guidance[language] || guidance.en
    );
    speech.lang = { te: "te-IN", hi: "hi-IN", en: "en-IN" }[language] || "en-IN";
    speech.onend = () => setIsSpeaking(false);
    speech.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(speech);
    setIsSpeaking(true);
  };

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  return (
    <div style={{ padding: "30px 20px", maxWidth: "900px", margin: "0 auto", color: "#3d2314", textAlign: "center" }}>
      
      {/* Accessibility & Voice Banner for Evaluators */}
      <div style={{ backgroundColor: "#e8ded2", padding: "12px 20px", borderRadius: "30px", display: "inline-flex", alignItems: "center", gap: "15px", marginBottom: "25px", border: "1px solid #d4c3b3" }}>
        <span style={{ fontSize: "14px", fontWeight: "bold" }}>🌐 Language / भाषा:</span>
        <select value={language} onChange={selectLanguage} style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid #3d2314", background: "#fcf8f2", color: "#3d2314", cursor: "pointer" }}>
          <option value="en" style={{ backgroundColor: "#fcf8f2", color: "#3d2314" }}>English</option>
          <option value="te" style={{ backgroundColor: "#fcf8f2", color: "#3d2314" }}>తెలుగు (Telugu)</option>
          <option value="hi" style={{ backgroundColor: "#fcf8f2", color: "#3d2314" }}>हिंदी (Hindi)</option>
        </select>
        <button onClick={togglePageSpeech} aria-pressed={isSpeaking} style={{ backgroundColor: "#b85334", color: "#fff", border: "none", padding: "6px 14px", borderRadius: "20px", cursor: "pointer", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px" }}>
          {isSpeaking ? "🔇 Stop Voice Guidance" : "🔊 Listen Page (Voice Guidance)"}
        </button>
      </div>

      <h1 style={{ fontFamily: "serif", fontSize: "36px", margin: "0 0 10px", color: "#3d2314" }}>
        Partner with <em>DHAAGA</em>
      </h1>
      <p style={{ fontSize: "16px", color: "#5a4033", marginBottom: "35px" }}>
        Simple, safe, and built for traditional creators.
      </p>

      {/* Visual 3-Step Solution Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "40px" }}>
        
        <div style={{ padding: "25px 15px", backgroundColor: "#f5efe6", borderRadius: "12px", border: "1px solid #d4c3b3" }}>
          <div style={{ fontSize: "40px", marginBottom: "10px" }}>💰</div>
          <h3 style={{ fontFamily: "serif", margin: "0 0 8px 0", color: "#b85334" }}>Fair Direct Income</h3>
          <p style={{ fontSize: "13px", color: "#5a4033", margin: 0, lineHeight: "1.5" }}>
            No middlemen. Get 100% fair payment directly to your account.
          </p>
        </div>

        <div style={{ padding: "25px 15px", backgroundColor: "#f5efe6", borderRadius: "12px", border: "1px solid #d4c3b3" }}>
          <div style={{ fontSize: "40px", marginBottom: "10px" }}>🛡️</div>
          <h3 style={{ fontFamily: "serif", margin: "0 0 8px 0", color: "#b85334" }}>Safe Heritage Tag</h3>
          <p style={{ fontSize: "13px", color: "#5a4033", margin: 0, lineHeight: "1.5" }}>
            Digital stamp protecting your craft from fake copies.
          </p>
        </div>

        <div style={{ padding: "25px 15px", backgroundColor: "#f5efe6", borderRadius: "12px", border: "1px solid #d4c3b3" }}>
          <div style={{ fontSize: "40px", marginBottom: "10px" }}>🌟</div>
          <h3 style={{ fontFamily: "serif", margin: "0 0 8px 0", color: "#b85334" }}>Global Name</h3>
          <p style={{ fontSize: "13px", color: "#5a4033", margin: 0, lineHeight: "1.5" }}>
            Your picture, story, and art shown proudly to global buyers.
          </p>
        </div>

      </div>

      {/* Voice-First Registration Callout */}
      <div style={{ backgroundColor: "#3d2314", color: "#fcf8f2", padding: "30px 20px", borderRadius: "12px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "serif", marginTop: 0, color: "#fcf8f2", fontSize: "24px" }}>
          Join in 2 Minutes using Voice
        </h2>
        <p style={{ fontSize: "14px", opacity: 0.9, marginBottom: "20px" }}>
          No typing required. Speak in your language to register.
        </p>
        <button
          onClick={() => (window.location.href = `/artisan?voice=1&lang=${language}`)}
          style={{
            padding: "12px 28px",
            fontSize: "15px",
            fontWeight: "bold",
            backgroundColor: "#b85334",
            color: "#ffffff",
            border: "none",
            borderRadius: "30px",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          🎙️ Speak & Register →
        </button>
      </div>

    </div>
  );
}

export default ArtisanInfo;