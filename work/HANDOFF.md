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
- Backend dependency installation is still incomplete because approval for `uv sync` was not granted.

## Next Step
Verify the mobile prototype on iPhone using Expo Go with the real capture -> mocked review -> save flow, then begin backend tutor mode with the first thin slice: database configuration.

## Open Questions
- Will scans be processed synchronously in v1, or should we create a stubbed job state now?
- Should `tags` stay denormalized for v1 as JSON/text array, then normalize later?
- Do we want local image storage only for dev, with a storage abstraction from day one?

## Session Notes
- 2026-06-06: Initial project framing. User wants a very small project, backend-first, with tutoring and strong handoff across many sessions.
- 2026-06-06: Monorepo initialized with Git. Added root README, backend bootstrap, architecture notes, and a first healthcheck test. Testing is blocked until backend dependencies are installed.
- 2026-06-06: Pivoted to mobile-first implementation. Added a vibe-coded Expo-style mobile scaffold and explicit API contract documentation so backend work can follow the app flow.
- 2026-06-13: Upgraded the mobile workspace from Expo SDK 53 to SDK 54 by aligning `expo`, `react`, `react-native`, `expo-status-bar`, `babel-preset-expo`, and React types with the SDK 54-compatible versions. This unblocks running the prototype on a physical iPhone with the current Expo Go release.
- 2026-06-13: Added a minimal real camera slice in the Expo app using `expo-image-picker`. The app now opens the device camera, captures a photo, previews it on the capture screen, and saves the image URI with the mocked book record. OCR and backend upload are still mocked and intentionally deferred.
