import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Users } from "lucide-react";
import { GENRE_TAGS, TOP_AUTHORS } from "./constants";

export default function GenresMenu() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  
  const chunkSize = 8;
  const columns = [];
  for (let i = 0; i < GENRE_TAGS.length; i += chunkSize) {
    columns.push(GENRE_TAGS.slice(i, i + chunkSize));
  }

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    function handleEsc(e) {
      if (e.key === "Escape") setOpen(false);
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEsc);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1 hover:underline"
        aria-haspopup="true"
        aria-expanded={open}
      >
        Genres <ChevronDown className="w-4 h-4" />
      </button>

      {open && (
        <div
          className="absolute left-0 mt-2 w-[760px] rounded-xl shadow-lg bg-white border border-[#A16541]/20 z-50"
        >
          <div className="grid grid-cols-3">
         
            <div className="col-span-2 p-4">
              <h4 className="text-xs font-semibold text-[#7A4C2E] mb-2 tracking-wide">
                BROWSE GENRES
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {columns.map((col, idx) => (
                  <ul key={idx} className="space-y-1">
                    {col.map((g) => (
                      <li key={g}>
                        <button
                          type="button"
                          className="text-left w-full text-sm text-[#A16541] hover:bg-[#A16541]/10 px-2 py-1 rounded-md transition"
                          onClick={() => {
                            window.dispatchEvent(
                              new CustomEvent("bf:set-subject", { detail: g })
                            );
                            setOpen(false); // close after selecting
                          }}
                        >
                          {g}
                        </button>
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>

            {/* AUTHORS */}
            <div className="col-span-1 p-4 border-l border-[#E7D9CF] bg-[#FFFCFA] rounded-r-xl">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-[#A16541]" />
                <h4 className="text-xs font-semibold text-[#7A4C2E] tracking-wide">
                  AUTHORS
                </h4>
              </div>
              <ul className="max-h-64 overflow-auto pr-1 space-y-1">
                {TOP_AUTHORS.map((name) => (
                  <li key={name}>
                    <button
                      type="button"
                      className="text-left w-full text-sm text-[#A16541] hover:bg-[#A16541]/10 px-2 py-1 rounded-md transition"
                      onClick={() => {
                        window.dispatchEvent(
                          new CustomEvent("bf:set-author", { detail: name })
                        );
                        setOpen(false); // close after selecting
                      }}
                    >
                      {name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
