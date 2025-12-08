"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface BillPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function BillPagination({
  currentPage,
  totalPages,
  onPageChange,
}: BillPaginationProps) {
  const handlePageChange = (e: React.MouseEvent, page: number) => {
    e.preventDefault();
    if (page >= 0 && page < totalPages) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const showMax = 5;

    let startPage = Math.max(0, currentPage - 2);
    let endPage = Math.min(totalPages - 1, startPage + showMax - 1);

    if (endPage - startPage < showMax - 1) {
      startPage = Math.max(0, endPage - showMax + 1);
    }

    if (startPage > 0) {
      pages.push(
        <PaginationItem key="first">
          <PaginationLink href="#" onClick={(e) => handlePageChange(e, 0)}>
            1
          </PaginationLink>
        </PaginationItem>
      );
      if (startPage > 1) {
        pages.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            isActive={i === currentPage}
            onClick={(e) => handlePageChange(e, i)}
          >
            {i + 1}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages - 1) {
      if (endPage < totalPages - 2) {
        pages.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      pages.push(
        <PaginationItem key="last">
          <PaginationLink
            href="#"
            onClick={(e) => handlePageChange(e, totalPages - 1)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => handlePageChange(e, currentPage - 1)}
            className={currentPage === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            aria-disabled={currentPage === 0}
          />
        </PaginationItem>

        {renderPageNumbers()}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => handlePageChange(e, currentPage + 1)}
            className={
              currentPage === totalPages - 1
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
            aria-disabled={currentPage === totalPages - 1}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}