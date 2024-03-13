'use client';

import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  cleanCookies,
  // getLocalStorageItem,
  getJWTToken,
} from '@/lib/utils';
import Menu from './Menu';
import { useRouter } from 'next/navigation';
import { useSidebarStore } from '@/store/sidebarStore';
import { HiChevronDoubleLeft } from 'react-icons/hi2';
import userIcon from '@/assets/user.gif';
import userStatic from '@/assets/user-static.png';
import gymIcon from '@/assets/gym.gif';
import staticGym from '@/assets/gym-static.png';
import LogStatic from '@/assets/logout-static.png';
import Log from '@/assets/logout.gif';
import Image from 'next/image';
import packageJson from '../../../package.json';
import useAuthStore from '@/store/userStore';

function Sidebar() {
  const router = useRouter();
  const token = getJWTToken();
  const { clearTokens } = useAuthStore();
  const { isShow, setShow } = useSidebarStore();
  const [logSrc, setLogSrc] = useState(LogStatic);
  const version = packageJson.version;
  // const userData =
  // getLocalStorageItem('userData') &&
  // JSON.parse(getLocalStorageItem('userData'));
  const [sidebarData, setSidebarData] = useState<
    {
      name: string;
      href: string;
      icon: any;
      access: boolean;
      staticIcon: any;
    }[]
  >([]);

  useEffect(() => {
    // if (userData?.id) {
    // }
    setSidebarData([
      {
        name: 'Users',
        href: '/users',
        icon: userIcon,
        access: true,
        staticIcon: userStatic,
      },
      {
        name: 'Gym',
        href: '/gym',
        icon: gymIcon,
        access: true,
        staticIcon: staticGym,
      },
    ]);
  }, []);

  const handleLogout = async () => {
    if (token) {
      cleanCookies();
      clearTokens();
      router.push('/login');
    }
  };

  const handleToggle = () => {
    setShow(!isShow);
  };

  return (
    <div>
      <Transition.Root show={isShow || false} as={Fragment}>
        <Dialog as='div' className='relative' onClose={() => null}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Dialog.Overlay className='fixed inset-0 lg:block lg:inset-full lg:bg-transparent lg:bg-opacity-0' />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0 translate-x-[-100%]'
            enterTo='opacity-100 translate-x-0'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 translate-x-0'
            leaveTo='opacity-0 translate-x-[-100%]'
          >
            <div className='fixed top-0 bottom-0 flex w-[260px] flex-1 flex-col bg-gradient-to-b from-admin-primary to-admin-sidebarBackground z-50'>
              <div className='flex-1 h-0 overflow-y-auto sidebar-container'>
                <div className='flex justify-between w-[260px] flex-shrink-0 fixed top-0 left-0 items-center px-4 h-[87px] '>
                  <p className='text-2xl font-semibold text-white capitalize'>
                    {/* {userData?.name}  */}
                    Admin Panel
                  </p>
                  <HiChevronDoubleLeft
                    className='w-6 h-6 text-white cursor-pointer'
                    onClick={handleToggle}
                  />
                </div>

                <nav className='space-y-3 mt-[100px] mb-[15px]'>
                  {sidebarData?.map((item, index) =>
                    !item?.access ? '' : <Menu key={index} item={item} />
                  )}
                </nav>
              </div>

              <span className='flex px-6 py-4 text-sm text-admin-gray2'>
                Version: {version}
              </span>

              <div className='flex flex-shrink-0 p-4 border-t border-admin-sidebarBorder'>
                <div
                  onMouseEnter={() => setLogSrc(Log)}
                  onMouseLeave={() => setLogSrc(LogStatic)}
                  className='flex-shrink-0 block w-full cursor-pointer group'
                  onClick={handleLogout}
                >
                  <div className='flex items-center'>
                    <div className='group-hover:bg-white p-3 rounded-[50%]'>
                      <Image
                        src={logSrc}
                        alt='logout_icon'
                        height={24}
                        width={24}
                        className={`h-6 w-6 text-admin-primary hover:rounded-full`}
                      />
                      {/* <HiArrowRightOnRectangle className='w-[20px] text-white' /> */}
                    </div>
                    <div className='ml-3'>
                      <p className='text-sm font-medium text-white'>Logout</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition.Root>
    </div>
  );
}

export default Sidebar;
