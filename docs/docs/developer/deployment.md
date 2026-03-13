# Deployment

## Local development (one command)

```bash
cp .env.example .env    # fill in credentials
docker compose up -d
```

Services start at:

- Frontend → http://localhost:3000
- Backend  → http://localhost:8000
- Docs     → http://localhost:8080

## Production checklist

### 1. HTTPS

Wrap the services behind a reverse proxy (e.g. Caddy or nginx) that terminates TLS.

Example **Caddyfile**:

```
your-domain.example.com {
    reverse_proxy /auth/*     backend:8000
    reverse_proxy /deposit/*  backend:8000
    reverse_proxy /health     backend:8000
    reverse_proxy /api/*      backend:8000
    reverse_proxy             frontend:80
}

docs.your-domain.example.com {
    reverse_proxy docs:8080
}
```

### 2. Environment variables

```env
ZENODO_BASE_URL=https://zenodo.org        # production Zenodo
FRONTEND_URL=https://your-domain.example.com
SECRET_KEY=<openssl rand -hex 32>         # strong random key
```

### 3. Session cookie security

In `backend/app/main.py`, change `https_only=False` to `https_only=True`
once HTTPS is in place. This prevents the session cookie from being sent
over plain HTTP.

### 4. Disable sandbox banner

Remove or conditionally hide the sandbox banner in `frontend/src/components/Layout.jsx`
when `ZENODO_BASE_URL` points to production.

### 5. Resource limits (optional)

Add limits to `docker-compose.yml`:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 512M
```

## CI / CD

A GitHub Actions workflow is included at `.github/workflows/ci.yml`.
It runs on every push to `main` and:

1. Lints the Python backend (`ruff`)
2. Type-checks with `mypy`
3. Builds both Docker images to verify they compile

To deploy automatically, add a `deploy` job that pushes images to your registry
and SSH-restarts the compose stack on your server.
