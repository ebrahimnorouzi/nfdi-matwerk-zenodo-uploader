# API Reference

The FastAPI backend auto-generates interactive API documentation.

## Interactive docs (Swagger UI)

When the backend is running, visit:

```
http://localhost:8000/api/docs
```

This gives you a live Swagger UI where you can try every endpoint directly in the browser.

## ReDoc

A read-only alternative is available at:

```
http://localhost:8000/api/redoc
```

---

## Endpoint summary

### Authentication

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/auth/login` | Redirect to Zenodo OAuth consent |
| `GET` | `/auth/callback` | Exchange code for token, set session |
| `GET` | `/auth/me` | Return `{ authenticated: bool }` |
| `POST` | `/auth/logout` | Clear session cookie |

### Deposits

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/deposit/create` | Create draft with reserved DOI |
| `POST` | `/deposit/{id}/upload` | Upload one file (multipart) |
| `GET` | `/deposit/{id}/status` | Get deposition state + file list |
| `POST` | `/deposit/{id}/publish` | Publish to MatWerk community |
| `DELETE` | `/deposit/{id}` | Discard a draft |

### Health

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Returns `{ status: "ok" }` |

---

## Authentication

All `/deposit/*` endpoints require an active session cookie (set by `/auth/callback`).
Requests without a valid session receive **HTTP 401**.

The session cookie is `HttpOnly`, `SameSite=lax`, and signed with `SECRET_KEY`.
It is never accessible from JavaScript.
