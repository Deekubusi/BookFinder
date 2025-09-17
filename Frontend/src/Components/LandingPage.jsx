import React, { useEffect, useMemo, useRef, useState } from "react";
import HeroSection from "./HeroSection";
import ActiveFiltersBar from "./ActiveFiltersBar";
import ResultsGrid from "./ResultsGrid";
import FiltersDrawer from "./FiltersDrawer";
import Pagination from "./Pagination";
import { OL_LANG, PAGE_SIZE } from "./constants";

export default function LandingPage() {
  // ------- Search / Filters state -------
  const [query, setQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [author, setAuthor] = useState("");
  const [subject, setSubject] = useState("");
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");
  const [language, setLanguage] = useState("en");
  const [sort, setSort] = useState("relevance");

  // ------- Results / Pagination state -------
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);

  // ------- "Most Read" (initial) state -------
  const [mostItems, setMostItems] = useState([]);
  const [mostLoading, setMostLoading] = useState(true);
  const [mostError, setMostError] = useState("");

  const lastQueryKey = useRef("");

  const queryKey = useMemo(
    () => JSON.stringify({ query, author, subject, yearFrom, yearTo, language, sort }),
    [query, author, subject, yearFrom, yearTo, language, sort]
  );

  // Load "Most Read" once (initial page)
  useEffect(() => {
    const ac = new AbortController();
    const loadMostRead = async () => {
      setMostLoading(true);
      setMostError("");
      try {
        // Heuristic for “most read/popular”: broad term + sort by editions (desc)
        const url = "https://openlibrary.org/search.json?q=the&sort=editions&limit=40";
        const res = await fetch(url, { signal: ac.signal });
        if (!res.ok) throw new Error(`OpenLibrary error ${res.status}`);
        const data = await res.json();
        const docs = Array.isArray(data.docs) ? data.docs : [];
        const normalized = docs.map((d) => ({
          key: d.key,
          title: d.title,
          author_name: d.author_name?.[0] || "Unknown",
          first_publish_year: d.first_publish_year,
          subject: d.subject?.slice(0, 5) || [],
          edition_count: d.edition_count,
          cover_i: d.cover_i,
        }));
        setMostItems(normalized);
      } catch (e) {
        if (e.name !== "AbortError") setMostError(e.message || "Failed to load Most Read");
      } finally {
        if (!ac.signal.aborted) setMostLoading(false);
      }
    };
    loadMostRead();
    return () => ac.abort();
  }, []);

  // Reset page when filters change
  useEffect(() => {
    if (lastQueryKey.current !== queryKey) {
      setItems([]);
      setPage(1);
    }
    lastQueryKey.current = queryKey;
  }, [queryKey]);

  // Fetch after search initiated
  useEffect(() => {
    if (!hasSearched) return;
    fetchPage(page); // eslint-disable-line
  }, [page, queryKey, hasSearched]);

  // Optional: events from Navbar/Hero
  useEffect(() => {
    const onSub = (e) => { setSubject(e.detail); setHasSearched(true); setPage(1); };
    const onAuth = (e) => { setAuthor(e.detail); setHasSearched(true); setPage(1); };
    const onSubmitSearch = (e) => { setQuery(e.detail || ""); setHasSearched(true); setPage(1); };
    const onOpenFilters = () => setFiltersOpen(true);

    window.addEventListener("bf:set-subject", onSub);
    window.addEventListener("bf:set-author", onAuth);
    window.addEventListener("bf:submit-search", onSubmitSearch);
    window.addEventListener("bf:open-filters", onOpenFilters);
    return () => {
      window.removeEventListener("bf:set-subject", onSub);
      window.removeEventListener("bf:set-author", onAuth);
      window.removeEventListener("bf:submit-search", onSubmitSearch);
      window.removeEventListener("bf:open-filters", onOpenFilters);
    };
  }, []);

  // --------- Search fetch ----------
  async function fetchPage(pageNum) {
    setLoading(true);
    setError("");
    try {
      const hasMeaningfulQuery =
        (query && query.trim()) ||
        (author && author.trim()) ||
        (subject && subject.trim()) ||
        (yearFrom && String(yearFrom).trim()) ||
        (yearTo && String(yearTo).trim()) ||
        (language && OL_LANG[language]);

      if (!hasMeaningfulQuery) {
        setItems([]);
        setTotalPages(1);
        setLoading(false);
        return;
      }

      const params = new URLSearchParams();
      if (query)  params.set("title", query);
      if (author) params.set("author", author);
      if (subject) params.set("subject", subject);

      params.set("page", String(pageNum));
      params.set("limit", String(PAGE_SIZE));
      if (sort === "newest") params.set("sort", "new");

      params.set(
        "fields",
        "key,title,author_name,first_publish_year,cover_i,edition_count,subject"
      );

      const qParts = [];
      if (yearFrom) qParts.push(`first_publish_year>=${yearFrom}`);
      if (yearTo)   qParts.push(`first_publish_year<=${yearTo}`);
      if (language && OL_LANG[language]) qParts.push(`language:${OL_LANG[language]}`);
      if (qParts.length) params.set("q", qParts.join(" "));

      const url = `https://openlibrary.org/search.json?${params.toString()}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch books (${res.status})`);

      const data = await res.json();
      const docs = Array.isArray(data.docs) ? data.docs : [];
      const results = docs.map((d) => ({
        key: d.key,
        title: d.title,
        author_name: d.author_name?.[0] || "Unknown",
        first_publish_year: d.first_publish_year,
        subject: d.subject?.slice(0, 5) || [],
        edition_count: d.edition_count,
        cover_i: d.cover_i,
      }));

      setItems(results);
      const numFound =
        typeof data.num_found === "number" ? data.num_found :
        typeof data.numFound === "number" ? data.numFound : 0;
      setTotalPages(Math.max(1, Math.ceil(numFound / PAGE_SIZE)));
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function startSearch() {
    setItems([]);
    setPage(1);
    setHasSearched(true);
  }

  // Chip handlers
  const handleClearKey = (k) => {
    if (k === "subject") setSubject("");
    else if (k === "author") setAuthor("");
    else if (k === "yearFrom") setYearFrom("");
    else if (k === "yearTo") setYearTo("");
    else if (k === "language") setLanguage("");
    if (hasSearched) startSearch();
  };

  const handleClearAll = () => {
    setSubject("");
    setAuthor("");
    setYearFrom("");
    setYearTo("");
    setLanguage("");
    // setQuery(""); // if you want chips to also clear title
    if (hasSearched) startSearch();
  };

  // --------- Pick which dataset to show ---------
  const effectiveItems   = hasSearched ? items       : mostItems;
  const effectiveLoading = hasSearched ? loading     : mostLoading;
  const effectiveError   = hasSearched ? error       : mostError;
  const headingText      = hasSearched ? "Results"   : "Most Read";

  return (
    <div className="min-h-screen text-[#3E3E3E] bg-gradient-to-b from-[#F7F4EA] via-[#FFFDF7] to-[#F7F4EA]">
      {!hasSearched && (
        <HeroSection onTagClick={(tag) => { setSubject(tag); startSearch(); }} />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6" id="results">

        <ActiveFiltersBar
          subject={subject}
          author={author}
          yearFrom={yearFrom}
          yearTo={yearTo}
          language={language}
          onClearKey={handleClearKey}
          onClearAll={handleClearAll}
        />

        <h2 className="text-2xl font-bold text-[#A16541] mb-4">{headingText}</h2>

        {/* Use the same grid component & loader/error behavior for both modes */}
        <ResultsGrid
          items={effectiveItems}
          loading={effectiveLoading}
          error={effectiveError}
          sort={sort}
          setSort={setSort}
        />

        {hasSearched && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
          />
        )}
      </div>

      <FiltersDrawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        author={author}
        setAuthor={setAuthor}
        subject={subject}
        setSubject={setSubject}
        yearFrom={yearFrom}
        setYearFrom={setYearFrom}
        yearTo={yearTo}
        setYearTo={setYearTo}
        language={language}
        setLanguage={setLanguage}
        startSearch={() => { setFiltersOpen(false); startSearch(); }}
      />
    </div>
  );
}
