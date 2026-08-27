const API_URL = import.meta.env.VITE_API_URL || "/api";
import { useCallback, useEffect, useRef, useState } from "react";

const formCopy = {
  en: {
    join: "JOIN OUR COMMUNITY", heading: "Preserve Your Craft with", intro: "Are you an artisan, weaver, or traditional creator? Register with DHAAGA to document your story, feature your creations, and reach people who value authentic heritage.", speak: "Speak to Fill Form", listening: "Listening...", listenPrompt: "Listening... speak your name, craft, location, phone number, story, and years of experience.", captured: "Captured", unsupported: "Voice input is not supported in this browser. Please fill the form manually.", failed: "Voice capture failed. Please type the details manually.", submitted: "Thank you for reaching out!", submittedDetail: "Our team will get in touch with you shortly to assist with your onboarding.", submit: "Submit Artisan Application", submitting: "Submitting...", name: "Your Name", craft: "Craft Type / Art Form", location: "Location (Village / City, State)", phone: "Contact Number", story: "Your Craft Story", years: "Years of Experience", namePlaceholder: "e.g. Lakshmi Devi", craftPlaceholder: "e.g. Nirmal Wooden Toys, Kalamkari", locationPlaceholder: "e.g. Nirmal, Telangana", phonePlaceholder: "+91 98765 43210", storyPlaceholder: "Tell people about your craft, its history, and what makes your work special", yearsPlaceholder: "e.g. 20",
  },
  te: {
    join: "మా సంఘంలో చేరండి", heading: "మీ కళను కాపాడండి", intro: "మీరు కళాకారులా, నేత పనివారా లేదా సంప్రదాయ సృష్టికర్తా? మీ కథను నమోదు చేయడానికి DHAAGAలో చేరండి.", speak: "ఫారమ్ నింపడానికి మాట్లాడండి", listening: "వింటున్నాము...", listenPrompt: "మీ పేరు, కళ, ప్రాంతం, ఫోన్ నంబర్, కథ మరియు అనుభవ సంవత్సరాలు చెప్పండి.", captured: "నమోదైంది", unsupported: "ఈ బ్రౌజర్‌లో వాయిస్ ఇన్‌పుట్ అందుబాటులో లేదు. దయచేసి ఫారమ్‌ను టైప్ చేయండి.", failed: "వాయిస్ నమోదు విఫలమైంది. దయచేసి వివరాలను టైప్ చేయండి.", submitted: "మమ్మల్ని సంప్రదించినందుకు ధన్యవాదాలు!", submittedDetail: "మీ నమోదు ప్రక్రియలో సహాయం చేయడానికి మా బృందం త్వరలో మిమ్మల్ని సంప్రదిస్తుంది.", submit: "కళాకారుల దరఖాస్తును పంపండి", submitting: "పంపుతున్నాము...", name: "మీ పేరు", craft: "కళ రకం / కళారూపం", location: "ప్రాంతం (గ్రామం / నగరం, రాష్ట్రం)", phone: "ఫోన్ నంబర్", story: "మీ కళా కథ", years: "అనుభవ సంవత్సరాలు", namePlaceholder: "ఉదా. లక్ష్మీ దేవి", craftPlaceholder: "ఉదా. కలంకారి", locationPlaceholder: "ఉదా. నిర్మల్, తెలంగాణ", phonePlaceholder: "+91 98765 43210", storyPlaceholder: "మీ కళ, దాని చరిత్ర మరియు ప్రత్యేకత గురించి చెప్పండి", yearsPlaceholder: "ఉదా. 20",
  },
  hi: {
    join: "हमारे समुदाय से जुड़ें", heading: "अपनी कला को सुरक्षित रखें", intro: "क्या आप शिल्पकार, बुनकर या पारंपरिक कलाकार हैं? अपनी कहानी दर्ज करने के लिए DHAAGA से जुड़ें।", speak: "फॉर्म भरने के लिए बोलें", listening: "सुन रहे हैं...", listenPrompt: "अपना नाम, कला, स्थान, फोन नंबर, कहानी और अनुभव के वर्ष बोलें।", captured: "दर्ज किया गया", unsupported: "इस ब्राउज़र में वॉइस इनपुट उपलब्ध नहीं है। कृपया फॉर्म टाइप करें।", failed: "वॉइस रिकॉर्ड नहीं हो सकी। कृपया विवरण टाइप करें।", submitted: "संपर्क करने के लिए धन्यवाद!", submittedDetail: "आपके जुड़ने में सहायता के लिए हमारी टीम जल्द आपसे संपर्क करेगी।", submit: "शिल्पकार आवेदन भेजें", submitting: "भेज रहे हैं...", name: "आपका नाम", craft: "शिल्प प्रकार / कला रूप", location: "स्थान (गाँव / शहर, राज्य)", phone: "फोन नंबर", story: "आपकी शिल्प कहानी", years: "अनुभव के वर्ष", namePlaceholder: "जैसे लक्ष्मी देवी", craftPlaceholder: "जैसे कलमकारी", locationPlaceholder: "जैसे निर्मल, तेलंगाना", phonePlaceholder: "+91 98765 43210", storyPlaceholder: "अपनी कला, इतिहास और विशेषता के बारे में बताएं", yearsPlaceholder: "जैसे 20",
  },
  ta: {
    join: "எங்கள் சமூகத்தில் இணையுங்கள்", heading: "உங்கள் கைவினையை பாதுகாக்குங்கள்", intro: "நீங்கள் ஒரு கைவினைஞரா, நெசவாளரா அல்லது பாரம்பரிய படைப்பாளரா? உங்கள் கதையை பதிவு செய்ய DHAAGA-வில் இணையுங்கள்.", speak: "படிவத்தை நிரப்ப பேசுங்கள்", listening: "கேட்கிறோம்...", listenPrompt: "உங்கள் பெயர், கைவினை, இடம், தொலைபேசி எண், கதை மற்றும் அனுபவ ஆண்டுகளைப் பேசுங்கள்.", captured: "பதிவு செய்யப்பட்டது", unsupported: "இந்த உலாவியில் குரல் உள்ளீடு ஆதரிக்கப்படவில்லை. படிவத்தை கைமுறையாக நிரப்புங்கள்.", failed: "குரல் பதிவு தோல்வியடைந்தது. விவரங்களை தட்டச்சு செய்யுங்கள்.", submitted: "தொடர்புக்கு நன்றி!", submittedDetail: "உங்கள் சேர்க்கைக்கு உதவ எங்கள் குழு விரைவில் தொடர்பு கொள்ளும்.", submit: "கைவினைஞர் விண்ணப்பத்தை அனுப்புங்கள்", submitting: "அனுப்பப்படுகிறது...", name: "உங்கள் பெயர்", craft: "கைவினை வகை / கலை வடிவம்", location: "இடம் (கிராமம் / நகரம், மாநிலம்)", phone: "தொடர்பு எண்", story: "உங்கள் கைவினைக் கதை", years: "அனுபவ ஆண்டுகள்", namePlaceholder: "எ.கா. லக்ஷ்மி தேவி", craftPlaceholder: "எ.கா. கலம்காரி", locationPlaceholder: "எ.கா. மங்களகிரி, ஆந்திரப் பிரதேசம்", phonePlaceholder: "+91 98765 43210", storyPlaceholder: "உங்கள் கைவினை, அதன் வரலாறு மற்றும் சிறப்பைச் சொல்லுங்கள்", yearsPlaceholder: "எ.கா. 20",
  },
};

function Artisan() {
  const [language] = useState(() => new URLSearchParams(window.location.search).get("lang") || localStorage.getItem("dhaaga-language") || "en");
  const copy = formCopy[language] || formCopy.en;
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState("");
  const [formData, setFormData] = useState({ name: "", craftType: "", location: "", phone: "", story: "", yearsOfExperience: "", profilePhoto: null });
  const recognitionRef = useRef(null);

  const updateField = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const applyVoiceTranscript = useCallback((text) => {
    const cleaned = text.trim().replace(/\s+/g, " ");
    if (!cleaned) return;

    const fieldLabels = "(?:name|craft(?: type)?|art form|location|village|city|state|phone(?: number)?|mobile(?: number)?|contact(?: number)?|story|bio|about my craft|years?(?: of experience)?|experience|పేరు|కళ|స్థలం|ప్రాంతం|ఫోన్|కథ|అనుభవం|नाम|शिल्प|कला|स्थान|फोन|कहानी|अनुभव|பெயர்|கலை|இடம்|கிராமம்|நகரம்|மாநிலம்|தொலைபேசி|கதை|அனுபவம்)";
    const valueAfter = (labels) => cleaned.match(new RegExp(`(?:${labels})\\s*(?:is|:)?\\s*(.*?)(?=\\s+(?:${fieldLabels})\\s*(?:is|:)?|$)`, "i"))?.[1]?.trim().replace(/[,.]$/, "");
    const updates = {};
    const name = valueAfter("my name|name|i am|call me|this is|పేరు|नाम|பெயர்");
    const craftType = valueAfter("craft(?: type)?|i make|i weave|i create|art form|my craft|కళ|शिल్ప|कला|கலை");
    const location = valueAfter("location|from|live in|located in|village|city|state|స్థలం|ప్రాంతం|स्थान|இடம்|கிராமம்|நகரம்|மாநிலம்");
    const phone = valueAfter("phone(?: number)?|call me on|contact(?: number)?|mobile(?: number)?|ఫోన్|फोन|தொலைபேசி");
    const story = valueAfter("(?:my )?story|bio|about my craft|tell me about my craft|కథ|कहानी|கதை");
    const years = valueAfter("years?(?: of experience)?|experience|(?:i have|with)\\s+\\d+\\s+years?|అనుభవం|अनुभव|அனுபவம்");
    const phoneDigits = cleaned.match(/(?:\+?\d[\d\s-]{5,}\d)/)?.[0];

    if (name && name.length <= 60) updates.name = name;
    if (craftType) updates.craftType = craftType;
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

  const startVoiceInput = useCallback(() => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceMessage(copy.unsupported);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = { te: "te-IN", hi: "hi-IN", ta: "ta-IN", en: "en-IN" }[language] || "en-IN";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onstart = () => { setIsListening(true); setVoiceMessage(copy.listenPrompt); };
    recognition.onresult = (event) => applyVoiceTranscript(Array.from(event.results).map((result) => result[0].transcript).join(" ").trim());
    recognition.onerror = () => { setIsListening(false); setVoiceMessage(copy.failed); };
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
  }, [applyVoiceTranscript, copy.failed, copy.listenPrompt, copy.unsupported, isListening, language]);

  useEffect(() => () => recognitionRef.current?.stop(), []);

  const submitApplication = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    try {
      const application = new FormData();
      application.append("name", formData.name);
      application.append("craftType", formData.craftType);
      application.append("phone", formData.phone);
      application.append("village", formData.location);
      application.append("bio", formData.story);
      application.append("yearsOfExperience", formData.yearsOfExperience);
      if (formData.profilePhoto) application.append("profilePhoto", formData.profilePhoto);
      const response = await fetch(`${API_URL}/artisans`, { method: "POST", body: application });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Unable to submit application");
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: "40px 20px", maxWidth: "800px", margin: "0 auto", color: "#3d2314", textAlign: "center" }}>
      <p style={{ letterSpacing: "1.5px", fontSize: "12px", fontWeight: "bold", opacity: 0.8, color: "#3d2314" }}>{copy.join}</p>
      <h1 style={{ fontSize: "36px", margin: "10px 0 20px", color: "#3d2314" }}>{copy.heading} <em>DHAAGA</em></h1>
      <p style={{ fontSize: "16px", lineHeight: "1.6", marginBottom: "30px", color: "#3d2314" }}>{copy.intro}</p>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <button type="button" onClick={startVoiceInput} style={{ padding: "10px 18px", borderRadius: "999px", border: "none", background: isListening ? "#5e2f25" : "#b85334", color: "#fff", cursor: "pointer", fontWeight: "bold" }}>{isListening ? `🎙️ ${copy.listening}` : `🎙️ ${copy.speak}`}</button>
      </div>
      {voiceMessage && <div style={{ marginBottom: "18px", padding: "10px 12px", background: "#f5efe6", border: "1px solid #d4c3b3", borderRadius: "8px", color: "#3d2314", textAlign: "left" }}>{voiceMessage}</div>}
      {submitted ? <div style={{ padding: "20px", border: "1px solid #3d2314", backgroundColor: "#fff", color: "#3d2314" }}><h3 style={{ color: "#3d2314" }}>{copy.submitted}</h3><p>{copy.submittedDetail}</p></div> : (
        <form onSubmit={submitApplication} style={{ display: "flex", flexDirection: "column", gap: "15px", textAlign: "left" }}>
          <label>{copy.name}<input required type="text" value={formData.name} onChange={(event) => updateField("name", event.target.value)} placeholder={copy.namePlaceholder} /></label>
          <label>{copy.craft}<input required type="text" value={formData.craftType} onChange={(event) => updateField("craftType", event.target.value)} placeholder={copy.craftPlaceholder} /></label>
          <label>{copy.location}<input required type="text" value={formData.location} onChange={(event) => updateField("location", event.target.value)} placeholder={copy.locationPlaceholder} /></label>
          <label>{copy.phone}<input required type="tel" value={formData.phone} onChange={(event) => updateField("phone", event.target.value)} placeholder={copy.phonePlaceholder} /></label>
          <label>{copy.story}<textarea required value={formData.story} onChange={(event) => updateField("story", event.target.value)} placeholder={copy.storyPlaceholder} rows="5" /></label>
          <label>{copy.years}<input required min="0" type="number" value={formData.yearsOfExperience} onChange={(event) => updateField("yearsOfExperience", event.target.value)} placeholder={copy.yearsPlaceholder} /></label>
          <label>Profile Photo<input accept="image/*" type="file" onChange={(event) => updateField("profilePhoto", event.target.files?.[0] || null)} /></label>
          {submitError && <p style={{ color: "#a12622", margin: 0 }}>{submitError}</p>}
          <button disabled={isSubmitting} type="submit" className="primary-button" style={{ marginTop: "10px", padding: "12px", cursor: isSubmitting ? "wait" : "pointer" }}>{isSubmitting ? copy.submitting : `${copy.submit} →`}</button>
        </form>
      )}
    </div>
  );
}

export default Artisan;
