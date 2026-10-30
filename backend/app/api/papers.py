"""A referat / mustaqil ish order as it comes from the website (routes/web.py) and the Mini App (routes/miniapp.py)."""
from typing import Annotated, Literal

from pydantic import BaseModel, Field

from app.services.ai import content as ai_content
from app.services.ai import paper as paper_ai

Short = Annotated[str, Field(max_length=paper_ai.TITLE_MAX)]


class PaperChapter(BaseModel):
    title: Short = Field(min_length=1)
    sections: list[Short] = Field(min_length=2, max_length=4)


class PaperFormat(BaseModel):
    """The teacher's layout requirements; the defaults are the usual ones (services/paper_docx.py DEFAULT_FORMAT)."""
    font_size: Literal[12, 13, 14] = 14
    spacing: float = Field(default=1.5, ge=1.0, le=2.0)
    margin_left: int = Field(default=30, ge=10, le=40)
    margin_right: int = Field(default=15, ge=10, le=30)
    margin_top: int = Field(default=20, ge=10, le=30)
    margin_bottom: int = Field(default=20, ge=10, le=30)
    page_numbers: Literal["bottom_center", "bottom_right", "top_center", "top_right"] = "bottom_center"
    toc_title: Literal["mundarija", "reja"] = "mundarija"


class PaperOutlineRequest(BaseModel):
    topic: str = Field(min_length=3, max_length=200)
    subject: str = Field("", max_length=120)
    language: Literal["uz", "uzc", "ru", "en"] = "uz"
    pages: int = Field(15, ge=paper_ai.PAGES_MIN, le=paper_ai.PAGES_MAX)
    wishes: str = Field("", max_length=paper_ai.WISHES_MAX)
    source: str = Field("", max_length=ai_content.SOURCE_MAX)


class PaperRequest(PaperOutlineRequest):
    doc_type: Literal["referat", "mustaqil"] = "referat"
    ministry: str = Field("", max_length=200)
    university: str = Field("", max_length=200)
    faculty: str = Field("", max_length=120)
    department: str = Field("", max_length=120)
    student: str = Field("", max_length=80)
    group: str = Field("", max_length=80)
    teacher: str = Field("", max_length=80)
    city: str = Field("", max_length=60)
    year: str = Field("", max_length=10)
    outline: list[PaperChapter] | None = Field(None, min_length=2, max_length=4)  # the plan the user approved
    format: PaperFormat = Field(default_factory=lambda: PaperFormat())
