"""PostgreSQL Database Session and Engine setup."""

from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from app.config import settings

# Engine setup with dialect-specific options
connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True if not settings.DATABASE_URL.startswith("sqlite") else False,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_session() -> Generator[Session, None, None]:
    """Yield a database session context."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    """Create all relational tables defined in the models package and seed initial dev entities."""
    from app.data.postgres.models.user import User
    from app.data.postgres.models.workspace import Workspace
    import app.data.postgres.models  # noqa: F401

    Base.metadata.create_all(bind=engine)

    # Seed default user and workspace for local development if not present
    with SessionLocal() as db:
        user = db.query(User).filter(User.id == "mock-user-id").first()
        if not user:
            user = User(
                id="mock-user-id",
                email="dev@legalai.local",
                hashed_password="local_development_hash",
                full_name="Legal AI Developer",
                is_active=True,
            )
            db.add(user)
            db.commit()

        workspace = db.query(Workspace).filter(Workspace.id == "default-workspace").first()
        if not workspace:
            workspace = Workspace(
                id="default-workspace",
                name="Default Workspace",
                owner_id="mock-user-id",
            )
            db.add(workspace)
            db.commit()
