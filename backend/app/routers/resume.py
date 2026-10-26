from fastapi import APIRouter, UploadFile, File, HTTPException
from pathlib import Path
import shutil
import fitz
import re
from docx import Document

router = APIRouter(
    prefix="/resume",
    tags=["Resume"]
)

# ============================================================
# UPLOAD DIRECTORY
# ============================================================

UPLOAD_DIR = Path("uploads/resumes")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# ============================================================
# SKILLS DATABASE
# ============================================================

SKILLS = [
    # Programming
    "python",
    "java",
    "javascript",
    "typescript",
    "c",
    "c++",

    # Web
    "html",
    "css",
    "react",
    "node.js",
    "express.js",
    "fastapi",
    "django",

    # Database
    "sql",
    "mysql",
    "postgresql",
    "mongodb",
    "redis",

    # Data Analytics
    "excel",
    "power bi",
    "tableau",
    "pandas",
    "numpy",
    "matplotlib",
    "seaborn",
    "statistics",
    "data visualization",

    # AI / ML
    "machine learning",
    "deep learning",
    "artificial intelligence",
    "data science",
    "nlp",
    "tensorflow",
    "pytorch",
    "scikit-learn",
    "transformers",
    "llm",
    "generative ai",
    "langchain",
    "hugging face",

    # Tools
    "git",
    "github",
    "docker",
    "kubernetes",

    # Cloud
    "aws",
    "azure",
    "google cloud",

    # Other
    "rest api",
    "api",
    "json",
    "linux",
    "postman",
    "streamlit",
    "jupyter",
]

# ============================================================
# DOMAIN SKILL MAP
# ============================================================

DOMAIN_SKILLS = {

    "AI & Data Science": [
        "python",
        "numpy",
        "pandas",
        "matplotlib",
        "seaborn",
        "sql",
        "statistics",
        "machine learning",
        "scikit-learn",
        "deep learning",
        "tensorflow",
        "pytorch",
        "nlp",
        "transformers",
        "generative ai",
        "llm",
        "langchain",
        "hugging face",
        "git",
        "github",
        "jupyter",
    ],

    "Data Analytics": [
        "python",
        "sql",
        "excel",
        "power bi",
        "tableau",
        "pandas",
        "numpy",
        "matplotlib",
        "seaborn",
        "statistics",
        "data visualization",
        "git",
    ],

    "Python Full Stack": [
        "python",
        "html",
        "css",
        "javascript",
        "react",
        "node.js",
        "fastapi",
        "django",
        "sql",
        "mysql",
        "postgresql",
        "mongodb",
        "rest api",
        "json",
        "git",
        "github",
        "docker",
    ],

    "Machine Learning": [
        "python",
        "numpy",
        "pandas",
        "matplotlib",
        "seaborn",
        "statistics",
        "machine learning",
        "scikit-learn",
        "tensorflow",
        "pytorch",
        "deep learning",
        "nlp",
        "git",
        "github",
    ],

    "Web Development": [
        "html",
        "css",
        "javascript",
        "typescript",
        "react",
        "node.js",
        "express.js",
        "fastapi",
        "django",
        "sql",
        "mongodb",
        "rest api",
        "json",
        "git",
        "github",
        "docker",
    ],
}

# ============================================================
# DOMAIN JOB ROLES
# ============================================================
# Resume domain batti relevant roles create cheyyadaniki.

DOMAIN_JOB_ROLES = {

    "AI & Data Science": [
        "AI Engineer",
        "Data Scientist",
        "AI Developer",
        "Data Science Engineer",
        "Generative AI Engineer",
        "NLP Engineer",
        "AI/ML Engineer",
    ],

    "Data Analytics": [
        "Data Analyst",
        "Junior Data Analyst",
        "Business Analyst",
        "Data Analytics Intern",
        "BI Analyst",
        "Power BI Developer",
        "Reporting Analyst",
    ],

    "Python Full Stack": [
        "Python Developer",
        "Full Stack Developer",
        "Python Full Stack Developer",
        "Backend Developer",
        "Python Backend Developer",
        "FastAPI Developer",
        "Software Developer",
        "Web Developer",
    ],

    "Machine Learning": [
        "Machine Learning Engineer",
        "ML Engineer",
        "Junior Machine Learning Engineer",
        "Machine Learning Developer",
        "AI/ML Engineer",
        "Data Scientist",
    ],

    "Web Development": [
        "Frontend Developer",
        "Backend Developer",
        "Full Stack Developer",
        "Web Developer",
        "React Developer",
        "JavaScript Developer",
        "Software Developer",
    ],
}

# ============================================================
# YOUTUBE SEARCH
# ============================================================

YOUTUBE_BASE = "https://www.youtube.com/results?search_query="


def youtube_url(skill):
    query = skill.replace(" ", "+")
    return (
        f"{YOUTUBE_BASE}"
        f"{query}+tutorial+for+beginners"
    )


# ============================================================
# PDF TEXT EXTRACTION
# ============================================================

def extract_pdf_text(file_path):

    extracted_text = ""

    try:

        pdf_document = fitz.open(file_path)

        for page in pdf_document:

            extracted_text += (
                page.get_text() + "\n"
            )

        pdf_document.close()

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"PDF reading failed: {error}"
        )

    return extracted_text


# ============================================================
# DOCX TEXT EXTRACTION
# ============================================================

def extract_docx_text(file_path):

    extracted_text = ""

    try:

        document = Document(file_path)

        # Paragraphs
        for paragraph in document.paragraphs:

            extracted_text += (
                paragraph.text + "\n"
            )

        # Tables
        for table in document.tables:

            for row in table.rows:

                for cell in row.cells:

                    extracted_text += (
                        cell.text + " "
                    )

                extracted_text += "\n"

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"DOCX reading failed: {error}"
        )

    return extracted_text


# ============================================================
# DETECT SKILLS
# ============================================================

def detect_skills(text):

    text_lower = text.lower()

    found_skills = []

    for skill in SKILLS:

        pattern = (
            rf"(?<!\w)"
            rf"{re.escape(skill.lower())}"
            rf"(?!\w)"
        )

        if re.search(
            pattern,
            text_lower
        ):

            found_skills.append(skill)

    return found_skills


# ============================================================
# DETECT DOMAIN
# ============================================================

def detect_domain(text, skills):

    skill_set = {
        skill.lower()
        for skill in skills
    }

    domain_scores = {}

    for domain, domain_skills in DOMAIN_SKILLS.items():

        score = 0

        for skill in domain_skills:

            if skill.lower() in skill_set:

                score += 1

        domain_scores[domain] = score

    if not domain_scores:

        return "General Software Development"

    best_domain = max(
        domain_scores,
        key=domain_scores.get
    )

    best_score = domain_scores[best_domain]

    if best_score == 0:

        return "General Software Development"

    return best_domain


# ============================================================
# FIND MISSING DOMAIN SKILLS
# ============================================================

def find_missing_skills(
    domain,
    resume_skills
):

    resume_skill_set = {
        skill.lower().strip()
        for skill in resume_skills
    }

    domain_skills = DOMAIN_SKILLS.get(
        domain,
        []
    )

    missing = []

    for skill in domain_skills:

        if skill.lower() not in resume_skill_set:

            missing.append(skill)

    return missing


# ============================================================
# CREATE LEARNING VIDEOS
# ============================================================

def generate_learning_videos(
    missing_skills
):

    videos = []

    for skill in missing_skills:

        videos.append({

            "skill": skill,

            "title": (
                f"Learn {skill.title()}"
            ),

            "youtube_url": youtube_url(
                skill
            )

        })

    return videos


# ============================================================
# DETECT RESUME SECTIONS
# ============================================================

def detect_sections(text):

    text_lower = text.lower()

    sections = {

        "contact": False,
        "summary": False,
        "skills": False,
        "education": False,
        "experience": False,
        "projects": False,
        "certifications": False,

    }

    section_keywords = {

        "contact": [
            "email",
            "phone",
            "linkedin",
            "github",
        ],

        "summary": [
            "summary",
            "objective",
            "profile",
        ],

        "skills": [
            "skills",
            "technical skills",
            "technical skill",
        ],

        "education": [
            "education",
            "degree",
            "b.tech",
            "bachelor",
            "master",
        ],

        "experience": [
            "experience",
            "work experience",
            "internship",
            "internships",
        ],

        "projects": [
            "projects",
            "project",
        ],

        "certifications": [
            "certification",
            "certifications",
            "certificate",
        ],

    }

    for section, keywords in section_keywords.items():

        for keyword in keywords:

            if keyword in text_lower:

                sections[section] = True

                break

    return sections


# ============================================================
# ACTION KEYWORDS
# ============================================================

ACTION_KEYWORDS = [

    "developed",
    "implemented",
    "designed",
    "built",
    "created",
    "managed",
    "analyzed",
    "improved",
    "automated",
    "deployed",
    "tested",
    "optimized",
    "integrated",
    "trained",

]


# ============================================================
# ATS SCORE
# ============================================================

def calculate_ats_score(
    text,
    skills,
    sections,
    domain,
    missing_skills
):

    text_lower = text.lower()

    # ========================================================
    # 1. DOMAIN SKILL COVERAGE - 35
    # ========================================================

    domain_skills = DOMAIN_SKILLS.get(
        domain,
        []
    )

    if domain_skills:

        total_domain_skills = len(
            domain_skills
        )

        detected_domain_skills = (
            total_domain_skills
            - len(missing_skills)
        )

        detected_domain_skills = max(
            detected_domain_skills,
            0
        )

        skill_coverage = (
            detected_domain_skills
            / total_domain_skills
        )

        skill_score = round(
            skill_coverage * 35
        )

    else:

        skill_score = min(
            len(skills) * 2,
            35
        )

    # ========================================================
    # 2. RESUME SECTIONS - 15
    # ========================================================

    section_score = 0

    important_sections = [

        "contact",
        "summary",
        "skills",
        "education",
        "experience",
        "projects",

    ]

    for section in important_sections:

        if sections.get(
            section,
            False
        ):

            section_score += 2.5

    section_score = round(
        section_score
    )

    # ========================================================
    # 3. EXPERIENCE - 10
    # ========================================================

    experience_score = (

        10
        if sections.get(
            "experience",
            False
        )
        else 0

    )

    # ========================================================
    # 4. PROJECTS - 10
    # ========================================================

    project_score = (

        10
        if sections.get(
            "projects",
            False
        )
        else 0

    )

    # ========================================================
    # 5. ACTION KEYWORDS - 10
    # ========================================================

    action_count = sum(

        1
        for keyword in ACTION_KEYWORDS
        if keyword in text_lower

    )

    action_score = min(
        round(action_count * 1.25),
        10
    )

    # ========================================================
    # 6. RESUME LENGTH - 5
    # ========================================================

    words = len(
        text.split()
    )

    if words >= 300:

        length_score = 5

    elif words >= 150:

        length_score = 4

    elif words >= 80:

        length_score = 2

    else:

        length_score = 0

    # ========================================================
    # 7. CONTACT DETAILS - 5
    # ========================================================

    contact_score = 0

    email_found = re.search(
        r"[\w\.-]+@[\w\.-]+\.\w+",
        text
    )

    phone_found = re.search(
        r"\b\d{10}\b",
        text
    )

    if email_found:

        contact_score += 2.5

    if phone_found:

        contact_score += 2.5

    contact_score = round(
        contact_score
    )

    # ========================================================
    # FINAL SCORE
    # ========================================================

    score = (

        skill_score
        + section_score
        + experience_score
        + project_score
        + action_score
        + length_score
        + contact_score

    )

    return min(
        round(score),
        100
    )


# ============================================================
# RESUME IMPROVEMENT SUGGESTIONS
# ============================================================

def generate_suggestions(
    skills,
    sections,
    score,
    missing_skills
):

    suggestions = []

    # ========================================================
    # ATS MESSAGE
    # ========================================================

    if score < 70:

        suggestions.append(

            "Your ATS score is below 70. "
            "Improve your resume with relevant "
            "skills, projects, experience and "
            "measurable achievements."

        )

    else:

        suggestions.append(

            "Your ATS score is good. "
            "Your resume is eligible for job "
            "matching. Keep improving it with "
            "job-specific skills and measurable "
            "achievements."

        )

    # ========================================================
    # MISSING SKILLS
    # ========================================================

    if missing_skills:

        skill_names = ", ".join(
            missing_skills[:10]
        )

        suggestions.append(

            f"Important skills missing for "
            f"your {score}/100 ATS profile: "
            f"{skill_names}."

        )

        if score < 70:

            suggestions.append(

                "Learn the missing skills and "
                "add relevant projects to improve "
                "your resume and internship readiness."

            )

        else:

            suggestions.append(

                "Your resume is above the job-access "
                "threshold. Learning these skills can "
                "improve your job matching further."

            )

    # ========================================================
    # SUMMARY
    # ========================================================

    if not sections.get(
        "summary",
        False
    ):

        suggestions.append(

            "Add a professional summary at "
            "the beginning of your resume."

        )

    # ========================================================
    # EXPERIENCE
    # ========================================================

    if not sections.get(
        "experience",
        False
    ):

        suggestions.append(

            "Add internship, work experience "
            "or practical experience if available."

        )

    # ========================================================
    # PROJECTS
    # ========================================================

    if not sections.get(
        "projects",
        False
    ):

        suggestions.append(

            "Add 2-3 relevant projects and "
            "explain your contribution, "
            "technologies and results."

        )

    # ========================================================
    # CERTIFICATIONS
    # ========================================================

    if not sections.get(
        "certifications",
        False
    ):

        suggestions.append(

            "Add relevant certifications or "
            "completed courses."

        )

    # ========================================================
    # ACHIEVEMENTS
    # ========================================================

    suggestions.append(

        "Use measurable achievements such as "
        "percentages, numbers, performance "
        "improvements or project results."

    )

    return suggestions


# ============================================================
# GET RECOMMENDED JOB ROLES
# ============================================================

def get_recommended_roles(domain):

    return DOMAIN_JOB_ROLES.get(
        domain,
        [
            "Software Developer",
            "Python Developer",
            "Junior Developer",
        ]
    )


# ============================================================
# UPLOAD + ANALYZE RESUME
# ============================================================

@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...)
):

    # ========================================================
    # VALIDATE FILE
    # ========================================================

    allowed_types = [

        "application/pdf",

        (
            "application/vnd.openxmlformats-officedocument."
            "wordprocessingml.document"
        )

    ]

    if file.content_type not in allowed_types:

        raise HTTPException(

            status_code=400,

            detail=(
                "Only PDF and DOCX files are allowed."
            )

        )

    # ========================================================
    # FILE NAME
    # ========================================================

    if not file.filename:

        raise HTTPException(
            status_code=400,
            detail="Filename is missing."
        )

    safe_filename = Path(
        file.filename
    ).name

    file_path = (
        UPLOAD_DIR / safe_filename
    )

    # ========================================================
    # SAVE FILE
    # ========================================================

    try:

        with open(
            file_path,
            "wb"
        ) as buffer:

            shutil.copyfileobj(
                file.file,
                buffer
            )

    except Exception as error:

        raise HTTPException(

            status_code=500,

            detail=(
                f"Resume saving failed: {error}"
            )

        )

    # ========================================================
    # EXTRACT TEXT
    # ========================================================

    if file.content_type == "application/pdf":

        extracted_text = extract_pdf_text(
            file_path
        )

    else:

        extracted_text = extract_docx_text(
            file_path
        )

    # ========================================================
    # TEXT CHECK
    # ========================================================

    if not extracted_text.strip():

        raise HTTPException(

            status_code=400,

            detail=(
                "Could not extract text from resume."
            )

        )

    # ========================================================
    # DETECT RESUME SKILLS
    # ========================================================

    detected_skills = detect_skills(
        extracted_text
    )

    # ========================================================
    # DETECT DOMAIN
    # ========================================================

    domain = detect_domain(
        extracted_text,
        detected_skills
    )

    # ========================================================
    # DETECT SECTIONS
    # ========================================================

    sections = detect_sections(
        extracted_text
    )

    # ========================================================
    # FIND MISSING SKILLS
    # ========================================================

    missing_skills = find_missing_skills(

        domain,

        detected_skills

    )

    # ========================================================
    # CALCULATE ATS SCORE
    # ========================================================

    ats_score = calculate_ats_score(

        extracted_text,

        detected_skills,

        sections,

        domain,

        missing_skills

    )

    # ========================================================
    # IMPORTANT:
    # SCORE BASED RESULT TYPE
    #
    # ATS >= 70 -> JOBS ONLY
    # ATS < 70  -> INTERNSHIPS ONLY
    # ========================================================

    if ats_score >= 70:

        result_type = "jobs"

        jobs_allowed = True

        internships_allowed = False

        learning_videos = []

    else:

        result_type = "internships"

        jobs_allowed = False

        internships_allowed = True

        learning_videos = (
            generate_learning_videos(
                missing_skills
            )
        )

    # ========================================================
    # RECOMMENDED JOB ROLES
    # ========================================================

    recommended_roles = get_recommended_roles(
        domain
    )

    # ========================================================
    # SUGGESTIONS
    # ========================================================

    suggestions = generate_suggestions(

        detected_skills,

        sections,

        ats_score,

        missing_skills

    )

    # ========================================================
    # FINAL RESPONSE
    # ========================================================

    return {

        "message":
            "Resume analyzed successfully",

        "filename":
            safe_filename,

        # ----------------------------------------------------
        # ATS
        # ----------------------------------------------------

        "ats_score":
            ats_score,

        "ats_status":
            (
                "good"
                if ats_score >= 70
                else "needs_improvement"
            ),

        # ----------------------------------------------------
        # RESULT TYPE
        # ----------------------------------------------------
        # jobs OR internships

        "result_type":
            result_type,

        # ----------------------------------------------------
        # ACTUAL RESUME SKILLS
        # ----------------------------------------------------

        "resume_skills":
            detected_skills,

        # ----------------------------------------------------
        # DOMAIN
        # ----------------------------------------------------

        "domain":
            domain,

        # ----------------------------------------------------
        # RECOMMENDED ROLES
        # ----------------------------------------------------

        "recommended_roles":
            recommended_roles,

        # ----------------------------------------------------
        # MISSING DOMAIN SKILLS
        # ----------------------------------------------------

        "missing_skills":
            missing_skills,

        # ----------------------------------------------------
        # YOUTUBE LEARNING
        # ----------------------------------------------------

        "learning_videos":
            learning_videos,

        # ----------------------------------------------------
        # ACCESS CONTROL
        # ----------------------------------------------------

        "jobs_allowed":
            jobs_allowed,

        "internships_allowed":
            internships_allowed,

        # ----------------------------------------------------
        # RESUME SECTIONS
        # ----------------------------------------------------

        "sections":
            sections,

        # ----------------------------------------------------
        # SUGGESTIONS
        # ----------------------------------------------------

        "suggestions":
            suggestions,

        # ----------------------------------------------------
        # TEXT LENGTH
        # ----------------------------------------------------

        "text_length":
            len(extracted_text),

    }
