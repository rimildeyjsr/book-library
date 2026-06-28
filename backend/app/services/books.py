from sqlalchemy.orm import Session

from app.models.book import Book
from app.schemas.book import CreateBookRequest


def create_book(session: Session, payload: CreateBookRequest) -> Book:
    book = Book(
        title=payload.title,
        author=payload.author,
        genre=payload.genre,
        rating=payload.rating,
        date_bought=payload.date_bought,
        date_read=payload.date_read,
        notes=payload.notes,
    )
    session.add(book)
    session.commit()
    session.refresh(book)
    return book
