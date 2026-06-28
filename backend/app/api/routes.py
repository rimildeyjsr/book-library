from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.dependencies import get_db_session
from app.schemas import BookResponse, CreateBookRequest, UpdateBookRequest
from app.services.books import create_book, get_book, list_books, update_book

router = APIRouter()


@router.get("/health", tags=["system"])
def healthcheck() -> dict[str, str]:
    return {"status": "ok"}


@router.get(
    "/books",
    response_model=list[BookResponse],
    response_model_by_alias=True,
    tags=["books"],
)
def list_books_route(session: Session = Depends(get_db_session)) -> list[BookResponse]:
    return list_books(session)


@router.get(
    "/books/{book_id}",
    response_model=BookResponse,
    response_model_by_alias=True,
    tags=["books"],
)
def get_book_route(book_id: str, session: Session = Depends(get_db_session)) -> BookResponse:
    book = get_book(session, book_id)
    if book is None:
        raise HTTPException(status_code=404, detail="Book not found")
    return book


@router.patch(
    "/books/{book_id}",
    response_model=BookResponse,
    response_model_by_alias=True,
    tags=["books"],
)
def update_book_route(
    book_id: str,
    payload: UpdateBookRequest,
    session: Session = Depends(get_db_session),
) -> BookResponse:
    book = get_book(session, book_id)
    if book is None:
        raise HTTPException(status_code=404, detail="Book not found")

    updates = payload.model_dump(exclude_unset=True, by_alias=False)
    if not updates:
        raise HTTPException(status_code=400, detail="Request body must include at least one field")

    return update_book(session, book, payload)


@router.post(
    "/books",
    response_model=BookResponse,
    response_model_by_alias=True,
    status_code=status.HTTP_201_CREATED,
    tags=["books"],
)
def create_book_route(
    payload: CreateBookRequest,
    session: Session = Depends(get_db_session),
) -> BookResponse:
    return create_book(session, payload)
