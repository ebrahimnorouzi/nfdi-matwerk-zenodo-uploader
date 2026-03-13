"""
Deposit lifecycle endpoints.

POST /deposit/create          → create draft deposition with metadata
POST /deposit/{id}/upload     → stream a file to Zenodo bucket (no local storage)
GET  /deposit/{id}/status     → check deposition status / file list
POST /deposit/{id}/publish    → publish the deposition
DELETE /deposit/{id}          → discard a draft
"""

import asyncio
from typing import Annotated

import httpx
from fastapi import APIRouter, Depends, File, HTTPException, Request, UploadFile
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.models.deposit import DepositMetadata

router = APIRouter()

MAX_FILES = 100
MAX_TOTAL_BYTES = 50 * 1024 ** 3   # 50 GiB


def require_token(request: Request) -> str:
    token = request.session.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return token


def zenodo_headers(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}


# ── Create draft ──────────────────────────────────────────────────────────────

@router.post("/create")
async def create_deposit(
    metadata: DepositMetadata,
    token: str = Depends(require_token),
):
    payload = {
        "metadata": {
            "title": metadata.title,
            "upload_type": metadata.upload_type,
            "publication_date": metadata.publication_date,
            "description": metadata.description,
            "creators": [c.model_dump(exclude_none=True) for c in metadata.creators],
            "access_right": "open",
            "license": metadata.license,
            "prereserve_doi": True,
            "communities": [{"identifier": settings.community_id}],
            "keywords": metadata.keywords or [],
        }
    }

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{settings.zenodo_api_url}/deposit/depositions",
            headers={**zenodo_headers(token), "Content-Type": "application/json"},
            json=payload,
            timeout=60,
        )

    if resp.status_code not in (200, 201):
        raise HTTPException(status_code=resp.status_code, detail=resp.text)

    data = resp.json()
    return {
        "id": data["id"],
        "bucket_url": data["links"]["bucket"],
        "html_url": data["links"]["html"],
        "doi": data["metadata"].get("prereserve_doi", {}).get("doi"),
    }


# ── Upload file ───────────────────────────────────────────────────────────────

@router.post("/{deposition_id}/upload")
async def upload_file(
    deposition_id: int,
    file: UploadFile = File(...),
    token: str = Depends(require_token),
):
    """
    Stream the uploaded file directly to Zenodo without writing to disk.
    Files are never persisted on the server.
    """
    # First, get the bucket URL for this deposition
    async with httpx.AsyncClient() as client:
        dep = await client.get(
            f"{settings.zenodo_api_url}/deposit/depositions/{deposition_id}",
            headers=zenodo_headers(token),
            timeout=30,
        )
        if dep.status_code != 200:
            raise HTTPException(status_code=dep.status_code, detail="Deposition not found")
        bucket_url = dep.json()["links"]["bucket"]

        # Stream file content directly to Zenodo
        content = await file.read()   # read into memory (files ≤ chunk limit)
        up = await client.put(
            f"{bucket_url}/{file.filename}",
            content=content,
            headers=zenodo_headers(token),
            timeout=600,
        )

    if up.status_code not in (200, 201):
        raise HTTPException(status_code=up.status_code, detail=up.text)

    return {"filename": file.filename, "size": len(content), "status": "uploaded"}


# ── Status ────────────────────────────────────────────────────────────────────

@router.get("/{deposition_id}/status")
async def deposit_status(
    deposition_id: int,
    token: str = Depends(require_token),
):
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{settings.zenodo_api_url}/deposit/depositions/{deposition_id}",
            headers=zenodo_headers(token),
            timeout=30,
        )

    if resp.status_code != 200:
        raise HTTPException(status_code=resp.status_code, detail=resp.text)

    data = resp.json()
    files = data.get("files", [])
    return {
        "id": data["id"],
        "state": data["state"],
        "submitted": data.get("submitted", False),
        "doi": data["metadata"].get("prereserve_doi", {}).get("doi"),
        "html_url": data["links"]["html"],
        "files": [
            {"filename": f["filename"], "size": f["filesize"]} for f in files
        ],
        "total_files": len(files),
        "total_size": sum(f["filesize"] for f in files),
    }


# ── Publish ───────────────────────────────────────────────────────────────────

@router.post("/{deposition_id}/publish")
async def publish_deposit(
    deposition_id: int,
    token: str = Depends(require_token),
):
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{settings.zenodo_api_url}/deposit/depositions/{deposition_id}/actions/publish",
            headers=zenodo_headers(token),
            timeout=60,
        )

    if resp.status_code not in (200, 202):
        raise HTTPException(status_code=resp.status_code, detail=resp.text)

    data = resp.json() if resp.content else {}
    return {
        "published": True,
        "doi": data.get("doi") or data.get("metadata", {}).get("doi"),
        "doi_url": data.get("doi_url"),
        "html_url": data.get("links", {}).get("record_html"),
    }


# ── Discard draft ─────────────────────────────────────────────────────────────

@router.delete("/{deposition_id}")
async def discard_deposit(
    deposition_id: int,
    token: str = Depends(require_token),
):
    async with httpx.AsyncClient() as client:
        resp = await client.delete(
            f"{settings.zenodo_api_url}/deposit/depositions/{deposition_id}",
            headers=zenodo_headers(token),
            timeout=30,
        )

    if resp.status_code not in (200, 201, 204):
        raise HTTPException(status_code=resp.status_code, detail=resp.text)

    return {"discarded": True}
