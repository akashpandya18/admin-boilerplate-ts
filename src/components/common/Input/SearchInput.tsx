'use client';

import { Input } from '@/components/ui/input';
import { HiSearch } from 'react-icons/hi';
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
        <HiSearch className='w-5 h-5 text-gray-500' />
      </div>
      <Input
        type={type}
        id={id}
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        value={value}
        className='rounded-3xl !pl-10 w-80 sm:w-[400px] md:w-85 appearance-none border border-gray-300 placeholder-gray-400 placeholder:text-sm focus:border-admin-primary focus:outline-none focus:ring-admin-primary sm:text-sm'
      />
    </div>
  );
};

export default SearchInput;
