# NFDI-MatWerk Zenodo Uploader

> A guided, browser-based upload wizard for publishing research datasets to the
> [nfdi-matwerk](https://zenodo.org/communities/nfdi-matwerk) Zenodo community.

![CI](https://github.com/ebrahimnorouzi/nfdi-matwerk-zenodo-uploader/actions/workflows/ci.yml/badge.svg)
![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg)
![Docker](https://img.shields.io/badge/Docker-ready-blue)
![Zenodo](https://img.shields.io/badge/Zenodo-sandbox%20%2F%20production-orange)

---

## ✨ Features

- 🔐 **Zenodo OAuth login** — sign in with your existing Zenodo account, no separate registration
- 🧙 **5-step guided wizard** — title, description, creators (with ORCID), keywords, license, files
- 📦 **Up to 100 files / 50 GB** per deposit (Zenodo limits)
- ⚡ **Real-time upload progress** per file, with retry on failure
- 🏷️ **Reserved DOI** assigned before publish — cite it in papers immediately
- 🌍 **Auto-submitted** to the `nfdi-matwerk` Zenodo community
- 🚫 **Zero data storage** — files stream directly to Zenodo, nothing persists on the server
- 📖 **Full MkDocs documentation** served alongside the app
- 🐳 **One-command Docker Compose** setup — fully reproducible

---

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/ebrahimnorouzi/nfdi-matwerk-zenodo-uploader
cd nfdi-matwerk-zenodo-uploader
```

### 2. Register a Zenodo OAuth application

Go to [sandbox.zenodo.org](https://sandbox.zenodo.org) → Account → Settings → Applications → **New application**

| Field | Value |
|-------|-------|
| Name | MatWerk Zenodo Uploader |
| Website URL | `http://localhost:3000` |
| Redirect URI | `http://localhost:8000/auth/callback` |
| Grant type | Authorization code |

Copy the **Client ID** and **Client Secret**.

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
ZENODO_CLIENT_ID=your_client_id_here
ZENODO_CLIENT_SECRET=your_client_secret_here
ZENODO_BASE_URL=https://sandbox.zenodo.org
SECRET_KEY=change-this-to-a-random-string
FRONTEND_URL=http://localhost:3000
```

### 4. Start everything

```bash
docker compose up -d
```

| Service | URL |
|---------|-----|
| 🖥️ Frontend | http://localhost:3000 |
| ⚙️ Backend API | http://localhost:8000 |
| 📖 Docs | http://localhost:8080 |
| 🔬 Swagger UI | http://localhost:8000/api/docs |

---

## 🗺️ Upload Wizard Steps

```
Step 1 — Basic Info        Title + description
Step 2 — Creators          Names, affiliations, ORCIDs (multiple authors)
Step 3 — Details           Upload type, date, license, keywords
Step 4 — Upload Files      Drag & drop, per-file progress, 100 files / 50 GB
Step 5 — Review & Publish  Summary, reserved DOI preview, one-click publish
```

---

## 🏗️ Architecture

```
Browser  ──►  React/Vite SPA  (port 3000)
                   │  REST + session cookie
                   ▼
             FastAPI backend  (port 8000)
                   │  HTTPS / httpx async
                   ▼
             Zenodo API  (sandbox.zenodo.org or zenodo.org)

             MkDocs docs      (port 8080)  — static, no backend needed
```

All file bytes pass through the backend **in memory only** and are forwarded
straight to Zenodo's S3-backed storage. Nothing is written to disk.

### Auth flow (OAuth 2.0 Authorization Code)

```
Browser → GET /auth/login
        → redirect to Zenodo consent page
        → user authorises
        → Zenodo redirects to /auth/callback?code=…
        → backend exchanges code for token
        → token stored in signed session cookie
        → redirect to frontend /?auth=success
```

---

## 🐳 Docker services

| Service | Base image | Exposed port |
|---------|-----------|--------------|
| `backend` | `python:3.12-slim` | 8000 |
| `frontend` | `node:20-alpine` → `nginx:alpine` | 3000 |
| `docs` | `python:3.12-slim` (mkdocs-material) | 8080 |

---

## 🔧 Development (without Docker)

**Backend**

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend**

```bash
cd frontend
npm install
npm run dev          # Vite dev server on :3000, proxies /auth and /deposit to :8000
```

**Docs**

```bash
cd docs
pip install mkdocs-material mkdocs-minify-plugin
mkdocs serve
```

---

## 🌐 Production deployment

1. Set `ZENODO_BASE_URL=https://zenodo.org` (remove sandbox)
2. Register a **production** Zenodo OAuth app with your real domain
3. Set `FRONTEND_URL=https://your-domain.example.com`
4. Generate a strong `SECRET_KEY`: `openssl rand -hex 32`
5. Add HTTPS (Caddy or nginx reverse proxy recommended)
6. In `backend/app/main.py` set `https_only=True` for the session middleware

See [Deployment docs](http://localhost:8080/developer/deployment/) for full details.

---

## 📁 Repository structure

```
nfdi-matwerk-zenodo-uploader/
├── backend/
│   ├── app/
│   │   ├── api/         auth.py, deposit.py
│   │   ├── core/        config.py (pydantic-settings)
│   │   └── models/      deposit.py (Pydantic schemas)
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/  Layout, StepIndicator, steps/Step1…5
│   │   ├── pages/       LandingPage, UploadWizard
│   │   └── lib/         store.js (Zustand), api.js (axios)
│   ├── Dockerfile
│   ├── vite.config.js
│   └── tailwind.config.js
├── docs/
│   ├── docs/            Markdown source pages
│   └── mkdocs.yml       Material theme config
├── .github/
│   └── workflows/       ci.yml (lint + docker build)
├── docker-compose.yml
├── .env.example
├── .gitignore
├── LICENSE              MIT
└── CONTRIBUTING.md
```

---

## 🤝 Contributing

Pull requests are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📄 License

MIT — see [LICENSE](LICENSE).

---

## 🔗 Links

- [NFDI-MatWerk](https://nfdi-matwerk.de)
- [MatWerk Zenodo Community](https://zenodo.org/communities/nfdi-matwerk)
- [Zenodo sandbox](https://sandbox.zenodo.org)
- [Zenodo REST API docs](https://developers.zenodo.org)
