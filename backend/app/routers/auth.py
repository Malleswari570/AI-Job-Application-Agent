from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from authlib.integrations.starlette_client import OAuth
from starlette.requests import Request


from app.database import get_db
from app.models import User
from app.schemas import SignupRequest, LoginRequest


from app.auth import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token
)


from app.config import (
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
)


# =========================================================
# ROUTER
# =========================================================

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# =========================================================
# GOOGLE OAUTH CONFIG
# =========================================================

oauth = OAuth()


oauth.register(
    name="google",

    client_id=GOOGLE_CLIENT_ID,

    client_secret=GOOGLE_CLIENT_SECRET,

    server_metadata_url=(
        "https://accounts.google.com/"
        ".well-known/openid-configuration"
    ),

    client_kwargs={
        "scope": "openid email profile"
    }
)


# =========================================================
# SIGNUP
# =========================================================

@router.post("/signup")
def signup(
    user_data: SignupRequest,
    db: Session = Depends(get_db)
):

    # -----------------------------------------------------
    # Check existing email
    # -----------------------------------------------------

    existing_user = db.query(User).filter(
        User.email == user_data.email
    ).first()


    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )


    # -----------------------------------------------------
    # Create new user
    # -----------------------------------------------------

    new_user = User(

        name=user_data.name,

        email=user_data.email,

        password=hash_password(
            user_data.password
        )
    )


    db.add(new_user)

    db.commit()

    db.refresh(new_user)


    # -----------------------------------------------------
    # Response
    # -----------------------------------------------------

    return {

        "message":
            "User registered successfully",

        "user_id":
            new_user.id,

        "name":
            new_user.name,

        "email":
            new_user.email
    }


# =========================================================
# LOGIN
# =========================================================

@router.post("/login")
def login(
    user_data: LoginRequest,
    db: Session = Depends(get_db)
):

    # -----------------------------------------------------
    # Find user by email
    # -----------------------------------------------------

    user = db.query(User).filter(
        User.email == user_data.email
    ).first()


    if not user:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )


    # -----------------------------------------------------
    # Verify password
    # -----------------------------------------------------

    if not verify_password(
        user_data.password,
        user.password
    ):

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )


    # -----------------------------------------------------
    # Create JWT
    # -----------------------------------------------------

    token = create_access_token({

        "user_id":
            user.id,

        "email":
            user.email
    })


    # -----------------------------------------------------
    # Return user + token
    # -----------------------------------------------------

    return {

        "message":
            "Login successful",

        "access_token":
            token,

        "token_type":
            "bearer",

        "user": {

            "id":
                user.id,

            "name":
                user.name,

            "email":
                user.email
        }
    }


# =========================================================
# CURRENT LOGGED-IN USER
# =========================================================

@router.get("/me")
def get_current_user(
    request: Request,
    db: Session = Depends(get_db)
):

    # -----------------------------------------------------
    # Get Authorization header
    # -----------------------------------------------------

    authorization = request.headers.get(
        "Authorization"
    )


    if not authorization:

        raise HTTPException(
            status_code=401,
            detail="Authorization token missing"
        )


    # -----------------------------------------------------
    # Check Bearer
    # -----------------------------------------------------

    if not authorization.startswith(
        "Bearer "
    ):

        raise HTTPException(
            status_code=401,
            detail="Invalid authorization format"
        )


    # -----------------------------------------------------
    # Extract token
    # -----------------------------------------------------

    token = authorization.replace(
        "Bearer ",
        "",
        1
    ).strip()


    # -----------------------------------------------------
    # Decode token
    # -----------------------------------------------------

    payload = decode_access_token(
        token
    )


    if not payload:

        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )


    # -----------------------------------------------------
    # Get user ID
    # -----------------------------------------------------

    user_id = payload.get(
        "user_id"
    )


    if not user_id:

        raise HTTPException(
            status_code=401,
            detail="User ID not found in token"
        )


    # -----------------------------------------------------
    # Find user
    # -----------------------------------------------------

    user = db.query(User).filter(
        User.id == user_id
    ).first()


    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )


    # -----------------------------------------------------
    # Return actual user
    # -----------------------------------------------------

    return {

        "id":
            user.id,

        "name":
            user.name,

        "email":
            user.email
    }


# =========================================================
# GOOGLE LOGIN
# =========================================================

@router.get("/google/login")
async def google_login(
    request: Request
):

    redirect_uri = (
        GOOGLE_REDIRECT_URI
    )


    return await oauth.google.authorize_redirect(
        request,
        redirect_uri
    )


# =========================================================
# GOOGLE CALLBACK
# =========================================================

@router.get("/google/callback")
async def google_callback(
    request: Request,
    db: Session = Depends(get_db)
):

    # -----------------------------------------------------
    # Get Google token
    # -----------------------------------------------------

    token = await oauth.google.authorize_access_token(
        request
    )


    # -----------------------------------------------------
    # Get Google user info
    # -----------------------------------------------------

    user_info = token.get(
        "userinfo"
    )


    if not user_info:

        raise HTTPException(
            status_code=400,
            detail="Google authentication failed"
        )


    # -----------------------------------------------------
    # Google email
    # -----------------------------------------------------

    email = user_info.get(
        "email"
    )


    if not email:

        raise HTTPException(
            status_code=400,
            detail="Google email not available"
        )


    # -----------------------------------------------------
    # Google name
    # -----------------------------------------------------

    name = user_info.get(
        "name",
        "Google User"
    )


    # -----------------------------------------------------
    # Check existing user
    # -----------------------------------------------------

    user = db.query(User).filter(
        User.email == email
    ).first()


    # -----------------------------------------------------
    # Create Google user
    # -----------------------------------------------------

    if not user:

        user = User(

            name=name,

            email=email,

            password="GOOGLE_AUTH"
        )


        db.add(user)

        db.commit()

        db.refresh(user)


    # -----------------------------------------------------
    # Create JWT
    # -----------------------------------------------------

    access_token = create_access_token({

        "user_id":
            user.id,

        "email":
            user.email
    })


    # -----------------------------------------------------
    # Redirect frontend
    # -----------------------------------------------------

    frontend_url = (

        "http://localhost:5173"

        f"/dashboard?token={access_token}"
    )


    return RedirectResponse(
        url=frontend_url
    )