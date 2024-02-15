'use client';

import { HiEye, HiEyeSlash, HiArrowTopRightOnSquare } from 'react-icons/hi2';
import { useState } from 'react';
import { MaxCharlimit } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface CommonInputProps {
  id: string;
  name: string;
  value: string;
  label: string;
  error: string;
  type: string;
  onChange: (e: any) => void;
  disabled: boolean;
  isRequired: boolean;
  isIcon: boolean;
  placeholder: string;
  classNames?: string;
  isLengthValidate?: boolean;
  domain_url_name: string;
  autocomplete?: string;
}

const CommonInput = ({
  id,
  name,
  value,
  label,
  error,
  type,
  onChange,
  disabled,
  isRequired,
  isIcon,
  placeholder,
  classNames,
  isLengthValidate,
  domain_url_name,
  autocomplete = 'off',
  ...props
}: CommonInputProps) => {
  const [showEyeIcon, setShowEyeIcon] = useState(false);
  return (
    <div>
      <Label htmlFor={id} className='block text-sm font-medium text-gray-700'>
        {label}{' '}
        {isRequired && !disabled && <span className='text-red-400'>&#42;</span>}
        {isLengthValidate && !disabled && (
          <span className='float-right mt-1 text-xs text-red-400'>
            {value.length <= MaxCharlimit
              ? MaxCharlimit - value.length + ' Characters Left'
              : 'Out Of Character Limit 100'}
          </span>
        )}
      </Label>
      <div className='relative'>
        <div
          className={`${
            name === 'domain_name'
              ? 'flex flex-row mt-1 border border-gray-300 focus:outline-none w-full rounded-full appearance-none'
              : 'relative mt-1'
          }`}
        >
          <Input
            id={id}
            name={name}
            type={showEyeIcon ? 'text' : type}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            autoComplete={autocomplete}
            value={
              disabled && name === 'domain_name'
                ? `${value}${domain_url_name}`
                : value
            }
            className={`block w-full appearance-none focus:outline-none sm:text-sm focus:border-admin-primary  focus:ring-admin-primary ${
              classNames ? classNames : 'px-3 py-2'
            } ${
              name === 'domain_name'
                ? 'overflow-x-scroll rounded-l-full'
                : 'placeholder-gray-400 border border-gray-300 rounded-full'
            } `}
            {...props}
          >
            {disabled && name === 'domain_name' && (
              <div
                className='flex items-center w-auto px-2 cursor-pointer'
                onClick={() =>
                  window.open(`https://${value}${domain_url_name}`, '_blank')
                }
              >
                <HiArrowTopRightOnSquare className='w-5 h-5 mr-1' />
              </div>
            )}
            {!disabled && name === 'domain_name' && (
              <div className='flex items-center w-auto px-2 bg-gray-100 rounded-r-full'>
                <p className='text-sm text-gray-500'>{domain_url_name}</p>
              </div>
            )}
          </Input>
        </div>
        {isIcon &&
          (showEyeIcon ? (
            <HiEyeSlash
              onClick={() => setShowEyeIcon(false)}
              className={`cursor-pointer absolute w-[20px] text-admin-primary top-1/2 transform -translate-y-1/2 ${
                classNames ? 'right-[13px]' : 'right-[10px]'
              }`}
            />
          ) : (
            <HiEye
              onClick={() => setShowEyeIcon(true)}
              className={`cursor-pointer absolute w-[20px] text-admin-primary top-1/2 transform -translate-y-1/2 ${
                classNames ? 'right-[13px]' : 'right-[10px]'
              }`}
            />
          ))}
      </div>
      {isRequired && (
        <span className='text-xs text-red-400 error'>{error}</span>
      )}
    </div>
  );
};

export default CommonInput;
