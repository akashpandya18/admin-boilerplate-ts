'use client';

import { Fragment, useEffect, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { HiCheck, HiChevronUpDown } from 'react-icons/hi2';
import { classNames } from '@/lib/utils';

interface SelectMenuProps {
  menuList: any;
  label?: string;
  setSelectedMenu: any;
  defaultSelected: any;
  disabled?: boolean;
  isRequired?: boolean;
  showLabel?: boolean;
  customClassFlag?: boolean;
}

const SelectMenu = ({
  menuList,
  label,
  setSelectedMenu,
  defaultSelected,
  disabled = false,
  isRequired = true,
  showLabel = true,
  customClassFlag,
}: SelectMenuProps) => {
  const [selected, setSelected] = useState<any>(menuList[0]);

  const handleChange = (e: any) => {
    setSelected(e);
    setSelectedMenu(e);
  };

  useEffect(() => {
    if (defaultSelected?.name) {
      setSelected(defaultSelected);
    }
  }, [defaultSelected]);

  return (
    <Listbox value={selected} onChange={handleChange}>
      {({ open }) => (
        <>
          {showLabel ? (
            <div
              className={`block ${
                customClassFlag ? 'text-md mr-2 w-auto' : 'text-sm'
              } font-medium text-gray-700`}
            >
              {label}{' '}
              {isRequired && !disabled && (
                <span className='text-red-400'>&#42;</span>
              )}
            </div>
          ) : (
            ''
          )}

          <div className={`${customClassFlag ? 'w-[270px] ' : ''}relative`}>
            <Listbox.Button
              className={`relative w-full py-2 pl-3 pr-10 text-left ${
                disabled
                  ? 'bg-gray-50 cursor-default'
                  : 'bg-white focus:border-admin-primary focus:outline-none focus:ring-admin-primary cursor-pointer'
              } border border-gray-300 rounded-3xl  sm:text-sm`}
            >
              <span className='block capitalize truncate'>
                {selected?.name}
              </span>
              {!disabled && (
                <span className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
                  <HiChevronUpDown
                    className='w-5 h-5 text-gray-400'
                    aria-hidden='true'
                  />
                </span>
              )}
            </Listbox.Button>

            <Transition
              show={!disabled && open}
              as={Fragment}
              leave='transition ease-in duration-100'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <Listbox.Options className='absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
                {menuList.map((menu: any, index: number) => (
                  <Listbox.Option
                    key={index}
                    className={({ active }) =>
                      classNames(
                        active
                          ? 'text-white bg-admin-primary'
                          : 'text-gray-900',
                        'relative cursor-default select-none py-2 pl-3 pr-9 capitalize'
                      )
                    }
                    disabled={menu?.value === ''}
                    value={menu}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={classNames(
                            selected ? 'font-semibold' : 'font-normal',
                            'block truncate cursor-pointer'
                          )}
                        >
                          {menu?.name}
                        </span>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? 'text-white' : 'text-admin-primary',
                              'absolute inset-y-0 right-0 flex items-center pr-4'
                            )}
                          >
                            <HiCheck className='w-5 h-5' aria-hidden='true' />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
};

export default SelectMenu;
