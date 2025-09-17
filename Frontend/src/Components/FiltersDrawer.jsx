import React, { useEffect } from "react";
import { X } from "lucide-react";
import { GENRE_TAGS, LANGS } from "./constants";

export default function FiltersDrawer({
  open,
  onClose,
  author,
  setAuthor,
  subject,
  setSubject,
  yearFrom,
  setYearFrom,
  yearTo,
  setYearTo,
  language,
  setLanguage,
  startSearch,
}) {
  if (!open) return null;

  // Optional: prevent body scroll while drawer is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const applyAndClose = () => {
    startSearch?.();
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close filters"
      />

      {/* --- Mobile: bottom sheet --- */}
      <div
        className="
          absolute bottom-0 left-0 right-0
          sm:hidden
          bg-[#FFFCFC] border-t border-[#A16541]/20
          rounded-t-2xl shadow-2xl
          pt-3 pb-[max(16px,env(safe-area-inset-bottom))] px-4
          translate-y-0 animate-[slideUp_200ms_ease-out]
        "
        role="dialog"
        aria-modal="true"
      >
        {/* Grab handle + Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="mx-auto h-1.5 w-12 rounded-full bg-[#A16541]/20" />
        </div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-bold text-[#A16541] tracking-wide">
            Filters
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[#A16541]/10 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-[#A16541]" />
          </button>
        </div>

        {/* Content (mobile) */}
        <div className="max-h-[70vh] overflow-y-auto pb-2">
          <Fields
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
            mobile
          />
        </div>

        {/* CTA row (mobile) */}
        <div className="mt-3 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-11 rounded-xl border border-[#A16541]/30 text-[#A16541] font-semibold hover:bg-[#A16541]/10"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={applyAndClose}
            className="flex-1 h-11 rounded-xl bg-[#A16541] text-white font-semibold shadow-md hover:scale-[1.02] transition"
          >
            Apply
          </button>
        </div>
      </div>

      {/* --- Desktop/Tablet: right drawer --- */}
      <div
        className="
          absolute right-0 top-0 h-full w-full sm:w-[420px]
          hidden sm:flex sm:flex-col
          bg-[#FFFCFC] border-l border-[#A16541]/20 p-5 shadow-2xl
          translate-x-0 animate-[slideIn_200ms_ease-out]
        "
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[#A16541] tracking-wide">
            Filters
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[#A16541]/10 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-[#A16541]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <Fields
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
          />
        </div>

        {/* Apply Button */}
        <div className="pt-3">
          <button
            type="button"
            onClick={applyAndClose}
            className="w-full h-11 rounded-xl bg-[#A16541] text-white font-semibold shadow-md hover:scale-[1.02] transition"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>
    </div>
  );
}

/** Extracted fields so we can reuse between mobile and desktop */
function Fields({
  author,
  setAuthor,
  subject,
  setSubject,
  yearFrom,
  setYearFrom,
  yearTo,
  setYearTo,
  language,
  setLanguage,
  mobile = false,
}) {
  return (
    <div className="grid gap-5">
      {/* Author */}
      <div className="grid gap-1">
        <label className="text-sm text-[#7A4C2E]">Author</label>
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="h-11 rounded-lg border border-[#A16541]/30 bg-white px-3 text-[#A16541] focus:ring-2 focus:ring-[#A16541]/40 outline-none"
          placeholder="e.g., Jane Austen"
          inputMode="text"
        />
      </div>

      {/* Subject */}
      <div className="grid gap-1">
        <label className="text-sm text-[#7A4C2E]">Genre / Subject</label>
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="h-11 rounded-lg border border-[#A16541]/30 bg-white px-3 text-[#A16541] focus:ring-2 focus:ring-[#A16541]/40 outline-none"
          placeholder="e.g., Fantasy"
          inputMode="text"
        />

        {/* Chips: wrap nicely on desktop; horizontal scroll on mobile for easier tapping */}
        <div
          className={
            mobile
              ? "mt-2 -mx-1 flex overflow-x-auto no-scrollbar snap-x gap-2 px-1 py-1"
              : "flex flex-wrap gap-2 mt-2"
          }
        >
          {GENRE_TAGS.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setSubject(g)}
              className={`snap-start px-3 py-1.5 rounded-full text-xs border font-medium whitespace-nowrap transition-all ${
                subject === g
                  ? "bg-[#A16541] text-white border-[#A16541] shadow"
                  : "border-[#A16541]/30 text-[#A16541] hover:bg-[#A16541]/10"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Year range */}
      <div className="grid grid-cols-2 gap-4 sm:gap-6">
        <div className="grid gap-1">
          <label className="text-sm text-[#7A4C2E]">Year from</label>
          <input
            value={yearFrom}
            onChange={(e) => setYearFrom(e.target.value)}
            className="h-11 rounded-lg border border-[#A16541]/30 bg-white px-3 text-[#A16541] focus:ring-2 focus:ring-[#A16541]/40 outline-none"
            placeholder="1990"
            inputMode="numeric"
            pattern="[0-9]*"
          />
        </div>
        <div className="grid gap-1">
          <label className="text-sm text-[#7A4C2E]">Year to</label>
          <input
            value={yearTo}
            onChange={(e) => setYearTo(e.target.value)}
            className="h-11 rounded-lg border border-[#A16541]/30 bg-white px-3 text-[#A16541] focus:ring-2 focus:ring-[#A16541]/40 outline-none"
            placeholder="2025"
            inputMode="numeric"
            pattern="[0-9]*"
          />
        </div>
      </div>

      {/* Language */}
      <div className="grid gap-1">
        <label className="text-sm text-[#7A4C2E]">Language</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="h-11 rounded-lg border border-[#A16541]/30 bg-white px-3 text-[#A16541] focus:ring-2 focus:ring-[#A16541]/40 outline-none"
        >
          {LANGS.map((l) => (
            <option key={l.code} value={l.code}>
              {l.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
