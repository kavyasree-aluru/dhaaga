import { useState } from "react";
import { apiRequest } from "../lib/api";

function Auth() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "customer" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const updateField = (field, value) => setForm((previous) => ({ ...previous, [field]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      const result = await apiRequest(`/auth/${mode === "login" ? "login" : "register"}`, {
        method: "POST",
        body: JSON.stringify(form),
      });
      localStorage.setItem("dhaaga-token", result.token);
      localStorage.setItem("dhaaga-user", JSON.stringify(result.user));
      setMessage(`Welcome, ${result.user.name}. You are signed in.`);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <main style={{ maxWidth: "520px", margin: "0 auto", padding: "70px 20px", color: "#3d2314" }}>
      <p className="eyebrow">DHAAGA COMMUNITY</p>
      <h1>{mode === "login" ? "Welcome back" : "Join DHAAGA"}</h1>
      <p>{mode === "login" ? "Sign in to manage your artisan connection." : "Create an account to support crafts or share your artisan profile."}</p>
      <form onSubmit={submit} style={{ display: "grid", gap: "14px", marginTop: "28px" }}>
        {mode === "register" && <input required placeholder="Your name" value={form.name} onChange={(event) => updateField("name", event.target.value)} />}
        <input required type="email" placeholder="Email address" value={form.email} onChange={(event) => updateField("email", event.target.value)} />
        <input required minLength="6" type="password" placeholder="Password (at least 6 characters)" value={form.password} onChange={(event) => updateField("password", event.target.value)} />
        {mode === "register" && (
          <select value={form.role} onChange={(event) => updateField("role", event.target.value)}>
            <option value="customer">Visitor / Supporter</option>
            <option value="artisan">Artisan</option>
          </select>
        )}
        {error && <p style={{ color: "#a12622", margin: 0 }}>{error}</p>}
        {message && <p style={{ color: "#2f6b3b", margin: 0 }}>{message}</p>}
        <button className="primary-button" type="submit">{mode === "login" ? "Sign In" : "Create Account"}</button>
      </form>
      <button type="button" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); setMessage(""); }} style={{ marginTop: "18px", border: 0, background: "transparent", color: "#b85334", cursor: "pointer" }}>
        {mode === "login" ? "Need an account? Register" : "Already registered? Sign in"}
      </button>
    </main>
  );
}

export default Auth;
