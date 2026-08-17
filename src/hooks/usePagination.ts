import { useState, useMemo, useCallback } from "react";

interface UsePaginationOptions {
  pageSize?: number;
  initialPage?: number;
}

interface PaginationInfo<T> {
  currentItems: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startIndex: number;
  endIndex: number;
}

interface PaginationActions {
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToPage: (page: number) => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
}

function usePagination<T>(
  data: T[],
  options: UsePaginationOptions = {},
): PaginationInfo<T> & PaginationActions {
  const { pageSize = 12, initialPage = 1 } = options;
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(data.length / pageSize)),
    [data.length, pageSize],
  );

  const safeCurrentPage = useMemo(
    () => Math.min(currentPage, totalPages),
    [currentPage, totalPages],
  );

  const paginationInfo = useMemo((): PaginationInfo<T> => {
    const totalItems = data.length;
    const startIndex = (safeCurrentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentItems = data.slice(startIndex, endIndex);

    return {
      currentItems,
      currentPage: safeCurrentPage,
      totalPages,
      totalItems,
      hasNextPage: safeCurrentPage < totalPages,
      hasPreviousPage: safeCurrentPage > 1,
      startIndex,
      endIndex,
    };
  }, [data, pageSize, safeCurrentPage, totalPages]);

  const goToNextPage = useCallback(() => {
    setCurrentPage((prev) => prev + 1);
  }, []);

  const goToPreviousPage = useCallback(() => {
    setCurrentPage((prev) => prev - 1);
  }, []);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const goToFirstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const goToLastPage = useCallback(() => {
    setCurrentPage(totalPages);
  }, [totalPages]);

  return {
    ...paginationInfo,
    goToNextPage,
    goToPreviousPage,
    goToPage,
    goToFirstPage,
    goToLastPage,
  };
}

export default usePagination;
export type { UsePaginationOptions, PaginationInfo, PaginationActions };
