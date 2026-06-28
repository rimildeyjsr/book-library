from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.book import Book
from app.schemas.book import CreateBookRequest


def get_book(session: Session, book_id: str) -> Book | None:
    return session.get(Book, book_id)


def list_books(session: Session) -> list[Book]:
    statement = select(Book).order_by(Book.created_at.desc())
    return list(session.scalars(statement))


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
