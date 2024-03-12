'use client';

import { DOTS, usePagination } from '@/hooks/usePagination';
import {
  Pagination as PaginationContainer,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface PaginationProps {
  onPageChange: (page: number | string) => void;
  totalCount: number;
  siblingCount?: number;
  currentPage: number;
  pageSize: number;
}

const Pagination = (props: PaginationProps) => {
  const {
    onPageChange,
    totalCount,
    siblingCount = 1,
    currentPage,
    pageSize,
  } = props;

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };
  const lastPage = paginationRange[paginationRange.length - 1];

  return (
    <PaginationContainer className='py-4'>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href='#'
            className={`${
              currentPage === 1 ? 'opacity-50' : 'cursor-pointer '
            }`}
            onClick={currentPage !== 1 ? onPrevious : undefined}
          />
        </PaginationItem>

        <PaginationItem className='hidden space-x-2 sm:flex'>
          {paginationRange.map((pageNumber, index) => {
            if (pageNumber === DOTS) {
              return <PaginationEllipsis />;
            }

            return (
              <PaginationLink
                href='#'
                key={index}
                onClick={() => onPageChange(pageNumber)}
                className={`cursor-pointer ${
                  pageNumber === currentPage
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
                    : 'border-gray-300 bg-white text-[#606060] hover:bg-gray-100'
                } text-center text-sm font-medium focus:z-20`}
              >
                {pageNumber}
              </PaginationLink>
            );
          })}
        </PaginationItem>

        <PaginationItem className='sm:hidden w-[45px] h-[45px] flex justify-center items-center text-sm font-medium'>
          <PaginationLink href='#'>{currentPage}</PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginationNext
            href='#'
            className={`${
              currentPage === lastPage ? 'opacity-75' : 'cursor-pointer'
            } flex`}
            onClick={currentPage !== lastPage ? onNext : undefined}
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationContainer>
  );
};

export default Pagination;
