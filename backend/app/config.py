import os
from dotenv import load_dotenv

# Load variables from .env
load_dotenv()


# =========================
# ADZUNA API
# =========================

ADZUNA_APP_ID = os.getenv(
    "ADZUNA_APP_ID"
)

ADZUNA_APP_KEY = os.getenv(
    "ADZUNA_APP_KEY"
)


# =========================
# GOOGLE OAUTH
# =========================

GOOGLE_CLIENT_ID = os.getenv(
    "GOOGLE_CLIENT_ID"
)

GOOGLE_CLIENT_SECRET = os.getenv(
    "GOOGLE_CLIENT_SECRET"
)

GOOGLE_REDIRECT_URI = (
    "http://127.0.0.1:8000/auth/google/callback"
)
