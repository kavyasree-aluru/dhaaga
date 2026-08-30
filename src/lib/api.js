const rawApiUrl = import.meta.env.VITE_API_URL || "/api";
const API_URL = rawApiUrl.endsWith("/api") ? rawApiUrl.replace(/\/$/, "") : `${rawApiUrl.replace(/\/$/, "")}/api`;

const decodeHtmlText = (value) => {
  if (!value) return "";

  const textarea = document.createElement("textarea");
  textarea.innerHTML = value;
  const text = textarea.value || value;

  return text
    .replace(/\s*\n\s*/g, " ")
    .replace(/\s{2,}/g, " ")
    .replace(/\u00a0/g, " ")
    .trim();
};

export const apiRequest = async (path, options = {}) => {
  const token = sessionStorage.getItem("dhaaga-token") || localStorage.getItem("dhaaga-token");
  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type") && options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const contentType = response.headers.get("content-type") || "";
  let result;

  if (contentType.includes("application/json")) {
    result = await response.json().catch(() => ({}));
  } else {
    const text = await response.text();
    const cleanText = decodeHtmlText(text.replace(/<[^>]*>/g, " "));
    result = cleanText ? { message: cleanText } : {};
  }

  if (!response.ok) {
    throw new Error(result.message || "Request failed");
  }

  return result;
};

export { API_URL };