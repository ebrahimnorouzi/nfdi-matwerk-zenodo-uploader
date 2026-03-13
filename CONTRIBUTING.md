# Contributing

Thank you for your interest in contributing to the NFDI-MatWerk Zenodo Uploader!

## Getting started

```bash
git clone https://github.com/ebrahimnorouzi/nfdi-matwerk-zenodo-uploader
cd nfdi-matwerk-zenodo-uploader
cp .env.example .env     # add sandbox credentials
docker compose up -d
```

For frontend hot-reload during development:

```bash
cd frontend
npm install
npm run dev              # starts Vite dev server on :3000 with backend proxy
```

For backend hot-reload:

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Code style

- **Python**: `ruff` for linting, `mypy` for type checking. Run `ruff check backend/` before committing.
- **JavaScript**: no linter configured by default — consider adding `eslint` if the project grows.

## Pull request process

1. Fork the repository and create a feature branch from `main`.
2. Make your changes with clear, atomic commits.
3. Ensure `docker compose build` succeeds.
4. Open a PR with a description of what you changed and why.
5. A maintainer will review and merge.

## Reporting issues

Use the GitHub issue tracker. For security vulnerabilities, please email the maintainers directly rather than opening a public issue.
