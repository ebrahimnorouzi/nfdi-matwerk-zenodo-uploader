from typing import Literal, Optional
from pydantic import BaseModel, Field


class Creator(BaseModel):
    name: str
    affiliation: Optional[str] = None
    orcid: Optional[str] = None


class DepositMetadata(BaseModel):
    title: str = Field(..., min_length=3, max_length=500)
    description: str = Field(..., min_length=10)
    upload_type: Literal["dataset", "software", "publication", "poster", "presentation", "image"] = "dataset"
    publication_date: str  # ISO date string YYYY-MM-DD
    creators: list[Creator] = Field(..., min_length=1)
    keywords: list[str] = []
    license: str = "cc-by-4.0"
