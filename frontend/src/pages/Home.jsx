import React from "react";
import { useNavigate } from "react-router-dom";
import professionalGirl from "../assets/professional-girl.png";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">

      {/* ================= NAVBAR ================= */}

      <nav className="navbar">

        <div className="brand">

          <div className="brand-icon">
            AI
          </div>

          <div className="brand-text">
            <h2>CareerAI</h2>
            <span>AI Career Platform</span>
          </div>

        </div>

        <div className="nav-actions">

          <button
            type="button"
            className="nav-signin"
            onClick={() => navigate("/login")}
          >
            Sign In
          </button>

          <button
            type="button"
            className="nav-signup"
            onClick={() => navigate("/signup")}
          >
            Get Started
          </button>

        </div>

      </nav>


      {/* ================= HERO ================= */}

      <main className="hero-section">

        {/* LEFT SIDE */}

        <section className="hero-content">

          <div className="small-badge">
            ✨ AI-POWERED CAREER PLATFORM
          </div>

          <h1>
            Build Your
            <br />
            <span>Dream Career</span>
            <br />
            With AI
          </h1>

          <p className="hero-description">
            Your intelligent career companion for resume analysis,
            personalized job recommendations, skill improvement,
            and AI-powered interview preparation.
          </p>


          {/* BUTTONS */}

          <div className="hero-buttons">

            <button
              type="button"
              className="start-button"
              onClick={() => navigate("/signup")}
            >
              Get Started
              <span>→</span>
            </button>

            <button
              type="button"
              className="account-button"
              onClick={() => navigate("/login")}
            >
              Sign In
            </button>

          </div>


          {/* FEATURES */}

          <div className="features">

            <div className="feature-item">
              <div className="check">✓</div>
              <span>Resume Analysis</span>
            </div>

            <div className="feature-item">
              <div className="check">✓</div>
              <span>AI Job Matching</span>
            </div>

            <div className="feature-item">
              <div className="check">✓</div>
              <span>Mock Interviews</span>
            </div>

          </div>

        </section>


        {/* ================= RIGHT SIDE ================= */}

        <section className="hero-visual">

          <div className="glow glow-one"></div>

          <div className="glow glow-two"></div>

          <div className="circle-background"></div>


          {/* GIRL IMAGE */}

          <div className="person-card">

            <img
              src={professionalGirl}
              alt="Professional AI Career Woman"
              className="professional-photo"
            />

          </div>


          {/* RESUME CARD */}

          <div className="floating-card resume-card">

            <div className="floating-icon resume-icon">
              📄
            </div>

            <div className="floating-content">

              <strong>
                Resume Score
              </strong>

              <span>
                ATS Optimized
              </span>

            </div>

            <b>
              92%
            </b>

          </div>


          {/* JOB CARD */}

          <div className="floating-card job-card">

            <div className="floating-icon job-icon">
              🎯
            </div>

            <div className="floating-content">

              <strong>
                Job Match
              </strong>

              <span>
                Python Developer
              </span>

            </div>

            <b>
              95%
            </b>

          </div>


          {/* AI INTERVIEW CARD */}

          <div className="floating-card ai-card">

            <div className="floating-icon ai-icon">
              🤖
            </div>

            <div className="floating-content">

              <strong>
                AI Interview
              </strong>

              <span>
                Ready to practice
              </span>

            </div>

            <div className="online-dot"></div>

          </div>


          {/* DECORATIVE DOTS */}

          <div className="decor-dot dot-one"></div>

          <div className="decor-dot dot-two"></div>

          <div className="decor-dot dot-three"></div>

        </section>

      </main>


      {/* ================= BOTTOM FEATURES ================= */}

      <section className="bottom-section">

        <div className="bottom-card">

          <div className="bottom-icon">
            📄
          </div>

          <div>

            <h3>
              Smart Resume Analysis
            </h3>

            <p>
              Get your ATS score and identify missing skills.
            </p>

          </div>

        </div>


        <div className="bottom-card">

          <div className="bottom-icon">
            🎯
          </div>

          <div>

            <h3>
              Personalized Jobs
            </h3>

            <p>
              Find opportunities based on your resume and domain.
            </p>

          </div>

        </div>


        <div className="bottom-card">

          <div className="bottom-icon">
            🎥
          </div>

          <div>

            <h3>
              AI Mock Interview
            </h3>

            <p>
              Practice aptitude, coding and interview rounds.
            </p>

          </div>

        </div>

      </section>


      {/* ================= CSS ================= */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          padding: 0;
        }

        .home-page {
          min-height: 100vh;
          overflow-x: hidden;

          background:
            radial-gradient(
              circle at 82% 18%,
              rgba(129, 140, 248, 0.30),
              transparent 30%
            ),
            radial-gradient(
              circle at 5% 90%,
              rgba(192, 132, 252, 0.16),
              transparent 28%
            ),
            linear-gradient(
              135deg,
              #f8fafc 0%,
              #eef2ff 48%,
              #faf5ff 100%
            );

          color: #111827;

          font-family:
            Inter,
            Arial,
            Helvetica,
            sans-serif;
        }


        /* ================= NAVBAR ================= */

        .navbar {
          height: 78px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 0 7%;

          background: rgba(255,255,255,0.88);

          backdrop-filter: blur(20px);

          border-bottom:
            1px solid
            rgba(226,232,240,0.85);

          position: relative;
          z-index: 100;
        }


        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }


        .brand-icon {
          width: 45px;
          height: 45px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 13px;

          background:
            linear-gradient(
              135deg,
              #4f46e5,
              #7c3aed
            );

          color: white;

          font-size: 14px;
          font-weight: 900;

          box-shadow:
            0 10px 28px
            rgba(79,70,229,0.30);
        }


        .brand-text h2 {
          margin: 0;

          font-size: 20px;
          font-weight: 800;

          letter-spacing: -0.5px;
        }


        .brand-text span {
          display: block;

          margin-top: 2px;

          color: #64748b;

          font-size: 10px;
        }


        .nav-actions {
          display: flex;
          align-items: center;

          gap: 12px;
        }


        .nav-signin,
        .nav-signup {
          padding: 12px 21px;

          border-radius: 11px;

          font-size: 13px;
          font-weight: 700;

          cursor: pointer;

          transition: all 0.25s ease;
        }


        .nav-signin {
          background: white;

          border:
            1px solid
            #d1d5db;

          color: #111827;
        }


        .nav-signin:hover {
          border-color: #6366f1;

          color: #4f46e5;

          transform: translateY(-2px);
        }


        .nav-signup {
          border: none;

          color: white;

          background:
            linear-gradient(
              135deg,
              #4f46e5,
              #7c3aed
            );

          box-shadow:
            0 9px 22px
            rgba(79,70,229,0.25);
        }


        .nav-signup:hover {
          transform: translateY(-2px);

          box-shadow:
            0 14px 30px
            rgba(79,70,229,0.35);
        }


        /* ================= HERO ================= */

        .hero-section {
          max-width: 1320px;

          min-height: 620px;

          margin: auto;

          padding: 45px 35px 20px;

          display: grid;

          grid-template-columns: 0.95fr 1.05fr;

          align-items: center;

          gap: 25px;
        }


        /* ================= LEFT CONTENT ================= */

        .hero-content {
          position: relative;
          z-index: 10;

          animation:
            fadeUp 0.8s ease;
        }


        .small-badge {
          display: inline-flex;

          align-items: center;

          padding: 9px 15px;

          background:
            rgba(238,242,255,0.90);

          color: #4f46e5;

          border:
            1px solid
            #c7d2fe;

          border-radius: 30px;

          font-size: 10px;

          font-weight: 800;

          letter-spacing: 1px;

          margin-bottom: 20px;

          box-shadow:
            0 6px 18px
            rgba(79,70,229,0.08);
        }


        .hero-content h1 {
          margin: 0;

          font-size: 64px;

          line-height: 1.03;

          letter-spacing: -3px;

          font-weight: 850;
        }


        .hero-content h1 span {
          background:
            linear-gradient(
              90deg,
              #4f46e5,
              #7c3aed,
              #9333ea
            );

          -webkit-background-clip: text;

          -webkit-text-fill-color:
            transparent;
        }


        .hero-description {
          max-width: 590px;

          margin:
            24px 0 27px;

          color: #64748b;

          font-size: 16px;

          line-height: 1.8;
        }


        /* ================= BUTTONS ================= */

        .hero-buttons {
          display: flex;

          align-items: center;

          gap: 13px;
        }


        .start-button,
        .account-button {
          padding:
            15px 25px;

          border-radius: 12px;

          font-size: 14px;

          font-weight: 800;

          cursor: pointer;

          transition:
            all 0.25s ease;
        }


        .start-button {
          display: flex;

          align-items: center;

          gap: 15px;

          border: none;

          color: white;

          background:
            linear-gradient(
              135deg,
              #111827,
              #312e81
            );

          box-shadow:
            0 14px 30px
            rgba(30,41,59,0.20);
        }


        .start-button span {
          font-size: 19px;

          transition:
            transform 0.25s ease;
        }


        .start-button:hover {
          transform:
            translateY(-3px);

          box-shadow:
            0 18px 35px
            rgba(30,41,59,0.28);
        }


        .start-button:hover span {
          transform:
            translateX(4px);
        }


        .account-button {
          background:
            rgba(255,255,255,0.85);

          border:
            1px solid
            #d1d5db;

          color: #111827;
        }


        .account-button:hover {
          background: white;

          border-color: #6366f1;

          color: #4f46e5;

          transform:
            translateY(-3px);
        }


        /* ================= FEATURES ================= */

        .features {
          display: flex;

          flex-wrap: wrap;

          gap: 22px;

          margin-top: 28px;
        }


        .feature-item {
          display: flex;

          align-items: center;

          gap: 7px;

          color: #64748b;

          font-size: 12px;

          font-weight: 600;
        }


        .check {
          width: 20px;
          height: 20px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background: #dcfce7;

          color: #16a34a;

          font-size: 11px;

          font-weight: 900;
        }


        /* ================= RIGHT VISUAL ================= */

        .hero-visual {
          height: 570px;

          position: relative;

          display: flex;

          align-items: center;
          justify-content: center;

          animation:
            fadeIn 1s ease;
        }


        .circle-background {
          position: absolute;

          width: 510px;
          height: 510px;

          border-radius: 50%;

          background:
            linear-gradient(
              135deg,
              #c7d2fe,
              #ddd6fe,
              #e9d5ff
            );

          box-shadow:
            0 40px 100px
            rgba(79,70,229,0.22);

          animation:
            pulseGlow 4s ease-in-out infinite;
        }


        .glow {
          position: absolute;

          border-radius: 50%;

          filter: blur(2px);

          opacity: 0.7;
        }


        .glow-one {
          width: 95px;
          height: 95px;

          background: #a5b4fc;

          top: 35px;
          right: 35px;

          animation:
            floatOne 4s ease-in-out infinite;
        }


        .glow-two {
          width: 60px;
          height: 60px;

          background: #c084fc;

          bottom: 55px;
          left: 20px;

          animation:
            floatTwo 5s ease-in-out infinite;
        }


        /* ================= GIRL ================= */

        .person-card {
          position: relative;

          z-index: 5;

          width: 430px;
          height: 535px;

          overflow: hidden;

          border-radius:
            215px 215px 30px 30px;

          background:
            linear-gradient(
              145deg,
              #6366f1,
              #7c3aed
            );

          box-shadow:
            0 40px 90px
            rgba(79,70,229,0.32);

          display: flex;

          align-items: flex-end;
          justify-content: center;
        }


        .professional-photo {
          width: 100%;
          height: 100%;

          object-fit: cover;

          object-position: center top;

          display: block;

          transition:
            transform 0.5s ease;
        }


        .person-card:hover
        .professional-photo {
          transform:
            scale(1.04);
        }


        /* ================= FLOATING CARDS ================= */

        .floating-card {
          position: absolute;

          z-index: 20;

          display: flex;

          align-items: center;

          gap: 10px;

          padding:
            13px 15px;

          min-width: 205px;

          background:
            rgba(255,255,255,0.94);

          backdrop-filter:
            blur(15px);

          border:
            1px solid
            rgba(255,255,255,0.95);

          border-radius: 15px;

          box-shadow:
            0 18px 40px
            rgba(15,23,42,0.13);

          transition:
            all 0.3s ease;
        }


        .floating-card:hover {
          transform:
            translateY(-6px)
            scale(1.02);

          box-shadow:
            0 25px 50px
            rgba(15,23,42,0.18);
        }


        .floating-icon {
          width: 39px;
          height: 39px;

          flex-shrink: 0;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 11px;

          font-size: 17px;
        }


        .resume-icon {
          background: #eef2ff;
        }


        .job-icon {
          background: #ecfdf5;
        }


        .ai-icon {
          background: #f3e8ff;
        }


        .floating-content {
          flex: 1;
        }


        .floating-content strong {
          display: block;

          font-size: 12px;

          color: #111827;
        }


        .floating-content span {
          display: block;

          margin-top: 3px;

          color: #94a3b8;

          font-size: 10px;
        }


        .floating-card b {
          color: #16a34a;

          font-size: 13px;
        }


        .resume-card {
          top: 65px;

          left: -10px;

          animation:
            floatingOne 4s ease-in-out infinite;
        }


        .job-card {
          bottom: 115px;

          right: -10px;

          animation:
            floatingTwo 4.5s ease-in-out infinite;
        }


        .ai-card {
          bottom: 30px;

          left: 25px;

          min-width: 210px;

          animation:
            floatingThree 5s ease-in-out infinite;
        }


        .online-dot {
          width: 9px;
          height: 9px;

          border-radius: 50%;

          background: #22c55e;

          box-shadow:
            0 0 0 4px
            rgba(34,197,94,0.12);
        }


        /* ================= DOTS ================= */

        .decor-dot {
          position: absolute;

          border-radius: 50%;

          z-index: 2;
        }


        .dot-one {
          width: 12px;
          height: 12px;

          background: #6366f1;

          top: 45px;
          left: 90px;

          animation:
            floatOne 3s infinite;
        }


        .dot-two {
          width: 8px;
          height: 8px;

          background: #a855f7;

          top: 130px;
          right: 25px;

          animation:
            floatTwo 4s infinite;
        }


        .dot-three {
          width: 10px;
          height: 10px;

          background: #818cf8;

          bottom: 120px;
          right: 65px;

          animation:
            floatThree 4s infinite;
        }


        /* ================= BOTTOM ================= */

        .bottom-section {
          max-width: 1180px;

          margin:
            0 auto 35px;

          padding:
            0 25px;

          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          gap: 18px;
        }


        .bottom-card {
          display: flex;

          align-items: center;

          gap: 15px;

          padding: 20px;

          border-radius: 17px;

          background:
            rgba(255,255,255,0.76);

          backdrop-filter:
            blur(12px);

          border:
            1px solid
            rgba(226,232,240,0.9);

          box-shadow:
            0 10px 30px
            rgba(15,23,42,0.05);

          transition:
            all 0.3s ease;
        }


        .bottom-card:hover {
          transform:
            translateY(-5px);

          background:
            rgba(255,255,255,0.96);

          box-shadow:
            0 18px 40px
            rgba(15,23,42,0.10);
        }


        .bottom-icon {
          width: 45px;
          height: 45px;

          flex-shrink: 0;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 13px;

          background: #eef2ff;

          font-size: 21px;
        }


        .bottom-card h3 {
          margin:
            0 0 5px;

          font-size: 14px;

          font-weight: 800;
        }


        .bottom-card p {
          margin: 0;

          color: #64748b;

          font-size: 11px;

          line-height: 1.5;
        }


        /* ================= ANIMATIONS ================= */

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(25px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }


        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(25px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }


        @keyframes floatingOne {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-9px);
          }
        }


        @keyframes floatingTwo {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(10px);
          }
        }


        @keyframes floatingThree {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-7px);
          }
        }


        @keyframes floatOne {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-12px);
          }
        }


        @keyframes floatTwo {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(12px);
          }
        }


        @keyframes floatThree {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-10px);
          }
        }


        @keyframes pulseGlow {
          0%,
          100% {
            transform: scale(1);
          }

          50% {
            transform: scale(1.025);
          }
        }


        /* ================= TABLET ================= */

        @media (max-width: 1050px) {

          .hero-section {
            grid-template-columns: 1fr;

            text-align: center;

            padding-top: 45px;
          }


          .hero-content {
            display: flex;

            flex-direction: column;

            align-items: center;
          }


          .hero-description {
            margin-left: auto;
            margin-right: auto;
          }


          .features {
            justify-content: center;
          }


          .hero-visual {
            height: 580px;
          }


          .bottom-section {
            grid-template-columns: 1fr;
          }
        }


        /* ================= MOBILE ================= */

        @media (max-width: 600px) {

          .navbar {
            height: 70px;

            padding: 0 18px;
          }


          .brand-icon {
            width: 38px;
            height: 38px;

            border-radius: 11px;
          }


          .brand-text h2 {
            font-size: 17px;
          }


          .brand-text span {
            display: none;
          }


          .nav-signin {
            display: none;
          }


          .nav-signup {
            padding:
              9px 14px;

            font-size: 11px;
          }


          .hero-section {
            padding:
              40px 18px;

            gap: 5px;
          }


          .small-badge {
            font-size: 8px;

            letter-spacing:
              0.7px;
          }


          .hero-content h1 {
            font-size: 42px;

            letter-spacing:
              -2px;
          }


          .hero-description {
            font-size: 14px;

            line-height: 1.7;
          }


          .hero-buttons {
            width: 100%;

            justify-content: center;
          }


          .start-button,
          .account-button {
            padding:
              13px 18px;

            font-size: 12px;
          }


          .features {
            gap: 12px;

            justify-content: center;
          }


          .feature-item {
            font-size: 10px;
          }


          .hero-visual {
            height: 470px;
          }


          .circle-background {
            width: 340px;
            height: 340px;
          }


          .person-card {
            width: 300px;
            height: 390px;

            border-radius:
              150px 150px 25px 25px;
          }


          .floating-card {
            transform: scale(0.78);
          }


          .resume-card {
            left: -45px;
            top: 55px;
          }


          .job-card {
            right: -45px;
            bottom: 100px;
          }


          .ai-card {
            left: -10px;
            bottom: 15px;
          }


          .floating-card:hover {
            transform:
              scale(0.82)
              translateY(-5px);
          }


          .bottom-section {
            padding:
              0 18px;

            gap: 12px;
          }


          .bottom-card {
            padding: 16px;
          }

        }

      `}</style>

    </div>
  );
};

export default Home;