/* eslint-disable no-unused-vars */
'use client';

// import { isSupported } from 'firebase/messaging';
// import { onMessageListener, requestForToken } from '../firebase';
import { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { HiBars3, HiChevronDown } from 'react-icons/hi2';
import {
  cleanLocalStorage,
  getLocalStorageItem,
  getDeviceToken,
  // errorToast,
  classNames,
} from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
// import LazyLoadImageProp from '../common/LazyLoadImage';
import { useSidebarStore } from '@/store/sidebarStore';
import axios from 'axios';
import BellStatic from '@/assets/bell-static.png';
import Bell from '@/assets/bell.gif';
// import NotificationPopup from '@/app/components/common/NotificationPopup';

function Header({ unreadNotiCount }: { unreadNotiCount: number }) {
  const router = useRouter();
  const { isShow, setShow } = useSidebarStore();
  const [bellSrc, setBellSrc] = useState(BellStatic);
  // const [showPopup, setShowPopup] = useState(false);
  // const [notificationData, setNotificationData] = useState({});

  const userData =
    getLocalStorageItem('userData') &&
    JSON.parse(getLocalStorageItem('userData') as string);

  // isSupported()?.then((res) => {
  //   if (res) {
  //     requestForToken().then(() => {
  //       onMessageListener()
  //         .then((data) => {
  //           setNotificationData({
  //             title: data?.notification?.title,
  //             body: data?.notification?.body,
  //           });
  //           setShowPopup(true);
  //         })
  //         .catch((err) => errorToast(err));
  //     });
  //   }
  // });

  const handleLogout = async () => {
    if (getDeviceToken())
      await axios.delete('/api/logout', {
        params: { tag: '/device-token', isHeader: true },
      });
    cleanLocalStorage();
    router.push('/login');
  };

  const name = userData?.name?.split(' ');
  return (
    <>
      <div
        className={`px-4 h-[88px] py-2 bg-white flex items-center justify-between fixed left-0 right-0 top-0 z-30 w-full border-b`}
      >
        <div className='flex items-center justify-between mb-4'>
          {!isShow && (
            <HiBars3
              className='self-center w-6 h-6 mr-3 cursor-pointer text-admin-customGray'
              onClick={() => setShow(true)}
            />
          )}
        </div>
        <div className='flex h-[88px]'>
          <div className='self-center border-r border-[#ECECEC] px-7 mx-7'>
            <div
              onClick={() => router.push('/notifications')}
              onMouseEnter={() => setBellSrc(Bell)}
              onMouseLeave={() => setBellSrc(BellStatic)}
              className='w-12 h-12 shadow-2xl p-3 relative rounded-full border border-[#EAEAEA] text-admin-customGray cursor-pointer flex justify-center self-center'
            >
              <Image
                src={bellSrc}
                alt='bell_icon'
                height={24}
                width={24}
                className={`h-6 w-6 text-admin-primary hover:rounded-full`}
              />
              {/* <HiBell className={'w-6 h-6 text-admin-primary'} /> */}
              {unreadNotiCount > 0 && (
                <div className='absolute -right-[5px] shadow-2xl -top-[8px] rounded-[50%] bg-gradient-to-r text-white text-[12px] flex justify-center align-middle text-center from-admin-primary to-admin-secondary bg-red-500 h-[25px] w-[25px]'>
                  <p className='self-center'>
                    {unreadNotiCount > 99 ? '99+' : unreadNotiCount}
                  </p>
                </div>
              )}
            </div>
          </div>
          <Menu as='div'>
            <div className='flex'>
              <Menu.Button className='justify-center w-full text-sm font-medium text-gray-700 focus:outline-none'>
                <div className='flex h-[88px] relative items-center'>
                  {userData?.profile ? (
                    <></>
                  ) : (
                    // <LazyLoadImageProp
                    //   src={userData.profile}
                    //   className='w-[50px] h-[50px] self-center rounded-full border border-[#EAEAEA]'
                    // />
                    <div className='self-center bg-gradient-to-br from-admin-primary to-admin-sidebarBackground flex justify-center items-center w-[50px] h-[50px] rounded-full'>
                      <span className='text-white'>
                        {name && name[0]?.charAt(0)}
                      </span>
                      <span className='text-white'>
                        {name && name[1]?.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className='self-center hidden ml-3 text-start md:block'>
                    <p className='text-[#0B0F18] text-[18px] m-0'>
                      {userData?.name}
                    </p>
                    <span className='font-light text-admin-customGray'>
                      Admin
                    </span>
                  </div>
                  <HiChevronDown className='w-6 h-6 ml-3 text-admin-customGray' />
                </div>
              </Menu.Button>
            </div>

            <Transition
              as={Fragment}
              enter='transition ease-out duration-100'
              enterFrom='transform opacity-0 scale-95'
              enterTo='transform opacity-100 scale-100'
              leave='transition ease-in duration-75'
              leaveFrom='transform opacity-100 scale-100'
              leaveTo='transform opacity-0 scale-95'
            >
              <Menu.Items className='absolute shadow-lg right-[20px] top-[90px] z-10 mt-2 w-56 origin-top-right rounded-md bg-white ring-1 ring-admin-primary ring-opacity-5 focus:outline-none'>
                <div className='py-1'>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href='/change-password'
                        className={classNames(
                          active
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-700',
                          'block px-4 py-2 text-sm'
                        )}
                      >
                        Change Password
                      </Link>
                    )}
                  </Menu.Item>

                  <Menu.Item>
                    {({ active }) => (
                      <button
                        type='button'
                        onClick={handleLogout}
                        className={classNames(
                          active
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-700',
                          'block w-full px-4 py-2 text-left text-sm'
                        )}
                      >
                        Sign out
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
      {/* {showPopup ? (
        <NotificationPopup notificationData={notificationData} />
      ) : (
        ''
      )} */}
    </>
  );
}

export default Header;
