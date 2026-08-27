import axios from "axios";
import fs from "fs";
import FormData from "form-data";

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const OPENAI_TRANSCRIBE_URL = "https://api.openai.com/v1/audio/transcriptions";
export const SUPPORTED_LANGUAGES = ["en", "te", "hi"];

const requireApiKey = (name) => {
  if (!process.env[name]) throw new Error(`${name} is not configured`);
};

const anthropicHeaders = () => ({
  "x-api-key": process.env.ANTHROPIC_API_KEY,
  "anthropic-version": "2023-06-01",
  "content-type": "application/json",
});

/**
 * Item 7: AI service — converts an artisan's spoken interview into text.
 * Claude's API does not accept raw audio, so speech-to-text is done with
 * OpenAI's Whisper model first, then Claude structures the transcript.
 */
export const transcribeAudio = async (filePath, language) => {
  requireApiKey("OPENAI_API_KEY");
  const form = new FormData();
  form.append("file", fs.createReadStream(filePath));
  form.append("model", "whisper-1");
  if (SUPPORTED_LANGUAGES.includes(language)) form.append("language", language);

  const { data } = await axios.post(OPENAI_TRANSCRIBE_URL, form, {
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      ...form.getHeaders(),
    },
  });
  return data.text; // raw transcript, original language
};

/**
 * Item 7 + 8: Takes a raw transcript (any regional language) and asks Claude to
 * (a) translate it into en/te/hi and (b) extract a structured artisan
 * profile (craft type, years of experience, techniques, materials, bio).
 */
export const structureArtisanProfile = async (rawTranscript) => {
  requireApiKey("ANTHROPIC_API_KEY");
  const system = `You are helping digitize spoken interviews of Indian handicraft artisans for the DHAAGA
  platform. Given a raw transcript (which may be in Telugu, Hindi, or English, and may
be informal/colloquial), respond with ONLY a JSON object, no preamble, no markdown fences:
{
  "translations": { "en": "...", "te": "...", "hi": "..." },
  "structuredProfile": {
    "craftType": "...",
    "yearsOfExperience": <number or null>,
    "techniques": ["..."],
    "materials": ["..."],
    "summaryBio": "a clean 2-3 sentence bio in English"
  }
}
Translate faithfully; if the source language is English, Telugu, or Hindi, keep it as-is in that slot
and translate into the other two. If information for a field isn't present, use null or [].`;

  const { data } = await axios.post(
    ANTHROPIC_URL,
    {
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6",
      max_tokens: 1500,
      system,
      messages: [{ role: "user", content: `Transcript:\n\n${rawTranscript}` }],
    },
    { headers: anthropicHeaders() }
  );

  const text = data.content.map((b) => b.text || "").join("\n").trim();
  const cleaned = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
};

/**
 * Item 9: Computer Vision — sends a craft photo to Claude's vision capability
 * to classify the craft style and flag whether the image plausibly matches
 * the claimed craftType (a lightweight authenticity check, not a legal
 * verification).
 */
export const classifyCraftImage = async (base64Image, mediaType, claimedCraftType) => {
  requireApiKey("ANTHROPIC_API_KEY");
  const system = `You are a visual classifier for Telangana/Indian handicrafts (e.g. Kalamkari,
Cheriyal painting, Kondapalli toys, Nirmal art/toys, and similar). Respond with ONLY JSON:
{ "tags": ["..."], "detectedCraftType": "...", "matchesClaim": true|false, "confidence": 0.0-1.0,
"notes": "short human-readable note" }`;

  const { data } = await axios.post(
    ANTHROPIC_URL,
    {
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6",
      max_tokens: 500,
      system,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: mediaType, data: base64Image },
            },
            {
              type: "text",
              text: `The artisan claims this is: "${claimedCraftType}". Classify the image.`,
            },
          ],
        },
      ],
    },
    { headers: anthropicHeaders() }
  );

  const text = data.content.map((b) => b.text || "").join("\n").trim();
  const cleaned = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
};

/**
 * Item 8 (standalone): Translate arbitrary text into a target regional language.
 * Used for on-the-fly UI content translation beyond the artisan profile flow.
 */
export const translateText = async (text, targetLang) => {
  requireApiKey("ANTHROPIC_API_KEY");
  const langNames = { en: "English", te: "Telugu", hi: "Hindi" };
  const { data } = await axios.post(
    ANTHROPIC_URL,
    {
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6",
      max_tokens: 800,
      system: `Translate the given text into ${langNames[targetLang] || targetLang}. Respond with ONLY the translated text, nothing else.`,
      messages: [{ role: "user", content: text }],
    },
    { headers: anthropicHeaders() }
  );
  return data.content.map((b) => b.text || "").join("\n").trim();
};
