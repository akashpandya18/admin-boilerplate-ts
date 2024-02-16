/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { ChangeEvent, Fragment, useEffect, useRef, useState } from 'react';
import { Transition } from '@headlessui/react';
import { useOutsideClick } from '@/lib/utils';
import { HiXCircle } from 'react-icons/hi2';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

interface SearchableSelectProps {
  setSelectedList: any;
  label: string;
  error: string;
}

const SearchableSelect = ({
  setSelectedList,
  label,
  error,
}: SearchableSelectProps) => {
  const wrapperRef = useRef<any>(null);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [loader, setLoader] = useState(false);
  const [errorMessage, setError] = useState('');
  const [dropDownData, setDropDownData] = useState<any[]>([]);
  const [arr, setArr] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  // const [page, setPage] = useState(1);
  // const [limit, setLimit] = useState(20);

  useEffect(() => {
    setError(error);
  }, [error]);

  // eslint-disable-next-line no-unused-vars
  const handleAPICall = (searchKey: string) => {
    //  use new app/api call here
    // Api.getUserEmailList('users-email-list', page, limit, searchKey).then(
    //   (response) => {
    //     if (response?.data?.meta?.code === 1) {
    //       setLoader(false);
    //       let temp = [];
    //       response?.data?.data?.map((e) => {
    //         temp.push({
    //           id: e?.id,
    //           name: e.email,
    //           checked: arr.some((a) => a.id == e.id),
    //         });
    //       });
    //       setDropDownData(temp);
    //     } else if (response?.data?.meta?.code === 0) {
    //       setLoader(false);
    //       errorToast(response?.data?.meta?.message);
    //     } else {
    //       setLoader(false);
    //     }
    //   }
    // );
  };

  useEffect(() => {
    setSelectedList(arr);
  }, [arr]);

  useEffect(() => {
    setLoader(true);
    setDropDownData([]);
    if (searchTerm) {
      const delayDebounceFn = setTimeout(() => {
        handleAPICall(searchTerm);
      }, 600);

      return () => clearTimeout(delayDebounceFn);
    } else {
      setLoader(false);
    }
  }, [searchTerm]);

  const handleCheckbox = (e: ChangeEvent<HTMLInputElement>, item: any) => {
    if (e?.target?.checked) {
      dropDownData?.map((data) => {
        if (data.id === item.id) {
          const tempArr = [{ name: item.name, id: item?.id, checked: true }];
          const filterData = dropDownData.map(
            (obj) => tempArr.find((o) => o.id === obj.id) || obj
          );
          setDropDownData(filterData);
        }
      });
      setArr((prevState) => [
        ...prevState,
        { name: item.name, id: item?.id, checked: true },
      ]);
    } else {
      dropDownData?.map((data) => {
        if (data.id === item.id) {
          const tempArr = [{ name: item.name, id: item?.id, checked: false }];
          const filterData = dropDownData.map(
            (obj) => tempArr.find((o) => o.id === obj.id) || obj
          );
          setDropDownData(filterData);
        }
      });
      const filterData = arr.filter((data) => data.id !== item.id);
      setArr(filterData);
    }
  };

  const deleteCapsule = (item: any) => {
    const tempArr = [{ name: item.name, id: item?.id, checked: false }];
    const filterData = dropDownData.map(
      (obj) => tempArr.find((o) => o.id === obj.id) || obj
    );
    setDropDownData(filterData);
    const filterArrData = arr.filter((data) => data.id !== item.id);
    setArr(filterArrData);
  };

  useOutsideClick(wrapperRef, () => {
    if (openDropdown) setOpenDropdown(!openDropdown);
  });

  return (
    <div>
      <div className='relative' ref={wrapperRef}>
        <Label
          htmlFor='searchTerm'
          className='block text-sm font-medium text-gray-700'
        >
          {label} <span className='text-red-400'>&#42;</span>
        </Label>
        <Input
          type='text'
          name='searchTerm'
          id='searchTerm'
          placeholder='Search email address'
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setOpenDropdown(true);
            setError('');
          }}
          className={`px-3 py-2 mt-1 block w-full rounded-3xl appearance-none border border-gray-300 placeholder-gray-400 focus:border-admin-primary focus:outline-none focus:ring-admin-primary sm:text-sm`}
        />
        {errorMessage && (
          <span className='text-xs text-red-400 error'>{errorMessage}</span>
        )}
        <Transition
          show={openDropdown}
          as={Fragment}
          enter='transition ease-out duration-100'
          enterFrom='transform opacity-0 scale-95'
          enterTo='transform opacity-100 scale-100'
          leave='transition ease-in duration-75'
          leaveFrom='transform opacity-100 scale-100'
          leaveTo='transform opacity-0 scale-95'
        >
          <div className='absolute left-0 z-10 w-full my-2 overflow-auto origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
            <div className='py-1 max-h-[150px] h-auto'>
              <div>
                {dropDownData?.length > 0 &&
                  dropDownData?.map((item, index) => {
                    return (
                      <div
                        className='relative flex items-start p-2'
                        key={index}
                      >
                        <div className='flex items-center h-5'>
                          <Input
                            id={item.name}
                            name='comments'
                            checked={item?.checked}
                            type='checkbox'
                            onChange={(e) => handleCheckbox(e, item)}
                            className='w-4 h-4 text-indigo-600 border-gray-300 rounded cursor-pointer focus:ring-indigo-500'
                          />
                        </div>
                        <div className='ml-3 text-sm cursor-pointer'>
                          <Label
                            htmlFor={item.name}
                            className='font-medium text-gray-700'
                          >
                            {item.name}
                          </Label>
                        </div>
                      </div>
                    );
                  })}
                {!loader && dropDownData?.length === 0 && (
                  <div className='py-2 text-center'>
                    <p className='m-0 text-sm'>No data</p>
                  </div>
                )}
                {loader && (
                  <div className='py-2 text-center'>
                    <p className='m-0 text-sm'>Loading...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Transition>
      </div>
      {arr?.length > 0 && (
        <div className='flex flex-wrap pt-3 mt-3'>
          {arr?.map((item, index) => {
            return (
              <div
                className='relative px-4 py-2 mb-2 mr-2 text-sm bg-gray-200 rounded-3xl w-fit'
                key={index}
              >
                {item.name}
                <HiXCircle
                  onClick={() => deleteCapsule(item)}
                  className='w-[20px] absolute top-[-7px] cursor-pointer right-0 text-red-400'
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
