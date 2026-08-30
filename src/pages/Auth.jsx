import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiRequest } from "../lib/api";

const persistAuthSession = (user, token) => {
  sessionStorage.setItem("dhaaga-token", token);
  localStorage.setItem("dhaaga-user", JSON.stringify(user));
  window.dispatchEvent(new Event("dhaaga-auth-state"));
};

function Auth() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mode, setMode] = useState(
    searchParams.get("mode") === "register"
      ? "register"
      : searchParams.get("mode") === "forgot-password"
        ? "forgot-password"
        : searchParams.get("mode") === "reset-password"
          ? "reset-password"
          : "login"
  );
  const [form, setForm] = useState({ name: "", email: searchParams.get("email") || "", password: "", role: "customer", resetToken: searchParams.get("token") || "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const nextMode = searchParams.get("mode") === "register"
      ? "register"
      : searchParams.get("mode") === "forgot-password"
        ? "forgot-password"
        : searchParams.get("mode") === "reset-password"
          ? "reset-password"
          : "login";
    setMode(nextMode);

    const emailFromQuery = searchParams.get("email") || "";
    const tokenFromQuery = searchParams.get("token") || "";

    setForm((previous) => ({
      ...previous,
      email: emailFromQuery || previous.email,
      resetToken: tokenFromQuery || previous.resetToken || "",
    }));

    if (nextMode === "register" && !emailFromQuery) {
      setForm((previous) => ({ ...previous, email: "" }));
    }
  }, [searchParams]);

  const updateSearchParams = (nextMode) => {
    const params = { mode: nextMode };
    const nextEmail = form.email.trim();
    if (nextEmail) params.email = nextEmail;
    setSearchParams(params);
  };

  const updateField = (field, value) => setForm((previous) => ({ ...previous, [field]: value }));

  const switchMode = (nextMode) => {
    setMode(nextMode);
    updateSearchParams(nextMode);
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (mode === "forgot-password") {
      try {
        const result = await apiRequest("/auth/forgot-password", {
          method: "POST",
          body: JSON.stringify({ email: form.email.trim() }),
        });

        setMessage(result.message || "If an account exists for this email, a reset link has been sent.");
      } catch (requestError) {
        setError(requestError.message || "Unable to send reset instructions.");
      }
      return;
    }

    if (mode === "reset-password") {
      try {
        const resetToken = form.resetToken.trim();
        const newPassword = form.password.trim();

        if (!resetToken || !newPassword) {
          setError("A reset token and a new password are required.");
          return;
        }

        const result = await apiRequest("/auth/reset-password", {
          method: "POST",
          body: JSON.stringify({ token: resetToken, password: newPassword }),
        });

        const user = {
          ...result.user,
          name: result.user.name || form.email.trim(),
          email: result.user.email || form.email.trim(),
          role: result.user.role || "customer",
        };

        persistAuthSession(user, result.token);
        localStorage.removeItem("dhaaga-join-email");
        setMessage("Password updated successfully.");
        setForm((previous) => ({ ...previous, password: "", resetToken: "" }));
        navigate("/");
      } catch (requestError) {
        setError(requestError.message || "Unable to reset password.");
      }
      return;
    }

    try {
      const result = await apiRequest(`/auth/${mode === "login" ? "login" : "register"}`, {
        method: "POST",
        body: JSON.stringify(form),
      });
      const user = {
        ...result.user,
        name: result.user.name || form.name.trim(),
        email: result.user.email || form.email.trim(),
        role: result.user.role || form.role,
      };

      persistAuthSession(user, result.token);
      localStorage.removeItem("dhaaga-join-email");
      setMessage(`Welcome, ${user.name}. You are signed in.`);
      navigate("/orders");
    } catch (requestError) {
      const message = requestError.message || "Request failed";
      if (message.toLowerCase().includes("already exists")) {
        setError("This email is already registered. Sign in instead.");
        setMode("login");
        updateSearchParams("login");
        return;
      }
      setError(message);
    }
  };

  const title = mode === "login" ? "Welcome back" : mode === "register" ? "Join DHAAGA" : mode === "reset-password" ? "Reset your password" : "Reset your password";
  const subtitle = mode === "login"
    ? "Sign in to manage your artisan connection."
    : mode === "register"
      ? "Create an account to support crafts or share your artisan profile."
      : "Enter your email to receive a reset link.";

  return (
    <main className="auth-page">
      <div className="auth-shell">
        <p className="auth-kicker">DHAAGA COMMUNITY</p>
        <h1 className="auth-title">{title}</h1>
        <p className="auth-subtitle">{subtitle}</p>

        <form className="auth-form" onSubmit={submit}>
          {mode === "register" && (
            <input
              className="auth-input"
              required
              placeholder="Your name"
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
            />
          )}

          {mode !== "reset-password" && (
            <input
              className="auth-input"
              required
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
            />
          )}

          {(mode === "login" || mode === "register" || mode === "reset-password") && (
            <input
              className="auth-input"
              required={mode !== "reset-password" || !form.resetToken}
              minLength="6"
              type="password"
              placeholder={mode === "reset-password" ? "New password" : "Password (at least 6 characters)"}
              value={form.password}
              onChange={(event) => updateField("password", event.target.value)}
            />
          )}

          {mode === "register" && (
            <select className="auth-select" value={form.role} onChange={(event) => updateField("role", event.target.value)}>
              <option value="customer">Visitor / Supporter</option>
              <option value="artisan">Artisan</option>
            </select>
          )}

          {error && <p className="auth-error">{error}</p>}
          {message && <p className="auth-success">{message}</p>}

          <button className="primary-button auth-submit" type="submit">
            {mode === "login" ? "Sign In" : mode === "register" ? "Create Account" : mode === "reset-password" ? "Set New Password" : "Send Reset Link"}
          </button>
        </form>

        {mode !== "forgot-password" && mode !== "reset-password" && (
          <button
            type="button"
            className="auth-toggle"
            onClick={() => {
              setError("");
              setMessage("");
              switchMode(mode === "login" ? "register" : "login");
            }}
          >
            {mode === "login" ? "Need an account? Register" : "Already registered? Sign in"}
          </button>
        )}

        {mode === "login" && (
          <button
            type="button"
            className="auth-toggle"
            onClick={() => {
              setError("");
              setMessage("");
              switchMode("forgot-password");
            }}
          >
            Forgot password?
          </button>
        )}

        {(mode === "forgot-password" || mode === "reset-password") && (
          <button
            type="button"
            className="auth-toggle"
            onClick={() => {
              setError("");
              setMessage("");
              switchMode("login");
            }}
          >
            Back to sign in
          </button>
        )}
      </div>
    </main>
  );
}

export default Auth;
