'use client';

import { useRef } from 'react';
import { HiOutlineExclamationTriangle } from 'react-icons/hi2';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
interface DeletePopupProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  setDelete: (value: boolean) => void;
  message?: string;
  title?: string;
}

const DeletePopup = ({
  open,
  setOpen,
  setDelete,
  message,
  title,
}: DeletePopupProps) => {
  const cancelButtonRef = useRef(null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='sm:max-w-3xl'>
        <DialogHeader>
          <HiOutlineExclamationTriangle
            className='w-6 h-6 text-red-600'
            aria-hidden='true'
          />
        </DialogHeader>
        <DialogTitle className='text-lg font-medium leading-6 text-gray-900'>
          {title ? title : 'Delete record'}
        </DialogTitle>
        <DialogDescription className='text-sm text-gray-500'>
          {message
            ? message
            : 'Are you sure you want to delete this record? All of your data will be permanently removed. This action cannot be undone.'}
        </DialogDescription>
        <DialogFooter>
          <Button
            type='button'
            variant={'default'}
            className='inline-flex justify-center w-full px-6 py-2 text-base font-medium text-white border border-transparent shadow-sm rounded-3xl bg-red-600 hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm'
            onClick={() => {
              setOpen(false);
              setDelete(false);
            }}
          >
            Delete
          </Button>
          <Button
            type='button'
            variant={'outline'}
            className='inline-flex justify-center w-full px-6 py-2 mt-3 text-base font-medium text-gray-700 border border-gray-300 shadow-sm rounded-3xl bg-white hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
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

export default DeletePopup;
