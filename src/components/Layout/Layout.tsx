'use client';

/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import {
  cleanCookies,
  cn,
  getJWTToken,
  getWindowDimensions,
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
import useSidebarStore from '@/store/sidebarStore';

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
  const { currentShow, setCurrentShow } = useSidebarStore();
  const currentDimensions = getWindowDimensions();
  const { width } = useWindowDimensions();

  const [leftPanelDimension, setLeftPanelDimesion] = useState({
    defaultSize: 4,
    collapsedSize: 4,
    minSize: 16,
    maxSize: 16,
  });
  const [rightPanelDimension, setRightPanelDimesion] = useState({
    defaultSize: 96,
  });

  useEffect(() => {
    if (currentDimensions.width >= 1920) {
      setLeftPanelDimesion({
        defaultSize: currentShow ? 18 : 4,
        collapsedSize: 4,
        minSize: 18,
        maxSize: 18,
      });
      setRightPanelDimesion({ defaultSize: currentShow ? 82 : 96 });
    } else if (currentDimensions.width >= 1440) {
      setLeftPanelDimesion({
        defaultSize: currentShow ? 16 : 4,
        collapsedSize: 4,
        minSize: 16,
        maxSize: 16,
      });
      setRightPanelDimesion({ defaultSize: currentShow ? 84 : 96 });
    } else if (currentDimensions.width >= 1024) {
      setLeftPanelDimesion({
        defaultSize: currentShow ? 25 : 4,
        collapsedSize: 4,
        minSize: 23,
        maxSize: 25,
      });
      setRightPanelDimesion({ defaultSize: currentShow ? 75 : 96 });
    } else if (currentDimensions.width >= 768) {
      setLeftPanelDimesion({
        defaultSize: currentShow ? 30 : 4,
        collapsedSize: 4,
        minSize: 25,
        maxSize: 30,
      });
      setRightPanelDimesion({ defaultSize: currentShow ? 70 : 96 });
    } else {
      setLeftPanelDimesion({
        defaultSize: currentShow ? 60 : 4,
        collapsedSize: 4,
        minSize: 55,
        maxSize: 60,
      });
      setRightPanelDimesion({ defaultSize: currentShow ? 40 : 96 });
    }
  }, [currentDimensions.width, width]);

  useEffect(() => {
    function logoutUser() {
      if (!token) {
        cleanCookies();
        router.push('/login');
      }
    }
    logoutUser();
  }, []);

  return (
    <>
      <ResizablePanelGroup direction='horizontal' className='min-h-screen'>
        <ResizablePanel
          defaultSize={leftPanelDimension.defaultSize}
          collapsedSize={leftPanelDimension.collapsedSize}
          collapsible={true}
          onCollapse={() => setCurrentShow(false)}
          onExpand={() => setCurrentShow(true)}
          minSize={leftPanelDimension.minSize}
          maxSize={leftPanelDimension.maxSize}
          className={cn(
            !currentShow && 'min-w-[60px]',
            'transition-all duration-300 ease-in-out'
          )}
        >
          <LoadSideBar />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={rightPanelDimension.defaultSize}>
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
