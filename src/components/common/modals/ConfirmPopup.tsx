'use client';

import { useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { HiOutlineQuestionMarkCircle } from 'react-icons/hi2';
import { Button } from '@/components/ui/button';

interface ConfirmPopupProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  setAccepted: (value: boolean) => void;
  message: string;
  handleNo?: () => void;
}

const ConfirmPopup = ({
  open,
  setOpen,
  setAccepted,
  message,
  handleNo,
}: ConfirmPopupProps) => {
  const cancelButtonRef = useRef(null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='sm:max-w-3xl'>
        <DialogHeader>
          <HiOutlineQuestionMarkCircle
            className='w-6 h-6 text-admin-secondary'
            aria-hidden='true'
          />
        </DialogHeader>
        <DialogTitle className='text-lg font-medium leading-6 text-gray-900'>
          Confirm
        </DialogTitle>
        <DialogDescription className='text-sm text-gray-500'>
          {message}
        </DialogDescription>
        <DialogFooter>
          <Button
            type='button'
            variant={'default'}
            className='inline-flex justify-center w-full px-6 py-2 text-base font-medium text-white border border-transparent shadow-sm rounded-3xl bg-admin-primary hover:bg-admin-secondary focus:outline-none sm:ml-3 sm:w-auto sm:text-sm'
            onClick={(e: any) => {
              setOpen(false);
              setAccepted(e);
            }}
          >
            Yes
          </Button>
          <Button
            type='button'
            variant={'outline'}
            className='inline-flex justify-center w-full px-6 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 shadow-sm rounded-3xl hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
            onClick={() => {
              setOpen(false);
              handleNo && handleNo();
            }}
            ref={cancelButtonRef}
          >
            No
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmPopup;
