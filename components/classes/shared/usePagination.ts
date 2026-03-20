import { useCallback, useEffect, useMemo, useState } from 'react';

type UsePaginationOptions = {
  pageSize: number;
};

const usePagination = <T,>(items: T[], { pageSize }: UsePaginationOptions) => {
  const [page, setPage] = useState(1);

  const pageCount = useMemo(() => Math.max(1, Math.ceil(items.length / pageSize)), [items.length, pageSize]);

  useEffect(() => {
    setPage((currentPage) => Math.min(currentPage, pageCount));
  }, [pageCount]);

  const pagedItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  const prev = useCallback(() => {
    setPage((currentPage) => Math.max(1, currentPage - 1));
  }, []);

  const next = useCallback(() => {
    setPage((currentPage) => Math.min(pageCount, currentPage + 1));
  }, [pageCount]);

  return {
    page,
    pageCount,
    pagedItems,
    showPagination: items.length > pageSize,
    setPage,
    prev,
    next,
  };
};

export default usePagination;
