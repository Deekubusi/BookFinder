import React from "react";
import { X } from "lucide-react"; //icon for remove purpose

export default function ActiveFiltersBar({
  subject,
  author,
  yearFrom,
  yearTo,
  language,
  onClearKey,   
  onClearAll,   
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

  if (!chips.length) return null; // not render when no active filters

  const handleClear = (k) => {
    if (onClearKey) return onClearKey(k);
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
          {/* to remove  filter */}
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
{/* clear all  button*/}
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
