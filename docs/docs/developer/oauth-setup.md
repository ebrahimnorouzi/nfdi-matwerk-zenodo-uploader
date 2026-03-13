# Zenodo OAuth Application Setup

You must register an OAuth application with Zenodo before running the uploader.
The steps are the same for sandbox and production — just use the correct domain.

## Sandbox (for development)

1. Log in at [sandbox.zenodo.org](https://sandbox.zenodo.org)
2. Go to **Account → Settings → Applications → Developer applications**
3. Click **New application**
4. Fill in:

   | Field | Value |
   |-------|-------|
   | **Name** | `MatWerk Zenodo Uploader (dev)` |
   | **Website URL** | `http://localhost:3000` |
   | **Redirect URIs** | `http://localhost:8000/auth/callback` |
   | **Allowed grant types** | ✅ Authorization code |

5. Click **Save**. Copy the **Client ID** and **Client Secret**.
6. Paste them into your `.env`:

```env
ZENODO_CLIENT_ID=your_client_id
ZENODO_CLIENT_SECRET=your_client_secret
ZENODO_BASE_URL=https://sandbox.zenodo.org
```

## Production

Repeat the steps above at [zenodo.org](https://zenodo.org), replacing localhost
with your actual domain:

```env
ZENODO_CLIENT_ID=prod_client_id
ZENODO_CLIENT_SECRET=prod_client_secret
ZENODO_BASE_URL=https://zenodo.org
FRONTEND_URL=https://your-domain.example.com
```

Also update `oauth_redirect_uri` in `backend/app/core/config.py` (or add it
as an env var) to match your production callback URL:

```
https://your-domain.example.com/auth/callback
```

!!! warning "Keep secrets secret"
    Never commit `ZENODO_CLIENT_SECRET` or `SECRET_KEY` to version control.
    Use Docker secrets, GitHub Actions secrets, or a secrets manager in production.
