import os
from typing import Any, Dict, List

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from starlette.middleware.sessions import SessionMiddleware

from app.database import Base, engine
from app.routers.auth import router as auth_router
from app.routers.resume import router as resume_router
from app.routers.jobs import router as jobs_router
from app.routers.internships import router as internships_router
from app.routers.applications import router as applications_router

load_dotenv()

try:
    from openai import OpenAI
except ImportError:
    OpenAI = None

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Job Application Agent")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("SESSION_SECRET_KEY", "change-this-secret-later"),
)

app.include_router(auth_router)
app.include_router(resume_router)
app.include_router(jobs_router)
app.include_router(internships_router)
app.include_router(applications_router)


class ChatMessage(BaseModel):
    role: str
    text: str


class CareerAgentRequest(BaseModel):
    question: str = Field(min_length=1, max_length=6000)
    user: Dict[str, Any] = Field(default_factory=dict)
    career_profile: Dict[str, Any] = Field(default_factory=dict)
    history: List[ChatMessage] = Field(default_factory=list)


def clean_list(value: Any, limit: int = 20) -> List[str]:
    if not isinstance(value, list):
        return []
    return [str(item) for item in value[:limit] if str(item).strip()]


def build_career_context(request: CareerAgentRequest) -> str:
    profile = request.career_profile or {}
    user = request.user or {}
    name = user.get("name") or "User"
    domain = profile.get("domain") or "Not detected yet"
    ats_score = profile.get("ats_score", 0)
    skills = clean_list(profile.get("skills"))
    missing_skills = clean_list(profile.get("missing_skills"))
    suggestions = clean_list(profile.get("suggestions"))
    return f"""
CURRENT USER PROFILE
Name: {name}
Email: {user.get('email') or 'Not available'}
Career domain: {domain}
ATS score: {ats_score}/100
Detected skills: {', '.join(skills) if skills else 'None available'}
Missing skills: {', '.join(missing_skills) if missing_skills else 'None available'}
Resume suggestions: {', '.join(suggestions) if suggestions else 'None available'}

APPLICATION FEATURES YOU CAN EXPLAIN
1. My Resume: user can upload a PDF/DOCX resume for analysis.
2. Resume analysis: the dashboard can show ATS score, detected skills, missing skills, suggestions, and career domain.
3. Learning: personalized learning roadmap based on the detected domain and skill gaps.
4. Jobs/Internships: recommendations can be based on the user's profile and ATS readiness.
5. Mock Interview: preparation can include aptitude, coding, and interview practice.
6. Applications: area for tracking the application journey.
7. My Profile: user profile information.
8. AI Career Agent: this floating chatbot answers natural-language questions about the app, career planning, resumes, skills, learning, jobs, internships, interviews, Python, SQL, data analytics, AI/ML, and general study/career topics.
"""


def build_conversation_history(history: List[ChatMessage]) -> str:
    if not history:
        return "No previous conversation."
    lines = []
    for message in history[-12:]:
        role = "User" if message.role == "user" else "Assistant"
        text = message.text.strip()
        if text:
            lines.append(f"{role}: {text}")
    return "\n".join(lines) if lines else "No previous conversation."


@app.post("/ai/career-agent")
def career_agent(request: CareerAgentRequest):
    if OpenAI is None:
        return {
            "success": False,
            "answer": "The OpenAI package is not installed. Run: pip install openai python-dotenv",
        }

    api_key = os.getenv("OPENAI_API_KEY", "").strip()
    if not api_key:
        return {
            "success": False,
            "answer": "OPENAI_API_KEY is missing. Add it to the backend .env file and restart FastAPI.",
        }

    try:
        client = OpenAI(api_key=api_key)
        model = os.getenv("OPENAI_MODEL", "gpt-5.6-luna")
        system_prompt = f"""
You are the AI Career Agent inside a student's AI Job Application Agent web application.

Your job is to be a helpful, natural-language assistant. Do NOT restrict yourself to a fixed
list of career keywords. Answer any reasonable question the user asks, including questions
about how to use the application, career guidance, programming, study plans, resumes, jobs,
interviews, projects, or general educational topics.

IMPORTANT BEHAVIOR:
- If the user asks "app ela use cheyali?", explain the app step-by-step in simple language.
- If the user asks in Telugu, Telugu-English mix, or simple English, reply in the same style when practical.
- Use the user's dashboard profile when it is relevant.
- Give actionable steps, examples, and short explanations rather than generic statements.
- If the user asks something unrelated to careers, you may still answer it when it is a normal safe question.
- Never claim that you uploaded a resume, applied to a job, changed settings, or completed an action unless the backend actually performed that action.
- You are currently a chatbot endpoint; you cannot directly click UI buttons or change the user's account.
- If information is missing from the dashboard profile, say so clearly instead of inventing it.
- For technical questions, provide correct explanations and code examples when useful.
- For career decisions, present practical options and trade-offs rather than pretending there is only one correct path.
- Keep responses readable with short paragraphs and numbered/bulleted steps when appropriate.

{build_career_context(request)}

PREVIOUS CONVERSATION
{build_conversation_history(request.history)}
"""
        user_prompt = f"Current user question:\n{request.question.strip()}"
        response = client.responses.create(
            model=model,
            instructions=system_prompt,
            input=user_prompt,
        )
        answer = (response.output_text or "").strip()
        if not answer:
            answer = "I couldn't generate a response right now. Please try again."
        return {"success": True, "answer": answer}
    except Exception as exc:
        print(f"AI Career Agent error: {exc}")
        return {
            "success": False,
            "answer": "The AI service could not respond right now. Check your OPENAI_API_KEY, model name, internet connection, and backend terminal for the exact error.",
        }


@app.get("/")
def home():
    return {"message": "AI Job Application Agent Backend Connected Successfully!"}
