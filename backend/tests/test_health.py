"""Test service health and route tree registration."""

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_root_health():
    """Verify global health endpoints return healthy status."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"

    api_resp = client.get("/api/health")
    assert api_resp.status_code == 200
    assert api_resp.json()["status"] == "healthy"


def test_v1_health():
    """Verify api/v1 sub-router health endpoint."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_auth_status():
    """Verify auth route status."""
    response = client.get("/api/v1/auth/status")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
