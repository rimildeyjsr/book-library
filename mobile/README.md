# Mobile

Thin Expo client for the personal library scanner.

## Current State

- Vibe-coded mobile prototype with mocked scan result and mocked library data
- Screens for capture, draft review, library list, and book detail
- Typed API contracts defined so backend implementation can target stable shapes

## Next Integration Steps

1. Replace mocked capture card with camera or image picker.
2. Call `POST /scans` to upload image.
3. Load scan result from `GET /scans/{id}`.
4. Save confirmed data with `POST /books`.
5. Load library and detail views from real book endpoints.

