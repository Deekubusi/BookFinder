import React from "react";
import { Tag } from "lucide-react";
import { GENRE_TAGS } from "./constants";

export default function HeroSection({ onTagClick }) {
  return (
    <section
      id="hero"
      className="h-screen bg-cover bg-center flex items-center justify-center text-center pb-7"
      style={{ backgroundImage: "url('/bookswallpaper.jpg')" }} // bg image
    >
      {/* heading */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-black">
          Find your next{" "}
          <span className="text-white">addictive</span>{" "}
          read
        </h1>
{/* sub heading */}
        <p className="mt-3 text-white max-w-xl mx-auto">
          Search across millions of books by title, author, genre, year, and language. No sign-in. Just stories.
        </p>
{/* subject buttons */}
        <div className="mt-6 flex flex-wrap justify-center gap-2" id="trending">
          {GENRE_TAGS.slice(0, 6).map((g) => (
            <button
              key={g}
              onClick={() => onTagClick(g)}
              className="px-3 py-1.5 rounded-full text-sm border border-[#E2DDD3] bg-[#EDE7DD] text-[#5B5B5B] hover:bg-[#FCDDB0]/60"
            >
            {/* icon in button */}
              <Tag className="w-3.5 h-3.5 mr-1 inline text-[#9A7D7D]" /> {g}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
