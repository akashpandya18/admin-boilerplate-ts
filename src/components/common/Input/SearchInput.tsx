'use client';

import { Input } from '@/components/ui/input';
interface SearchInputProps {
  id: string;
  name: string;
  type: string;
  onChange: (e: any) => void;
  placeholder: string;
  value?: string;
}

const SearchInput = ({
  id,
  name,
  type,
  onChange,
  placeholder,
  value,
}: SearchInputProps) => {
  return (
    <div className='relative'>
      <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
        <svg
          className='w-5 h-5 text-gray-500 dark:text-gray-400'
          aria-hidden='true'
          fill='currentColor'
          viewBox='0 0 20 20'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            fillRule='evenodd'
            d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
            clipRule='evenodd'
          ></path>
        </svg>
      </div>
      <Input
        type={type}
        id={id}
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        value={value}
        className='block p-2 rounded-3xl pl-10 w-80 sm:w-[400px] md:w-85 appearance-none border border-gray-300 px-3 py-2 placeholder-gray-400 placeholder:text-sm focus:border-admin-primary focus:outline-none focus:ring-admin-primary sm:text-sm'
      />
    </div>
  );
};

export default SearchInput;
