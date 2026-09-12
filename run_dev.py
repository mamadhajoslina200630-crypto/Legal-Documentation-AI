"""Unified local development runner for Legal AI Simplifier.

Launches both backend (FastAPI on http://localhost:8000) and
frontend (Vite on http://localhost:5173) with zero Docker dependencies.
"""

import os
import sys
import subprocess
import signal
import time
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = ROOT_DIR / "backend"
FRONTEND_DIR = ROOT_DIR / "frontend"


def get_backend_python():
    """Detect virtual environment Python executable."""
    windows_venv = BACKEND_DIR / ".venv" / "Scripts" / "python.exe"
    posix_venv = BACKEND_DIR / ".venv" / "bin" / "python"

    if windows_venv.exists():
        return str(windows_venv)
    elif posix_venv.exists():
        return str(posix_venv)
    return sys.executable


def get_npm_cmd():
    """Determine npm command based on OS."""
    return "npm.cmd" if os.name == "nt" else "npm"


def main():
    print("=" * 60)
    print("   LEGAL AI SIMPLIFIER - LOCAL DEVELOPMENT RUNNER")
    print("=" * 60)
    print("No Docker needed. Running natively with SQLite + FastAPI + React.")
    print("-" * 60)

    python_bin = get_backend_python()
    npm_bin = get_npm_cmd()

    # Step 1: Pre-initialize database
    print("[1/3] Checking database...")
    init_cmd = [python_bin, "-c", "from app.data.postgres.session import init_db; init_db()"]
    try:
        subprocess.run(init_cmd, cwd=str(BACKEND_DIR), check=True)
        print("      Database tables verified (SQLite: backend/legal_ai.db).")
    except Exception as e:
        print(f"      [Warning] DB check: {e}")

    # Step 2: Start Backend (Uvicorn)
    print("[2/3] Launching FastAPI Backend on http://localhost:8000 ...")
    backend_cmd = [
        python_bin,
        "-m",
        "uvicorn",
        "app.main:app",
        "--reload",
        "--port",
        "8000",
        "--host",
        "127.0.0.1",
    ]
    backend_proc = subprocess.Popen(
        backend_cmd,
        cwd=str(BACKEND_DIR),
        stdout=sys.stdout,
        stderr=sys.stderr,
    )

    # Step 3: Start Frontend (Vite)
    print("[3/3] Launching Vite Frontend on http://localhost:5173 ...")
    frontend_cmd = [npm_bin, "run", "dev", "--", "--port", "5173"]
    frontend_proc = subprocess.Popen(
        frontend_cmd,
        cwd=str(FRONTEND_DIR),
        stdout=sys.stdout,
        stderr=sys.stderr,
    )

    print("-" * 60)
    print("All services running:")
    print("  -> Frontend App:   http://localhost:5173")
    print("  -> Backend API:    http://localhost:8000")
    print("  -> Interactive API Docs: http://localhost:8000/docs")
    print("-" * 60)
    print("Press Ctrl+C to terminate both services.\n")

    def cleanup(signum=None, frame=None):
        print("\nStopping services...")
        try:
            backend_proc.terminate()
            frontend_proc.terminate()
            backend_proc.wait(timeout=3)
            frontend_proc.wait(timeout=3)
        except Exception:
            backend_proc.kill()
            frontend_proc.kill()
        print("All processes terminated. Goodbye!")
        sys.exit(0)

    signal.signal(signal.SIGINT, cleanup)
    if hasattr(signal, "SIGTERM"):
        signal.signal(signal.SIGTERM, cleanup)

    try:
        while True:
            time.sleep(1)
            if backend_proc.poll() is not None or frontend_proc.poll() is not None:
                cleanup()
    except KeyboardInterrupt:
        cleanup()


if __name__ == "__main__":
    main()
