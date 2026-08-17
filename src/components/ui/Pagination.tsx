import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onNextPage: () => void;
  onPreviousPage: () => void;
  onPageClick: (page: number) => void;
  onFirstPage: () => void;
  onLastPage: () => void;
}

function Pagination({
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  onNextPage,
  onPreviousPage,
  onPageClick,
  onFirstPage,
  onLastPage,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Generate page numbers to display
  // Shows: first page, ellipsis, current-1, current, current+1, ellipsis, last page
  const getPageNumbers = (): (number | "ellipsis")[] => {
    const pages: (number | "ellipsis")[] = [];

    pages.push(1);

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    if (start > 2) {
      pages.push("ellipsis");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) {
      pages.push("ellipsis");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav
      className="flex items-center justify-center gap-1 mt-8"
      aria-label="Pagination"
    >
      {/* First page button */}
      <button
        onClick={onFirstPage}
        disabled={!hasPreviousPage}
        className="p-2 rounded-lg border border-neutral-200 text-neutral-500
                   disabled:opacity-30 disabled:cursor-not-allowed
                   hover:bg-neutral-50 hover:text-neutral-700 transition-colors cursor-pointer"
        aria-label="Go to first page"
      >
        <ChevronsLeft className="w-4 h-4" />
      </button>

      {/* Previous page button */}
      <button
        onClick={onPreviousPage}
        disabled={!hasPreviousPage}
        className="p-2 rounded-lg border border-neutral-200 text-neutral-500
                   disabled:opacity-30 disabled:cursor-not-allowed
                   hover:bg-neutral-50 hover:text-neutral-700 transition-colors cursor-pointer"
        aria-label="Go to previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) => {
          if (page === "ellipsis") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="w-9 h-9 flex items-center justify-center text-neutral-400 text-sm"
              >
                ...
              </span>
            );
          }

          const isActive = page === currentPage;

          return (
            <button
              key={page}
              onClick={() => onPageClick(page)}
              disabled={isActive}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors cursor-pointer
                ${
                  isActive
                    ? "bg-primary-600 text-white cursor-default"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
              aria-label={`Go to page ${page}`}
              aria-current={isActive ? "page" : undefined}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next page button */}
      <button
        onClick={onNextPage}
        disabled={!hasNextPage}
        className="p-2 rounded-lg border border-neutral-200 text-neutral-500
                   disabled:opacity-30 disabled:cursor-not-allowed
                   hover:bg-neutral-50 hover:text-neutral-700 transition-colors cursor-pointer"
        aria-label="Go to next page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Last page button */}
      <button
        onClick={onLastPage}
        disabled={!hasNextPage}
        className="p-2 rounded-lg border border-neutral-200 text-neutral-500
                   disabled:opacity-30 disabled:cursor-not-allowed
                   hover:bg-neutral-50 hover:text-neutral-700 transition-colors cursor-pointer"
        aria-label="Go to last page"
      >
        <ChevronsRight className="w-4 h-4" />
      </button>
    </nav>
  );
}

export default Pagination;
