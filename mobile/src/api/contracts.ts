export type ScanStatus = "uploaded" | "ocr_complete" | "structured" | "failed";

export type ScanDraft = {
  title: string;
  author: string;
  genre?: string;
  rating?: number;
  tags: string[];
  dateRead?: string;
  notes?: string;
  confidence?: number;
};

export type ScanRecord = {
  id: string;
  status: ScanStatus;
  imagePath: string;
  ocrText?: string;
  draft?: ScanDraft;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
};

export type BookRecord = {
  id: string;
  title: string;
  author: string;
  genre?: string;
  rating?: number;
  tags: string[];
  dateBought?: string;
  dateAdded: string;
  dateRead?: string;
  imagePath?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateBookRequest = {
  scanId?: string;
  title: string;
  author: string;
  genre?: string;
  rating?: number;
  tags: string[];
  dateBought?: string;
  dateRead?: string;
  notes?: string;
};

