from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator


class CreateBookRequest(BaseModel):
    title: str
    author: str
    genre: str | None = None
    rating: int | None = Field(default=None, ge=1, le=5)
    date_bought: date | None = Field(default=None, alias="dateBought")
    date_read: date | None = Field(default=None, alias="dateRead")
    notes: str | None = None

    model_config = ConfigDict(populate_by_name=True)

    @field_validator("title", "author", mode="before")
    @classmethod
    def validate_required_text(cls, value: str) -> str:
        trimmed = value.strip()
        if not trimmed:
            raise ValueError("Field cannot be empty")
        return trimmed

    @field_validator("genre", "notes", mode="before")
    @classmethod
    def normalize_optional_text(cls, value: str | None) -> str | None:
        if value is None:
            return None
        trimmed = value.strip()
        return trimmed or None


class BookResponse(BaseModel):
    id: str
    title: str
    author: str
    genre: str | None
    rating: int | None
    date_bought: date | None = Field(alias="dateBought")
    date_added: date = Field(alias="dateAdded")
    date_read: date | None = Field(alias="dateRead")
    image_path: str | None = Field(alias="imagePath")
    notes: str | None
    created_at: datetime = Field(alias="createdAt")
    updated_at: datetime = Field(alias="updatedAt")

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
