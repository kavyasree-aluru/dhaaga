const API_URL = import.meta.env.VITE_API_URL || "/api";
const AUTH_TOKEN_KEY = "dhaaga-token";
import { useCallback, useEffect, useRef, useState } from "react";

import { getCraftCategoryOptions } from "../lib/craftCategories";

// Canonical craft categories. Registrations are locked to this list (plus "Other")
// so that artisans doing the same craft always land in the same category on Explore,
// instead of being split apart by free-text spelling differences.
const CRAFT_OPTIONS = getCraftCategoryOptions();

const formCopy = {
  en: {
    join: "JOIN OUR COMMUNITY", heading: "Preserve Your Craft with", intro: "Are you an artisan, weaver, or traditional creator? Register with DHAAGA to document your story, feature your creations, and reach people who value authentic heritage.", speak: "Speak to Fill Form", listening: "Listening...", listenPrompt: "Listening... speak your name, craft, location, phone number, story, and years of experience.", captured: "Captured", unsupported: "Voice input is not supported in this browser. Please fill the form manually.", failed: "Voice capture failed. Please type the details manually.", submitted: "Thank you for reaching out!", submittedDetail: "Our team will get in touch with you shortly to assist with your onboarding.", submit: "Submit Artisan Application", submitting: "Submitting...", name: "Your Name", craft: "Craft Type / Art Form", location: "Location (Village / City, State)", phone: "Contact Number", story: "Your Craft Story", years: "Years of Experience", namePlaceholder: "e.g. Sita Narayana", craftPlaceholder: "e.g. Nirmal Wooden Toys, Kalamkari", locationPlaceholder: "e.g. Nirmal, Telangana", phonePlaceholder: "+91 98765 43210", storyPlaceholder: "Tell people about your craft, its history, and what makes your work special", yearsPlaceholder: "e.g. 20",
  },
  te: {
    join: "మా సంఘంలో చేరండి", heading: "మీ కళను కాపాడండి", intro: "మీరు కళాకారులా, నేత పనివారా లేదా సంప్రదాయ సృష్టికర్తా? మీ కథను నమోదు చేయడానికి DHAAGAలో చేరండి.", speak: "ఫారమ్ నింపడానికి మాట్లాడండి", listening: "వింటున్నాము...", listenPrompt: "మీ పేరు, కళ, ప్రాంతం, ఫోన్ నంబర్, కథ మరియు అనుభవ సంవత్సరాలు చెప్పండి.", captured: "నమోదైంది", unsupported: "ఈ బ్రౌజర్‌లో వాయిస్ ఇన్‌పుట్ అందుబాటులో లేదు. దయచేసి ఫారమ్‌ను టైప్ చేయండి.", failed: "వాయిస్ నమోదు విఫలమైంది. దయచేసి వివరాలను టైప్ చేయండి.", submitted: "మమ్మల్ని సంప్రదించినందుకు ధన్యవాదాలు!", submittedDetail: "మీ నమోదు ప్రక్రియలో సహాయం చేయడానికి మా బృందం త్వరలో మిమ్మల్ని సంప్రదిస్తుంది.", submit: "కళాకారుల దరఖాస్తును పంపండి", submitting: "పంపుతున్నాము...", name: "మీ పేరు", craft: "కళ రకం / కళారూపం", location: "ప్రాంతం (గ్రామం / నగరం, రాష్ట్రం)", phone: "ఫోన్ నంబర్", story: "మీ కళా కథ", years: "అనుభవ సంవత్సరాలు", namePlaceholder: "ఉదా. లక్ష్మీ దేవి", craftPlaceholder: "ఉదా. కలంకారి", locationPlaceholder: "ఉదా. నిర్మల్, తెలంగాణ", phonePlaceholder: "+91 98765 43210", storyPlaceholder: "మీ కళ, దాని చరిత్ర మరియు ప్రత్యేకత గురించి చెప్పండి", yearsPlaceholder: "ఉదా. 20",
  },
  hi: {
    join: "हमारे समुदाय से जुड़ें", heading: "अपनी कला को सुरक्षित रखें", intro: "क्या आप शिल्पकार, बुनकर या पारंपरिक कलाकार हैं? अपनी कहानी दर्ज करने के लिए DHAAGA से जुड़ें।", speak: "फॉर्म भरने के लिए बोलें", listening: "सुन रहे हैं...", listenPrompt: "अपना नाम, कला, स्थान, फोन नंबर, कहानी और अनुभव के वर्ष बोलें।", captured: "दर्ज किया गया", unsupported: "इस ब्राउज़र में वॉइस इनपुट उपलब्ध नहीं है। कृपया फॉर्म टाइप करें।", failed: "वॉइस रिकॉर्ड नहीं हो सकी। कृपया विवरण टाइप करें।", submitted: "संपर्क करने के लिए धन्यवाद!", submittedDetail: "आपके जुड़ने में सहायता के लिए हमारी टीम जल्द आपसे संपर्क करेगी।", submit: "शिल्पकार आवेदन भेजें", submitting: "भेज रहे हैं...", name: "आपका नाम", craft: "शिल्प प्रकार / कला रूप", location: "स्थान (गाँव / शहर, राज्य)", phone: "फोन नंबर", story: "आपकी शिल्प कहानी", years: "अनुभव के वर्ष", namePlaceholder: "जैसे लक्ष्मी देवी", craftPlaceholder: "जैसे कलमकारी", locationPlaceholder: "जैसे निर्मल, तेलंगाना", phonePlaceholder: "+91 98765 43210", storyPlaceholder: "अपनी कला, इतिहास और विशेषता के बारे में बताएं", yearsPlaceholder: "जैसे 20",
  },
};

function Artisan() {
  const [language] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedLanguage = params.get("lang") || localStorage.getItem("dhaaga-language");
    return ["en", "te", "hi"].includes(requestedLanguage) ? requestedLanguage : "en";
  });
  const copy = formCopy[language] || formCopy.en;
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState("");
  const [formData, setFormData] = useState({ name: "", craftType: "", customCraftType: "", location: "", phone: "", story: "", yearsOfExperience: "", profilePhoto: null });
  const recognitionRef = useRef(null);

  const updateField = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const applyVoiceTranscript = useCallback((text) => {
    const cleaned = text.trim().replace(/\s+/g, " ");
    if (!cleaned) return;

    const fieldLabels = "(?:name|craft(?: type)?|art form|location|village|city|state|phone(?: number)?|mobile(?: number)?|contact(?: number)?|story|bio|about my craft|years?(?: of experience)?|experience|పేరు|కళ|శిల్పం|స్థలం|ప్రాంతం|ఫోన్|కథ|అనుభవం|नाम|शिल्प|कला|स्थान|फोन|कहानी|अनुभव)";
    const valueAfter = (labels) => cleaned.match(new RegExp(`(?:${labels})\\s*(?:is|:|है|అంటే|గా|ఇది|కోసం|हैं)?\\s*(.*?)(?=\\s+(?:${fieldLabels})\\s*(?:is|:|है|అంటే|గా|ఇది|కోసం|हैं)?|$)`, "i"))?.[1]?.trim().replace(/[,.]$/, "");
    const updates = {};
    const name = valueAfter("my name|name|i am|call me|this is|పేరు|నేను|నన్ను|नाम");
    const craftType = valueAfter("craft(?: type)?|i make|i weave|i create|art form|my craft|కళ|శిల్పం|కళారూపం|कला|शिल्प");
    const location = valueAfter("location|from|live in|located in|village|city|state|స్థలం|ప్రాంతం|గ్రామం|నగరం|రాష్ట్రం|स्थान");
    const phone = valueAfter("phone(?: number)?|call me on|contact(?: number)?|mobile(?: number)?|ఫోన్|సెల్|फोन");
    const story = valueAfter("(?:my )?story|bio|about my craft|tell me about my craft|కథ|కళా కథ|कहानी|कला की कहानी");
    const years = valueAfter("years?(?: of experience)?|experience|(?:i have|with)\\s+\\d+\\s+years?|అనుభవం|अनुभవ");
    const phoneDigits = cleaned.match(/(?:\+?\d[\d\s-]{5,}\d)/)?.[0];

    if (name && name.length <= 60) updates.name = name;
    if (craftType) {
      // Match the spoken craft against our fixed category list so it still
      // groups correctly on Explore; anything unmatched falls into "Other".
      const matchedOption = CRAFT_OPTIONS.find(
        (option) => option !== "Other" && option.toLowerCase().includes(craftType.toLowerCase().trim())
      );
      if (matchedOption) {
        updates.craftType = matchedOption;
      } else {
        updates.craftType = "Other";
        updates.customCraftType = craftType;
      }
    }
    if (location) updates.location = location;
    if (phone) {
      const normalizedPhone = phone.toLowerCase().replace(/zero/g, "0").replace(/one/g, "1").replace(/two/g, "2").replace(/three/g, "3").replace(/four/g, "4").replace(/five/g, "5").replace(/six/g, "6").replace(/seven/g, "7").replace(/eight/g, "8").replace(/nine/g, "9").replace(/[^0-9+]/g, "");
      if (normalizedPhone.length >= 7) updates.phone = normalizedPhone;
    }
    if (story) updates.story = story;
    if (years) updates.yearsOfExperience = years.match(/\d+/)?.[0] || "";

    if (phoneDigits) {
      const words = cleaned.slice(0, cleaned.indexOf(phoneDigits)).trim().split(/\s+/).filter(Boolean);
      if (words.length >= 3) {
        if (!updates.name) updates.name = words[0];
        if (!updates.craftType) updates.craftType = words[1];
        if (!updates.location) updates.location = words.slice(2).join(" ");
        if (!updates.phone) updates.phone = phoneDigits.replace(/[^0-9+]/g, "");
      }
    }

    setFormData((prev) => Object.keys(updates).length ? { ...prev, ...updates } : (!prev.name && /^[A-Za-z][A-Za-z '\u2019-]{1,40}$/.test(cleaned) ? { ...prev, name: cleaned } : prev));
    setVoiceMessage(`${copy.captured}: ${cleaned}`);
  }, [copy.captured]);

  const stopVoiceInput = useCallback(() => {
    const currentRecognition = recognitionRef.current;
    if (currentRecognition) {
      try {
        currentRecognition.onend = null;
        currentRecognition.stop();
      } catch (error) {
        // ignore stop errors from already-ended recognition
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const startVoiceInput = useCallback(() => {
    if (recognitionRef.current) {
      stopVoiceInput();
      setVoiceMessage("Voice input stopped. You can start again when ready.");
      return;
    }

    const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition;
    if (!SpeechRecognitionCtor) {
      setVoiceMessage(copy.unsupported);
      return;
    }

    try {
      const recognition = new SpeechRecognitionCtor();
      const speechLocale = { te: "te-IN", hi: "hi-IN", en: "en-IN" }[language] || "en-IN";
      recognition.lang = speechLocale;
      recognition.interimResults = false;
      recognition.continuous = false;
      recognition.maxAlternatives = 2;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceMessage(copy.listenPrompt);
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0]?.transcript || "")
          .join(" ")
          .trim();

        if (transcript) {
          applyVoiceTranscript(transcript);
          stopVoiceInput();
        }
      };

      recognition.onnomatch = () => {
        stopVoiceInput();
        setVoiceMessage("I couldn’t hear a clear voice input. Please speak again or fill the form manually.");
      };

      recognition.onerror = (event) => {
        const errorMap = {
          "not-allowed": "Microphone permission is blocked. Please allow access and try again.",
          "no-speech": "No speech was detected. Please speak clearly and try again.",
          "audio-capture": "Your microphone is unavailable. Please check the device settings.",
          network: "Voice recognition is unavailable right now. Please try again in a moment.",
        };

        stopVoiceInput();
        setVoiceMessage(errorMap[event?.error] || copy.failed);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (error) {
      setIsListening(false);
      setVoiceMessage("Voice input could not start. Please check microphone permissions and try again.");
    }
  }, [applyVoiceTranscript, copy.failed, copy.listenPrompt, copy.unsupported, language, stopVoiceInput]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const voiceParam = params.get("voice");
    if (voiceParam === "1" || voiceParam === "true") {
      const timer = window.setTimeout(() => {
        startVoiceInput();
      }, 150);
      return () => {
        window.clearTimeout(timer);
        stopVoiceInput();
      };
    }
    return () => stopVoiceInput();
  }, [startVoiceInput, stopVoiceInput]);

  const submitApplication = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    try {
      const application = new FormData();
      const finalCraftType =
        formData.craftType === "Other" ? formData.customCraftType.trim() : formData.craftType;
      application.append("name", formData.name);
      application.append("craftType", finalCraftType);
      application.append("phone", formData.phone);
      application.append("village", formData.location);
      application.append("bio", formData.story);
      application.append("yearsOfExperience", formData.yearsOfExperience);
      if (formData.profilePhoto) application.append("profilePhoto", formData.profilePhoto);
      const response = await fetch(`${API_URL}/artisans`, { method: "POST", body: application });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Unable to submit application");
      if (result.token) localStorage.setItem(AUTH_TOKEN_KEY, result.token);
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: "42px 20px 70px", maxWidth: "920px", margin: "0 auto", color: "#3d2314", textAlign: "center" }}>
      <p style={{ letterSpacing: "2px", fontSize: "12px", fontWeight: 700, opacity: 0.8, color: "#3d2314", margin: "0 0 16px" }}>{copy.join}</p>
      <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 5rem)", lineHeight: 1.02, margin: "0 0 18px", color: "#3d2314", fontFamily: "Georgia, 'Times New Roman', serif", letterSpacing: "-0.06em" }}>{copy.heading} <em style={{ fontStyle: "italic", color: "#b85334", fontWeight: 400 }}>DHAAGA</em></h1>
      <p style={{ maxWidth: "780px", margin: "0 auto 28px", fontSize: "1.12rem", lineHeight: "1.7", color: "#47372f" }}>{copy.intro}</p>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: "22px" }}>
        <button
          type="button"
          onClick={startVoiceInput}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            padding: "14px 26px",
            borderRadius: "999px",
            border: "none",
            background: isListening ? "#5c3125" : "#b85334",
            color: "#fff",
            cursor: "pointer",
            fontWeight: 800,
            fontSize: "1.06rem",
            boxShadow: "0 10px 22px rgba(120, 64, 38, 0.18)",
          }}
        >
          <span aria-hidden="true">🎙️</span>
          {isListening ? copy.listening : copy.speak}
        </button>
      </div>

      {voiceMessage && (
        <div style={{ maxWidth: "820px", margin: "0 auto 22px", padding: "14px 16px", background: "#f4efe8", border: "1px solid #d7c7b2", borderRadius: "10px", color: "#3d2314", textAlign: "left", fontSize: "1.02rem" }}>
          {voiceMessage}
        </div>
      )}

      {submitted ? (
        <div style={{ maxWidth: "820px", margin: "0 auto", padding: "28px 22px", border: "1px solid #3d2314", backgroundColor: "#fffdf9", color: "#3d2314", borderRadius: "12px", boxShadow: "0 8px 18px rgba(60,36,24,0.06)" }}>
          <h3 style={{ color: "#3d2314", margin: "0 0 10px", fontSize: "1.7rem", fontFamily: "Georgia, 'Times New Roman', serif" }}>{copy.submitted}</h3>
          <p style={{ margin: 0, fontSize: "1.02rem", lineHeight: 1.7 }}>{copy.submittedDetail}</p>
        </div>
      ) : (
        <form onSubmit={submitApplication} style={{ maxWidth: "820px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "18px", textAlign: "left" }}>
          <div style={{ display: "grid", gap: "18px" }}>
            <label style={{ display: "grid", gap: "8px", fontSize: "1.1rem", fontWeight: 700, color: "#3d2314" }}>
              {copy.name}
              <input
                required
                type="text"
                value={formData.name}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder={copy.namePlaceholder}
                style={{ width: "100%", minHeight: "54px", padding: "14px 16px", border: "1px solid #c9b8a6", borderRadius: "8px", background: "#faf5ef", color: "#3d2314", fontSize: "1.08rem", outline: "none", boxShadow: "inset 0 1px 2px rgba(60,36,24,0.03)" }}
              />
            </label>

            <label style={{ display: "grid", gap: "8px", fontSize: "1.1rem", fontWeight: 700, color: "#3d2314" }}>
              {copy.craft}
              <select
                required
                value={formData.craftType}
                onChange={(event) => updateField("craftType", event.target.value)}
                style={{ width: "100%", minHeight: "54px", padding: "14px 16px", border: "1px solid #c9b8a6", borderRadius: "8px", background: "#faf5ef", color: "#3d2314", fontSize: "1.08rem", outline: "none" }}
              >
                <option value="" disabled>{copy.craftPlaceholder}</option>
                {CRAFT_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>

            {formData.craftType === "Other" && (
              <label style={{ display: "grid", gap: "8px", fontSize: "1.1rem", fontWeight: 700, color: "#3d2314" }}>
                {copy.craft}
                <input
                  required
                  type="text"
                  value={formData.customCraftType}
                  onChange={(event) => updateField("customCraftType", event.target.value)}
                  placeholder={copy.craftPlaceholder}
                  style={{ width: "100%", minHeight: "54px", padding: "14px 16px", border: "1px solid #c9b8a6", borderRadius: "8px", background: "#faf5ef", color: "#3d2314", fontSize: "1.08rem", outline: "none" }}
                />
              </label>
            )}

            <label style={{ display: "grid", gap: "8px", fontSize: "1.1rem", fontWeight: 700, color: "#3d2314" }}>
              {copy.location}
              <input
                required
                type="text"
                value={formData.location}
                onChange={(event) => updateField("location", event.target.value)}
                placeholder={copy.locationPlaceholder}
                style={{ width: "100%", minHeight: "54px", padding: "14px 16px", border: "1px solid #c9b8a6", borderRadius: "8px", background: "#faf5ef", color: "#3d2314", fontSize: "1.08rem", outline: "none" }}
              />
            </label>

            <label style={{ display: "grid", gap: "8px", fontSize: "1.1rem", fontWeight: 700, color: "#3d2314" }}>
              {copy.phone}
              <input
                required
                type="tel"
                value={formData.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                placeholder={copy.phonePlaceholder}
                style={{ width: "100%", minHeight: "54px", padding: "14px 16px", border: "1px solid #c9b8a6", borderRadius: "8px", background: "#faf5ef", color: "#3d2314", fontSize: "1.08rem", outline: "none" }}
              />
            </label>

            <label style={{ display: "grid", gap: "8px", fontSize: "1.1rem", fontWeight: 700, color: "#3d2314" }}>
              {copy.story}
              <textarea
                required
                value={formData.story}
                onChange={(event) => updateField("story", event.target.value)}
                placeholder={copy.storyPlaceholder}
                rows="5"
                style={{ width: "100%", minHeight: "120px", resize: "vertical", padding: "14px 16px", border: "1px solid #c9b8a6", borderRadius: "8px", background: "#faf5ef", color: "#3d2314", fontSize: "1.08rem", outline: "none" }}
              />
            </label>

            <label style={{ display: "grid", gap: "8px", fontSize: "1.1rem", fontWeight: 700, color: "#3d2314" }}>
              {copy.years}
              <input
                required
                min="0"
                type="number"
                value={formData.yearsOfExperience}
                onChange={(event) => updateField("yearsOfExperience", event.target.value)}
                placeholder={copy.yearsPlaceholder}
                style={{ width: "100%", minHeight: "54px", padding: "14px 16px", border: "1px solid #c9b8a6", borderRadius: "8px", background: "#faf5ef", color: "#3d2314", fontSize: "1.08rem", outline: "none" }}
              />
            </label>

            <label style={{ display: "grid", gap: "8px", fontSize: "1.1rem", fontWeight: 700, color: "#3d2314" }}>
              Profile Photo
              <input
                accept="image/*"
                type="file"
                onChange={(event) => updateField("profilePhoto", event.target.files?.[0] || null)}
                style={{ width: "100%", minHeight: "54px", padding: "12px 14px", border: "1px solid #c9b8a6", borderRadius: "8px", background: "#faf5ef", color: "#3d2314" }}
              />
            </label>
          </div>

          {submitError && <p style={{ color: "#a12622", margin: 0, fontSize: "1rem", fontWeight: 600 }}>{submitError}</p>}

          <button
            disabled={isSubmitting || submitted}
            type="submit"
            className="primary-button"
            style={{
              marginTop: "8px",
              padding: "16px 20px",
              cursor: isSubmitting ? "wait" : "pointer",
              fontSize: "1.18rem",
              fontWeight: 800,
              borderRadius: "10px",
              background: "#b85334",
              border: "none",
              width: "100%",
              boxShadow: "0 12px 22px rgba(184, 83, 52, 0.2)",
            }}
          >
            {isSubmitting ? copy.submitting : `${copy.submit} →`}
          </button>
        </form>
      )}
    </div>
  );
}

export default Artisan;