# Code style rules for this project

- Python: PEP 8, type hints on all function signatures, docstring on every public function
- FastAPI routes are thin: validate input, call a service function, return its result — no
  DB queries or AI calls directly in a route file
- One service = one subpackage under backend/app/services/; do not reach across service
  boundaries directly, go through the shared layers (data, ai_layer)
- Every new pipeline gets a Celery task wrapper in background/workers/tasks.py
- No hardcoded API keys, DB URLs, or secrets anywhere — read from config.py/.env only
- React: functional components + hooks only, one component per file, feature-local
  components live under features/<feature>/components/
- Add or update a test alongside any new service (backend/tests/test_<service>.py)
