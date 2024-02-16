'use client';

import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
import Link from 'next/link';

const PaginationExample = () => {
  return (
    <div className='flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6'>
      <div className='flex justify-between flex-1 sm:hidden'>
        <Link
          href='#'
          className='relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50'
        >
          Previous
        </Link>
        <Link
          href='#'
          className='relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50'
        >
          Next
        </Link>
      </div>
      <div className='hidden sm:flex sm:flex-1 sm:items-center sm:justify-between'>
        <div>
          <p className='text-sm text-gray-700'>
            Showing <span className='font-medium'>1</span> to{' '}
            <span className='font-medium'>10</span> of{' '}
            <span className='font-medium'>97</span> results
          </p>
        </div>
        <div>
          <nav
            className='inline-flex -space-x-px rounded-md shadow-sm isolate'
            aria-label='Pagination'
          >
            <Link
              href='#'
              className='relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 focus:z-20'
            >
              <span className='sr-only'>Previous</span>
              <HiChevronLeft className='w-5 h-5' aria-hidden='true' />
            </Link>
            {/* Current: "z-10 bg-indigo-50 border-indigo-500 text-indigo-600", Default: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" */}
            <Link
              href='#'
              aria-current='page'
              className='relative z-10 inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-500 bg-indigo-50 focus:z-20'
            >
              1
            </Link>
            <Link
              href='#'
              className='relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 focus:z-20'
            >
              2
            </Link>
            <Link
              href='#'
              className='relative items-center hidden px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 focus:z-20 md:inline-flex'
            >
              3
            </Link>
            <span className='relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300'>
              ...
            </span>
            <Link
              href='#'
              className='relative items-center hidden px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 focus:z-20 md:inline-flex'
            >
              8
            </Link>
            <Link
              href='#'
              className='relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 focus:z-20'
            >
              9
            </Link>
            <Link
              href='#'
              className='relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 focus:z-20'
            >
              10
            </Link>
            <Link
              href='#'
              className='relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 focus:z-20'
            >
              <span className='sr-only'>Next</span>
              <HiChevronRight className='w-5 h-5' aria-hidden='true' />
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default PaginationExample;
