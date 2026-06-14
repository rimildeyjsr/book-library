from app.db.session import SessionLocal


def get_db_session():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()