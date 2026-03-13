"""
Zenodo OAuth2 authentication.
Token is stored server-side in the session. The session cookie is set on the
backend domain (:8000) and all API calls are proxied through Vite in dev,
or nginx in production, so the cookie is always same-origin.
"""

import secrets
from urllib.parse import urlencode

import httpx
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse, RedirectResponse

from app.core.config import settings

router = APIRouter()


@router.get("/debug")
async def debug_oauth():
    return {
        "zenodo_authorize_url": settings.zenodo_authorize_url,
        "oauth_redirect_uri":   settings.oauth_redirect_uri,
        "zenodo_base_url":      settings.zenodo_base_url,
        "client_id_set":        bool(settings.zenodo_client_id),
        "client_secret_set":    bool(settings.zenodo_client_secret),
    }


@router.get("/login")
async def login(request: Request):
    state = secrets.token_urlsafe(16)
    request.session["oauth_state"] = state
    params = {
        "client_id":     settings.zenodo_client_id,
        "redirect_uri":  settings.oauth_redirect_uri,
        "response_type": "code",
        "scope":         "deposit:write deposit:actions",
        "state":         state,
    }
    url = f"{settings.zenodo_authorize_url}?{urlencode(params)}"
    return RedirectResponse(url)


@router.get("/callback")
async def callback(request: Request, code: str, state: str):
    stored_state = request.session.get("oauth_state")
    print(f"[OAuth] state match: {state == stored_state}, session keys: {list(request.session.keys())}")

    if stored_state and stored_state != state:
        return JSONResponse({"error": "Invalid OAuth state"}, status_code=400)

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            settings.zenodo_token_url,
            data={
                "client_id":     settings.zenodo_client_id,
                "client_secret": settings.zenodo_client_secret,
                "grant_type":    "authorization_code",
                "code":          code,
                "redirect_uri":  settings.oauth_redirect_uri,
            },
            timeout=30,
        )
        if resp.status_code != 200:
            return JSONResponse({"error": "Token exchange failed", "detail": resp.text}, status_code=400)
        token_data = resp.json()

    access_token = token_data.get("access_token")
    if not access_token:
        return JSONResponse({"error": "No access token in response"}, status_code=400)

    request.session["access_token"] = access_token
    request.session.pop("oauth_state", None)
    print(f"[OAuth] token stored, session keys: {list(request.session.keys())}")

    # Redirect to frontend — the frontend will call /auth/me to confirm
    return RedirectResponse(f"{settings.frontend_url}/?auth=success")


@router.get("/me")
async def me(request: Request):
    token = request.session.get("access_token")
    print(f"[Auth/me] session keys: {list(request.session.keys())}, token present: {bool(token)}")
    if not token:
        return JSONResponse({"authenticated": False})

    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get(
                f"{settings.zenodo_api_url}/deposit/depositions",
                headers={"Authorization": f"Bearer {token}"},
                params={"size": 1},
                timeout=15,
            )
            valid = resp.status_code == 200
        except Exception:
            valid = False

    if not valid:
        request.session.clear()
        return JSONResponse({"authenticated": False})

    return JSONResponse({"authenticated": True, "zenodo_url": settings.zenodo_base_url})


@router.post("/logout")
async def logout(request: Request):
    request.session.clear()
    return JSONResponse({"logged_out": True})
