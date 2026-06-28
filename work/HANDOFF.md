# Book Scanner Handoff

## Project Goal
Build a small personal library app where a user scans or photographs book covers/spines on mobile, extracts draft metadata, edits it, and saves it to a database.

## Scope Guardrails
- Keep v1 to one user.
- Backend is the learning focus.
- Mobile app is a thin client and can be vibe coded.
- AI flow is assistive, not fully autonomous.
- No social features, recommendations, or advanced search in v1.

## Current Decisions
- Mobile: Expo + React Native + TypeScript
- Backend: FastAPI
- Database: PostgreSQL
- ORM: SQLAlchemy 2.0
- Migrations: Alembic
- OCR/AI: backend extraction pipeline returning structured draft metadata

## Stable V1 Flow
1. User takes or selects a photo in the mobile app.
2. App uploads the image to backend.
3. Backend extracts draft metadata from image/text.
4. App shows editable draft.
5. User confirms and saves book.
6. App lists saved books and shows details.

## Backend V1 Endpoints
- `POST /scans`
- `GET /scans/{id}`
- `POST /books`
- `GET /books`
- `GET /books/{id}`
- `PUT /books/{id}`

## Minimal V1 Tables
### books
- id
- title
- author
- genre nullable
- rating nullable
- tags nullable
- date_bought nullable
- date_added
- date_read nullable
- image_path nullable
- created_at

### scans
- id
- image_path
- raw_extracted_text nullable
- structured_result nullable
- status
- created_at

## Working Rules For Future Sessions
- Read this file first.
- Prefer finishing one thin vertical slice over broad setup.
- Do not add new features until the current flow is working end to end.
- Explain backend changes in tutor mode before or while implementing them.
- Update the "Next Step" and "Open Questions" sections at the end of each substantial session.

## Current State
- Git monorepo initialized at project root.
- Root folders created: `backend`, `mobile`, `docs`, `work`.
- Backend bootstrapped with a minimal FastAPI app and `/api/health` route.
- Backend `pyproject.toml` created with initial dependencies and test dependencies.
- First backend test added for health route.
- Mobile Expo-style scaffold created with a mocked capture -> draft -> save -> library -> detail flow.
- Typed frontend API contracts added so backend implementation can target stable request/response shapes.
- `docs/API_CONTRACT.md` now defines the intended v1 API shapes.
- Mobile app dependency tree was upgraded from Expo SDK 53 to Expo SDK 54 so it can run in the current iOS Expo Go app.
- Mobile dependencies are installed at the new repo path.
- Mobile capture now opens the real device camera through `expo-image-picker`, stores the captured image locally in app state, and carries that image through the existing mocked review/save flow.
- Backend dependencies are installed in `backend/.venv` via `uv`.
- Backend database configuration is now wired through `backend/.env` using `DATABASE_URL`.
- SQLAlchemy engine/session plumbing exists in `backend/app/db/session.py` and `backend/app/db/dependencies.py`.
- Alembic is configured and points at app settings for the database URL.
- A first `Book` ORM model exists with UUID string IDs and the agreed MVP fields.
- The initial books migration was generated and applied successfully.
- Local PostgreSQL is running, the `book_library` database exists, and the `books` table was verified manually.
- `POST /books` is implemented with request/response schemas, service-layer write logic, and a real manual verification against the local API and Postgres database.
- `GET /books` is implemented and returns saved books ordered newest first by `created_at`.
- `GET /books/{book_id}` is implemented and returns `404` when a book is missing.
- `PATCH /books/{book_id}` is implemented with partial-update semantics, schema validation, `400` for empty patch bodies, and `404` for missing books.

## Next Step
Implement `DELETE /books/{book_id}`:
- decide the response shape for successful deletion
- return `404` for missing books
- verify the row is actually removed from Postgres

## Open Questions
- Will scans be processed synchronously in v1, or should we create a stubbed job state now?
- `tags` are deferred for now and intentionally excluded from the first `Book` model/API slice.
- Do we want local image storage only for dev, with a storage abstraction from day one?

## Session Notes
- 2026-06-06: Initial project framing. User wants a very small project, backend-first, with tutoring and strong handoff across many sessions.
- 2026-06-06: Monorepo initialized with Git. Added root README, backend bootstrap, architecture notes, and a first healthcheck test. Testing is blocked until backend dependencies are installed.
- 2026-06-06: Pivoted to mobile-first implementation. Added a vibe-coded Expo-style mobile scaffold and explicit API contract documentation so backend work can follow the app flow.
- 2026-06-13: Upgraded the mobile workspace from Expo SDK 53 to SDK 54 by aligning `expo`, `react`, `react-native`, `expo-status-bar`, `babel-preset-expo`, and React types with the SDK 54-compatible versions. This unblocks running the prototype on a physical iPhone with the current Expo Go release.
- 2026-06-13: Added a minimal real camera slice in the Expo app using `expo-image-picker`. The app now opens the device camera, captures a photo, previews it on the capture screen, and saves the image URI with the mocked book record. OCR and backend upload are still mocked and intentionally deferred.
- 2026-06-15: Completed the first backend persistence foundation slice in tutor mode. Added `database_url` config, backend `.env`, SQLAlchemy engine/session plumbing, Alembic setup, a first `Book` ORM model, and the initial `books` migration. Installed backend dependencies with `uv`, created the local `book_library` database using the local `rimildey` Postgres role, applied the migration, and verified that the `books` table exists.
- 2026-06-28: Completed the first real API slice for books. Added `CreateBookRequest` and `BookResponse` Pydantic schemas, a `create_book` service, and the `POST /books` route returning `201 Created`. Manually verified the endpoint end to end with `curl`, confirming validation, DB persistence, and camelCase API response fields.
- 2026-06-28: Completed the first read API slices for books. Added `GET /books` with newest-first ordering and `GET /books/{book_id}` with explicit `404 Book not found` behavior. Both routes reuse the `BookResponse` schema and the thin route/service layering established for `POST /books`.
- 2026-06-28: Added `PATCH /books/{book_id}` with an `UpdateBookRequest` schema for partial updates. The route rejects empty patch bodies with `400`, returns `404` for missing books, and uses `payload.model_dump(exclude_unset=True)` so only explicitly provided fields are applied to the ORM object.
