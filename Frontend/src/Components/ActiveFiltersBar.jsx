import React from "react";
import { X } from "lucide-react";

export default function ActiveFiltersBar({
  subject,
  author,
  yearFrom,
  yearTo,
  language,
  onClearKey,   // preferred: (key) => void
  onClearAll,   // preferred: () => void
  // optional legacy props (if you still pass them)
  onClearSubject,
  onClearAuthor,
  onClearYear,
  onClearLanguage,
}) {
  const chips = [];
  if (subject) chips.push({ k: "subject", label: `Subject: ${subject}` });
  if (author) chips.push({ k: "author", label: `Author: ${author}` });
  if (yearFrom) chips.push({ k: "yearFrom", label: `From: ${yearFrom}` });
  if (yearTo) chips.push({ k: "yearTo", label: `To: ${yearTo}` });
  if (language) chips.push({ k: "language", label: `Lang: ${language.toUpperCase()}` });

  if (!chips.length) return null;

  const handleClear = (k) => {
    if (onClearKey) return onClearKey(k);
    // fallback to legacy props so it still works if you forget to update parent
    if (k === "subject") onClearSubject?.();
    else if (k === "author") onClearAuthor?.();
    else if (k === "yearFrom" || k === "yearTo") onClearYear?.();
    else if (k === "language") onClearLanguage?.();
  };

  return (
    <div className="flex items-center flex-wrap gap-2 mb-4">
      {chips.map(({ k, label }) => (
        <span
          key={k}
          className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm border border-[#A16541]/30 bg-[#FFF8F3] text-[#A16541] shadow-sm"
        >
          {label}
          <button
            type="button"
            onClick={() => handleClear(k)}
            className="grid place-items-center w-5 h-5 rounded-full hover:bg-[#A16541]/15"
            aria-label={`Remove ${label}`}
          >
            <X className="w-4 h-4 text-[#A16541]" />
          </button>
        </span>
      ))}

      <button
        type="button"
        onClick={onClearAll}
        className="ml-2 text-sm text-[#A16541] underline-offset-2 hover:underline"
      >
        Clear all
      </button>
    </div>
  );
}
