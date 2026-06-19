"use client";

/**
 * ============================================================
 * src/app/gallery/page.tsx
 * ============================================================
 *
 * The Gallery page: heading, search bar, style filter pills,
 * a responsive grid of TattooCards, and pagination.
 *
 * "use client" is required because this page has interactive
 * state: the search text, the selected filter, and the current
 * page number all live here and change as the user interacts.
 *
 * DATA SOURCE: mockTattoos (src/lib/mockData.ts) for now.
 * In Phase 6, we'll replace this with a real fetch() to our
 * Express API's GET /api/tattoos endpoint - the rest of this
 * page's logic (filtering, search, pagination) stays the same.
 */

import { useMemo, useState } from "react";
import SearchBar from "@/components/ui/SearchBar";
import FilterPills from "@/components/ui/FilterPills";
import TattooCard from "@/components/ui/TattooCard";
import { mockTattoos } from "@/lib/mockData";
import { TATTOO_STYLES } from "@/lib/types";

const ITEMS_PER_PAGE = 8;

export default function GalleryPage() {
  const [searchText, setSearchText] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);

  // useMemo recalculates this filtered list ONLY when searchText,
  // selectedStyle, or the underlying data changes - not on every
  // render. For a small mock array this barely matters, but it's
  // the correct pattern for when this becomes real, larger API data.
  const filteredTattoos = useMemo(() => {
    return mockTattoos.filter((tattoo) => {
      const matchesStyle =
        selectedStyle === "All" || tattoo.style === selectedStyle;
      const matchesSearch = tattoo.title
        .toLowerCase()
        .includes(searchText.toLowerCase());
      return matchesStyle && matchesSearch;
    });
  }, [searchText, selectedStyle]);

  const totalPages = Math.ceil(filteredTattoos.length / ITEMS_PER_PAGE);

  // Slice out just the tattoos for the CURRENT page.
  // e.g. page 1 -> items 0-7, page 2 -> items 8-15, etc.
  const paginatedTattoos = filteredTattoos.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Whenever the search text or filter changes, jump back to page 1.
  // Without this, you could be on page 3 of "All", switch to a
  // filter with only 1 page of results, and see an empty grid.
  function handleFilterChange(newStyle: string) {
    setSelectedStyle(newStyle);
    setCurrentPage(1);
  }

  function handleSearchChange(newText: string) {
    setSearchText(newText);
    setCurrentPage(1);
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      {/* Heading */}
      <div className="text-center">
        <h1 className="font-display text-4xl sm:text-5xl">
          The <span className="text-ink-crimson-bright">Gallery</span>
        </h1>
        <p className="mt-3 text-ink-muted">
          Curated designs from independent artists worldwide.
        </p>
      </div>

      {/* Search */}
      <div className="mx-auto mt-8 max-w-xl">
        <SearchBar
          value={searchText}
          onChange={handleSearchChange}
          placeholder="Search designs, styles..."
        />
      </div>

      {/* Filter pills */}
      <div className="mt-6 flex justify-center">
        <FilterPills
          options={TATTOO_STYLES}
          selected={selectedStyle}
          onSelect={handleFilterChange}
        />
      </div>

      {/* Results count */}
      <p className="mt-8 text-sm text-ink-muted">
        {filteredTattoos.length} design
        {filteredTattoos.length !== 1 ? "s" : ""} found
      </p>

      {/* Tattoo grid */}
      {paginatedTattoos.length > 0 ? (
        <div className="mt-4 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {paginatedTattoos.map((tattoo) => (
            <TattooCard key={tattoo.id} tattoo={tattoo} />
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center text-ink-muted">
          No designs match your search. Try a different style or keyword.
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => {
            const pageNumber = i + 1;
            const isActive = pageNumber === currentPage;
            return (
              <button
                key={pageNumber}
                onClick={() => setCurrentPage(pageNumber)}
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-ink-crimson text-ink-cream"
                    : "border border-ink-border text-ink-muted hover:text-ink-cream"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
