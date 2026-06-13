# API Contract Notes

These are the shapes the backend should honor first so the mobile app can integrate without churn.

## `POST /scans`

Accepts a multipart image upload.

Response shape:

```json
{
  "id": "scan_123",
  "status": "structured",
  "imagePath": "uploads/scans/scan_123.jpg",
  "ocrText": "The Design of Everyday Things Don Norman",
  "draft": {
    "title": "The Design of Everyday Things",
    "author": "Don Norman",
    "genre": "Design",
    "rating": 5,
    "tags": ["ux", "favorites"],
    "dateRead": "2026-06-01",
    "notes": "Parsed from OCR output",
    "confidence": 0.92
  },
  "createdAt": "2026-06-06T10:00:00Z",
  "updatedAt": "2026-06-06T10:00:00Z"
}
```

## `GET /scans/{id}`

Returns the same scan record, including status progression and any extraction errors.

## `POST /books`

Request shape:

```json
{
  "scanId": "scan_123",
  "title": "The Design of Everyday Things",
  "author": "Don Norman",
  "genre": "Design",
  "rating": 5,
  "tags": ["ux", "favorites"],
  "dateBought": "2026-05-20",
  "dateRead": "2026-06-01",
  "notes": "User confirmed and edited this draft."
}
```

Response shape:

```json
{
  "id": "book_123",
  "title": "The Design of Everyday Things",
  "author": "Don Norman",
  "genre": "Design",
  "rating": 5,
  "tags": ["ux", "favorites"],
  "dateBought": "2026-05-20",
  "dateAdded": "2026-06-06",
  "dateRead": "2026-06-01",
  "imagePath": "uploads/scans/scan_123.jpg",
  "notes": "User confirmed and edited this draft.",
  "createdAt": "2026-06-06T10:05:00Z",
  "updatedAt": "2026-06-06T10:05:00Z"
}
```

## `GET /books`

Returns an array of book records for the library screen.

## `GET /books/{id}`

Returns one full book record for the detail screen.

## `PUT /books/{id}`

Accepts editable book fields and returns the updated book record.
