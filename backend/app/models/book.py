from datetime import UTC, date, datetime
from uuid import uuid4

from sqlalchemy import Date, DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Book(Base):
    __tablename__ = "books"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid4()),
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    author: Mapped[str] = mapped_column(String(255), nullable=False)
    genre: Mapped[str | None] = mapped_column(String(255), nullable=True)
    rating: Mapped[int | None] = mapped_column(Integer, nullable=True)
    date_bought: Mapped[date | None] = mapped_column(Date, nullable=True)
    date_added: Mapped[date] = mapped_column(
        Date,
        default=lambda: datetime.now(UTC).date(),
        nullable=False,
    )
    date_read: Mapped[date | None] = mapped_column(Date, nullable=True)
    image_path: Mapped[str | None] = mapped_column(String(500), nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        onupdate=lambda: datetime.now(UTC),
        nullable=False,
    )
