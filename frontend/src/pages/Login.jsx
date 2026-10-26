import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // LOGIN
  // =========================

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    // Validation
    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: email.trim(),
            password: password,
          }),
        }
      );

      // Read backend response
      const data = await response.json();

      console.log("Login response:", data);

      // =========================
      // BACKEND ERROR
      // =========================

      if (!response.ok) {
        let message = "Login failed";

        if (typeof data.detail === "string") {
          message = data.detail;
        }

        else if (Array.isArray(data.detail)) {
          message = data.detail
            .map((item) => item.msg)
            .join(", ");
        }

        else if (
          data.detail &&
          typeof data.detail === "object"
        ) {
          message =
            data.detail.message ||
            data.detail.error ||
            data.detail.msg ||
            JSON.stringify(data.detail);
        }

        else if (typeof data.message === "string") {
          message = data.message;
        }

        else if (typeof data.error === "string") {
          message = data.error;
        }

        throw new Error(message);
      }

      // =========================
      // TOKEN CHECK
      // =========================

      if (!data.access_token) {
        throw new Error(
          "Login successful, but access token was not received."
        );
      }

      // =========================
      // SAVE TOKEN
      // =========================

      localStorage.setItem(
        "access_token",
        data.access_token
      );

      // =========================
      // SAVE USER DETAILS
      // =========================

      if (data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }

      console.log("Logged-in user:", data.user);

      console.log("Login successful");

      // =========================
      // GO TO HOME
      // =========================

      navigate("/");

      window.location.reload();

    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      setError(
        error.message ||
        "Login failed"
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // GOOGLE LOGIN
  // =========================

  const handleGoogleLogin = () => {
    window.location.href =
      "http://127.0.0.1:8000/auth/google/login";
  };

  // =========================
  // UI
  // =========================

  return (
    <div className="login-page">

      {/* Background */}

      <div className="bg-circle circle-1"></div>

      <div className="bg-circle circle-2"></div>

      <div className="bg-circle circle-3"></div>

      {/* Back Button */}

      <button
        className="back-button"
        onClick={() => navigate("/")}
      >
        ← Back to Home
      </button>

      {/* Login Card */}

      <div className="login-card">

        {/* Logo */}

        <div className="login-logo">
          AI
        </div>

        {/* Heading */}

        <h1>
          Welcome Back 👋
        </h1>

        <p className="login-subtitle">
          Sign in to continue your
          AI-powered career journey
        </p>

        {/* Error */}

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        {/* Login Form */}

        <form onSubmit={handleLogin}>

          {/* Email */}

          <div className="input-group">

            <label>
              Email Address
            </label>

            <div className="input-wrapper">

              <span className="input-icon">
                ✉️
              </span>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                autoComplete="email"
              />

            </div>

          </div>

          {/* Password */}

          <div className="input-group">

            <div className="password-label">

              <label>
                Password
              </label>

              <button
                type="button"
                className="forgot-button"
                onClick={() =>
                  alert(
                    "Password reset feature coming soon"
                  )
                }
              >
                Forgot Password?
              </button>

            </div>

            <div className="input-wrapper">

              <span className="input-icon">
                🔒
              </span>

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                autoComplete="current-password"
              />

              <button
                type="button"
                className="show-password"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >
                {showPassword
                  ? "🙈"
                  : "👁️"}
              </button>

            </div>

          </div>

          {/* Remember Me */}

          <div className="remember-row">

            <label className="remember">

              <input
                type="checkbox"
              />

              <span>
                Remember me
              </span>

            </label>

          </div>

          {/* Sign In */}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >

            {loading ? (
              <>
                <span className="spinner"></span>

                Signing In...
              </>
            ) : (
              <>
                Sign In

                <span>
                  →
                </span>
              </>
            )}

          </button>

        </form>

        {/* Divider */}

        <div className="divider">
          <span>
            or
          </span>
        </div>

        {/* Google */}

        <button
          type="button"
          className="google-button"
          onClick={handleGoogleLogin}
        >

          <span className="google-icon">
            G
          </span>

          Continue with Google

        </button>

        {/* Signup */}

        <p className="signup-text">

          Don't have an account?

          <button
            type="button"
            className="signup-link"
            onClick={() =>
              navigate("/signup")
            }
          >
            Create Account
          </button>

        </p>

        {/* Security */}

        <div className="secure-text">
          🔐 Your information is
          securely protected
        </div>

      </div>

    </div>
  );
};

export default Login;