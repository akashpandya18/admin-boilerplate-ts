'use client';

/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import {
  cleanCookies,
  cn,
  getJWTToken,
  useWindowDimensions,
} from '@/lib/utils';
import Header from './Header';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { useSidebarStore } from '@/store/sidebarStore';

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
  const { isShow, setShow, setCurrentShow } = useSidebarStore();
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
    if (width && width < 1280) {
      setShow(false);
      setCurrentShow(false);
    } else {
      setShow(true);
      setCurrentShow(true);
    }
  }, [width]);

  return (
    <>
      <ResizablePanelGroup direction='horizontal' className='min-h-screen'>
        <ResizablePanel
          defaultSize={isShow ? 16 : 4}
          collapsedSize={isShow ? 4 : 16}
          collapsible={true}
          onCollapse={() => setCurrentShow(false)}
          onExpand={() => setCurrentShow(true)}
          minSize={isShow ? 16 : 4}
          maxSize={isShow ? 16 : 4}
          className={cn('min-w-[60px] transition-all duration-300 ease-in-out')}
        >
          <LoadSideBar />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={isShow ? 84 : 96}>
          <main className='relative flex'>
            {token && <Header unreadNotiCount={unreadNotiCount} />}
            <div className={`w-full px-4 pt-4 pb-8 lg:ml-auto mt-[88px]`}>
              {children}
            </div>
          </main>
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
};

export default Layout;
