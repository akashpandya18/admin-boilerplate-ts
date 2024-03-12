'use client';

/* eslint-disable no-unused-vars */
import { useSidebarStore } from '@/store/sidebarStore';
import { useState, useEffect } from 'react';
import { cleanCookies, getJWTToken, useWindowDimensions } from '@/lib/utils';
import Header from './Header';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from './Sidebar';

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

const Layout = ({ children }: props) => {
  const router = useRouter();
  const token = getJWTToken();
  const [unreadNotiCount] = useState(0);
  const { isShow, setShow } = useSidebarStore();
  const { width } = useWindowDimensions();

  useEffect(() => {
    async function logoutUser() {
      if (!token) {
        cleanCookies();
        router.push('/login');
      }
    }
    logoutUser();
  }, []);

  useEffect(() => {
    if (width && width < 1024) {
      setShow(false);
    } else setShow(true);
  }, [width]);

  return (
    <>
      <LoadSideBar />
      <div className='h-full'>
        {/* {getLocalStorageItem('token') && (
        )} */}
        <Header unreadNotiCount={unreadNotiCount} />
        <main className='relative flex'>
          <div
            className={`${
              !isShow ? 'w-full' : 'lg:w-[calc(100%-260px)]'
            } px-4 pt-4 pb-8 lg:ml-auto mt-[88px]`}
          >
            {children}
          </div>
        </main>
      </div>
    </>
  );
};

export default Layout;
