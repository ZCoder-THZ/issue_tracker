'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

export function PaginationDemo({ itemCount, pageSize, currentPage }: any) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageCount = Math.ceil(Number(itemCount) / Number(pageSize));
  const page = Number(currentPage);

  if (pageCount <= 1) return null;

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`?${params.toString()}`);
  };

  const createPageLinks = () => {
    let pages = [];
    const pageRange = 3; // Number of pages to show around the current page

    const startPage = Math.max(1, page - pageRange);
    const endPage = Math.min(pageCount, page + pageRange);

    // Add the first page and ellipsis if necessary
    if (startPage > 1) {
      pages.push(
        <PaginationItem key={1}>
          <PaginationLink href="#" onClick={() => handlePageChange(1)}>
            1
          </PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        pages.push(
          <PaginationItem key="start-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    // Add the range of pages around the current page
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            isActive={i === page}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Add the last page and ellipsis if necessary
    if (endPage < pageCount) {
      if (endPage < pageCount - 1) {
        pages.push(
          <PaginationItem key="end-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      pages.push(
        <PaginationItem key={pageCount}>
          <PaginationLink href="#" onClick={() => handlePageChange(pageCount)}>
            {pageCount}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pages;
  };

  return (
    <Pagination className="float-end">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
          />
        </PaginationItem>
        {createPageLinks()}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= pageCount}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
