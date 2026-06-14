# Backend Build List

## Active MVP Sequence
1. Database configuration
2. SQLAlchemy session setup
3. Alembic migration setup
4. `Book` model
5. Initial `books` migration
6. `POST /books`
7. `GET /books`
8. `GET /books/{id}`
9. `PATCH /books/{id}`
10. `DELETE /books/{id}`
11. `POST /scans`
12. `GET /scans/{id}`
13. Search and filters
14. Pagination
15. Tags

## Notes
- `POST /books` should allow manual creation with no `scanId`.
- Scan/OCR is assistive and comes after book persistence works.
- `books` are the source of truth; `scans` help generate draft metadata.

## Out Of Scope For Current MVP
- Authentication
- Login flow
- Google sign-in
- User model
- Per-user book ownership
- Protected routes / authorization
