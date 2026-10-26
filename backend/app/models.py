from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func

from .database import Base


# =========================
# USER MODEL
# =========================
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    email = Column(
        String,
        unique=True,
        index=True,
        nullable=False
    )

    password = Column(String, nullable=False)


# =========================
# APPLICATION MODEL
# =========================
class Application(Base):
    __tablename__ = "applications"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    title = Column(
        String,
        nullable=False
    )

    company = Column(
        String,
        nullable=False
    )

    location = Column(
        String,
        nullable=True
    )

    application_type = Column(
        String,
        nullable=False,
        default="Job"
    )

    url = Column(
        String,
        nullable=True
    )

    match_score = Column(
        Integer,
        nullable=True
    )

    status = Column(
        String,
        nullable=False,
        default="Applied"
    )

    applied_at = Column(
        DateTime,
        server_default=func.now()
    )