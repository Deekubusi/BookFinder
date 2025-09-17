import React from "react";
import BookCard from "../BookCard";
import { Loader2 } from "lucide-react";

export default function ResultsGrid({ items, loading, error, sort, setSort }) {
  return (
    <section id="discover" className="pb-16 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* for sort */}
        <div className="flex items-end justify-between mb-3">
          <div className="flex items-center gap-2 text-sm">
            <label className="text-neutral-600 dark:text-neutral-400 mt-2">Sort</label>
           <div className="relative">
  <select
    value={sort}
    onChange={(e) => setSort(e.target.value)}
    className="h-10 rounded-[12px] border border-[#CBD5E1] bg-white px-4 pr-10 text-sm text-[#001433]
               focus:outline-none focus:ring-2 focus:ring-[#A16541] transition-all duration-200 appearance-none"
  >
    <option value="relevance">Relevance</option>
    <option value="newest">Newest</option>
  </select>

  {/* down arrow icon */}
  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#A16541]">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  </span>
</div>



          </div>
        </div>

        {error && (
          <div className="p-4 border border-rose-200 dark:border-rose-900/50 bg-rose-50/60 dark:bg-rose-500/10 rounded-xl text-rose-700 dark:text-rose-200 mb-4">
            {error}
          </div>
        )}
{/* results */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {loading && items.length === 0 &&
            new Array(10).fill(0).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-xl overflow-hidden border border-black/5 dark:border-white/10"
              >
                <div className="aspect-[2/3] bg-neutral-200/70 dark:bg-neutral-800" />
                <div className="p-3 space-y-2">
                  <div className="h-3 w-3/4 bg-neutral-200/70 dark:bg-neutral-800 rounded" />
                  <div className="h-3 w-1/2 bg-neutral-200/70 dark:bg-neutral-800 rounded" />
                </div>
              </div>
            ))}

          {items.map((b) => (
            <BookCard key={b.key} book={b} />
          ))}
        </div>
{/* if no results */}
        {!loading && items.length === 0 && !error && (
          <div className="text-center py-16 text-neutral-500">
            No results yet — try a different search.
          </div>
        )}

        {loading && items.length > 0 && (
          <div className="flex justify-center mt-6 text-neutral-500">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
        )}
      </div>
    </section>
  );
}
