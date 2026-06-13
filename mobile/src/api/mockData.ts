import type { BookRecord, ScanRecord } from "./contracts";

export const mockScan: ScanRecord = {
  id: "scan_1",
  status: "structured",
  imagePath: "mock://cover/the-design-of-everyday-things",
  ocrText: "The Design of Everyday Things Don Norman",
  draft: {
    title: "The Design of Everyday Things",
    author: "Don Norman",
    genre: "Design",
    rating: 5,
    tags: ["ux", "favorites"],
    notes: "Mock OCR plus AI cleanup result.",
    confidence: 0.92,
  },
  createdAt: "2026-06-06T10:00:00Z",
  updatedAt: "2026-06-06T10:00:00Z",
};

export const mockBooks: BookRecord[] = [
  {
    id: "book_1",
    title: "Atomic Habits",
    author: "James Clear",
    genre: "Self-Improvement",
    rating: 4,
    tags: ["habits", "reference"],
    dateAdded: "2026-06-01",
    createdAt: "2026-06-01T09:00:00Z",
    updatedAt: "2026-06-01T09:00:00Z",
  },
  {
    id: "book_2",
    title: "Deep Work",
    author: "Cal Newport",
    genre: "Productivity",
    rating: 5,
    tags: ["focus"],
    dateAdded: "2026-06-02",
    dateRead: "2026-06-04",
    createdAt: "2026-06-02T09:00:00Z",
    updatedAt: "2026-06-04T15:00:00Z",
  },
];

