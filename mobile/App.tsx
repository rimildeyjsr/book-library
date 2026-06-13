import * as ImagePicker from "expo-image-picker";
import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type BookRecord = {
  id: string;
  title: string;
  author: string;
  genre?: string;
  rating?: number;
  tags: string[];
  dateAdded: string;
  dateRead?: string;
  imageUri?: string;
  notes?: string;
};

type DraftScan = {
  title: string;
  author: string;
  genre: string;
  rating: string;
  tags: string;
  dateRead: string;
  notes: string;
};

type Screen = "capture" | "draft" | "library" | "detail";

const initialDraft: DraftScan = {
  title: "The Design of Everyday Things",
  author: "Don Norman",
  genre: "Design",
  rating: "5",
  tags: "ux, favorites",
  dateRead: "",
  notes: "Draft generated from mocked OCR + AI cleanup.",
};

const initialBooks: BookRecord[] = [
  {
    id: "1",
    title: "Atomic Habits",
    author: "James Clear",
    genre: "Self-Improvement",
    rating: 4,
    tags: ["habits", "reference"],
    dateAdded: "2026-06-01",
    notes: "Use as a layout example for the library card.",
  },
  {
    id: "2",
    title: "Deep Work",
    author: "Cal Newport",
    genre: "Productivity",
    rating: 5,
    tags: ["focus"],
    dateAdded: "2026-06-02",
    dateRead: "2026-06-04",
  },
];

export default function App() {
  const [screen, setScreen] = useState<Screen>("library");
  const [draft, setDraft] = useState<DraftScan>(initialDraft);
  const [books, setBooks] = useState<BookRecord[]>(initialBooks);
  const [selectedBookId, setSelectedBookId] = useState<string>(initialBooks[0]?.id ?? "");
  const [capturedImageUri, setCapturedImageUri] = useState<string | undefined>();

  const selectedBook = useMemo(
    () => books.find((book) => book.id === selectedBookId) ?? books[0],
    [books, selectedBookId],
  );

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Camera permission needed", "Allow camera access to photograph a book cover or spine.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      cameraType: ImagePicker.CameraType.back,
      mediaTypes: ["images"],
      quality: 0.7,
    });

    if (result.canceled) {
      return;
    }

    setCapturedImageUri(result.assets[0]?.uri);
  };

  const saveDraft = () => {
    const book: BookRecord = {
      id: String(Date.now()),
      title: draft.title.trim(),
      author: draft.author.trim(),
      genre: draft.genre.trim() || undefined,
      rating: draft.rating.trim() ? Number(draft.rating) : undefined,
      tags: draft.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      dateAdded: new Date().toISOString().slice(0, 10),
      dateRead: draft.dateRead.trim() || undefined,
      imageUri: capturedImageUri,
      notes: draft.notes.trim() || undefined,
    };

    setBooks((current) => [book, ...current]);
    setSelectedBookId(book.id);
    setScreen("detail");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.shell}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>Personal Library</Text>
            <Text style={styles.title}>Scan, review, save.</Text>
          </View>
          <Pressable style={styles.primaryButton} onPress={() => setScreen("capture")}>
            <Text style={styles.primaryButtonText}>New Scan</Text>
          </Pressable>
        </View>

        <View style={styles.tabRow}>
          <TabButton label="Library" active={screen === "library"} onPress={() => setScreen("library")} />
          <TabButton label="Draft" active={screen === "draft"} onPress={() => setScreen("draft")} />
          <TabButton label="Capture" active={screen === "capture"} onPress={() => setScreen("capture")} />
        </View>

        {screen === "capture" && (
          <CaptureScreen
            capturedImageUri={capturedImageUri}
            onTakePhoto={takePhoto}
            onContinue={() => setScreen("draft")}
          />
        )}
        {screen === "draft" && (
          <DraftScreen
            draft={draft}
            onChange={setDraft}
            onSave={saveDraft}
            onCancel={() => setScreen("library")}
          />
        )}
        {screen === "library" && (
          <LibraryScreen
            books={books}
            onOpenBook={(bookId) => {
              setSelectedBookId(bookId);
              setScreen("detail");
            }}
          />
        )}
        {screen === "detail" && selectedBook && (
          <BookDetailScreen
            book={selectedBook}
            onBack={() => setScreen("library")}
            onEdit={() => {
              setDraft({
                title: selectedBook.title,
                author: selectedBook.author,
                genre: selectedBook.genre ?? "",
                rating: selectedBook.rating ? String(selectedBook.rating) : "",
                tags: selectedBook.tags.join(", "),
                dateRead: selectedBook.dateRead ?? "",
                notes: selectedBook.notes ?? "",
              });
              setScreen("draft");
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

function TabButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={[styles.tabButton, active && styles.tabButtonActive]} onPress={onPress}>
      <Text style={[styles.tabButtonText, active && styles.tabButtonTextActive]}>{label}</Text>
    </Pressable>
  );
}

function CaptureScreen({
  capturedImageUri,
  onTakePhoto,
  onContinue,
}: {
  capturedImageUri?: string;
  onTakePhoto: () => void;
  onContinue: () => void;
}) {
  return (
    <View style={styles.panel}>
      <Text style={styles.sectionTitle}>Capture Flow</Text>
      <Text style={styles.bodyText}>
        Take a photo of a book cover or spine, then continue into the mocked OCR review flow. The
        real backend upload still comes later.
      </Text>
      <View style={styles.captureCard}>
        {capturedImageUri ? (
          <Image source={{ uri: capturedImageUri }} style={styles.capturePreview} />
        ) : (
          <>
            <Text style={styles.captureTitle}>Book cover or spine</Text>
            <Text style={styles.captureHint}>
              This now opens the real phone camera. After capture, the metadata step is still
              mocked until the backend scan route exists.
            </Text>
          </>
        )}
      </View>
      <Pressable style={styles.primaryButtonWide} onPress={onTakePhoto}>
        <Text style={styles.primaryButtonText}>{capturedImageUri ? "Retake Photo" : "Take Photo"}</Text>
      </Pressable>
      <Pressable style={styles.secondaryButtonWide} onPress={onContinue}>
        <Text style={styles.secondaryButtonText}>
          {capturedImageUri ? "Continue to Draft" : "Use Mocked Scan Result"}
        </Text>
      </Pressable>
      {!capturedImageUri && (
        <Text style={styles.captureFootnote}>
          If you skip photo capture, the app still uses the same mocked draft as before.
        </Text>
      )}
    </View>
  );
}

function DraftScreen({
  draft,
  onChange,
  onSave,
  onCancel,
}: {
  draft: DraftScan;
  onChange: (draft: DraftScan) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <ScrollView style={styles.panel} contentContainerStyle={styles.formContent}>
      <Text style={styles.sectionTitle}>Review Draft</Text>
      <Text style={styles.bodyText}>
        Treat extracted metadata as provisional. The user confirms the final truth before save.
      </Text>
      <Field label="Title" value={draft.title} onChangeText={(title) => onChange({ ...draft, title })} />
      <Field
        label="Author"
        value={draft.author}
        onChangeText={(author) => onChange({ ...draft, author })}
      />
      <Field label="Genre" value={draft.genre} onChangeText={(genre) => onChange({ ...draft, genre })} />
      <Field
        label="Rating"
        value={draft.rating}
        keyboardType="numeric"
        onChangeText={(rating) => onChange({ ...draft, rating })}
      />
      <Field label="Tags" value={draft.tags} onChangeText={(tags) => onChange({ ...draft, tags })} />
      <Field
        label="Date Read"
        value={draft.dateRead}
        placeholder="YYYY-MM-DD"
        onChangeText={(dateRead) => onChange({ ...draft, dateRead })}
      />
      <Field
        label="Notes"
        value={draft.notes}
        multiline
        onChangeText={(notes) => onChange({ ...draft, notes })}
      />
      <View style={styles.actionRow}>
        <Pressable style={styles.secondaryButton} onPress={onCancel}>
          <Text style={styles.secondaryButtonText}>Cancel</Text>
        </Pressable>
        <Pressable style={styles.primaryButton} onPress={onSave}>
          <Text style={styles.primaryButtonText}>Save Book</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

function LibraryScreen({
  books,
  onOpenBook,
}: {
  books: BookRecord[];
  onOpenBook: (bookId: string) => void;
}) {
  return (
    <ScrollView style={styles.panel} contentContainerStyle={styles.listContent}>
      <Text style={styles.sectionTitle}>Your Library</Text>
      {books.map((book) => (
        <Pressable key={book.id} style={styles.bookCard} onPress={() => onOpenBook(book.id)}>
          <BookCover title={book.title} imageUri={book.imageUri} />
          <View style={styles.bookMeta}>
            <Text style={styles.bookTitle}>{book.title}</Text>
            <Text style={styles.bookSubtitle}>{book.author}</Text>
            <Text style={styles.bookCaption}>
              {book.genre ?? "Uncategorized"} · Added {book.dateAdded}
            </Text>
            <Text style={styles.bookCaption}>Tags: {book.tags.join(", ") || "None"}</Text>
          </View>
          <View style={styles.ratingPill}>
            <Text style={styles.ratingPillText}>{book.rating ?? "-"}</Text>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
}

function BookDetailScreen({
  book,
  onBack,
  onEdit,
}: {
  book: BookRecord;
  onBack: () => void;
  onEdit: () => void;
}) {
  return (
    <ScrollView style={styles.panel} contentContainerStyle={styles.detailContent}>
      <View style={styles.detailHeader}>
        <Pressable style={styles.secondaryButton} onPress={onBack}>
          <Text style={styles.secondaryButtonText}>Back</Text>
        </Pressable>
        <Pressable style={styles.primaryButton} onPress={onEdit}>
          <Text style={styles.primaryButtonText}>Edit</Text>
        </Pressable>
      </View>

      <View style={styles.detailHero}>
        <BookCover title={book.title} imageUri={book.imageUri} size="large" />
        <Text style={styles.detailTitle}>{book.title}</Text>
        <Text style={styles.detailAuthor}>{book.author}</Text>
      </View>

      <View style={styles.detailGrid}>
        <InfoRow label="Genre" value={book.genre ?? "Not set"} />
        <InfoRow label="Rating" value={book.rating ? `${book.rating}/5` : "Not set"} />
        <InfoRow label="Date added" value={book.dateAdded} />
        <InfoRow label="Date read" value={book.dateRead ?? "Not set"} />
        <InfoRow label="Tags" value={book.tags.join(", ") || "None"} />
        <InfoRow label="Notes" value={book.notes ?? "No notes yet"} />
      </View>
    </ScrollView>
  );
}

function BookCover({
  title,
  imageUri,
  size = "small",
}: {
  title: string;
  imageUri?: string;
  size?: "small" | "large";
}) {
  if (imageUri) {
    return (
      <Image
        source={{ uri: imageUri }}
        style={size === "large" ? styles.detailCoverImage : styles.bookThumbImage}
      />
    );
  }

  return (
    <View style={size === "large" ? styles.detailCover : styles.bookThumb}>
      <Text style={size === "large" ? styles.detailCoverText : styles.bookThumbText}>
        {title.slice(0, 1)}
      </Text>
    </View>
  );
}

function Field({
  label,
  multiline,
  ...props
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "numeric";
  multiline?: boolean;
}) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        {...props}
        multiline={multiline}
        style={[styles.input, multiline && styles.inputMultiline]}
        placeholderTextColor="#8a8677"
      />
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f2ecdf",
  },
  shell: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 18,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  eyebrow: {
    color: "#7f5f3c",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  title: {
    marginTop: 4,
    color: "#1f1a14",
    fontSize: 28,
    fontWeight: "800",
  },
  tabRow: {
    flexDirection: "row",
    gap: 10,
  },
  tabButton: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 10,
    backgroundColor: "#e4d7bf",
    alignItems: "center",
  },
  tabButtonActive: {
    backgroundColor: "#3d2c1f",
  },
  tabButtonText: {
    color: "#5f4b3d",
    fontWeight: "700",
  },
  tabButtonTextActive: {
    color: "#fff8f0",
  },
  panel: {
    flex: 1,
    backgroundColor: "#fffaf2",
    borderRadius: 28,
    padding: 18,
  },
  sectionTitle: {
    color: "#20170f",
    fontSize: 22,
    fontWeight: "800",
  },
  bodyText: {
    marginTop: 8,
    marginBottom: 18,
    color: "#65584e",
    fontSize: 15,
    lineHeight: 22,
  },
  captureCard: {
    minHeight: 220,
    borderRadius: 24,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#b69772",
    backgroundColor: "#f0e3cc",
    justifyContent: "center",
    padding: 22,
    overflow: "hidden",
  },
  capturePreview: {
    width: "100%",
    height: 260,
    borderRadius: 16,
  },
  captureTitle: {
    color: "#2e241c",
    fontSize: 20,
    fontWeight: "800",
  },
  captureHint: {
    marginTop: 10,
    color: "#6a5847",
    fontSize: 15,
    lineHeight: 22,
  },
  captureFootnote: {
    marginTop: 12,
    color: "#7a6b5c",
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center",
  },
  primaryButton: {
    borderRadius: 999,
    backgroundColor: "#1f7a5b",
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  primaryButtonWide: {
    marginTop: 18,
    borderRadius: 18,
    backgroundColor: "#1f7a5b",
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#f7fff9",
    fontWeight: "800",
  },
  secondaryButton: {
    borderRadius: 999,
    backgroundColor: "#e4d7bf",
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  secondaryButtonWide: {
    marginTop: 12,
    borderRadius: 18,
    backgroundColor: "#e4d7bf",
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#4c4033",
    fontWeight: "800",
  },
  formContent: {
    paddingBottom: 32,
  },
  fieldWrap: {
    marginBottom: 14,
  },
  fieldLabel: {
    marginBottom: 6,
    color: "#574538",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  input: {
    borderRadius: 16,
    backgroundColor: "#f4ede0",
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#1f1a14",
    fontSize: 16,
  },
  inputMultiline: {
    minHeight: 110,
    textAlignVertical: "top",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  listContent: {
    gap: 14,
    paddingBottom: 26,
  },
  bookCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#f6edde",
    borderRadius: 24,
    padding: 14,
  },
  bookThumb: {
    width: 54,
    height: 78,
    borderRadius: 14,
    backgroundColor: "#7f5f3c",
    alignItems: "center",
    justifyContent: "center",
  },
  bookThumbImage: {
    width: 54,
    height: 78,
    borderRadius: 14,
    backgroundColor: "#d7c1a1",
  },
  bookThumbText: {
    color: "#fff8f0",
    fontSize: 20,
    fontWeight: "800",
  },
  bookMeta: {
    flex: 1,
    gap: 3,
  },
  bookTitle: {
    color: "#231a12",
    fontSize: 18,
    fontWeight: "800",
  },
  bookSubtitle: {
    color: "#6e5947",
    fontSize: 14,
    fontWeight: "600",
  },
  bookCaption: {
    color: "#8a7b6e",
    fontSize: 13,
  },
  ratingPill: {
    minWidth: 38,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "#1f7a5b",
    alignItems: "center",
  },
  ratingPillText: {
    color: "#f8fff9",
    fontWeight: "800",
  },
  detailContent: {
    paddingBottom: 28,
  },
  detailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  detailHero: {
    alignItems: "center",
    marginBottom: 22,
  },
  detailCover: {
    width: 124,
    height: 176,
    borderRadius: 24,
    backgroundColor: "#7f5f3c",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  detailCoverImage: {
    width: 124,
    height: 176,
    borderRadius: 24,
    backgroundColor: "#d7c1a1",
    marginBottom: 16,
  },
  detailCoverText: {
    color: "#fff8f0",
    fontSize: 40,
    fontWeight: "900",
  },
  detailTitle: {
    color: "#20170f",
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
  },
  detailAuthor: {
    marginTop: 6,
    color: "#6c5948",
    fontSize: 17,
  },
  detailGrid: {
    gap: 12,
  },
  infoRow: {
    backgroundColor: "#f6edde",
    borderRadius: 20,
    padding: 14,
    gap: 4,
  },
  infoLabel: {
    color: "#7f6d5f",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  infoValue: {
    color: "#20170f",
    fontSize: 16,
    lineHeight: 22,
  },
});
