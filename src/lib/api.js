const API_URL = import.meta.env.VITE_API_URL || "/api";

export const apiRequest = async (path, options = {}) => {
  const token = localStorage.getItem("dhaaga-token");
  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type") && options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.message || "Request failed");
  return result;
};

export { API_URL };