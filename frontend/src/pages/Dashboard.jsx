import React, { useEffect, useMemo, useRef, useState } from "react";
import "./Dashboard.css";
import MockInterview from "./MockInterview";
import LearningTopic from "./Learning";
import heroImage from "../assets/hero.png";

// =========================================================
// LOCAL STORAGE HELPERS
// =========================================================

const getSavedCareerProfile = () => {
  try {
    return JSON.parse(localStorage.getItem("career_profile") || "{}");
  } catch {
    return {};
  }
};

const getSavedUserSession = () => {
  try {
    return JSON.parse(localStorage.getItem("current_user") || "{}");
  } catch {
    return {};
  }
};

// =========================================================
// DASHBOARD
// =========================================================

function Dashboard({ onLogout }) {
  const fileInputRef = useRef(null);

  // =========================================================
  // CURRENT USER
  // =========================================================

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = getSavedUserSession();

    return {
      id: saved.id || saved.sub || null,
      name: saved.name || saved.username || "",
      email: saved.email || "",
      role: saved.role || "User",
      picture: saved.picture || saved.avatar || null,
      authProvider:
        saved.authProvider || (saved.picture ? "Google" : "Email"),
    };
  });

  const [loadingUser, setLoadingUser] = useState(true);

  // =========================================================
  // GET CURRENT USER
  // =========================================================

  useEffect(() => {
    let isMounted = true;

    const fetchCurrentUser = async () => {
      const token = localStorage.getItem("access_token");
      const googleToken = localStorage.getItem("google_id_token");

      if (!token && !googleToken) {
        if (isMounted) {
          setLoadingUser(false);
        }
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/auth/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token || googleToken}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            handleLogout();
            return;
          }

          throw new Error(`User API failed: ${response.status}`);
        }

        const data = await response.json();

        const userData = {
          id: data.id || data.user_id || data._id || data.sub || null,
          name: data.name || data.username || "User",
          email: data.email || "",
          role: data.role || "User",
          picture:
            data.picture || data.avatar || data.profile_pic || null,
          authProvider:
            data.auth_provider ||
            (data.picture ? "Google" : "Standard"),
        };

        if (isMounted) {
          setCurrentUser(userData);
          localStorage.setItem(
            "current_user",
            JSON.stringify(userData)
          );
        }
      } catch (error) {
        console.error("Current user sync error:", error);

        const savedUser = getSavedUserSession();

        if (
          isMounted &&
          (savedUser.name || savedUser.email)
        ) {
          setCurrentUser({
            id: savedUser.id || savedUser.sub || null,
            name: savedUser.name || "User",
            email: savedUser.email || "",
            role: savedUser.role || "User",
            picture: savedUser.picture || null,
            authProvider:
              savedUser.authProvider || "Local Cache",
          });
        }
      } finally {
        if (isMounted) {
          setLoadingUser(false);
        }
      }
    };

    fetchCurrentUser();

    return () => {
      isMounted = false;
    };
  }, []);

  // =========================================================
  // NAVIGATION
  // =========================================================

  const [activePage, setActivePage] = useState("dashboard");
  const [selectedTopic, setSelectedTopic] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const [atsScore, setAtsScore] = useState(0);
  const [skills, setSkills] = useState([]);
  const [missingSkills, setMissingSkills] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const [domain, setDomain] = useState(() => {
    const saved = getSavedCareerProfile();
    return saved.analysisComplete ? saved.domain || "" : "";
  });

  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const [learningVideos, setLearningVideos] = useState([]);

  // =========================================================
  // APPLICATIONS
  // =========================================================

  const [applications, setApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(false);

  // =========================================================
  // NOTIFICATIONS
  // =========================================================

  const [notifications, setNotifications] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("career_notifications") || "[]");
    } catch {
      return [];
    }
  });
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const addNotification = (notification) => {
    const item = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      createdAt: new Date().toISOString(),
      read: false,
      ...notification,
    };

    setNotifications((prev) => {
      const next = [item, ...prev].slice(0, 50);
      localStorage.setItem("career_notifications", JSON.stringify(next));
      return next;
    });
  };

  const markNotificationsRead = () => {
    setNotifications((prev) => {
      const next = prev.map((item) => ({ ...item, read: true }));
      localStorage.setItem("career_notifications", JSON.stringify(next));
      return next;
    });
  };

  const unreadNotificationCount = notifications.filter((item) => !item.read).length;

  // =========================================================
  // FLOATING AI CAREER AGENT
  // =========================================================

  const [aiAgentOpen, setAiAgentOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [aiMessages, setAiMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I'm your AI Career Agent 👋 Ask me about your resume, ATS score, missing skills, learning plan, jobs, or interview preparation."
    }
  ]);
  const [aiTyping, setAiTyping] = useState(false);

  const sendAIMessage = async (presetQuestion = null) => {
    const question = String(presetQuestion ?? aiInput).trim();
    if (!question || aiTyping) return;

    const userMessage = { role: "user", text: question };
    const historyForAPI = aiMessages.slice(-12).map((message) => ({
      role: message.role,
      text: message.text,
    }));

    setAiMessages((prev) => [...prev, userMessage]);
    setAiInput("");
    setAiTyping(true);

    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch("http://127.0.0.1:8000/ai/career-agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          question,
          history: historyForAPI,
          user: {
            name: currentUser.name || "User",
            email: currentUser.email || "",
            role: currentUser.role || "User",
          },
          career_profile: {
            domain: domain || "",
            ats_score: Number(atsScore) || 0,
            skills,
            missing_skills: missingSkills,
            suggestions,
          },
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        throw new Error(data.answer || data.detail || "AI Career Agent request failed.");
      }

      setAiMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.answer || "I couldn't generate a response." },
      ]);
    } catch (error) {
      console.error("AI Career Agent error:", error);
      setAiMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            "Sorry, I couldn't connect to the AI Career Agent. Please make sure the FastAPI backend is running and OPENAI_API_KEY is configured in the backend .env file.",
        },
      ]);
    } finally {
      setAiTyping(false);
    }
  };

  // =========================================================
  // MENU
  // =========================================================

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "⌂" },
    { id: "resume", label: "My Resume", icon: "▤" },
    { id: "applications", label: "Applications", icon: "✓" },
    { id: "mock-interview", label: "Mock Interview", icon: "◉" },
    { id: "learning", label: "Learning", icon: "▥" },
  ];

  const handleNavigation = (page) => {
    setActivePage(page);

    if (page === "learning" && domain) {
      setSelectedTopic(domain);
    } else if (page !== "learning") {
      setSelectedTopic(null);
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================================
  // FILE SELECT
  // =========================================================

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const fileName = file.name.toLowerCase();

    const validExtension =
      fileName.endsWith(".pdf") ||
      fileName.endsWith(".docx");

    if (!validExtension) {
      setUploadMessage(
        "Please upload only PDF or DOCX files."
      );
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadMessage(
        "File size should be less than 10MB."
      );
      return;
    }

    setSelectedFile(file);
    setUploadMessage("");
  };

  // =========================================================
  // YOUTUBE VIDEOS
  // =========================================================

  const createLearningVideos = (missing) => {
    if (!Array.isArray(missing)) return [];

    return missing.slice(0, 10).map((skill) => {
      const cleanSkill = String(skill).trim();

      return {
        skill: cleanSkill,
        title: `${cleanSkill} Full Course for Beginners`,
        url:
          "https://www.youtube.com/results?search_query=" +
          encodeURIComponent(
            `${cleanSkill} full course for beginners`
          ),
      };
    });
  };

  const normalizeVideos = (
    videos,
    missingSkillsList
  ) => {
    if (Array.isArray(videos) && videos.length > 0) {
      return videos.map((video) => {
        if (typeof video === "string") {
          return {
            skill: video,
            title: `${video} Full Course`,
            url:
              "https://www.youtube.com/results?search_query=" +
              encodeURIComponent(`${video} full course`),
          };
        }

        const title =
          video.title ||
          video.name ||
          video.video_title ||
          "Recommended Learning Video";

        const skill =
          video.skill ||
          video.topic ||
          video.keyword ||
          "";

        const url =
          video.url ||
          video.link ||
          video.video_url ||
          video.youtube_url ||
          `https://www.youtube.com/results?search_query=${encodeURIComponent(
            `${skill || title} full course`
          )}`;

        return {
          skill,
          title,
          url,
        };
      });
    }

    return createLearningVideos(missingSkillsList);
  };

  // =========================================================
  // JOB RECOMMENDATIONS
  // =========================================================

  const fetchRecommendations = async (
    resumeSkills,
    currentAts,
    currentDomain
  ) => {
    if (
      !Array.isArray(resumeSkills) ||
      resumeSkills.length === 0
    ) {
      setJobs([]);
      return;
    }

    setLoadingJobs(true);
    setJobs([]);

    const score = Number(currentAts || 0);

    const recommendationType =
      score < 70 ? "internship" : "job";

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/jobs/recommend",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resume_skills: resumeSkills,
            skills: resumeSkills,
            ats_score: score,
            domain: currentDomain || "",
            location: "India",
            recommendation_type: recommendationType,
            limit: 50,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Jobs API failed: ${response.status}`
        );
      }

      const data = await response.json();

      let result = [];

      if (recommendationType === "internship") {
        result =
          data.internships ||
          data.results ||
          data.recommendations ||
          data.data ||
          [];
      } else {
        result =
          data.jobs ||
          data.results ||
          data.recommendations ||
          data.data ||
          [];
      }

      const filteredResults = result.filter((item) => {
        const title = String(
          item.title ||
            item.job_title ||
            item.position ||
            ""
        ).toLowerCase();

        const itemType = String(
          item.type ||
            item.opportunity_type ||
            item.category ||
            ""
        ).toLowerCase();

        const combinedText =
          `${title} ${itemType}`;

        const isInternship =
          combinedText.includes("intern") ||
          combinedText.includes("trainee") ||
          combinedText.includes("apprentice");

        return recommendationType === "internship"
          ? isInternship
          : !isInternship;
      });

      setJobs(filteredResults);
    } catch (error) {
      console.error(
        "Recommendations error:",
        error
      );

      setJobs([]);

      setUploadMessage(
        "Opportunities could not be loaded. Please check FastAPI server."
      );
    } finally {
      setLoadingJobs(false);
    }
  };

  // =========================================================
  // APPLICATIONS API
  // =========================================================

  const fetchApplications = async () => {
    const userId = currentUser?.id;

    if (!userId) {
      setApplications([]);
      return;
    }

    setLoadingApplications(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/applications/${userId}`
      );

      if (!response.ok) {
        throw new Error(`Applications API failed: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setApplications(
          Array.isArray(data.applications)
            ? data.applications
            : []
        );
      } else {
        setApplications([]);
      }
    } catch (error) {
      console.error("Applications fetch error:", error);
      setApplications([]);
    } finally {
      setLoadingApplications(false);
    }
  };

  useEffect(() => {
    if (currentUser?.id) {
      fetchApplications();
    }
  }, [currentUser?.id]);

  // =========================================================
  // APPLY
  // =========================================================

  const handleApply = async (job) => {
    const originalUrl =
      job.url ||
      job.redirect_url ||
      job.apply_url ||
      job.link ||
      job.adzuna_url ||
      "";

    if (!originalUrl) {
      alert(
        "Application link is not available for this opportunity."
      );
      return;
    }

    const userId = currentUser?.id;

    if (!userId) {
      alert("User information is not available. Please login again.");
      return;
    }

    const title =
      job.title ||
      job.job_title ||
      job.position ||
      "Career Opportunity";

    const company =
      job.company ||
      job.company_name ||
      job.employer ||
      "Company";

    const location =
      job.location ||
      job.city ||
      "India";

    const combinedType = String(
      job.type ||
      job.opportunity_type ||
      job.category ||
      ""
    ).toLowerCase();

    const applicationType =
      combinedType.includes("intern") ||
      combinedType.includes("trainee") ||
      combinedType.includes("apprentice")
        ? "Internship"
        : "Job";

    const rawMatchScore =
      job.match_score ??
      job.match_percentage ??
      job.match ??
      null;

    const matchScore =
      rawMatchScore !== null && rawMatchScore !== undefined &&
      rawMatchScore !== "" && !Number.isNaN(Number(rawMatchScore))
        ? Number(rawMatchScore)
        : null;

    // First save the application in the database.
    try {
      const saveResponse = await fetch(
        "http://127.0.0.1:8000/applications/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: Number(userId),
            title,
            company,
            location,
            application_type: applicationType,
            url: originalUrl,
            match_score: matchScore,
            status: "Applied",
          }),
        }
      );

      const saveData = await saveResponse.json().catch(() => ({}));

      if (!saveResponse.ok || !saveData.success) {
        throw new Error(
          saveData.detail || "Failed to save application."
        );
      }

      // Show immediate success notification after the application is saved.
      addNotification({
        type: "success",
        title: "Successfully Applied!",
        message: `${title} at ${company} has been added to your Applications.`,
        applicationId: saveData.application?.id || null,
      });

      // Refresh Applications page immediately.
      await fetchApplications();
      setSelectedJob(null);
    } catch (error) {
      console.error("Application save error:", error);
      alert(
        "Application could not be saved. Please make sure the backend is running."
      );
      return;
    }

    // Then open the actual application page.
    if (!originalUrl.toLowerCase().includes("adzuna")) {
      window.open(
        originalUrl,
        "_blank",
        "noopener,noreferrer"
      );
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/jobs/resolve-url",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: originalUrl,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `URL resolve failed: ${response.status}`
        );
      }

      const data = await response.json();

      if (data.success && data.direct_url) {
        window.open(
          data.direct_url,
          "_blank",
          "noopener,noreferrer"
        );
      } else {
        const searchQuery = [
          title,
          company,
          "job application",
        ]
          .filter(Boolean)
          .join(" ");

        window.open(
          `https://www.google.com/search?q=${encodeURIComponent(
            searchQuery
          )}`,
          "_blank",
          "noopener,noreferrer"
        );
      }
    } catch (error) {
      console.error("Apply URL error:", error);

      const searchQuery = [
        title,
        company,
        "job application",
      ]
        .filter(Boolean)
        .join(" ");

      window.open(
        `https://www.google.com/search?q=${encodeURIComponent(
          searchQuery
        )}`,
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

  // =========================================================
  // RESUME UPLOAD
  // =========================================================

  const uploadResume = async () => {
    if (!selectedFile) {
      setUploadMessage(
        "Please select your resume first."
      );
      return;
    }

    setUploading(true);
    setUploadMessage("");
    setAnalysisComplete(false);

    try {
      const formData = new FormData();

      formData.append(
        "file",
        selectedFile
      );

      const token =
        localStorage.getItem("access_token");

      const response = await fetch(
        "http://127.0.0.1:8000/resume/upload",
        {
          method: "POST",
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(
          `Resume upload failed: ${response.status}`
        );
      }

      const data = await response.json();

      const newAtsScore = Number(
        data.ats_score ??
          data.ATS_score ??
          data.score ??
          0
      );

      const newSkills =
        data.resume_skills ||
        data.skills ||
        data.detected_skills ||
        [];

      const newMissingSkills =
        data.missing_skills ||
        data.skill_gaps ||
        data.missingSkills ||
        [];

      const newSuggestions =
        data.suggestions ||
        data.resume_suggestions ||
        [];

      const newDomain =
        data.domain ||
        data.career_domain ||
        "";

      const backendVideos =
        data.learning_videos ||
        data.youtube_videos ||
        data.youtubeVideos ||
        data.videos ||
        [];

      const newVideos = normalizeVideos(
        backendVideos,
        Array.isArray(newMissingSkills)
          ? newMissingSkills
          : []
      );

      setAtsScore(newAtsScore);

      setSkills(
        Array.isArray(newSkills)
          ? newSkills
          : []
      );

      setMissingSkills(
        Array.isArray(newMissingSkills)
          ? newMissingSkills
          : []
      );

      setSuggestions(
        Array.isArray(newSuggestions)
          ? newSuggestions
          : []
      );

      setDomain(newDomain);

      localStorage.setItem(
        "career_profile",
        JSON.stringify({
          analysisComplete: true,
          domain: newDomain,
          atsScore: newAtsScore,
          skills: Array.isArray(newSkills)
            ? newSkills
            : [],
        })
      );

      setLearningVideos(newVideos);

      setAnalysisComplete(true);

      setUploadMessage(
        "Resume analyzed successfully!"
      );

      await fetchRecommendations(
        Array.isArray(newSkills)
          ? newSkills
          : [],
        newAtsScore,
        newDomain
      );

      setActivePage("dashboard");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error(
        "Resume upload error:",
        error
      );

      setUploadMessage(
        "Backend connection failed. Please make sure FastAPI is running."
      );
    } finally {
      setUploading(false);
    }
  };

  // =========================================================
  // ✅ LOGOUT
  // =========================================================

  const handleLogout = () => {
    console.log("Logout button clicked");

    // Clear ALL login/session data
    localStorage.removeItem("access_token");
    localStorage.removeItem("google_id_token");
    localStorage.removeItem("current_user");
    localStorage.removeItem("career_profile");

    // Clear session storage also
    sessionStorage.clear();

    // Disable Google automatic login
    try {
      if (
        window.google &&
        window.google.accounts &&
        window.google.accounts.id
      ) {
        window.google.accounts.id.disableAutoSelect();
        window.google.accounts.id.revoke?.(
          currentUser.email || "",
          () => {
            console.log(
              "Google session revoked"
            );
          }
        );
      }
    } catch (error) {
      console.log(
        "Google logout cleanup:",
        error
      );
    }

    // Reset React state
    setCurrentUser({
      id: null,
      name: "",
      email: "",
      role: "User",
      picture: null,
      authProvider: "Email",
    });

    setAnalysisComplete(false);
    setAtsScore(0);
    setSkills([]);
    setMissingSkills([]);
    setSuggestions([]);
    setJobs([]);
    setLearningVideos([]);
    setSelectedFile(null);
    setProfileMenuOpen(false);
    setAiAgentOpen(false);

    // IMPORTANT:
    // Tell App.jsx that logout happened
    if (typeof onLogout === "function") {
      onLogout();
    } else {
      // Fallback if onLogout was not passed
      window.location.href = "/login";
    }
  };

  // =========================================================
  // ATS STATUS
  // =========================================================

  const getATSStatus = () => {
    if (atsScore >= 80) {
      return {
        title: "Excellent",
        text: "Your resume is highly optimized.",
      };
    }

    if (atsScore >= 70) {
      return {
        title: "Job Ready",
        text: "Your profile is ready for job applications.",
      };
    }

    if (atsScore >= 50) {
      return {
        title: "Needs Improvement",
        text: "Improve your skills and resume before applying.",
      };
    }

    return {
      title: "Needs Work",
      text: "Build more skills to improve your career profile.",
    };
  };

  // =========================================================
  // HEADER
  // =========================================================

  const renderHeader = (
    title,
    subtitle
  ) => (
    <div className="page-header">
      <div className="page-header-icon">
        ✦
      </div>

      <div>
        <span className="section-eyebrow">
          CAREER AI
        </span>

        <h1>{title}</h1>

        <p>{subtitle}</p>
      </div>
    </div>
  );

  // =========================================================
  // DASHBOARD INTRO
  // =========================================================

  const renderDashboardIntro = () => (
    <section className="intro-section">
      <div className="intro-content">
        <span className="intro-eyebrow">
          ✦ AI CAREER ASSISTANT
        </span>

        <h1>
          Build your career
          <br />
          <span>with AI.</span>
        </h1>

        <p>
          Upload your resume once. CareerAI
          analyzes your profile, finds missing
          skills, gives YouTube learning resources
          and recommends jobs or internships
          based on your ATS score.
        </p>

        <div className="intro-points">
          <span>✓ Resume Analysis</span>
          <span>✓ ATS Score</span>
          <span>✓ Skill Gap Detection</span>
          <span>✓ YouTube Learning</span>
          <span>✓ AI Job Matching</span>
        </div>

        {!analysisComplete && (
          <button
            className="intro-button"
            onClick={() =>
              handleNavigation("resume")
            }
          >
            Analyze My Resume →
          </button>
        )}
      </div>

      <div className="intro-ai-visual">
        <div className="ai-orbit orbit-one" />
        <div className="ai-orbit orbit-two" />

        <div className="ai-core">
          <img
            className="ai-hero-image"
            src={heroImage}
            alt="CareerAI assistant"
          />

          <div className="ai-core-symbol">
            ✦
          </div>
        </div>

        <div className="ai-floating-card card-one">
          <span>ATS</span>
          <strong>
            {analysisComplete
              ? `${atsScore}%`
              : "AI"}
          </strong>
        </div>

        <div className="ai-floating-card card-two">
          <span>SKILLS</span>
          <strong>
            {analysisComplete
              ? skills.length
              : "AI"}
          </strong>
        </div>
      </div>
    </section>
  );

  // =========================================================
  // HOW IT WORKS
  // =========================================================

  const renderHowItWorks = () => {
    const steps = [
      [
        "01",
        "Upload your resume",
        "Add your latest PDF or DOCX resume securely.",
      ],
      [
        "02",
        "Get AI insights",
        "Receive ATS score, skills, gaps and improvement tips.",
      ],
      [
        "03",
        "Learn and apply",
        "Follow learning resources and discover relevant opportunities.",
      ],
    ];

    return (
      <section className="how-it-works">
        <div className="process-intro">
          <span className="section-eyebrow">
            HOW CAREERAI WORKS
          </span>

          <h2>
            Your career plan, in three simple steps.
          </h2>

          <p>
            CareerAI turns your resume into a clear
            action plan so you can improve your profile
            and apply with confidence.
          </p>
        </div>

        <div className="process-grid">
          {steps.map(
            ([
              number,
              title,
              description,
            ]) => (
              <article
                className="process-card"
                key={number}
              >
                <span className="process-number">
                  {number}
                </span>

                <h3>{title}</h3>

                <p>{description}</p>
              </article>
            )
          )}
        </div>
      </section>
    );
  };

  // =========================================================
  // ATS
  // =========================================================

  const renderATSSection = () => {
    if (!analysisComplete) return null;

    const status = getATSStatus();

    const score = Math.min(
      Math.max(Number(atsScore), 0),
      100
    );

    return (
      <section className="dashboard-section">
        <div className="section-heading">
          <div>
            <span className="section-eyebrow">
              AI RESUME ANALYSIS
            </span>

            <h2>Your Resume Analysis</h2>

            <p>
              AI analyzed your resume and identified
              your career profile.
            </p>
          </div>

          <span className="analysis-success">
            ✓ Analysis Complete
          </span>
        </div>

        <div className="analysis-grid">
          <div className="ats-card">
            <div className="card-top">
              <div>
                <span className="card-label">
                  ATS SCORE
                </span>

                <p>
                  Applicant Tracking System
                </p>
              </div>

              <div className="card-icon">
                ✦
              </div>
            </div>

            <div className="ats-main">
              <div className="ats-number">
                {score}
                <span>/100</span>
              </div>

              <div
                className="ats-ring"
                style={{
                  background: `conic-gradient(#111827 ${
                    score * 3.6
                  }deg, #e8edf3 ${
                    score * 3.6
                  }deg)`,
                }}
              >
                <div>{score}%</div>
              </div>
            </div>

            <div className="progress-track">
              <div
                style={{
                  width: `${score}%`,
                }}
              />
            </div>

            <div className="ats-status">
              <strong>
                {status.title}
              </strong>

              <span>
                {status.text}
              </span>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">
              ◈
            </div>

            <span className="card-label">
              DETECTED DOMAIN
            </span>

            <h3>
              {domain || "Not detected yet"}
            </h3>

            <p>
              Career domain detected from your
              resume.
            </p>
          </div>

          <div className="info-card">
            <div className="info-icon">
              ✓
            </div>

            <span className="card-label">
              SKILLS DETECTED
            </span>

            <h3>
              {skills.length} Skills
            </h3>

            <p>
              Technical skills identified from your
              resume.
            </p>
          </div>
        </div>

        <div className="skills-card">
          <div className="result-header">
            <div>
              <span className="card-label">
                RESUME SKILLS
              </span>

              <h3>Skills Detected</h3>
            </div>

            <span className="count-badge">
              {skills.length}
            </span>
          </div>

          {skills.length > 0 ? (
            <div className="skills-list">
              {skills.map(
                (skill, index) => (
                  <span
                    className="skill-chip"
                    key={`${skill}-${index}`}
                  >
                    ✓ {skill}
                  </span>
                )
              )}
            </div>
          ) : (
            <p className="no-data">
              No skills detected.
            </p>
          )}
        </div>
      </section>
    );
  };

  // =========================================================
  // MISSING SKILLS
  // =========================================================

  const renderMissingSkills = () => {
    if (!analysisComplete) return null;

    return (
      <section className="dashboard-section">
        <div className="section-heading">
          <div>
            <span className="section-eyebrow">
              SKILL IMPROVEMENT
            </span>

            <h2>
              Skills You Should Improve
            </h2>

            <p>
              These skills can improve your resume
              and career opportunities.
            </p>
          </div>

          <div className="gap-badge">
            {missingSkills.length} Skill Gaps
          </div>
        </div>

        {missingSkills.length > 0 ? (
          <div className="missing-grid">
            {missingSkills
              .slice(0, 10)
              .map((skill, index) => (
                <div
                  className="missing-card"
                  key={`${skill}-${index}`}
                >
                  <div className="missing-icon">
                    +
                  </div>

                  <span>SKILL GAP</span>

                  <h3>{skill}</h3>

                  <p>
                    Improve this skill to strengthen
                    your profile.
                  </p>
                </div>
              ))}
          </div>
        ) : (
          <div className="no-data-box">
            <h3>
              Great! No major skill gaps detected.
            </h3>

            <p>
              Continue improving your skills to
              maintain a strong profile.
            </p>
          </div>
        )}

        <div className="youtube-wrapper">
          <div className="youtube-heading">
            <div>
              <span className="section-eyebrow">
                AI LEARNING RESOURCES
              </span>

              <h2>
                Learn Your Missing Skills
              </h2>

              <p>
                Recommended YouTube learning
                resources based on your missing
                skills.
              </p>
            </div>

            <div className="youtube-icon">
              ▶
            </div>
          </div>

          {learningVideos.length > 0 ? (
            <div className="youtube-grid">
              {learningVideos
                .slice(0, 10)
                .map(
                  (video, index) => {
                    const title =
                      video.title ||
                      "Learning Video";

                    const url =
                      video.url ||
                      `https://www.youtube.com/results?search_query=${encodeURIComponent(
                        title
                      )}`;

                    const videoSkill =
                      video.skill ||
                      video.topic ||
                      "Missing Skill";

                    return (
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="youtube-card"
                        key={index}
                      >
                        <div className="thumbnail">
                          <div className="thumbnail-pattern">
                            ✦
                          </div>

                          <div className="play-button">
                            ▶
                          </div>
                        </div>

                        <div className="video-content">
                          <span>
                            {videoSkill}
                          </span>

                          <h3>{title}</h3>

                          <p>
                            Watch on YouTube{" "}
                            <strong>→</strong>
                          </p>
                        </div>
                      </a>
                    );
                  }
                )}
            </div>
          ) : (
            <div className="no-videos">
              <div>▶</div>

              <h3>
                No videos available yet
              </h3>

              <p>
                YouTube resources will appear based
                on your missing skills.
              </p>
            </div>
          )}
        </div>

        {suggestions.length > 0 && (
          <div className="resume-improvement-card">
            <div className="result-header">
              <div>
                <span className="section-eyebrow">
                  AI RESUME COACH
                </span>

                <h3>
                  Important Resume Improvements
                </h3>
              </div>

              <div className="info-icon">
                ✦
              </div>
            </div>

            <div className="suggestions-list">
              {suggestions
                .slice(0, 8)
                .map(
                  (suggestion, index) => (
                    <div
                      className="suggestion-item"
                      key={index}
                    >
                      <span>
                        {index + 1}
                      </span>

                      <p>
                        {typeof suggestion ===
                        "string"
                          ? suggestion
                          : suggestion.text ||
                            suggestion.message ||
                            JSON.stringify(
                              suggestion
                            )}
                      </p>
                    </div>
                  )
                )}
            </div>
          </div>
        )}
      </section>
    );
  };

  // =========================================================
  // RECOMMENDATIONS
  // =========================================================

  const renderRecommendations = () => {
    if (!analysisComplete) return null;

    const score = Number(atsScore);

    const isJobReady = score >= 70;

    const opportunityType =
      isJobReady
        ? "JOB"
        : "INTERNSHIP";

    return (
      <section className="dashboard-section recommendations-section">
        <div className="section-heading">
          <div>
            <span className="section-eyebrow">
              AI CAREER MATCHING
            </span>

            <h2>
              {isJobReady
                ? "Jobs Recommended For You"
                : "Internships Recommended For You"}
            </h2>

            <p>
              Opportunities matched using your
              resume, skills, domain and ATS score.
            </p>
          </div>

          <div
            className={
              isJobReady
                ? "job-ready-badge"
                : "internship-badge"
            }
          >
            {isJobReady
              ? "💼 JOB READY"
              : "🎓 INTERNSHIP TRACK"}
          </div>
        </div>

        <div className="career-match-banner">
          <div className="score-box">
            <span>
              YOUR ATS SCORE
            </span>

            <strong>
              {score}/100
            </strong>
          </div>

          <div className="career-message">
            <strong>
              {isJobReady
                ? "Your profile is job-ready!"
                : "Build experience through internships."}
            </strong>

            <p>
              {isJobReady
                ? "Your ATS score is 70 or above, so AI is showing job opportunities."
                : "Your ATS score is below 70, so AI is showing internships only."}
            </p>
          </div>

          <button
            className="refresh-button"
            onClick={() =>
              fetchRecommendations(
                skills,
                atsScore,
                domain
              )
            }
            disabled={loadingJobs}
          >
            {loadingJobs
              ? "Finding..."
              : "Refresh →"}
          </button>
        </div>

        <div className="opportunity-info">
          <div className="opportunity-info-icon">
            {isJobReady ? "💼" : "🎓"}
          </div>

          <div>
            <span>
              AI RECOMMENDATION MODE
            </span>

            <strong>
              Showing {opportunityType}s
            </strong>

            <p>
              {isJobReady
                ? "ATS score ≥ 70 → Job opportunities"
                : "ATS score < 70 → Internship opportunities"}
            </p>
          </div>
        </div>

        {loadingJobs && (
          <div className="jobs-loading">
            <div className="loading-spinner">
              ✦
            </div>

            <h3>
              AI is finding suitable{" "}
              {isJobReady
                ? "jobs"
                : "internships"}
              ...
            </h3>

            <p>
              Matching your skills with available
              opportunities.
            </p>
          </div>
        )}

        {!loadingJobs &&
          jobs.length > 0 && (
            <div className="job-list">
              {jobs
                .slice(0, 20)
                .map((job, index) => {
                  const title =
                    job.title ||
                    job.job_title ||
                    job.position ||
                    "Career Opportunity";

                  const company =
                    job.company ||
                    job.company_name ||
                    job.employer ||
                    "Company";

                  const location =
                    job.location ||
                    job.city ||
                    "India";

                  const url =
                    job.url ||
                    job.redirect_url ||
                    job.apply_url ||
                    job.link ||
                    job.adzuna_url ||
                    "";

                  const matchScore =
                    job.match_score ??
                    job.match_percentage ??
                    job.match ??
                    null;

                  return (
                    <div
                      className="job-card"
                      key={
                        job.id ||
                        job.job_id ||
                        `${title}-${company}-${index}`
                      }
                    >
                      <div className="company-logo">
                        {company
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="job-info">
                        <span className="job-type">
                          {opportunityType}
                        </span>

                        <h3>{title}</h3>

                        <p className="company">
                          {company}
                        </p>

                        <div className="job-meta">
                          <span>
                            📍 {location}
                          </span>

                          {job.salary && (
                            <span>
                              💰 {job.salary}
                            </span>
                          )}

                          {job.job_type && (
                            <span>
                              ◉ {job.job_type}
                            </span>
                          )}

                          {job.source && (
                            <span>
                              🌐 {job.source}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="job-action">
                        {matchScore !== null && (
                          <div className="match-score">
                            <strong>
                              {matchScore}%
                            </strong>

                            <span>
                              Match
                            </span>
                          </div>
                        )}

                        {url ? (
                          <button
                            className="apply-button"
                            onClick={() =>
                              setSelectedJob(job)
                            }
                          >
                            {isJobReady
                              ? "Apply Now →"
                              : "View Internship →"}
                          </button>
                        ) : (
                          <button
                            className="apply-button disabled"
                            disabled
                          >
                            View →
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}

        {!loadingJobs &&
          jobs.length === 0 && (
            <div className="no-opportunities">
              <div className="empty-icon">
                {isJobReady
                  ? "💼"
                  : "🎓"}
              </div>

              <h3>
                No{" "}
                {isJobReady
                  ? "jobs"
                  : "internships"}{" "}
                found
              </h3>

              <p>
                We could not find matching{" "}
                {isJobReady
                  ? "job opportunities"
                  : "internship opportunities"}{" "}
                right now.
              </p>

              <button
                className="primary-button"
                onClick={() =>
                  fetchRecommendations(
                    skills,
                    atsScore,
                    domain
                  )
                }
              >
                Find{" "}
                {isJobReady
                  ? "Jobs"
                  : "Internships"}{" "}
                →
              </button>
            </div>
          )}
      </section>
    );
  };

  // =========================================================
  // DASHBOARD PAGE
  // =========================================================

  const renderDashboard = () => (
    <>
      {renderDashboardIntro()}

      {renderHowItWorks()}

      {uploadMessage && (
        <div
          className={
            uploadMessage.includes(
              "successfully"
            )
              ? "upload-message success"
              : "upload-message"
          }
        >
          <span>
            {uploadMessage.includes(
              "successfully"
            )
              ? "✓"
              : "!"}
          </span>

          {uploadMessage}
        </div>
      )}

      {renderATSSection()}

      {renderMissingSkills()}

      {renderRecommendations()}

      {selectedJob && (
        <div
          className="job-modal-backdrop"
          role="presentation"
          onClick={() =>
            setSelectedJob(null)
          }
        >
          <section
            className="job-details-modal"
            role="dialog"
            aria-modal="true"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <button
              className="modal-close"
              onClick={() =>
                setSelectedJob(null)
              }
              aria-label="Close job details"
            >
              ×
            </button>

            <span className="job-type">
              {selectedJob.type ||
                selectedJob.opportunity_type ||
                "Opportunity"}
            </span>

            <h2>
              {selectedJob.title ||
                selectedJob.job_title ||
                "Career Opportunity"}
            </h2>

            <p className="modal-company">
              {selectedJob.company ||
                selectedJob.company_name ||
                "Company"}
            </p>

            <div className="modal-meta">
              <span>
                Location:{" "}
                {selectedJob.location ||
                  selectedJob.city ||
                  "India"}
              </span>

              {selectedJob.salary && (
                <span>
                  Salary:{" "}
                  {selectedJob.salary}
                </span>
              )}

              {selectedJob.match_score !==
                undefined && (
                <span>
                  Match:{" "}
                  {selectedJob.match_score}%
                </span>
              )}
            </div>

            <div className="modal-description">
              <h3>
                About this opportunity
              </h3>

              <p>
                {selectedJob.description ||
                  "A detailed description was not provided by the job source."}
              </p>
            </div>

            <div className="modal-actions">
              <button
                className="secondary-button"
                onClick={() =>
                  setSelectedJob(null)
                }
              >
                Close
              </button>

              <button
                className="primary-button"
                onClick={() =>
                  handleApply(selectedJob)
                }
              >
                Apply on company site →
              </button>
            </div>
          </section>
        </div>
      )}

      {!analysisComplete && (
        <div className="empty-dashboard">
          <div className="empty-dashboard-icon">
            ✦
          </div>

          <h2>
            Your AI career journey starts here
          </h2>

          <p>
            Go to <strong>My Resume</strong> and
            upload your resume. After analysis,
            your ATS score, skills, missing skills,
            YouTube learning resources and job
            recommendations will appear here
            automatically.
          </p>

          <button
            className="primary-button"
            onClick={() =>
              handleNavigation("resume")
            }
          >
            Upload Resume →
          </button>
        </div>
      )}
    </>
  );

  // =========================================================
  // RESUME PAGE
  // =========================================================

  const renderResume = () => (
    <>
      {renderHeader(
        "My Resume",
        "Upload your resume and let AI analyze your career profile."
      )}

      <div className="resume-page-card">
        <div className="resume-top">
          <div className="resume-icon">
            📄
          </div>

          <div>
            <span className="section-eyebrow">
              RESUME ANALYSIS
            </span>

            <h2>
              {selectedFile
                ? selectedFile.name
                : "Upload your resume"}
            </h2>

            <p>
              PDF or DOCX • Maximum 10MB
            </p>
          </div>
        </div>

        <div
          className="upload-zone"
          onClick={() =>
            fileInputRef.current?.click()
          }
        >
          <div className="upload-icon">
            ↑
          </div>

          <h3>
            Upload your latest resume
          </h3>

          <p>
            AI will analyze your skills, ATS score,
            missing skills, resume improvements and
            career domain.
          </p>

          <button
            className="primary-button"
            type="button"
          >
            Choose File
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx"
          onChange={handleFileSelect}
          hidden
        />

        {selectedFile && (
          <div className="selected-file">
            <div>
              <strong>
                {selectedFile.name}
              </strong>

              <span>
                Ready for AI analysis
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedFile(null);
                setUploadMessage("");

                if (fileInputRef.current) {
                  fileInputRef.current.value =
                    "";
                }
              }}
            >
              Remove
            </button>
          </div>
        )}

        {uploadMessage && (
          <div className="resume-message">
            {uploadMessage}
          </div>
        )}

        <button
          className="primary-button analyze-resume-button"
          onClick={uploadResume}
          disabled={
            uploading || !selectedFile
          }
        >
          {uploading
            ? "Analyzing Resume..."
            : "Analyze Resume →"}
        </button>
      </div>
    </>
  );

  // =========================================================
  // APPLICATIONS
  // =========================================================

  const renderApplications = () => {
    const appliedCount = applications.length;
    const interviewCount = applications.filter(
      (application) =>
        ["interview", "technical round", "hr round"].includes(
          String(application.status || "").toLowerCase()
        )
    ).length;
    const offerCount = applications.filter(
      (application) => String(application.status || "").toLowerCase() === "offer"
    ).length;

    const updateApplicationStatus = async (application, newStatus, interviewDate = "") => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/applications/${application.id}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
          }
        );

        const data = await response.json().catch(() => ({}));
        if (!response.ok || !data.success) {
          throw new Error(data.detail || "Failed to update application status.");
        }

        await fetchApplications();

        if (newStatus === "Interview") {
          const when = interviewDate
            ? new Date(interviewDate).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })
            : "Time not scheduled yet";

          addNotification({
            type: "interview",
            title: "Interview Scheduled!",
            message: `${application.title} at ${application.company} — ${when}`,
            applicationId: application.id,
            scheduledFor: interviewDate || null,
          });

          // Browser notification at the selected interview time, when permitted.
          if (interviewDate) {
            const delay = new Date(interviewDate).getTime() - Date.now();
            if (delay > 0 && delay < 2147483647) {
              window.setTimeout(() => {
                addNotification({
                  type: "interview",
                  title: "Interview Time!",
                  message: `Your ${application.title} interview at ${application.company} starts now.`,
                  applicationId: application.id,
                });

                if ("Notification" in window && Notification.permission === "granted") {
                  new Notification("CareerAI — Interview Time!", {
                    body: `${application.title} at ${application.company} starts now.`,
                  });
                }
              }, delay);
            }
          }

          if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission().catch(() => {});
          }
        }

        if (newStatus === "Shortlisted") {
          addNotification({
            type: "success",
            title: "Application Shortlisted!",
            message: `${application.title} at ${application.company} moved to Shortlisted.`,
            applicationId: application.id,
          });
        }

        if (newStatus === "Technical Round") {
          addNotification({
            type: "interview",
            title: "Technical Round!",
            message: `${application.title} at ${application.company} moved to the Technical Round.`,
            applicationId: application.id,
          });
        }

        if (newStatus === "HR Round") {
          addNotification({
            type: "interview",
            title: "HR Round!",
            message: `${application.title} at ${application.company} moved to the HR Round.`,
            applicationId: application.id,
          });
        }

        if (newStatus === "Offer") {
          addNotification({
            type: "offer",
            title: "Offer Letter Received!",
            message: `Congratulations! You received an offer for ${application.title} at ${application.company}.`,
            applicationId: application.id,
          });

          if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission().catch(() => {});
          }
        }

        if (newStatus === "Rejected") {
          addNotification({
            type: "update",
            title: "Application Update",
            message: `${application.title} at ${application.company} was marked as Rejected.`,
            applicationId: application.id,
          });
        }
      } catch (error) {
        console.error("Update application error:", error);
        alert("Could not update the application. Please check the backend.");
      }
    };

    const removeApplication = async (applicationId) => {
      if (!applicationId) return;
      if (!window.confirm("Remove this application from your tracker?")) return;

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/applications/${applicationId}`,
          { method: "DELETE" }
        );
        const data = await response.json().catch(() => ({}));
        if (!response.ok || !data.success) {
          throw new Error(data.detail || "Failed to remove application.");
        }
        await fetchApplications();
      } catch (error) {
        console.error("Remove application error:", error);
        alert("Could not remove the application. Please check the backend.");
      }
    };

    return (
      <>
        {renderHeader("Applications", "Track applications, interviews and offers in one place.")}

        <div className="empty-page">
          <div className="empty-icon">✓</div>
          <h2>Application Tracker</h2>
          <p>Your application status and important updates will appear here.</p>

          <div className="application-stats">
            <div><strong>{appliedCount}</strong><span>Applied</span></div>
            <div><strong>{interviewCount}</strong><span>Interviews</span></div>
            <div><strong>{offerCount}</strong><span>Offers</span></div>
          </div>
        </div>

        {loadingApplications ? (
          <div className="empty-page"><h3>Loading applications...</h3></div>
        ) : applications.length === 0 ? (
          <div className="empty-page">
            <div className="empty-icon">📭</div>
            <h2>No Applications Yet</h2>
            <p>Go to Jobs or Internships, click Apply, and your application will automatically be saved here.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "16px", marginTop: "24px" }}>
            {applications.map((application) => {
              const status = application.status || "Applied";
              return (
                <div key={application.id} style={{ border: "1px solid #e5e7eb", borderRadius: "16px", padding: "20px", background: "#fff", boxShadow: "0 8px 24px rgba(0,0,0,.05)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", flexWrap: "wrap" }}>
                    <div>
                      <h3 style={{ margin: "0 0 8px" }}>{application.title}</h3>
                      <p style={{ margin: "4px 0" }}><strong>{application.company}</strong></p>
                      <p style={{ margin: "4px 0", color: "#6b7280" }}>📍 {application.location || "India"}</p>
                      <p style={{ margin: "8px 0 0", color: "#6b7280" }}>
                        {application.application_type || "Job"}
                        {application.match_score !== null && application.match_score !== undefined ? ` • Match: ${application.match_score}%` : ""}
                      </p>
                    </div>

                    <span style={{ padding: "7px 12px", borderRadius: "999px", background: status === "Offer" ? "#fef3c7" : status === "Interview" ? "#dbeafe" : status === "Rejected" ? "#fee2e2" : "#ecfdf5", color: status === "Offer" ? "#92400e" : status === "Interview" ? "#1d4ed8" : status === "Rejected" ? "#b91c1c" : "#047857", fontWeight: 700, fontSize: "13px" }}>
                      {status}
                    </span>
                  </div>

                  {/* Application Status Timeline */}
                  {(() => {
                    const timelineSteps = [
                      "Applied",
                      "Shortlisted",
                      "Interview",
                      "Technical Round",
                      "HR Round",
                      "Offer",
                    ];
                    const normalizedStatus = String(status || "Applied").toLowerCase();
                    const rejected = normalizedStatus === "rejected";
                    const statusIndex = timelineSteps.findIndex(
                      (step) => step.toLowerCase() === normalizedStatus
                    );
                    const activeIndex = statusIndex >= 0 ? statusIndex : 0;

                    return (
                      <div style={{ marginTop: "20px", padding: "18px", borderRadius: "14px", background: "#f8fafc", border: "1px solid #e5e7eb" }}>
                        <div style={{ fontWeight: 800, marginBottom: "14px" }}>Application Progress</div>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: "0", overflowX: "auto", paddingBottom: "6px" }}>
                          {timelineSteps.map((step, index) => {
                            const completed = index <= activeIndex && !rejected;
                            const current = index === activeIndex && !rejected;
                            return (
                              <React.Fragment key={step}>
                                <div style={{ minWidth: "92px", textAlign: "center" }}>
                                  <div style={{ width: "34px", height: "34px", margin: "0 auto 8px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: completed ? "#2563eb" : "#e5e7eb", color: completed ? "#fff" : "#6b7280", fontWeight: 800, boxShadow: current ? "0 0 0 5px rgba(37,99,235,.12)" : "none" }}>
                                    {completed ? "✓" : index + 1}
                                  </div>
                                  <div style={{ fontSize: "12px", fontWeight: current ? 800 : 600, color: completed ? "#1d4ed8" : "#6b7280", lineHeight: 1.25 }}>{step}</div>
                                </div>
                                {index < timelineSteps.length - 1 && (
                                  <div style={{ flex: 1, minWidth: "28px", height: "3px", marginTop: "16px", background: !rejected && index < activeIndex ? "#2563eb" : "#e5e7eb", borderRadius: "999px" }} />
                                )}
                              </React.Fragment>
                            );
                          })}
                        </div>
                        {rejected && (
                          <div style={{ marginTop: "12px", padding: "10px 12px", borderRadius: "10px", background: "#fee2e2", color: "#b91c1c", fontWeight: 700 }}>
                            ❌ Application Rejected
                          </div>
                        )}
                        {status === "Offer" && (
                          <div style={{ marginTop: "12px", padding: "10px 12px", borderRadius: "10px", background: "#fef3c7", color: "#92400e", fontWeight: 700 }}>
                            🎉 Offer Received!
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  <div style={{ display: "flex", gap: "10px", marginTop: "18px", flexWrap: "wrap", alignItems: "center" }}>
                    {application.url && (
                      <button className="primary-button" onClick={() => window.open(application.url, "_blank", "noopener,noreferrer")}>Open Application ↗</button>
                    )}

                    <select
                      value={status}
                      onChange={async (e) => {
                        const newStatus = e.target.value;
                        let interviewDate = "";
                        if (newStatus === "Interview") {
                          interviewDate = window.prompt("Enter interview date & time (example: 2026-09-15T10:30)", "") || "";
                        }
                        await updateApplicationStatus(application, newStatus, interviewDate);
                      }}
                      style={{ padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "10px", background: "#fff", fontWeight: 600 }}
                    >
                      <option value="Applied">Applied</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Interview">Interview</option>
                      <option value="Technical Round">Technical Round</option>
                      <option value="HR Round">HR Round</option>
                      <option value="Offer">Offer</option>
                      <option value="Rejected">Rejected</option>
                    </select>

                    <button className="secondary-button" onClick={() => removeApplication(application.id)}>Remove</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </>
    );
  };

  // =========================================================
  // AI CAREER AGENT
  // =========================================================

  const renderCareerAgent = () => null;

  // =========================================================
  // LEARNING
  // =========================================================

  const renderLearning = () => {
    if (analysisComplete && domain) {
      return (
        <LearningTopic
          topic={domain}
          skills={skills}
          missingSkills={missingSkills}
          onBack={() =>
            handleNavigation(
              "dashboard"
            )
          }
        />
      );
    }

    const domains = [
      {
        title: "Data Analytics",
        icon: "📊",
        description:
          "Excel, SQL, Python, Power BI and analytics.",
      },
      {
        title: "Python Full Stack",
        icon: "🐍",
        description:
          "Python, FastAPI, React, databases and APIs.",
      },
      {
        title: "AI & Data Science",
        icon: "🤖",
        description:
          "Python, NumPy, Pandas, ML, NLP and GenAI.",
      },
      {
        title: "Machine Learning",
        icon: "🧠",
        description:
          "ML fundamentals, algorithms and projects.",
      },
    ];

    return (
      <>
        {renderHeader(
          "Learning Roadmap",
          "Build the skills required for your target career."
        )}

        <div className="learning-intro">
          <div>
            <span className="section-eyebrow">
              PERSONALIZED ROADMAP
            </span>

            <h2>
              Learn. Practice. Get Hired.
            </h2>

            <p>
              Select a domain to explore its
              roadmap, concepts, examples and
              exercises.
            </p>
          </div>

          <div className="learning-intro-icon">
            ✦
          </div>
        </div>

        <div className="learning-domain-grid">
          {domains.map((item) => (
            <button
              className="learning-domain-card"
              key={item.title}
              onClick={() =>
                setSelectedTopic(
                  item.title
                )
              }
            >
              <div className="domain-icon">
                {item.icon}
              </div>

              <h3>
                {item.title}
              </h3>

              <p>
                {item.description}
              </p>

              <span>
                Explore roadmap →
              </span>
            </button>
          ))}
        </div>
      </>
    );
  };

  // =========================================================
  // MOCK INTERVIEW
  // =========================================================

  const renderMockInterview = () => (
    <MockInterview
      onBack={() =>
        handleNavigation("dashboard")
      }
    />
  );

  // =========================================================
  // PROFILE
  // =========================================================

  const renderProfile = () => {
    const displayName =
      currentUser.name || "User";

    const displayEmail =
      currentUser.email ||
      "Email not available";

    const displayId =
      currentUser.id ??
      currentUser.user_id ??
      currentUser.userId ??
      "Not available";

    const displayRole =
      currentUser.role || "User";

    const avatarUrl =
      currentUser.picture;

    const authMethod =
      currentUser.authProvider ||
      "Standard Login";

    return (
      <>
        {renderHeader(
          "My Profile",
          "View your account details and manage your CareerAI account."
        )}

        <div className="profile-page-wrapper">
          <div className="profile-layout-card">

            {/* LEFT */}
            <div className="profile-left-panel">
              <div className="profile-avatar-wrapper">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="profile-avatar-img"
                  />
                ) : (
                  <span className="profile-avatar-fallback">
                    {displayName
                      .charAt(0)
                      .toUpperCase()}
                  </span>
                )}
              </div>

              <h2 className="profile-left-name">
                {displayName}
              </h2>

              <span className="profile-left-badge">
                {displayRole}
              </span>

              <p className="profile-left-email">
                {displayEmail}
              </p>

              {/* ✅ WORKING LOGOUT BUTTON */}
              <button
                className="profile-logout-button"
                onClick={handleLogout}
                type="button"
              >
                ↪ Logout
              </button>
            </div>

            {/* RIGHT */}
            <div className="profile-right-panel">
              <h3 className="profile-section-title">
                Account Information
              </h3>

              <div className="profile-details-grid">
                <div className="profile-info-box">
                  <span className="info-box-label">
                    Full Name
                  </span>

                  <strong className="info-box-value">
                    {displayName}
                  </strong>
                </div>

                <div className="profile-info-box">
                  <span className="info-box-label">
                    Email Address
                  </span>

                  <strong className="info-box-value">
                    {displayEmail}
                  </strong>
                </div>

                <div className="profile-info-box">
                  <span className="info-box-label">
                    Account ID
                  </span>

                  <strong className="info-box-value">
                    {displayId}
                  </strong>
                </div>

                <div className="profile-info-box">
                  <span className="info-box-label">
                    Role
                  </span>

                  <strong className="info-box-value">
                    {displayRole}
                  </strong>
                </div>

                <div className="profile-info-box full-width">
                  <span className="info-box-label">
                    Sign-In Method
                  </span>

                  <strong className="info-box-value">
                    {authMethod}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  // =========================================================
  // PAGE ROUTER
  // =========================================================

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return renderDashboard();

      case "resume":
        return renderResume();

      case "applications":
        return renderApplications();

      case "mock-interview":
        return renderMockInterview();

      case "learning":
        return renderLearning();

      case "profile":
        return renderProfile();

      default:
        return renderDashboard();
    }
  };

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div className="dashboard-layout">

      {/* SIDEBAR */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo">
            ✦
          </div>

          <div>
            <h2>CareerAI</h2>
            <span>
              Career Assistant
            </span>
          </div>
        </div>

        <div className="sidebar-divider" />

        <p className="menu-title">
          MAIN MENU
        </p>

        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`sidebar-item ${
                activePage === item.id
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                handleNavigation(
                  item.id
                )
              }
            >
              <span className="sidebar-icon">
                {item.icon}
              </span>

              <span>
                {item.label}
              </span>

              {activePage === item.id && (
                <span className="active-indicator" />
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <div className="upgrade-icon">
              ✦
            </div>

            <strong>
              Improve your career
            </strong>

            <p>
              Keep learning and practicing every day.
            </p>

            <button
              type="button"
              onClick={() =>
                handleNavigation(
                  "learning"
                )
              }
            >
              Explore Learning →
            </button>
          </div>

          {/* ✅ SIDEBAR LOGOUT */}
          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            <span>↪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="dashboard-content">
        <header className="topbar">
          <div className="mobile-brand">
            <div className="brand-logo">
              ✦
            </div>

            <strong>
              CareerAI
            </strong>
          </div>

          <div className="topbar-right">
            <div style={{ position: "relative" }}>
              <button
                type="button"
                className="notification-button"
                onClick={() => {
                  setNotificationsOpen((open) => !open);
                  markNotificationsRead();
                }}
                aria-label="Open notifications"
              >
                🔔
                {unreadNotificationCount > 0 && (
                  <span style={{ position: "absolute", top: -5, right: -5, minWidth: 18, height: 18, padding: "0 4px", borderRadius: 999, background: "#dc2626", color: "#fff", fontSize: 10, fontWeight: 800, display: "grid", placeItems: "center" }}>
                    {unreadNotificationCount > 9 ? "9+" : unreadNotificationCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div style={{ position: "absolute", right: 0, top: "calc(100% + 10px)", width: 360, maxWidth: "calc(100vw - 32px)", maxHeight: 430, overflowY: "auto", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, boxShadow: "0 18px 50px rgba(15,23,42,.18)", zIndex: 10001, padding: 10 }}>
                  <div style={{ padding: "8px 10px 12px", borderBottom: "1px solid #eef0f3", fontWeight: 800 }}>Notifications</div>
                  {notifications.length === 0 ? (
                    <div style={{ padding: 24, textAlign: "center", color: "#6b7280", fontSize: 13 }}>No notifications yet.</div>
                  ) : (
                    notifications.map((item) => (
                      <div key={item.id} style={{ padding: "12px 10px", borderBottom: "1px solid #f1f5f9" }}>
                        <strong style={{ display: "block", fontSize: 13 }}>{item.title}</strong>
                        <p style={{ margin: "5px 0", color: "#4b5563", fontSize: 12, lineHeight: 1.45 }}>{item.message}</p>
                        <span style={{ color: "#9ca3af", fontSize: 10 }}>{new Date(item.createdAt).toLocaleString("en-IN")}</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* PROFILE CIRCLE + DROPDOWN */}
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              <button
                type="button"
                onClick={() =>
                  setProfileMenuOpen((open) => !open)
                }
                title="Profile"
                aria-label="Open profile menu"
                aria-expanded={profileMenuOpen}
                style={{
                  width: 46,
                  height: 46,
                  minWidth: 46,
                  borderRadius: "50%",
                  border: "2px solid #ffffff",
                  padding: 0,
                  overflow: "hidden",
                  cursor: "pointer",
                  background: "#111827",
                  color: "#ffffff",
                  display: "grid",
                  placeItems: "center",
                  fontSize: 17,
                  fontWeight: 800,
                  boxShadow: "0 4px 14px rgba(15,23,42,.14)",
                }}
              >
                {loadingUser ? (
                  "..."
                ) : currentUser.picture ? (
                  <img
                    src={currentUser.picture}
                    alt={currentUser.name || "Profile"}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "50%",
                    }}
                  />
                ) : currentUser.name ? (
                  currentUser.name.charAt(0).toUpperCase()
                ) : (
                  "U"
                )}
              </button>

              {profileMenuOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 10px)",
                    right: 0,
                    width: 250,
                    background: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: 16,
                    padding: 10,
                    boxShadow: "0 18px 50px rgba(15,23,42,.18)",
                    zIndex: 10000,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 8px 12px",
                      borderBottom: "1px solid #eef0f3",
                    }}
                  >
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        minWidth: 42,
                        borderRadius: "50%",
                        overflow: "hidden",
                        background: "#111827",
                        color: "#fff",
                        display: "grid",
                        placeItems: "center",
                        fontWeight: 800,
                      }}
                    >
                      {currentUser.picture ? (
                        <img
                          src={currentUser.picture}
                          alt={currentUser.name || "Profile"}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        (currentUser.name || "U")
                          .charAt(0)
                          .toUpperCase()
                      )}
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <strong
                        style={{
                          display: "block",
                          fontSize: 13,
                          color: "#111827",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {currentUser.name || "User"}
                      </strong>
                      <span
                        style={{
                          display: "block",
                          marginTop: 3,
                          fontSize: 11,
                          color: "#6b7280",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {currentUser.email || "Email not available"}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      handleNavigation("profile");
                    }}
                    style={{
                      width: "100%",
                      marginTop: 8,
                      padding: "10px 11px",
                      border: 0,
                      borderRadius: 10,
                      background: "#f8fafc",
                      color: "#111827",
                      textAlign: "left",
                      cursor: "pointer",
                      fontWeight: 700,
                      fontSize: 12,
                    }}
                  >
                    👤 My Profile
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    style={{
                      width: "100%",
                      marginTop: 6,
                      padding: "10px 11px",
                      border: 0,
                      borderRadius: 10,
                      background: "#fff1f2",
                      color: "#b91c1c",
                      textAlign: "left",
                      cursor: "pointer",
                      fontWeight: 700,
                      fontSize: 12,
                    }}
                  >
                    ↪ Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <section className="page-content">
          {renderPage()}
        </section>

        {/* =====================================================
            FLOATING AI CAREER AGENT
            ===================================================== */}
        <div
          style={{
            position: "fixed",
            right: "24px",
            bottom: "24px",
            zIndex: 9999,
            fontFamily: "inherit"
          }}
        >
          {aiAgentOpen && (
            <div
              style={{
                position: "absolute",
                right: 0,
                bottom: "72px",
                width: "min(380px, calc(100vw - 32px))",
                height: "min(570px, calc(100vh - 110px))",
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "22px",
                boxShadow: "0 24px 70px rgba(15,23,42,.22)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column"
              }}
            >
              <div
                style={{
                  padding: "17px 18px",
                  background: "linear-gradient(135deg,#111827,#374151)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%",
                    display: "grid", placeItems: "center",
                    background: "rgba(255,255,255,.14)",
                    fontSize: 21
                  }}>🤖</div>
                  <div>
                    <strong style={{ display: "block", fontSize: 14 }}>AI Career Agent</strong>
                    <span style={{ fontSize: 11, opacity: .72 }}>Personal career assistant</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAiAgentOpen(false)}
                  style={{
                    border: 0, background: "rgba(255,255,255,.1)", color: "#fff",
                    width: 32, height: 32, borderRadius: 9, cursor: "pointer", fontSize: 18
                  }}
                  aria-label="Close AI Career Agent"
                >×</button>
              </div>

              <div
                style={{
                  padding: "10px 12px", background: "#f8fafc",
                  borderBottom: "1px solid #eef0f3", display: "flex", gap: 7, overflowX: "auto"
                }}
              >
                {["Improve ATS", "What should I learn?", "Interview help", "Resume advice"].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => sendAIMessage(q)}
                    style={{
                      flex: "0 0 auto", padding: "7px 10px", borderRadius: 999,
                      border: "1px solid #e5e7eb", background: "#fff", color: "#374151",
                      fontSize: 10, cursor: "pointer", fontWeight: 700
                    }}
                  >{q}</button>
                ))}
              </div>

              <div
                style={{
                  flex: 1, overflowY: "auto", padding: 15, background: "#f9fafb",
                  display: "flex", flexDirection: "column", gap: 11
                }}
              >
                {aiMessages.map((message, index) => (
                  <div
                    key={index}
                    style={{
                      alignSelf: message.role === "user" ? "flex-end" : "flex-start",
                      maxWidth: "86%", padding: "10px 12px", borderRadius: 14,
                      background: message.role === "user" ? "#111827" : "#fff",
                      color: message.role === "user" ? "#fff" : "#374151",
                      border: message.role === "user" ? "none" : "1px solid #e5e7eb",
                      fontSize: 12, lineHeight: 1.55,
                      boxShadow: "0 3px 10px rgba(15,23,42,.04)"
                    }}
                  >{message.text}</div>
                ))}

                {aiTyping && (
                  <div style={{ alignSelf: "flex-start", padding: "10px 13px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, color: "#6b7280", fontSize: 12 }}>
                    AI is thinking...
                  </div>
                )}
              </div>

              <div style={{ padding: 12, borderTop: "1px solid #e5e7eb", background: "#fff" }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") sendAIMessage(); }}
                    placeholder="Ask your career question..."
                    style={{
                      flex: 1, minWidth: 0, padding: "11px 12px", border: "1px solid #dfe3e8",
                      borderRadius: 12, outline: "none", fontSize: 12
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => sendAIMessage()}
                    disabled={!aiInput.trim() || aiTyping}
                    style={{
                      width: 44, border: 0, borderRadius: 12, background: "#111827",
                      color: "#fff", cursor: "pointer", fontSize: 16,
                      opacity: !aiInput.trim() || aiTyping ? .45 : 1
                    }}
                  >➤</button>
                </div>
                <div style={{ marginTop: 7, fontSize: 9, color: "#9ca3af", textAlign: "center" }}>
                  Career guidance based on your dashboard profile
                </div>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => setAiAgentOpen((open) => !open)}
            aria-label="Open AI Career Agent"
            title="AI Career Agent"
            style={{
              width: 58, height: 58, borderRadius: "50%", border: "1px solid rgba(255,255,255,.5)",
              background: "linear-gradient(135deg,#111827,#4b5563)", color: "#fff",
              boxShadow: "0 12px 32px rgba(15,23,42,.28)", cursor: "pointer",
              fontSize: 25, display: "grid", placeItems: "center",
              transition: "transform .2s ease, box-shadow .2s ease"
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.08)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
          >
            {aiAgentOpen ? "×" : "🤖"}
          </button>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;