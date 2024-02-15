'use client';

import { Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  HiOutlineExclamationTriangle,
  HiCheck,
  HiNoSymbol,
} from 'react-icons/hi2';

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
                    <div
                      className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10

                    ${
                      getDecodedType(actionType) === 'delete'
                        ? 'bg-red-100'
                        : getDecodedType(actionType) === 'active'
                          ? 'bg-green-100'
                          : 'bg-red-100'
                    }
                    `}
                    >
                      {getDecodedType(actionType) === 'delete' ? (
                        <HiOutlineExclamationTriangle
                          className='w-6 h-6 text-red-600'
                          aria-hidden='true'
                        />
                      ) : getDecodedType(actionType) === 'active' ? (
                        <HiCheck
                          className='w-6 h-6 text-green-600'
                          aria-hidden='true'
                        />
                      ) : (
                        <HiNoSymbol
                          className='w-6 h-6 text-red-500'
                          aria-hidden='true'
                        />
                      )}
                    </div>
                    <div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
                      <Dialog.Title
                        as='h3'
                        className='text-lg font-medium leading-6 text-gray-900'
                      >
                        <span className='capitalize'>
                          {getDecodedType(actionType)}
                        </span>{' '}
                        records
                      </Dialog.Title>
                      <div className='mt-2'>
                        <p className='text-sm text-gray-500'>
                          Are you sure you want to {getDecodedType(actionType)}{' '}
                          these record(s)?{' '}
                          {getDecodedType(actionType) === 'delete' &&
                            'All of your data will be permanently removed. This action cannot be undone.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='px-4 py-3 bg-gray-50 sm:flex sm:flex-row-reverse sm:px-6'>
                  <button
                    type='button'
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
                  </button>
                  <button
                    type='button'
                    className='inline-flex justify-center w-full px-6 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 shadow-sm rounded-3xl hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    Cancel
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

export default BulkOperationPopup;
