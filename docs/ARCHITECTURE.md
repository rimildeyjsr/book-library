# Architecture Notes

## v1 Shape

- Mobile uploads book photos.
- Backend stores images through a storage abstraction.
- Backend runs OCR first.
- Backend runs AI cleanup on OCR output.
- User confirms the extracted draft before saving a book.

## Immediate Backend Priorities

1. app bootstrap
2. database setup
3. book CRUD
4. scan upload
5. OCR pipeline
6. AI cleanup pipeline
