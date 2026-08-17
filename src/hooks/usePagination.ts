export interface UsePaginationOptions {
  pageSize?: number;
  initialPage?: number;
}

export interface PaginationInfo<T> {
  currentItems: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startIndex: number;
  endIndex: number;
}

export interface PaginationActions {
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToPage: (page: number) => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
}
