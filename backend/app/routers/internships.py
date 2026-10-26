from fastapi import APIRouter
from pydantic import BaseModel
import requests
import os
import re


router = APIRouter(
    prefix="/internships",
    tags=["Internships"]
)


# ============================================================
# ADZUNA CONFIG
# ============================================================

ADZUNA_APP_ID = os.getenv("ADZUNA_APP_ID")
ADZUNA_APP_KEY = os.getenv("ADZUNA_APP_KEY")


# ============================================================
# REQUEST MODEL
# ============================================================

class InternshipRecommendationRequest(BaseModel):

    resume_skills: list[str]

    ats_score: int

    location: str = "India"


# ============================================================
# CLEAN SKILLS
# ============================================================

def clean_skills(skills):

    if not isinstance(skills, list):
        return []

    cleaned = []

    for skill in skills:

        if not isinstance(skill, str):
            continue

        skill = skill.strip().lower()

        if skill:
            cleaned.append(skill)

    # Remove duplicates
    cleaned = list(
        dict.fromkeys(cleaned)
    )

    return cleaned


# ============================================================
# MATCH SCORE
# ============================================================

def calculate_internship_match(
    resume_skills,
    title,
    description
):

    resume_skills = clean_skills(
        resume_skills
    )

    combined_text = (
        f"{title} {description}"
    ).lower()

    if not resume_skills:
        return 0, []

    matched_skills = []

    for skill in resume_skills:

        # Escape special regex characters
        pattern = (
            rf"(?<!\w)"
            rf"{re.escape(skill)}"
            rf"(?!\w)"
        )

        if re.search(
            pattern,
            combined_text
        ):

            matched_skills.append(
                skill
            )

    if not matched_skills:
        return 0, []

    match_score = round(
        (
            len(matched_skills)
            / len(resume_skills)
        ) * 100
    )

    return (
        match_score,
        matched_skills
    )


# ============================================================
# ADZUNA SEARCH
# ============================================================

def get_internships_from_adzuna(
    query,
    location="India",
    page=1,
    results_per_page=50
):

    if not ADZUNA_APP_ID:
        print("ADZUNA_APP_ID is missing")
        return []

    if not ADZUNA_APP_KEY:
        print("ADZUNA_APP_KEY is missing")
        return []

    url = (
        "https://api.adzuna.com/"
        f"v1/api/jobs/in/search/{page}"
    )

    params = {

        "app_id":
            ADZUNA_APP_ID,

        "app_key":
            ADZUNA_APP_KEY,

        "what":
            query,

        "where":
            location,

        "results_per_page":
            results_per_page,

        "content-type":
            "application/json"
    }

    try:

        response = requests.get(
            url,
            params=params,
            timeout=20
        )

        print(
            "Adzuna:",
            query,
            "Status:",
            response.status_code
        )

        if response.status_code != 200:

            print(
                "Adzuna error:",
                response.text[:500]
            )

            return []

        data = response.json()

        return data.get(
            "results",
            []
        )

    except Exception as error:

        print(
            "Adzuna request error:",
            error
        )

        return []


# ============================================================
# RECOMMEND INTERNSHIPS
# ============================================================

@router.post("/recommend")
async def recommend_internships(
    request: InternshipRecommendationRequest
):

    # ========================================================
    # CLEAN RESUME SKILLS
    # ========================================================

    cleaned_skills = clean_skills(
        request.resume_skills
    )

    print(
        "Resume skills received:",
        cleaned_skills
    )

    print(
        "ATS score:",
        request.ats_score
    )

    # ========================================================
    # NO SKILLS
    # ========================================================

    if not cleaned_skills:

        return {

            "message":
                "No resume skills available for internship matching.",

            "ats_score":
                request.ats_score,

            "internships_allowed":
                True,

            "resume_skills":
                [],

            "count":
                0,

            "internships":
                []
        }

    # ========================================================
    # API KEY CHECK
    # ========================================================

    if (
        not ADZUNA_APP_ID
        or not ADZUNA_APP_KEY
    ):

        return {

            "message":
                "Adzuna API credentials are missing.",

            "ats_score":
                request.ats_score,

            "internships_allowed":
                True,

            "resume_skills":
                cleaned_skills,

            "count":
                0,

            "internships":
                []
        }

    # ========================================================
    # SEARCH TERMS
    #
    # IMPORTANT:
    #
    # ONLY skills already present
    # in the uploaded resume are used.
    #
    # Missing skills are NOT used.
    # ========================================================

    search_terms = []

    for skill in cleaned_skills:

        search_terms.append(
            f"{skill} intern"
        )

        search_terms.append(
            f"{skill} internship"
        )

        search_terms.append(
            f"{skill} trainee"
        )

    search_terms = list(
        dict.fromkeys(
            search_terms
        )
    )

    print(
        "Internship search terms:",
        search_terms
    )

    # ========================================================
    # FETCH RESULTS
    # ========================================================

    all_results = []

    for search_term in search_terms:

        for page in range(1, 4):

            results = (
                get_internships_from_adzuna(

                    query=search_term,

                    location=request.location,

                    page=page,

                    results_per_page=50
                )
            )

            all_results.extend(
                results
            )

    print(
        "Total raw internship results:",
        len(all_results)
    )

    # ========================================================
    # REMOVE DUPLICATES
    # ========================================================

    unique_internships = {}

    for job in all_results:

        job_id = job.get("id")

        if job_id:

            unique_internships[
                str(job_id)
            ] = job

    print(
        "Unique results:",
        len(unique_internships)
    )

    # ========================================================
    # MATCH INTERNSHIPS
    # ========================================================

    internships = []

    for job in unique_internships.values():

        title = job.get(
            "title",
            "Internship"
        )

        description = job.get(
            "description",
            ""
        )

        # ====================================================
        # CHECK INTERNSHIP
        # ====================================================

        internship_text = (
            f"{title} {description}"
        ).lower()

        internship_words = [

            "intern",

            "internship",

            "trainee",

            "apprentice"

        ]

        is_internship = any(

            word in internship_text

            for word in internship_words

        )

        if not is_internship:

            continue

        # ====================================================
        # SKILL MATCHING
        # ====================================================

        match_score, matched_skills = (
            calculate_internship_match(

                cleaned_skills,

                title,

                description
            )
        )

        # ====================================================
        # IGNORE UNRELATED INTERNSHIPS
        # ====================================================

        if match_score == 0:

            continue

        # ====================================================
        # COMPANY
        # ====================================================

        company_data = job.get(
            "company",
            {}
        )

        if not isinstance(
            company_data,
            dict
        ):

            company_data = {}

        # ====================================================
        # LOCATION
        # ====================================================

        location_data = job.get(
            "location",
            {}
        )

        if not isinstance(
            location_data,
            dict
        ):

            location_data = {}

        # ====================================================
        # ADD INTERNSHIP
        # ====================================================

        internship = {

            "id":
                str(
                    job.get(
                        "id",
                        ""
                    )
                ),

            "title":
                title,

            "company":
                company_data.get(
                    "display_name",
                    "Company not available"
                ),

            "location":
                location_data.get(
                    "display_name",
                    request.location
                ),

            "description":
                description,

            "url":
                job.get(
                    "redirect_url",
                    ""
                ),

            "salary_min":
                job.get(
                    "salary_min"
                ),

            "salary_max":
                job.get(
                    "salary_max"
                ),

            "match_score":
                match_score,

            "matched_skills":
                matched_skills
        }

        internships.append(
            internship
        )

    # ========================================================
    # REMOVE DUPLICATES AGAIN
    # ========================================================

    final_internships = {}

    for internship in internships:

        internship_id = internship.get(
            "id"
        )

        if internship_id:

            final_internships[
                internship_id
            ] = internship

    internships = list(
        final_internships.values()
    )

    # ========================================================
    # SORT
    # ========================================================

    internships.sort(

        key=lambda item:
            item.get(
                "match_score",
                0
            ),

        reverse=True
    )

    # ========================================================
    # LIMIT RESULTS
    #
    # You can change 100 if needed.
    # ========================================================

    internships = internships[:100]

    # ========================================================
    # RESPONSE
    # ========================================================

    return {

        "message":
            "Internships matched using skills present in your resume.",

        "ats_score":
            request.ats_score,

        "internships_allowed":
            True,

        "resume_skills":
            cleaned_skills,

        "location":
            request.location,

        "count":
            len(internships),

        "internships":
            internships
    }