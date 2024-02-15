'use client';

import { useRef } from 'react';
import {
  HiOutlineExclamationTriangle,
  HiCheck,
  HiNoSymbol,
} from 'react-icons/hi2';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface BulkOperationPopupProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  setDelete: (value: boolean) => void;
  actionType: number;
}

const BulkOperationPopup = ({
  open,
  setOpen,
  setDelete,
  actionType,
}: BulkOperationPopupProps) => {
  const cancelButtonRef = useRef(null);

  const getDecodedType = (type: number) => {
    return type === 0 ? 'inactive' : type === 1 ? 'active' : 'delete';
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='sm:max-w-3xl'>
        <DialogHeader>
          <div
            className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10 ${
              getDecodedType(actionType) === 'delete'
                ? 'bg-red-100'
                : getDecodedType(actionType) === 'active'
                  ? 'bg-green-100'
                  : 'bg-red-100'
            }`}
          >
            {getDecodedType(actionType) === 'delete' ? (
              <HiOutlineExclamationTriangle
                className='w-6 h-6 text-red-600'
                aria-hidden='true'
              />
            ) : getDecodedType(actionType) === 'active' ? (
              <HiCheck className='w-6 h-6 text-green-600' aria-hidden='true' />
            ) : (
              <HiNoSymbol className='w-6 h-6 text-red-500' aria-hidden='true' />
            )}
          </div>
        </DialogHeader>
        <DialogTitle className='text-lg font-medium leading-6 text-gray-900'>
          <span className='capitalize'>{getDecodedType(actionType)}</span>{' '}
          records
        </DialogTitle>
        <DialogDescription className='text-sm text-gray-500'>
          Are you sure you want to {getDecodedType(actionType)} these record(s)?{' '}
          {getDecodedType(actionType) === 'delete' &&
            'All of your data will be permanently removed. This action cannot be undone.'}
        </DialogDescription>
        <DialogFooter>
          <Button
            type='button'
            variant={'default'}
            className={`inline-flex capitalize w-full justify-center rounded-3xl border border-transparent ${
              getDecodedType(actionType) === 'delete'
                ? 'bg-red-600'
                : getDecodedType(actionType) === 'active'
                  ? 'bg-green-600'
                  : 'bg-red-500'
            } px-6 py-2 text-base font-medium text-white shadow-sm focus:outline-none sm:ml-3 sm:w-auto sm:text-sm`}
            onClick={() => {
              setOpen(false);
              setDelete(false);
            }}
          >
            {getDecodedType(actionType)}
          </Button>
          <Button
            type='button'
            variant={'outline'}
            className='inline-flex justify-center w-full px-6 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 shadow-sm rounded-3xl hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
            onClick={() => setOpen(false)}
            ref={cancelButtonRef}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkOperationPopup;
