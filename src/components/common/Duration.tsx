'use client';

import { Button } from '../ui/button';

interface DurationProps {
  min: number;
  sec: number;
  setSec: (value: number) => void;
  setMin: (value: number) => void;
  disabled: boolean;
}

export default function Duration({
  min,
  sec,
  setSec,
  setMin,
  disabled,
}: DurationProps) {
  const secondChange = (type: string, count: number) => {
    if (type === 'increment') {
      if (count === 59) {
        setSec(0);
        setMin(min + 1);
      } else {
        setSec(sec + 1);
      }
    }
    if (type === 'decrement' && count > 0) setSec(sec - 1);
  };
  const minutesChange = (type: string, count: number) => {
    if (type === 'increment' && count < 60) setMin(min + 1);
    if (type === 'decrement' && count > 0) setMin(min - 1);
  };
  return (
    <div>
      <div className='flex flex-wrap mt-2'>
        <div className='py-2 mr-10'>
          <div className='text-sm text-gray-500'> Minutes </div>
          <div className='flex mt-3'>
            <div className='self-center'>
              <Button
                type='button'
                variant={'default'}
                className='px-3 py-1 rounded-3xl border border-[#4A56DB] text-[#4A56DB] disabled:text-gray-400 disabled:border-gray-400'
                onClick={() => minutesChange('decrement', min)}
                disabled={disabled}
              >
                {' '}
                -
              </Button>
            </div>
            <div className='flex justify-center items-center mx-4 bg-white rounded-3xl w-[80px] h-[37px] text-admin-secondary'>
              <p className='m-0'>{min} mins </p>
            </div>
            <div className='self-center'>
              <Button
                type='button'
                variant={'default'}
                className='px-3 py-1 rounded-3xl border border-[#4A56DB] text-[#4A56DB] disabled:text-gray-400 disabled:border-gray-400'
                onClick={() => minutesChange('increment', min)}
                disabled={disabled}
              >
                +
              </Button>
            </div>
          </div>
        </div>
        <div className='py-2'>
          <div className='text-sm text-gray-500'> Seconds </div>
          <div className='flex mt-3'>
            <div className='self-center'>
              <Button
                type='button'
                variant={'default'}
                className='px-3 py-1 rounded-3xl border border-[#4A56DB] text-[#4A56DB] disabled:text-gray-400 disabled:border-gray-400'
                onClick={() => secondChange('decrement', sec)}
                disabled={disabled}
              >
                -
              </Button>
            </div>
            <div className='flex justify-center items-center mx-4 text-admin-secondary rounded-3xl w-[80px] h-[37px]'>
              <p className='m-0'>{sec} sec </p>
            </div>
            <div className='self-center'>
              <Button
                type='button'
                variant={'default'}
                className='px-3 py-1 rounded-3xl border border-[#4A56DB] text-[#4A56DB] disabled:text-gray-400 disabled:border-gray-400'
                onClick={() => secondChange('increment', sec)}
                disabled={disabled}
              >
                +
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
