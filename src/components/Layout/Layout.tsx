'use client';

/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import {
  cleanCookies,
  cn,
  getJWTToken,
  useWindowDimensions,
} from '@/lib/utils';
import Header from './Header';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import useSidebarStore from '@/store/sidebarStore';
import { Sheet, SheetContent } from '@/components/ui/sheet';

type props = {
  children: React.ReactNode;
};

const LoadSideBar = () => {
  const pathname = usePathname();
  return (
    <>
      {!['/login', '/reset-password', '/forgot-password']?.includes(
        pathname
      ) && <Sidebar />}
    </>
  );
};

const LoadSideBarMobile = () => {
  const pathname = usePathname();
  return (
    <SheetContent side='left' className='p-0 bg-transparent'>
      {!['/login', '/reset-password', '/forgot-password']?.includes(
        pathname
      ) && <Sidebar />}
    </SheetContent>
  );
};

const Layout = ({ children }: props) => {
  const router = useRouter();
  const token = getJWTToken();
  const [unreadNotiCount] = useState(0);
  const { showSideBar, setShowSideBar, toggleSideBar } = useSidebarStore();
  const { width } = useWindowDimensions();

  useEffect(() => {
    function logoutUser() {
      if (!token) {
        cleanCookies();
        router.push('/login');
      }
    }
    logoutUser();
  }, []);

  useEffect(() => {
    if (width < 768) {
      setShowSideBar(false);
    } else if (width >= 768 && showSideBar === false) {
      // Do nothing, keep showSideBar as false
    } else {
      setShowSideBar(true);
    }
  }, [width]);

  return (
    <div className='relative min-h-screen'>
      <Sheet>
        <div
          className={cn(
            showSideBar ? 'w-[300px]' : 'w-0',
            'transition-all duration-500 h-full ease-in-out fixed z-50 left-0 overflow-x-hidden scrollbar-hide'
          )}
        >
          {width < 768 ? <LoadSideBarMobile /> : <LoadSideBar />}
        </div>
        {token && <Header unreadNotiCount={unreadNotiCount} />}
        <div
          className={`relative flex-1 flex items-center min-h-screen transition-margin duration-500 ${showSideBar ? 'ml-[304px] px-4' : 'ml-0'}`}
        >
          {width >= 768 && (
            <button
              className={cn(
                showSideBar ? '-translate-x-full' : 'translate-x-0',
                `absolute top-1/2 transform -translate-y-1/2 z-50 cursor-pointer text-gray-700 transition-transform duration-500`
              )}
              onClick={toggleSideBar}
            >
              {showSideBar ? (
                <IoIosArrowBack className='w-5 h-5' />
              ) : (
                <IoIosArrowForward className='w-5 h-5' />
              )}
            </button>
          )}
          <div
            className={`w-full ${showSideBar ? 'px-0' : 'px-6'} pt-4 pb-8 lg:ml-auto mt-[88px] min-h-screen`}
          >
            {children}
          </div>
        </div>
      </Sheet>
    </div>
  );
};

export default Layout;
