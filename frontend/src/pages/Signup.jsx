import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!name || !email || !password) {
      setError("Please fill all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            email: email,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Account creation failed."
        );
      }

      setSuccess(
        "Account created successfully! Redirecting to login..."
      );

      setName("");
      setEmail("");
      setPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      console.error("Signup Error:", error);

      setError(
        error.message || "Backend connection failed."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href =
      "http://127.0.0.1:8000/auth/google/login";
  };

  return (
    <div className="signup-page">

      <div className="background-circle circle-one"></div>
      <div className="background-circle circle-two"></div>

      <button
        className="back-button"
        onClick={() => navigate("/")}
      >
        ← Back to Home
      </button>

      <div className="signup-card">

        <div className="logo">
          AI
        </div>

        <h1>Create Your Account 🚀</h1>

        <p className="subtitle">
          Start your AI-powered career journey today
        </p>

        {error && (
          <div className="error-box">
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div className="success-box">
            ✅ {success}
          </div>
        )}

        <form onSubmit={handleSignup}>

          {/* NAME */}
          <div className="input-group">
            <label>Full Name</label>

            <div className="input-wrapper">
              <span>👤</span>

              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          {/* EMAIL */}
          <div className="input-group">
            <label>Email Address</label>

            <div className="input-wrapper">
              <span>✉️</span>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="input-group">
            <label>Password</label>

            <div className="input-wrapper">
              <span>🔒</span>

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                className="password-button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* TERMS */}
          <label className="terms">
            <input type="checkbox" required />

            <span>
              I agree to the Terms & Conditions and
              Privacy Policy
            </span>
          </label>

          {/* CREATE ACCOUNT */}
          <button
            type="submit"
            className="create-button"
            disabled={loading}
          >
            {loading ? (
              "Creating Account..."
            ) : (
              <>
                Create Account
                <span>→</span>
              </>
            )}
          </button>

        </form>

        <div className="divider">
          <span>or</span>
        </div>

        {/* GOOGLE */}
        <button
          type="button"
          className="google-button"
          onClick={handleGoogleSignup}
        >
          <span className="google">
            G
          </span>

          Continue with Google
        </button>

        <p className="login-text">
          Already have an account?

          <button
            onClick={() => navigate("/login")}
          >
            Sign In
          </button>
        </p>

        <div className="secure">
          🔐 Your information is securely protected
        </div>

      </div>

      <style>{`

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: Arial, sans-serif;
        }

        .signup-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;

          background:
            linear-gradient(
              135deg,
              #eef2ff,
              #f8fafc,
              #faf5ff
            );
        }

        .background-circle {
          position: absolute;
          border-radius: 50%;
          opacity: 0.5;
        }

        .circle-one {
          width: 300px;
          height: 300px;
          background: #c7d2fe;
          top: -100px;
          left: -100px;
        }

        .circle-two {
          width: 350px;
          height: 350px;
          background: #ddd6fe;
          right: -150px;
          bottom: -100px;
        }

        .back-button {
          position: absolute;
          top: 25px;
          left: 30px;

          padding: 10px 16px;

          border: 1px solid #e2e8f0;
          border-radius: 10px;

          background: white;
          color: #475569;

          cursor: pointer;
          font-weight: 600;
        }

        .signup-card {
          width: 450px;
          max-width: calc(100% - 30px);

          padding: 35px 40px;

          background: rgba(255,255,255,0.92);

          border-radius: 25px;

          box-shadow:
            0 25px 70px
            rgba(30,41,59,0.15);

          position: relative;
          z-index: 2;
        }

        .logo {
          width: 58px;
          height: 58px;

          margin: 0 auto 15px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 17px;

          background:
            linear-gradient(
              135deg,
              #4f46e5,
              #7c3aed
            );

          color: white;

          font-size: 18px;
          font-weight: bold;
        }

        h1 {
          margin: 0;
          text-align: center;

          color: #111827;
          font-size: 27px;
        }

        .subtitle {
          text-align: center;
          color: #64748b;

          font-size: 13px;
          margin: 10px 0 25px;
        }

        .error-box {
          padding: 11px;
          margin-bottom: 15px;

          background: #fef2f2;
          border: 1px solid #fecaca;

          border-radius: 10px;

          color: #dc2626;
          font-size: 12px;
        }

        .success-box {
          padding: 11px;
          margin-bottom: 15px;

          background: #f0fdf4;
          border: 1px solid #bbf7d0;

          border-radius: 10px;

          color: #16a34a;
          font-size: 12px;
        }

        .input-group {
          margin-bottom: 17px;
        }

        .input-group label {
          display: block;

          margin-bottom: 7px;

          color: #334155;

          font-size: 12px;
          font-weight: bold;
        }

        .input-wrapper {
          position: relative;
        }

        .input-wrapper span {
          position: absolute;

          left: 14px;
          top: 50%;

          transform: translateY(-50%);
        }

        .input-wrapper input {
          width: 100%;
          height: 48px;

          padding: 0 42px;

          border: 1px solid #dbe1ea;

          border-radius: 11px;

          outline: none;

          font-size: 13px;

          background: #f8fafc;
        }

        .input-wrapper input:focus {
          background: white;

          border-color: #6366f1;

          box-shadow:
            0 0 0 4px
            rgba(99,102,241,0.1);
        }

        .password-button {
          position: absolute;

          right: 10px;
          top: 50%;

          transform: translateY(-50%);

          border: none;
          background: transparent;

          cursor: pointer;
        }

        .terms {
          display: flex;

          gap: 8px;

          align-items: flex-start;

          margin: 5px 0 20px;

          color: #64748b;

          font-size: 10px;
          line-height: 1.5;
        }

        .terms input {
          accent-color: #4f46e5;
        }

        .create-button {
          width: 100%;
          height: 50px;

          border: none;
          border-radius: 11px;

          background:
            linear-gradient(
              135deg,
              #4f46e5,
              #7c3aed
            );

          color: white;

          font-size: 14px;
          font-weight: bold;

          cursor: pointer;

          display: flex;
          align-items: center;
          justify-content: center;

          gap: 12px;
        }

        .create-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .divider {
          display: flex;

          align-items: center;

          gap: 12px;

          margin: 22px 0;

          color: #94a3b8;

          font-size: 11px;
        }

        .divider::before,
        .divider::after {
          content: "";

          flex: 1;

          height: 1px;

          background: #e2e8f0;
        }

        .google-button {
          width: 100%;
          height: 48px;

          display: flex;

          align-items: center;
          justify-content: center;

          gap: 10px;

          background: white;

          border: 1px solid #dbe1ea;

          border-radius: 11px;

          color: #334155;

          font-size: 13px;
          font-weight: bold;

          cursor: pointer;
        }

        .google {
          color: #4285f4;

          font-size: 18px;

          font-weight: bold;
        }

        .login-text {
          margin-top: 22px;

          text-align: center;

          color: #64748b;

          font-size: 12px;
        }

        .login-text button {
          margin-left: 5px;

          border: none;

          background: transparent;

          color: #4f46e5;

          font-weight: bold;

          cursor: pointer;
        }

        .secure {
          margin-top: 18px;

          text-align: center;

          color: #94a3b8;

          font-size: 10px;
        }

        @media (max-width: 500px) {

          .signup-card {
            padding: 30px 24px;
          }

          h1 {
            font-size: 23px;
          }

          .back-button {
            top: 15px;
            left: 15px;
          }
        }

      `}</style>

    </div>
  );
}

export default Signup;