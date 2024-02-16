'use client';

import { HiChevronRight, HiHome } from 'react-icons/hi2';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface BreadcrumbProps {
  pageList: {
    name: string;
    href: string;
    current?: boolean;
  }[];
}

const Breadcrumb = ({ pageList }: BreadcrumbProps) => {
  const pathname = usePathname();
  return (
    <nav className='flex pb-4 border-b border-gray-200' aria-label='Breadcrumb'>
      <ol role='list' className='flex items-center space-x-4'>
        <li>
          <div>
            <Link
              href='/'
              className={`
                ${pathname == '/' ? 'cursor-default' : 'hover:text-gray-500'}
                text-gray-400`}
            >
              <HiHome className='flex-shrink-0 w-5 h-5' aria-hidden='true' />
              <span className='sr-only'>Home</span>
            </Link>
          </div>
        </li>
        {pageList?.map((page) => (
          <li key={page.name}>
            <div className='flex items-center'>
              <HiChevronRight
                className='flex-shrink-0 w-5 h-5 text-gray-400'
                aria-hidden='true'
              />
              <Link
                href={page.href}
                className={`${
                  page.href === pathname
                    ? 'text-admin-primary cursor-default'
                    : 'text-gray-500 cursor-pointer hover:text-gray-700'
                } ml-4 text-sm font-medium `}
                aria-current={page.current ? 'page' : undefined}
              >
                {page.name}
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
