'use client';

import { useState, useEffect } from 'react';
import { cleanCookies, getJWTToken } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import Menu from './Menu';
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
  const { user, clearTokens } = useAuthStore();
  const [logSrc, setLogSrc] = useState(LogStatic);
  const version = packageJson.version;

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
    if (user?.id) {
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
    }
  }, [user]);

  const handleLogout = async () => {
    if (token) {
      cleanCookies();
      clearTokens();
      router.push('/login');
    }
  };

  return (
    <div className={`block relative`}>
      <div className='absolute z-30 flex flex-col w-full h-screen bg-gradient-to-b from-admin-primary to-admin-sidebarBackground'>
        <div className={`flex items-center py-6 px-4`}>
          <p className='text-2xl text-left font-semibold text-white capitalize'>
            Admin Panel
          </p>
        </div>

        <nav className='mt-4 space-y-3'>
          {sidebarData?.map((item, index) =>
            !item?.access ? '' : <Menu key={index} item={item} />
          )}
        </nav>

        <div className='absolute bottom-0 flex justify-start w-full px-6 py-4 text-sm text-admin-gray2'>
          Version: {version}
        </div>
        <div
          className={`absolute w-full py-2 border-t px-2 bottom-14 border-admin-sidebarBorder group`}
        >
          <div
            onMouseEnter={() => setLogSrc(Log)}
            onMouseLeave={() => setLogSrc(LogStatic)}
            className={`flex items-center justify-start p-2 gap-x-2 rounded-md cursor-pointer group-hover:bg-white`}
            onClick={handleLogout}
          >
            <Image src={logSrc} alt='logout_icon' height={30} width={30} />
            <p className='text-base font-medium text-white group-hover:text-admin-primary'>
              Logout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
