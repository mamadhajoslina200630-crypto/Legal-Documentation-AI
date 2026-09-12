"""Pytest configuration and test database initialization."""

import pytest
from app.data.postgres.session import init_db


@pytest.fixture(autouse=True, scope="session")
def setup_test_db():
    """Initialize database tables before running tests."""
    init_db()
