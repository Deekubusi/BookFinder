

// Language options for dropdown
export const LANGS = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "te", label: "Telugu" },
  { code: "fr", label: "French" },
  { code: "es", label: "Spanish" },
];

// my codes to Open Library's language filters
export const OL_LANG = {
  en: "eng",
  hi: "hin",
  te: "tel",
  fr: "fre",
  es: "spa",
};

// Genre tags 
export const GENRE_TAGS = [
  "Romance",
  "Fantasy",
  "Science Fiction",
  "Mystery",
  "Thriller",
  "Horror",
  "Historical",
  "Young Adult",
  "Adventure",
  "Poetry",
];
// authors
export const TOP_AUTHORS = [
  "J. K. Rowling",
  "Stephen King",
  "Agatha Christie",
  "George R. R. Martin",
  "J. R. R. Tolkien",
  "Jane Austen",
  "Mark Twain",
  "Haruki Murakami",
  "Leo Tolstoy",
  "Charles Dickens",
  "Chetan Bhagat",
  "Ruskin Bond",
];

// for pagination
export const PAGE_SIZE = 20;

// to build cover URLs
export const buildCoverUrl = (cover_i, size = "L") =>
  cover_i
    ? `https://covers.openlibrary.org/b/id/${cover_i}-${size}.jpg`
    : `https://placehold.co/400x600?text=No+Cover`;
