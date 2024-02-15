'use client';

import { DOTS, usePagination } from '@/app/hooks/usePagination';
import { HiArrowLeft, HiArrowRight } from 'react-icons/hi2';

const Pagination = (props) => {
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
  let lastPage = paginationRange[paginationRange.length - 1];

  return (
    <div className='px-4 py-4 bg-white border-r border-l border-b border-gray-200 rounded-b-[15px]'>
      <ul className='flex justify-between mb-0'>
        <li
          className={`${
            currentPage === 1 ? 'opacity-50' : 'cursor-pointer '
          } flex`}
          onClick={currentPage !== 1 ? onPrevious : undefined}
        >
          <span
            className={`relative inline-flex text-[#0B0F18] items-center rounded-3xl border border-gray-300 bg-white pl-3 pr-4 py-2 text-sm font-medium hover:bg-gray-50 focus:z-20`}
          >
            <HiArrowLeft className='w-5 h-5 mr-2' aria-hidden='true' />
            <span>Previous</span>
          </span>
        </li>

        <div className='hidden space-x-2 sm:flex'>
          {paginationRange.map((pageNumber, index) => {
            if (pageNumber === DOTS) {
              return (
                <span
                  key={index}
                  className='relative inline-flex items-center bg-white px-3 py-2 text-sm font-medium text-[#606060]'
                >
                  ...
                </span>
              );
            }

            return (
              <div key={index} className='flex items-center'>
                <li
                  onClick={() => onPageChange(pageNumber)}
                  className={`cursor-pointer w-[45px] h-[45px] flex justify-center items-center ${
                    pageNumber === currentPage
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
                      : 'border-gray-300 bg-white text-[#606060] hover:bg-gray-100'
                  } text-center rounded-[50%] text-sm font-medium focus:z-20`}
                >
                  <span>{pageNumber}</span>
                </li>
              </div>
            );
          })}
        </div>

        <div className='sm:hidden w-[45px] h-[45px] flex justify-center items-center text-sm font-medium rounded-[50%] bg-indigo-50 text-indigo-600'>
          {currentPage}
        </div>

        <li
          className={`${
            currentPage === lastPage ? 'opacity-75' : 'cursor-pointer'
          } flex`}
          onClick={currentPage !== lastPage ? onNext : undefined}
        >
          <span
            className={`relative inline-flex text-[#0B0F18] items-center rounded-3xl border border-gray-300 bg-white pl-4 pr-3 py-2 text-sm font-medium ${
              currentPage === lastPage ? 'text-gray-200' : 'text-gray-500'
            } hover:bg-gray-50 focus:z-20`}
          >
            <span>Next</span>
            <HiArrowRight className='w-5 h-5 ml-2' aria-hidden='true' />
          </span>
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
