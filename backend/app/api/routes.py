from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.dependencies import get_db_session
from app.schemas import BookResponse, CreateBookRequest
from app.services.books import create_book

router = APIRouter()


@router.get("/health", tags=["system"])
def healthcheck() -> dict[str, str]:
    return {"status": "ok"}


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
