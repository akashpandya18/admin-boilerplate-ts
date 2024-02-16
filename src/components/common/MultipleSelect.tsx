import { ChangeEvent, Fragment, useEffect, useRef, useState } from 'react';
import { Transition } from '@headlessui/react';
import { HiChevronDown, HiXCircle } from 'react-icons/hi2';
import { useOutsideClick } from '@/lib/utils';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface MultipleSelectProps {
  data: any;
  label: string;
  selectedFocus: any;
  handleSelectedFocusList: any;
  disabled: boolean;
}

const MultipleSelect = ({
  data,
  label,
  selectedFocus,
  handleSelectedFocusList,
  disabled,
}: MultipleSelectProps) => {
  const wrapperRef = useRef<any>(null);
  const [show, setShow] = useState(false);
  const [arr, setArr] = useState<any[]>([]);
  const [dataList, setDataList] = useState<any[]>([]);

  useEffect(() => {
    let tempArr: any[] = [];
    setArr(selectedFocus);
    data?.map((item: any) => {
      tempArr.push({
        id: item?.id,
        name: item.focusName,
        checked: selectedFocus?.some((e: any) => e.id === item.id),
      });
    });
    setDataList(tempArr);
  }, [data, selectedFocus]);

  useEffect(() => {
    handleSelectedFocusList(arr);
  }, [arr]);

  const handleCheckbox = (e: ChangeEvent<HTMLInputElement>, item: any) => {
    if (e?.target?.checked) {
      dataList?.map((data) => {
        if (data.id === item.id) {
          let tempArr = [{ name: item.name, id: item?.id, checked: true }];
          let filterData = dataList.map(
            (obj) => tempArr.find((o) => o.id === obj.id) || obj
          );
          setDataList(filterData);
        }
      });
      setArr((prevState) => [
        ...prevState,
        { name: item.name, id: item?.id, checked: true },
      ]);
    } else {
      dataList?.map((data) => {
        if (data.id === item.id) {
          let tempArr = [{ name: item.name, id: item?.id, checked: false }];
          let filterData = dataList.map(
            (obj) => tempArr.find((o) => o.id === obj.id) || obj
          );
          setDataList(filterData);
        }
      });
      const filterData = arr.filter((data) => data.id !== item.id);
      setArr(filterData);
    }
  };

  const deleteCapsule = (item: any) => {
    let tempArr = [{ name: item.name, id: item?.id, checked: false }];
    let filterData = dataList.map(
      (obj) => tempArr.find((o) => o.id === obj.id) || obj
    );
    setDataList(filterData);
    const filterArrData = arr.filter((data) => data.id !== item.id);
    setArr(filterArrData);
  };

  useOutsideClick(wrapperRef, () => {
    if (show) setShow(!show);
  });

  return (
    <div className={!disabled ? 'cursor-pointer' : 'cursor-default'}>
      <Label
        htmlFor='meditationName'
        className='block text-sm font-medium text-gray-700'
      >
        {disabled ? 'Focus' : label}{' '}
        {!disabled && <span className='text-red-400'>&#42;</span>}
      </Label>

      {!disabled && (
        <div
          className='relative inline-block mt-1 text-left'
          style={{ width: '-webkit-fill-available' }}
          ref={wrapperRef}
        >
          <div
            onClick={() => {
              !disabled ? setShow(!show) : undefined;
            }}
            className={`${
              disabled ? 'bg-gray-50' : 'bg-white'
            } flex justify-between w-full rounded-3xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm focus:border-admin-primary focus:outline-none focus:ring-admin-primary`}
          >
            {label} here
            <HiChevronDown className='w-5 h-5 ml-2 -mr-1' aria-hidden='true' />
          </div>

          <Transition
            show={show}
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
                  {dataList?.length > 0 &&
                    dataList?.map((item, index) => {
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
                            <label
                              htmlFor={item.name}
                              className='font-medium text-gray-700'
                            >
                              {item.name}
                            </label>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </Transition>
        </div>
      )}
      {arr?.length > 0 && (
        <div className='flex flex-wrap mt-3'>
          {arr?.map((item, index) => {
            return (
              <div
                className='relative px-4 py-2 mb-2 mr-2 text-sm bg-gray-200 rounded-3xl w-fit'
                key={index}
              >
                {item.name}
                {!disabled && (
                  <HiXCircle
                    onClick={() => deleteCapsule(item)}
                    className='w-[20px] absolute top-[-7px] cursor-pointer right-0 text-red-400'
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MultipleSelect;
