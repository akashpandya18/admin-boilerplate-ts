'use client';

import { MaxCharlimitLongText } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
interface CommonTextareaProps {
  id: string;
  name: string;
  value: string;
  label: string;
  error: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows: number;
  isRequired: boolean;
  disabled: boolean;
  isLengthValidate: boolean;
}

const CommonTextarea = ({
  id,
  name,
  value,
  label,
  error,
  onChange,
  rows,
  isRequired,
  disabled,
  isLengthValidate,
}: CommonTextareaProps) => {
  return (
    <div>
      <Label htmlFor={id} className='block text-sm font-medium text-gray-700'>
        {label}{' '}
        {isRequired && !disabled && <span className='text-red-400'>&#42;</span>}
        {isLengthValidate && !disabled && (
          <span className='float-right mt-1 text-xs text-red-400'>
            {value.length <= MaxCharlimitLongText
              ? MaxCharlimitLongText - value.length + ' Characters Left'
              : 'Out Of Character Limit 100'}
          </span>
        )}
      </Label>
      <div className='mt-1'>
        <Textarea
          id={id}
          name={name}
          value={value}
          rows={rows}
          disabled={disabled}
          onChange={onChange}
          className='block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 appearance-none rounded-2xl focus:border-admin-primary focus:outline-none focus:ring-admin-primary sm:text-sm'
        />
      </div>
      {isRequired && (
        <span className='text-xs text-red-400 error'>{error}</span>
      )}
    </div>
  );
};

export default CommonTextarea;
