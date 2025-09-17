import React, { useEffect, useState } from "react";
import ResultsGrid from "../Components/ResultsGrid";

export default function TrendingPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const ac = new AbortController();

    const run = async () => {
      setLoading(true);
      setErr("");
      try {
        // Broad query, sort by most editions as a proxy for "trending/popular"
        const url = "https://openlibrary.org/search.json?q=the&sort=editions&limit=40";
        const res = await fetch(url, { signal: ac.signal });
        if (!res.ok) throw new Error(`OpenLibrary error ${res.status}`);
        const data = await res.json();

        // Normalize to the same shape LandingPage uses so ResultsGrid behaves identically
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

        setItems(normalized);
      } catch (e) {
        if (e.name !== "AbortError") setErr(e.message || "Failed to load trending");
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }
    };

    run();
    return () => ac.abort();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h2 className="text-2xl font-bold text-[#A16541] mb-4">Trending</h2>

      {err && (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-700">
          {err}
        </div>
      )}

      {/* Always render ResultsGrid and let it show its own skeleton just like LandingPage */}
      <ResultsGrid items={items} loading={loading} error={err} />
    </div>
  );
}
