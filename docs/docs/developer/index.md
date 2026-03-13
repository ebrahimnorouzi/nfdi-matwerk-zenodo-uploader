# Developer Guide

This section covers everything you need to deploy, configure, and extend
the NFDI-MatWerk Zenodo Uploader.

## Prerequisites

| Tool | Minimum version |
|------|----------------|
| Docker | 24.x |
| Docker Compose | v2.x (`docker compose`) |
| A Zenodo account | sandbox or production |

## Repository layout

```
nfdi-matwerk-zenodo-uploader/
├── backend/                  # FastAPI application
│   ├── app/
│   │   ├── api/              # Route handlers (auth, deposit)
│   │   ├── core/             # Settings (pydantic-settings)
│   │   └── models/           # Pydantic request/response models
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/                 # React + Vite SPA
│   ├── src/
│   │   ├── components/       # Layout, StepIndicator, step forms
│   │   ├── pages/            # LandingPage, UploadWizard
│   │   └── lib/              # Zustand store, axios API client
│   ├── Dockerfile
│   └── vite.config.js
├── docs/                     # MkDocs-Material documentation
│   ├── docs/                 # Markdown source files
│   └── mkdocs.yml
├── docker-compose.yml
└── .env.example
```

Continue reading:

- [Architecture](architecture.md) — data flow, auth flow, sequence diagrams
- [Deployment](deployment.md) — production checklist, HTTPS, reverse proxy
- [OAuth Setup](oauth-setup.md) — registering a Zenodo OAuth application
