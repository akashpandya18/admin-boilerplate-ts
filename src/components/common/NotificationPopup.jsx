'use client';

import { Fragment, useEffect, useState } from 'react';
import { Transition } from '@headlessui/react';
import { useRouter } from 'next/navigation';

const NotificationPopup = ({ notificationData }) => {
  const router = useRouter();
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
    setTimeout(() => {
      setShow(false);
    }, 5000);
  }, [notificationData]);

  return (
    <div className='absolute right-0 top-[88px] z-[10]'>
      {/* Global notification live region, render this permanently at the end of the document */}
      <div
        aria-live='assertive'
        className='pointer-events-none w-[400px] flex items-end px-4 py-6 sm:items-start sm:p-6'
      >
        <div className='flex flex-col items-center w-full space-y-4 sm:items-end'>
          {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
          <Transition
            appear
            show={show}
            as={Fragment}
            enter='transform ease-out duration-300 transition'
            enterFrom='translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2'
            enterTo='translate-y-0 opacity-100 sm:translate-x-0'
            leave='transition ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='flex w-full max-w-md bg-white rounded-lg shadow-lg pointer-events-auto ring-1 ring-black ring-opacity-5'>
              <div
                className='flex-1 w-0 p-3 cursor-pointer'
                onClick={() => router.push('/notifications')}
              >
                <div className='flex items-start'>
                  <div className='flex-1 w-0 ml-1'>
                    <p className='text-sm font-medium text-gray-900'>
                      {notificationData?.title}
                    </p>
                    <p className='mt-1 text-sm text-gray-500'>
                      {notificationData?.body}
                    </p>
                  </div>
                </div>
              </div>
              <div className='flex border-l border-gray-200'>
                <button
                  type='button'
                  className='flex items-center justify-center w-full p-4 text-sm font-medium text-gray-600 border border-transparent rounded-none rounded-r-lg hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500'
                  onClick={() => {
                    setShow(false);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  );
};

export default NotificationPopup;
