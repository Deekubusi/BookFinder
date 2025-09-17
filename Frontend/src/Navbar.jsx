import React, { useEffect, useState } from "react";
import {
  Search,
  Menu,
  X,
  SlidersHorizontal,
  BookOpen,
  Filter,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import GenresMenu from "./Components/GenresMenu";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [local, setLocal] = useState("");
  const navigate = useNavigate();

  const submitSearch = () => {
    const q = local.trim();
    navigate("/");
    window.dispatchEvent(new CustomEvent("bf:submit-search", { detail: q }));
    // collapse mobile search after submit
    setMobileSearchOpen(false);
  };

  // Close sheets on route change (optional if you use NavLink)
  useEffect(() => {
    const closeOnNav = () => {
      setMobileOpen(false);
      setMobileSearchOpen(false);
    };
    window.addEventListener("popstate", closeOnNav);
    return () => window.removeEventListener("popstate", closeOnNav);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#A16541]/20 shadow-sm supports-[padding:max(0px)]:pt-[env(safe-area-inset-top)]">
      {/* Top bar */}
      <div className="w-full px-3 sm:px-6">
        <div className="h-14 sm:h-16 flex items-center gap-2">
          {/* Mobile: Hamburger */}
          <button
            className="inline-flex sm:hidden p-2 rounded-lg hover:bg-[#A16541]/10"
            onClick={() => setMobileOpen((s) => !s)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-5 h-5 text-[#A16541]" />
            ) : (
              <Menu className="w-5 h-5 text-[#A16541]" />
            )}
          </button>

          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer select-none"
            onClick={() => navigate("/#results")}
            aria-label="Go to Home"
            role="button"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 grid place-items-center rounded-full bg-gradient-to-tr from-[#A16541] via-[#C88C5D] to-[#FFD4B0] shadow-md">
              <BookOpen className="w-5 h-5 text-white drop-shadow" />
            </div>
            <span className="text-lg sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-[#A16541] via-[#C88C5D] to-[#FFD4B0] bg-clip-text text-transparent">
              BookFinder
            </span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden sm:flex ml-4 items-center gap-4 text-sm text-[#A16541]">
            <NavLink to="/#results" className="hover:underline">Home</NavLink>
            <NavLink to="/trending" className="hover:underline">Trending</NavLink>
            <GenresMenu />
          </nav>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Desktop search */}
          <div className="hidden sm:block flex-1 max-w-xl">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A16541]" />
              <input
                value={local}
                onChange={(e) => setLocal(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitSearch()}
                placeholder="Search by title, author, or keyword…"
                className="w-full rounded-xl border border-[#A16541]/30 bg-white text-[#A16541] pl-10 pr-28 h-11 outline-none focus:ring-2 focus:ring-[#A16541] placeholder:text-[#A16541]/50"
                aria-label="Search books"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <button
                  onClick={submitSearch}
                  className="px-3 py-1.5 rounded-lg text-sm bg-[#A16541] text-white font-medium shadow hover:scale-105 transition"
                >
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Desktop filters */}
          <button
            onClick={() => window.dispatchEvent(new Event("bf:open-filters"))}
            className="hidden sm:inline-flex px-3 py-2 rounded-lg text-sm border border-[#A16541]/30 text-[#A16541] hover:bg-[#A16541]/10 transition"
            aria-label="Open filters"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
          </button>

          {/* Mobile: search + filter icons */}
          <div className="sm:hidden flex items-center gap-1 ml-1">
            <button
              onClick={() => setMobileSearchOpen((v) => !v)}
              className="p-2 rounded-lg hover:bg-[#A16541]/10"
              aria-expanded={mobileSearchOpen}
              aria-controls="mobile-search"
              aria-label="Toggle search"
            >
              <Search className="w-5 h-5 text-[#A16541]" />
            </button>
            <button
              onClick={() => window.dispatchEvent(new Event("bf:open-filters"))}
              className="p-2 rounded-lg hover:bg-[#A16541]/10"
              aria-label="Open filters"
            >
              <Filter className="w-5 h-5 text-[#A16541]" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile slide-down search */}
      <div
        id="mobile-search"
        className={`sm:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-out ${
          mobileSearchOpen ? "max-h-28 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-3 pb-3 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A16541]" />
            <input
              value={local}
              onChange={(e) => setLocal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitSearch()}
              placeholder="Search books…"
              className="w-full h-11 rounded-xl border border-[#A16541]/30 bg-white text-[#A16541] pl-10 pr-24 outline-none focus:ring-2 focus:ring-[#A16541] placeholder:text-[#A16541]/50"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button
                onClick={() => setLocal("")}
                className="px-2 py-1 rounded-lg text-xs border border-[#A16541]/30 text-[#A16541] hover:bg-[#A16541]/10"
              >
                Clear
              </button>
              <button
                onClick={submitSearch}
                className="px-3 py-1.5 rounded-lg text-sm bg-[#A16541] text-white font-medium shadow"
              >
                Go
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu sheet */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-[#A16541]/15 bg-white text-[#A16541]">
          <div className="px-3 py-3 grid gap-1.5 text-sm">
            <NavLink
              to="/#results"
              className="px-2 py-2 rounded-lg hover:bg-[#A16541]/10"
              onClick={() => setMobileOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/trending"
              className="px-2 py-2 rounded-lg hover:bg-[#A16541]/10"
              onClick={() => setMobileOpen(false)}
            >
              Trending
            </NavLink>

            <button
              onClick={() => {
                window.dispatchEvent(new Event("bf:open-filters"));
                setMobileOpen(false);
              }}
              className="mt-1 px-2 py-2 rounded-lg border border-[#A16541]/30 hover:bg-[#A16541]/10 inline-flex items-center"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
