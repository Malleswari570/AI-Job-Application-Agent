from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

import requests
import re

from concurrent.futures import ThreadPoolExecutor, as_completed
from urllib.parse import urlparse, urljoin

from bs4 import BeautifulSoup

from app.config import (
    ADZUNA_APP_ID,
    ADZUNA_APP_KEY,
)


router = APIRouter(
    prefix="/jobs",
    tags=["Jobs"],
)


# =========================================================
# REQUEST MODELS
# =========================================================

class JobRecommendationRequest(BaseModel):
    skills: list[str] = Field(default_factory=list)
    domain: str = ""
    ats_score: float = 0
    location: str = "India"


class JobURLRequest(BaseModel):
    url: str


# =========================================================
# COMMON HEADERS
# =========================================================

BROWSER_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/151.0.0.0 Safari/537.36"
    ),
    "Accept": (
        "text/html,application/xhtml+xml,"
        "application/xml;q=0.9,*/*;q=0.8"
    ),
    "Accept-Language": "en-US,en;q=0.9",
}


# =========================================================
# CLEAN HTML
# =========================================================

def clean_html(text: str) -> str:
    if not text:
        return ""

    text = re.sub(
        r"<[^>]+>",
        " ",
        str(text),
    )

    text = re.sub(
        r"\s+",
        " ",
        text,
    )

    return text.strip()


# =========================================================
# CHECK ADZUNA URL
# =========================================================

def is_adzuna_url(url: str) -> bool:
    if not url:
        return False

    try:
        hostname = urlparse(url).netloc.lower()

        return "adzuna" in hostname

    except Exception:
        return False


# =========================================================
# SOURCE DETECTION
# =========================================================

def detect_source(
    url: str,
    company: str = "",
) -> str:

    url_lower = (url or "").lower()

    if "linkedin.com" in url_lower:
        return "LinkedIn"

    if "naukri.com" in url_lower:
        return "Naukri"

    if "indeed.com" in url_lower:
        return "Indeed"

    if "foundit.in" in url_lower:
        return "Foundit"

    if "monster.com" in url_lower:
        return "Monster"

    if "glassdoor.com" in url_lower:
        return "Glassdoor"

    if "internshala.com" in url_lower:
        return "Internshala"

    if "wellfound.com" in url_lower:
        return "Wellfound"

    if "greenhouse.io" in url_lower:
        return "Greenhouse"

    if "lever.co" in url_lower:
        return "Lever"

    if company:
        return company

    return "Adzuna"


# =========================================================
# INTERNSHIP DETECTION
# =========================================================

def is_internship_title(title: str) -> bool:

    title_lower = (title or "").lower()

    keywords = [
        "intern",
        "internship",
        "trainee",
        "apprentice",
        "graduate trainee",
        "student trainee",
        "fresher internship",
    ]

    return any(
        keyword in title_lower
        for keyword in keywords
    )


# =========================================================
# CLEAN SKILLS
# =========================================================

def clean_skills(
    skills: list[str],
) -> list[str]:

    final_skills = []
    seen = set()

    for skill in skills or []:

        skill = str(skill).strip()

        if not skill:
            continue

        key = skill.lower()

        if key in seen:
            continue

        seen.add(key)
        final_skills.append(skill)

    return final_skills


# =========================================================
# BUILD SEARCH QUERIES
#
# ATS >= 70 -> JOBS
# ATS < 70  -> INTERNSHIPS
# =========================================================

def build_search_queries(
    skills: list[str],
    domain: str,
    ats_score: float,
):

    skills = clean_skills(skills)

    domain = (domain or "").strip()

    score = float(ats_score or 0)

    queries = []

    # =====================================================
    # JOBS
    # =====================================================

    if score >= 70:

        if domain:
            queries.append(domain)

        for skill in skills[:3]:
            queries.append(skill)

        for skill in skills[:2]:

            if domain:
                queries.append(
                    f"{domain} {skill}"
                )

    # =====================================================
    # INTERNSHIPS
    # =====================================================

    else:

        if domain:
            queries.append(
                f"{domain} internship"
            )

        for skill in skills[:3]:
            queries.append(
                f"{skill} internship"
            )

        for skill in skills[:2]:

            if domain:
                queries.append(
                    f"{domain} {skill} internship"
                )

    # =====================================================
    # REMOVE DUPLICATES
    # =====================================================

    final_queries = []
    seen = set()

    for query in queries:

        query = query.strip()

        if not query:
            continue

        key = query.lower()

        if key not in seen:

            seen.add(key)
            final_queries.append(query)

    # =====================================================
    # FALLBACK
    # =====================================================

    if not final_queries:

        if score >= 70:

            final_queries = [
                "software developer",
                "python developer",
                "data analyst",
            ]

        else:

            final_queries = [
                "software developer internship",
                "python developer internship",
                "data analyst internship",
            ]

    return final_queries[:5]


# =========================================================
# SEARCH ADZUNA
# =========================================================

def search_adzuna(
    query: str,
    location: str,
    results_per_page: int = 20,
):

    url = (
        "https://api.adzuna.com/v1/api/jobs/in/search/1"
    )

    params = {
        "app_id": ADZUNA_APP_ID,
        "app_key": ADZUNA_APP_KEY,
        "results_per_page": results_per_page,
        "what": query,
        "where": location,
        "content-type": "application/json",
        "sort_by": "date",
    }

    try:

        response = requests.get(
            url,
            params=params,
            timeout=15,
        )

        if response.status_code != 200:

            print(
                "Adzuna error:",
                response.status_code,
                response.text[:500],
            )

            return {
                "results": []
            }

        return response.json()

    except requests.RequestException as e:

        print(
            f"Adzuna request failed for '{query}':",
            str(e),
        )

        return {
            "results": []
        }

    except Exception as e:

        print(
            f"Unexpected Adzuna error for '{query}':",
            str(e),
        )

        return {
            "results": []
        }


# =========================================================
# CALCULATE MATCH SCORE
# =========================================================

def calculate_skill_match(
    job: dict,
    skills: list[str],
    domain: str,
):

    title = str(
        job.get("title", "")
    ).lower()

    description = str(
        job.get("description", "")
    ).lower()

    company = str(
        job.get("company", "")
    ).lower()

    location = str(
        job.get("location", "")
    ).lower()

    full_text = (
        f"{title} "
        f"{description} "
        f"{company} "
        f"{location}"
    )

    clean_skill_list = clean_skills(skills)

    matched_skills = []

    # =====================================================
    # SKILL MATCH
    # =====================================================

    for skill in clean_skill_list:

        skill_text = skill.lower().strip()

        if not skill_text:
            continue

        if skill_text in full_text:

            matched_skills.append(skill)

    if clean_skill_list:

        skill_score = (
            len(matched_skills)
            / len(clean_skill_list)
        ) * 100

    else:

        skill_score = 0

    # =====================================================
    # DOMAIN MATCH
    # =====================================================

    domain_score = 0

    if domain:

        domain_words = [
            word.lower()
            for word in re.findall(
                r"[A-Za-z0-9+#.]+",
                domain,
            )
            if len(word) > 2
        ]

        if domain_words:

            domain_matches = sum(
                1
                for word in domain_words
                if word in full_text
            )

            domain_score = (
                domain_matches
                / len(domain_words)
            ) * 100

    # =====================================================
    # FINAL SCORE
    # =====================================================

    if clean_skill_list and domain:

        final_score = (
            skill_score * 0.70
            +
            domain_score * 0.30
        )

    elif clean_skill_list:

        final_score = skill_score

    elif domain:

        final_score = domain_score

    else:

        final_score = 50

    final_score = round(
        min(
            100,
            max(
                0,
                final_score,
            ),
        )
    )

    return (
        final_score,
        matched_skills,
    )


# =========================================================
# NORMALIZE JOB
# =========================================================

def normalize_job(
    job: dict,
    skills: list[str],
    domain: str,
):

    title = job.get(
        "title",
        "Job Opportunity",
    )

    # =====================================================
    # COMPANY
    # =====================================================

    company_data = (
        job.get("company")
        or {}
    )

    if isinstance(company_data, dict):

        company = company_data.get(
            "display_name",
            "Company",
        )

    else:

        company = str(company_data)

    # =====================================================
    # LOCATION
    # =====================================================

    location_data = (
        job.get("location")
        or {}
    )

    if isinstance(location_data, dict):

        location = location_data.get(
            "display_name",
            "India",
        )

    else:

        location = str(location_data)

    # =====================================================
    # DESCRIPTION
    # =====================================================

    description = clean_html(
        job.get(
            "description",
            "",
        )
    )

    # =====================================================
    # ADZUNA URL
    # =====================================================

    job_url = (
        job.get(
            "redirect_url",
            "",
        )
        or ""
    ).strip()

    # =====================================================
    # MATCH SCORE
    # =====================================================

    match_score, matched_skills = (
        calculate_skill_match(
            {
                "title": title,
                "description": description,
                "company": company,
                "location": location,
            },
            skills,
            domain,
        )
    )

    # =====================================================
    # SALARY
    # =====================================================

    salary_min = job.get("salary_min")
    salary_max = job.get("salary_max")

    salary = ""

    if salary_min and salary_max:

        salary = (
            f"{salary_min} - {salary_max}"
        )

    elif salary_min:

        salary = f"From {salary_min}"

    elif salary_max:

        salary = f"Up to {salary_max}"

    # =====================================================
    # RETURN
    # =====================================================

    return {

        "id": str(
            job.get(
                "id",
                "",
            )
        ),

        "title": title,

        "company": company,

        "location": location,

        "description": description[:1000],

        "salary": salary,

        "url": job_url,

        "adzuna_url": job_url,

        "source": "Adzuna",

        "created": job.get(
            "created",
            "",
        ),

        "contract_type": job.get(
            "contract_type",
            "",
        ),

        "contract_time": job.get(
            "contract_time",
            "",
        ),

        "matched_skills": matched_skills,

        "match_score": match_score,
    }


# =========================================================
# REMOVE DUPLICATES
# =========================================================

def remove_duplicate_jobs(
    jobs: list[dict],
):

    unique_jobs = []
    seen = set()

    for job in jobs:

        title = str(
            job.get(
                "title",
                "",
            )
        ).strip().lower()

        company = str(
            job.get(
                "company",
                "",
            )
        ).strip().lower()

        url = str(
            job.get(
                "url",
                "",
            )
        ).strip().lower()

        unique_key = (
            url
            if url
            else f"{title}|{company}"
        )

        if unique_key in seen:
            continue

        seen.add(unique_key)

        unique_jobs.append(job)

    return unique_jobs


# =========================================================
# CHECK EXTERNAL URL
# =========================================================

def is_external_job_url(
    url: str,
) -> bool:

    if not url:
        return False

    try:

        parsed = urlparse(url)

        hostname = (
            parsed.netloc.lower()
        )

        if not hostname:
            return False

        blocked_domains = [
            "adzuna",
            "google.com",
            "google.co.in",
            "bing.com",
            "yahoo.com",
        ]

        return not any(
            blocked in hostname
            for blocked in blocked_domains
        )

    except Exception:

        return False


# =========================================================
# CHECK THAT A URL IS A WEB PAGE, NOT A SCRIPT / ASSET
# =========================================================

def is_safe_job_page_url(
    url: str,
) -> bool:

    if not is_external_job_url(url):
        return False

    try:
        parsed = urlparse(url)
        path = (parsed.path or "").lower()
        hostname = (parsed.netloc or "").lower()

        blocked_extensions = (
            ".js", ".css", ".json", ".xml", ".jpg", ".jpeg",
            ".png", ".gif", ".svg", ".webp", ".ico", ".pdf",
        )

        blocked_hosts = (
            "cdnjs.", "cdn.", "static.", "assets.", "googletagmanager",
            "google-analytics", "doubleclick", "labjs", "w3.org", "schema.org",
        )

        return (
            parsed.scheme in ("http", "https")
            and not path.endswith(blocked_extensions)
            and not any(item in hostname for item in blocked_hosts)
        )

    except Exception:
        return False


# =========================================================
# NORMALIZE EXTERNAL URL
# =========================================================

def normalize_external_url(
    href: str,
    base_url: str,
):

    if not href:
        return ""

    href = href.strip()

    if href.lower().startswith(
        "javascript:"
    ):
        return ""

    if href.startswith("//"):

        href = "https:" + href

    elif href.startswith("/"):

        href = urljoin(
            base_url,
            href,
        )

    elif not (
        href.startswith("http://")
        or href.startswith("https://")
    ):

        href = urljoin(
            base_url,
            href,
        )

    return href.strip()


# =========================================================
# FIND DIRECT APPLICATION URL
# =========================================================

def extract_direct_application_url(
    url: str,
):

    if not url:
        return None

    # =====================================================
    # IF ALREADY EXTERNAL
    # =====================================================

    if not is_adzuna_url(url):

        return url if is_safe_job_page_url(url) else None

    try:

        response = requests.get(
            url,
            headers=BROWSER_HEADERS,
            allow_redirects=True,
            timeout=15,
        )

        print(
            "Resolve status:",
            response.status_code,
        )

        print(
            "Original URL:",
            url,
        )

        print(
            "Final URL:",
            response.url,
        )

        # =================================================
        # FIRST TRY HTTP REDIRECT
        # =================================================

        final_url = (
            response.url or ""
        ).strip()

        content_type = response.headers.get(
            "content-type",
            "",
        ).lower()

        if (
            final_url
            and "text/html" in content_type
            and is_safe_job_page_url(final_url)
        ):

            print(
                "DIRECT JOB URL:",
                final_url,
            )

            return final_url

        # =================================================
        # PARSE HTML
        # =================================================

        html = response.text or ""

        soup = BeautifulSoup(
            html,
            "html.parser",
        )

        # =================================================
        # CANONICAL URL
        # =================================================

        canonical = soup.find(
            "link",
            rel=lambda value:
                value
                and "canonical" in value,
        )

        if canonical:

            canonical_url = (
                canonical.get(
                    "href",
                    "",
                )
            )

            canonical_url = (
                normalize_external_url(
                    canonical_url,
                    response.url,
                )
            )

            if is_safe_job_page_url(
                canonical_url
            ):

                print(
                    "CANONICAL URL:",
                    canonical_url,
                )

                return canonical_url

        # =================================================
        # META REFRESH
        # =================================================

        meta_refresh = soup.find(
            "meta",
            attrs={
                "http-equiv": re.compile(
                    r"refresh",
                    re.I,
                )
            },
        )

        if meta_refresh:

            content = (
                meta_refresh.get(
                    "content",
                    "",
                )
            )

            match = re.search(
                r"url\s*=\s*(.+)",
                content,
                re.I,
            )

            if match:

                meta_url = (
                    match.group(1)
                    .strip()
                    .strip("'")
                    .strip('"')
                )

                meta_url = (
                    normalize_external_url(
                        meta_url,
                        response.url,
                    )
                )

                if is_safe_job_page_url(
                    meta_url
                ):

                    print(
                        "META URL:",
                        meta_url,
                    )

                    return meta_url

        # =================================================
        # FIND APPLY BUTTON/LINK
        # =================================================

        priority_links = []
        normal_links = []

        for link in soup.find_all(
            "a",
            href=True,
        ):

            href = (
                link.get(
                    "href",
                    "",
                )
                .strip()
            )

            if not href:
                continue

            text = (
                link.get_text(
                    " ",
                    strip=True,
                ).lower()
            )

            aria = (
                link.get(
                    "aria-label",
                    "",
                )
                or ""
            ).lower()

            class_text = " ".join(
                link.get(
                    "class",
                    [],
                )
            ).lower()

            combined_text = (
                f"{text} "
                f"{aria} "
                f"{class_text} "
                f"{href.lower()}"
            )

            external_url = (
                normalize_external_url(
                    href,
                    response.url,
                )
            )

            if not is_safe_job_page_url(
                external_url
            ):
                continue

            # =================================================
            # APPLY LINKS FIRST
            # =================================================

            if any(
                word in combined_text
                for word in [
                    "apply now",
                    "apply",
                    "application",
                    "career",
                    "careers",
                    "job application",
                ]
            ):

                priority_links.append(
                    external_url
                )

            else:

                normal_links.append(
                    external_url
                )

        # =================================================
        # RETURN APPLY LINK
        # =================================================

        if priority_links:

            print(
                "APPLY LINK:",
                priority_links[0],
            )

            return priority_links[0]

        return None

    except Exception as e:

        print(
            "URL extraction failed:",
            str(e),
        )

        return None


# =========================================================
# SEARCH ONE QUERY
# =========================================================

def search_one_query(
    query: str,
    location: str,
    skills: list[str],
    domain: str,
):

    try:

        data = search_adzuna(
            query=query,
            location=location,
            results_per_page=20,
        )

        raw_jobs = data.get(
            "results",
            [],
        )

        print(
            f"Query: {query} | "
            f"Results: {len(raw_jobs)}"
        )

        normalized_jobs = []

        for raw_job in raw_jobs:

            try:

                normalized = normalize_job(
                    raw_job,
                    skills,
                    domain,
                )

                normalized_jobs.append(
                    normalized
                )

            except Exception as e:

                print(
                    "Job normalize error:",
                    str(e),
                )

        return normalized_jobs

    except Exception as e:

        print(
            f"Query failed: {query} | {e}"
        )

        return []


# =========================================================
# RECOMMEND JOBS / INTERNSHIPS
# =========================================================

@router.post("/recommend")
def recommend_jobs(
    request: JobRecommendationRequest,
):

    # =====================================================
    # CHECK API CREDENTIALS
    # =====================================================

    if (
        not ADZUNA_APP_ID
        or not ADZUNA_APP_KEY
    ):

        raise HTTPException(
            status_code=500,
            detail=(
                "Adzuna API credentials are missing."
            ),
        )

    # =====================================================
    # ATS
    # =====================================================

    score = float(
        request.ats_score or 0
    )

    # =====================================================
    # INPUT
    # =====================================================

    skills = clean_skills(
        request.skills
    )

    domain = (
        request.domain or ""
    ).strip()

    location = (
        request.location
        or "India"
    ).strip()

    # =====================================================
    # QUERIES
    # =====================================================

    queries = build_search_queries(
        skills=skills,
        domain=domain,
        ats_score=score,
    )

    print(
        "\n======================================"
    )

    print("ATS SCORE:", score)
    print("DOMAIN:", domain)
    print("SKILLS:", skills)
    print("LOCATION:", location)
    print("QUERIES:", queries)

    print(
        "======================================\n"
    )

    # =====================================================
    # PARALLEL SEARCH
    # =====================================================

    all_jobs = []

    max_workers = min(
        len(queries),
        5,
    )

    if max_workers > 0:

        with ThreadPoolExecutor(
            max_workers=max_workers
        ) as executor:

            future_map = {
                executor.submit(
                    search_one_query,
                    query,
                    location,
                    skills,
                    domain,
                ): query
                for query in queries
            }

            for future in as_completed(
                future_map
            ):

                query = future_map[
                    future
                ]

                try:

                    results = (
                        future.result()
                    )

                    all_jobs.extend(
                        results
                    )

                except Exception as e:

                    print(
                        f"Parallel query error "
                        f"{query}: {e}"
                    )

    # =====================================================
    # REMOVE DUPLICATES
    # =====================================================

    all_jobs = remove_duplicate_jobs(
        all_jobs
    )

    # =====================================================
    # SEPARATE JOBS / INTERNSHIPS
    # =====================================================

    jobs = []
    internships = []

    for job in all_jobs:

        title = job.get(
            "title",
            "",
        )

        if is_internship_title(title):

            internships.append(job)

        else:

            jobs.append(job)

    # =====================================================
    # SORT
    # =====================================================

    jobs.sort(
        key=lambda item:
            float(
                item.get(
                    "match_score",
                    0,
                )
            ),
        reverse=True,
    )

    internships.sort(
        key=lambda item:
            float(
                item.get(
                    "match_score",
                    0,
                )
            ),
        reverse=True,
    )

    # =====================================================
    # LIMIT
    # =====================================================

    jobs = jobs[:50]
    internships = internships[:50]

    # =====================================================
    # ATS >= 70 -> ONLY JOBS
    # =====================================================

    if score >= 70:

        print(
            f"FINAL JOBS: {len(jobs)}"
        )

        return {
            "success": True,
            "ats_score": score,
            "domain": domain,
            "skills": skills,
            "queries": queries,
            "jobs": jobs,
            "internships": [],
            "total_jobs": len(jobs),
            "total_internships": 0,
        }

    # =====================================================
    # ATS < 70 -> ONLY INTERNSHIPS
    # =====================================================

    print(
        f"FINAL INTERNSHIPS: "
        f"{len(internships)}"
    )

    return {
        "success": True,
        "ats_score": score,
        "domain": domain,
        "skills": skills,
        "queries": queries,
        "jobs": [],
        "internships": internships,
        "total_jobs": 0,
        "total_internships": len(internships),
    }


# =========================================================
# RESOLVE DIRECT APPLICATION URL
#
# Apply Now click ->
# Adzuna URL -> actual company/job URL
# =========================================================

@router.post("/resolve-url")
def resolve_job_url(
    request: JobURLRequest,
):

    if not request.url:

        raise HTTPException(
            status_code=400,
            detail="Job URL is required",
        )

    url = request.url.strip()

    # =====================================================
    # ALREADY DIRECT URL
    # =====================================================

    if not is_adzuna_url(url) and is_safe_job_page_url(url):

        return {
            "success": True,
            "original_url": url,
            "is_adzuna_url": False,
            "direct_url": url,
            "source": detect_source(url),
        }

    # =====================================================
    # EXTRACT DIRECT URL
    # =====================================================

    direct_url = (
        extract_direct_application_url(
            url
        )
    )

    # =====================================================
    # DIRECT URL FOUND
    # =====================================================

    if direct_url:

        return {
            "success": True,
            "original_url": url,
            "direct_url": direct_url,
            "is_adzuna_url": False,
            "source": detect_source(
                direct_url
            ),
        }

    # =====================================================
    # NO DIRECT URL FOUND
    # =====================================================

    return {
        "success": False,
        "original_url": url,
        "direct_url": None,
        "is_adzuna_url": True,
        "source": "Adzuna",
        "message": (
            "Direct company application URL "
            "could not be extracted from this job."
        ),
    }


# =========================================================
# HEALTH CHECK
# =========================================================

@router.get("/health")
def jobs_health():

    return {
        "success": True,
        "message": "Jobs API is running",
        "adzuna_configured": bool(
            ADZUNA_APP_ID
            and ADZUNA_APP_KEY
        ),
    }
