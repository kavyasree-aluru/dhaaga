import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ArtisanInfo() {
  const navigate = useNavigate();
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
    <div className="artisan-info-page">
      <div className="artisan-info-topbar">
        <span className="artisan-language-label">🌐 Language / भाषा:</span>
        <select value={language} onChange={selectLanguage} className="artisan-language-select">
          <option value="en">English</option>
          <option value="te">తెలుగు (Telugu)</option>
          <option value="hi">हिंदी (Hindi)</option>
        </select>
        <button onClick={togglePageSpeech} aria-pressed={isSpeaking} className="artisan-voice-button">
          {isSpeaking ? "🔇 Stop Voice Guidance" : "🔊 Listen Page (Voice Guidance)"}
        </button>
      </div>

      <div className="artisan-info-header">
        <h1>
          Partner with <em>DHAAGA</em>
        </h1>
        <p>Simple, safe, and built for traditional creators.</p>
      </div>

      <div className="artisan-benefits">
        <div className="artisan-benefit-card">
          <div className="benefit-icon">💰</div>
          <h3>Fair Direct Income</h3>
          <p>No middlemen. Get 100% fair payment directly to your account.</p>
        </div>

        <div className="artisan-benefit-card">
          <div className="benefit-icon">🛡️</div>
          <h3>Safe Heritage Tag</h3>
          <p>Digital stamp protecting your craft from fake copies.</p>
        </div>

        <div className="artisan-benefit-card">
          <div className="benefit-icon">🌟</div>
          <h3>Global Name</h3>
          <p>Your picture, story, and art shown proudly to global buyers.</p>
        </div>
      </div>

      <div className="artisan-cta">
        <h2>Join in 2 Minutes using Voice</h2>
        <p>No typing required. Speak in English, Telugu or Hindi to register your craft.</p>
        <button onClick={() => navigate(`/artisan?voice=1&lang=${language}`)}>
          🎙️ Speak &amp; Register →
        </button>
      </div>
    </div>
  );
}

export default ArtisanInfo;
