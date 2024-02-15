'use client';

import { Fragment, useState } from 'react';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi2';
import { Transition } from '@headlessui/react';
import { usePathname, useRouter } from 'next/navigation';
import { useSidebarStore } from '@/store/sidebarStore';
import { classNames } from '@/lib/utils';
import Image from 'next/image';

const subMenu: {
  name: string;
  href: string;
  icon: string;
  access: boolean;
  show: boolean;
}[] = [
  {
    name: 'Focus',
    href: '/content-management/focus',
    icon: '',
    access: true,
    show: true,
  },
  {
    name: 'Focus',
    href: '/content-management/focus/add-edit',
    icon: '',
    access: true,
    show: false,
  },
  {
    name: 'Focus',
    href: '/content-management/focus/view',
    icon: '',
    access: true,
    show: false,
  },
  {
    name: 'Affirmation',
    href: '/content-management/affirmation',
    icon: '',
    access: true,
    show: true,
  },
  {
    name: 'Affirmation',
    href: '/content-management/affirmation/add-edit',
    icon: '',
    access: true,
    show: false,
  },
  {
    name: 'Affirmation',
    href: '/content-management/affirmation/view',
    icon: '',
    access: true,
    show: false,
  },
  {
    name: 'Meditation',
    href: '/content-management/meditation',
    icon: '',
    access: true,
    show: true,
  },
  {
    name: 'Meditation',
    href: '/content-management/meditation/add-edit',
    icon: '',
    access: true,
    show: false,
  },
  {
    name: 'Gratitude',
    href: '/content-management/gratitude',
    icon: '',
    access: true,
    show: true,
  },
  {
    name: 'Gratitude',
    href: '/content-management/gratitude/add-edit',
    icon: '',
    access: true,
    show: false,
  },
  {
    name: 'Rituals',
    href: '/content-management/rituals',
    icon: '',
    access: true,
    show: true,
  },
  {
    name: 'Rituals',
    href: '/content-management/rituals/add-edit',
    icon: '',
    access: true,
    show: false,
  },
  // {
  //   name: 'BedTime Stories',
  //   href: '/content-management/bedtime-stories',
  //   icon: '',
  //   access: true,
  //   show: true,
  // },
  {
    name: 'Sounds',
    href: '/content-management/sounds',
    icon: '',
    access: true,
    show: true,
  },
  {
    name: 'Sounds',
    href: '/content-management/sounds/add-edit',
    icon: '',
    access: true,
    show: false,
  },
  {
    name: 'Top Picks',
    href: '/content-management/top-picks',
    icon: '',
    access: true,
    show: true,
  },
  {
    name: 'Top Picks',
    href: '/content-management/top-picks/add-edit',
    icon: '',
    access: true,
    show: false,
  },
  // {
  //   name: 'Manifestation',
  //   href: '/content-management/manifestation',
  //   icon: '',
  //   access: true,
  //   show: true,
  // },
];

const Menu = ({ item }: { item: any }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { setShow } = useSidebarStore();
  const [src, setSrc] = useState(item.staticIcon);

  const getStatus = () => {
    return !!subMenu?.map((item) => item.href)?.includes(pathname);
  };

  const [showSubMenu, isShowSubMenu] = useState(getStatus());

  const handleRedirect = (link: string) => {
    if (window.innerWidth < 1024) {
      setShow(false);
    }
    router.push(link);
  };

  return (
    <>
      <div
        key={item.name}
        onClick={() => {
          item.href !== '#'
            ? item.href === 'isDropDown'
              ? isShowSubMenu(!showSubMenu)
              : handleRedirect(item.href)
            : undefined;
        }}
        onMouseEnter={() => setSrc(item.icon)}
        onMouseLeave={() => setSrc(item.staticIcon)}
        className={classNames(
          pathname.includes(item.href)
            ? 'bg-gradient-to-r from-white to-gray-50 cursor-pointer text-admin-primary font-semibold'
            : 'hover:bg-gradient-to-r hover:from-white hover:to-gray-100/90 cursor-pointer text-white',
          'group outline-none mx-2 flex hover:text-admin-primary items-center py-3 px-2 text-sm font-normal rounded-md'
        )}
      >
        <Image
          src={src}
          alt='sidebar_icon'
          height={30}
          width={30}
          className={`mr-3 ml-2 flex-shrink-0 text-white hover:rounded-full`}
        />

        {item.name}
        {item.isDropDown &&
          (showSubMenu ? (
            <HiChevronUp className='w-5 h-5 ml-2' />
          ) : (
            <HiChevronDown className='w-5 h-5 ml-2' />
          ))}
      </div>
      {item.isDropDown && showSubMenu && (
        <Transition
          as={Fragment}
          enter='transition ease-out duration-100'
          enterFrom='transform opacity-0 scale-95'
          enterTo='transform opacity-100 scale-100'
          leave='transition ease-in duration-75'
          leaveFrom='transform opacity-100 scale-100'
          leaveTo='transform opacity-0 scale-95'
        >
          <div className='px-2 py-2 space-y-2 text-white bg-admin-subMenuBackground'>
            {item.subMenu?.map((innerItem: any, index: number) => {
              return !innerItem.show ? (
                ''
              ) : (
                <div
                  key={index}
                  onClick={() => handleRedirect(innerItem.href)}
                  className={classNames(
                    pathname?.includes(innerItem.href)
                      ? 'bg-gradient-to-r from-admin-primary to-admin-secondary cursor-pointer'
                      : 'hover:bg-admin-secondary hover:bg-opacity-75 cursor-pointer',
                    'pl-[20px] mx-4 group outline-none flex text-[#F5F5F5] items-center py-3 px-2 text-sm font-normal rounded-md'
                  )}
                >
                  {innerItem.name}
                </div>
              );
            })}
          </div>
        </Transition>
      )}
    </>
  );
};

export default Menu;
