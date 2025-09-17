import React from "react";
import { buildCoverUrl } from "./Components/constants";

export default function BookCard({ book }) {
  const cover = buildCoverUrl(book.cover_i, "L");
  const workUrl = book.key?.startsWith("/")
    ? `https://openlibrary.org${book.key}`
    : `https://openlibrary.org/works/${book.key}`;

  return (
    <article className="group rounded-xl overflow-hidden border border-[#E2DDD3] bg-[#FAF7F2] hover:shadow-xl transition-shadow">
      <a href={workUrl} target="_blank" rel="noreferrer" className="block">
        <div className="relative">
          <img
            src={cover}
            alt={book.title}
            className="w-full aspect-[2/3] object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <div className="p-3">
          <h3 title={book.title} className="font-semibold leading-snug line-clamp-2 min-h-[2.6rem] text-[#3E3E3E]">
            {book.title}
          </h3>
          <p className="text-sm text-[#5B5B5B] line-clamp-1">
            {book.author_name}
          </p>

          <div className="mt-2 flex items-center justify-between text-xs text-[#5B5B5B]">
            <span>{book.first_publish_year || "—"}</span>
            <span className="inline-flex items-center gap-1" title="Approx. editions">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFBFA9] inline-block" />
              {book.edition_count || 0} eds
            </span>
          </div>

          {book.subject?.length > 0 && (
            <div className="mt-2 flex gap-1.5 flex-wrap">
              {book.subject.slice(0, 3).map((s) => (
                <span
                  key={s}
                  className="text-[10px] px-2 py-0.5 rounded-full border border-[#E2DDD3] bg-[#EDE7DD] text-[#5B5B5B]"
                >
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      </a>
    </article>
  );
}
