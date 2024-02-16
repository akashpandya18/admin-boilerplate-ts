'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

interface FocusPopupProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  data: any;
}

const FocusPopup = ({ open, setOpen, data }: FocusPopupProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='sm:max-w-3xl'>
        <DialogTitle className='text-lg font-medium leading-6 text-gray-900'>
          Focus
        </DialogTitle>
        <div className='sm:flex sm:items-start'>
          <div className='flex flex-wrap mt-3'>
            {data.map((value: any, key: number) => (
              <div
                className='relative px-4 py-2 mb-2 mr-2 text-sm bg-gray-200 rounded-3xl w-fit'
                key={key}
              >
                {value.display_name}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FocusPopup;
