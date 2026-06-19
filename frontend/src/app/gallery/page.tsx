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
 * DATA SOURCE: GET /api/tattoos backed by the Express API.
 */

import { useEffect, useState } from "react";
import SearchBar from "@/components/ui/SearchBar";
import FilterPills from "@/components/ui/FilterPills";
import TattooCard from "@/components/ui/TattooCard";
import { getTattoos, TattoosResponse, TattooApiItem } from "@/lib/api";
import { TATTOO_STYLES, Tattoo } from "@/lib/types";

const ITEMS_PER_PAGE = 8;

export default function GalleryPage() {
  const [searchText, setSearchText] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [tattoos, setTattoos] = useState<Tattoo[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTattoos() {
      setIsLoading(true);
      setError(null);

      try {
        const response: TattoosResponse = await getTattoos({
          style: selectedStyle,
          search: searchText,
          page: currentPage,
          limit: ITEMS_PER_PAGE,
        });

        const normalizedTattoos: Tattoo[] = response.data.map(
          (tattoo: TattooApiItem) => ({
            ...tattoo,
            id: tattoo._id ?? tattoo.id,
          })
        );

        setTattoos(normalizedTattoos);
        setTotalPages(response.totalPages);
        setTotalResults(response.total);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load tattoos. Please try again."
        );
        setTattoos([]);
        setTotalPages(1);
        setTotalResults(0);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTattoos();
  }, [searchText, selectedStyle, currentPage]);

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
        {totalResults} design{totalResults !== 1 ? "s" : ""} found
      </p>

      {error ? (
        <div className="mt-8 rounded-lg border border-ink-border bg-ink-surface p-6 text-center text-sm text-ink-crimson-bright">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <div className="mt-16 text-center text-ink-muted">Loading designs…</div>
      ) : tattoos.length > 0 ? (
        <div className="mt-4 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {tattoos.map((tattoo) => (
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
