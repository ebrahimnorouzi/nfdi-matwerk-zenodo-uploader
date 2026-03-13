# NFDI-MatWerk Zenodo Uploader

A guided, browser-based upload wizard for publishing research datasets to the
[nfdi-matwerk](https://zenodo.org/communities/nfdi-matwerk) Zenodo community.

---

## What is this?

The **NFDI-MatWerk Zenodo Uploader** is a self-hosted web application that lets researchers:

1. **Sign in** with an existing Zenodo account (OAuth 2.0 — no separate password)
2. **Fill in metadata** through a 5-step wizard (title, creators, keywords, license …)
3. **Upload files** (up to 100 files / 50 GB per deposit) with real-time progress
4. **Publish** directly to the `nfdi-matwerk` Zenodo community with a reserved DOI

!!! info "Zero data storage"
    Uploaded files are streamed straight to Zenodo's API. Nothing is written to the
    server's disk — the application is completely stateless with respect to research data.

---

## Quick start

```bash
git clone https://github.com/ebrahimnorouzi/nfdi-matwerk-zenodo-uploader
cd nfdi-matwerk-zenodo-uploader
cp .env.example .env   # fill in ZENODO_CLIENT_ID + ZENODO_CLIENT_SECRET
docker compose up -d
```

| Service  | URL                       |
|----------|---------------------------|
| Frontend | http://localhost:3000     |
| Backend  | http://localhost:8000     |
| Docs     | http://localhost:8080     |
| API docs | http://localhost:8000/api/docs |

---

## Architecture overview

```
Browser  ──►  React/Vite (port 3000)
                   │
                   ▼ REST + session cookie
             FastAPI (port 8000)
                   │
                   ▼ HTTPS
             Zenodo API (sandbox.zenodo.org)
```

See [Architecture](developer/architecture.md) for full details.
