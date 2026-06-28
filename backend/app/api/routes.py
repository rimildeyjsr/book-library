from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.dependencies import get_db_session
from app.schemas import BookResponse, CreateBookRequest
from app.services.books import create_book, list_books

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
