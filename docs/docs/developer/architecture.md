# Architecture

## Component overview

```
┌─────────────────────────────────────────────────────────┐
│  Browser                                                │
│  React SPA (Vite, Zustand, Tailwind)  :3000             │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP + session cookie (same-origin)
┌────────────────────▼────────────────────────────────────┐
│  FastAPI backend                       :8000             │
│  ├── /auth/*   OAuth2 login/callback/me/logout          │
│  └── /deposit/* create / upload / status / publish      │
└────────────────────┬────────────────────────────────────┘
                     │ HTTPS (httpx async)
┌────────────────────▼────────────────────────────────────┐
│  Zenodo API                                             │
│  sandbox.zenodo.org/api  (or zenodo.org/api)            │
└─────────────────────────────────────────────────────────┘
```

---

## OAuth 2.0 login flow

```
Browser          Backend           Zenodo
  │──── GET /auth/login ────►│
  │                          │── redirect ──────────────►│
  │◄────── 302 ──────────────│                           │
  │                          │                           │
  │  (user logs in at Zenodo and clicks Authorize)        │
  │                          │                           │
  │◄────────────────────── ?code=…&state=… ─────────────│
  │──── GET /auth/callback?code=…&state=… ──►│           │
  │                          │── POST /oauth/token ─────►│
  │                          │◄──── access_token ────────│
  │                          │  store token in session   │
  │◄──── 302 → /?auth=success│
```

The access token is stored **only in the server-side session cookie** (signed
with `SECRET_KEY`). It is never sent to the browser or logged.

---

## Deposit lifecycle

```
POST /deposit/create
  → Zenodo: POST /api/deposit/depositions
  ← returns { id, bucket_url, doi }

POST /deposit/{id}/upload   (one call per file)
  → reads file from multipart body into memory
  → Zenodo: PUT {bucket_url}/{filename}
  ← { filename, size, status }

GET /deposit/{id}/status
  → Zenodo: GET /api/deposit/depositions/{id}
  ← { state, files[], doi, … }

POST /deposit/{id}/publish
  → Zenodo: POST /api/deposit/depositions/{id}/actions/publish
  ← { doi, doi_url, html_url }
```

---

## State management (frontend)

All wizard state lives in a single **Zustand store** (`src/lib/store.js`).
There is no local-storage persistence — refreshing the page resets the wizard.
This is intentional: it prevents stale deposit IDs from accumulating.

---

## Security notes

| Concern | Mitigation |
|---------|-----------|
| CSRF | `SameSite=lax` session cookie; state param in OAuth |
| Token leakage | Token stored server-side only in signed cookie |
| Data persistence | No database; no file writes; `/tmp` only for OS temp |
| XSS | React escapes all output; no `dangerouslySetInnerHTML` |
| CORS | Only `FRONTEND_URL` is whitelisted |
