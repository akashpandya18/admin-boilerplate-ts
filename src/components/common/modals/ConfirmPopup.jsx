'use client';

import { Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { HiOutlineQuestionMarkCircle } from 'react-icons/hi2';

const ConfirmPopup = ({ open, setOpen, setAccepted, message, handleNo }) => {
  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root appear show={open} as={Fragment}>
      <Dialog
        as='div'
        className='relative z-20'
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75' />
        </Transition.Child>

        <div className='fixed inset-0 z-20 overflow-y-auto'>
          <div className='flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <Dialog.Panel className='relative overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-lg'>
                <div className='px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4'>
                  <div className='sm:flex sm:items-start'>
                    <div className='flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-blue-100 rounded-full sm:mx-0 sm:h-10 sm:w-10'>
                      <HiOutlineQuestionMarkCircle
                        className='w-6 h-6 text-admin-secondary'
                        aria-hidden='true'
                      />
                    </div>
                    <div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
                      <Dialog.Title
                        as='h3'
                        className='text-lg font-medium leading-6 text-gray-900'
                      >
                        Confirm
                      </Dialog.Title>
                      <div className='mt-2'>
                        <p className='text-sm text-gray-500'>{message}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='px-4 py-3 bg-gray-50 sm:flex sm:flex-row-reverse sm:px-6'>
                  <button
                    type='button'
                    className='inline-flex justify-center w-full px-6 py-2 text-base font-medium text-white border border-transparent shadow-sm rounded-3xl bg-admin-primary hover:bg-admin-secondary focus:outline-none sm:ml-3 sm:w-auto sm:text-sm'
                    onClick={(e) => {
                      setOpen(false);
                      setAccepted(e);
                    }}
                  >
                    Yes
                  </button>
                  <button
                    type='button'
                    className='inline-flex justify-center w-full px-6 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 shadow-sm rounded-3xl hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
                    onClick={() => {
                      setOpen(false);
                      handleNo && handleNo();
                    }}
                    ref={cancelButtonRef}
                  >
                    No
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default ConfirmPopup;
