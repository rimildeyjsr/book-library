from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.book import Book
from app.schemas.book import CreateBookRequest, UpdateBookRequest


def get_book(session: Session, book_id: str) -> Book | None:
    return session.get(Book, book_id)


def list_books(session: Session) -> list[Book]:
    statement = select(Book).order_by(Book.created_at.desc())
    return list(session.scalars(statement))


def update_book(session: Session, book: Book, payload: UpdateBookRequest) -> Book:
    updates = payload.model_dump(exclude_unset=True, by_alias=False)

    for field_name, value in updates.items():
        setattr(book, field_name, value)

    session.commit()
    session.refresh(book)
    return book


def delete_book(session: Session, book: Book) -> None:
    session.delete(book)
    session.commit()


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
