'use client';

import { SetStateAction, useEffect, useState } from 'react';
import Breadcrumb from '@/components/common/Breadcrumb';
import { ErrorToast, SuccessToast } from '@/lib/utils';
import Loader from '@/components/common/Loader';
import Pagination from '@/components/common/Pagination/Pagination';
import moment from 'moment';
import DeletePopup from '@/components/common/modals/DeletePopup';
import LazyLoadImageProp from '@/components/common/LazyLoadImage';
import { HiTrash } from 'react-icons/hi2';
import NoDataFoundImg from '@/assets/images/no-data-found.svg';
import axios from 'axios';

const pages = [
  { name: 'Notifications', href: '/notifications', current: true },
];
const PAGE_SIZE = 15;

function Notification() {
  const [loader, setLoader] = useState(false);
  const [notificationList, setNotificationList] = useState<any[]>([]);
  const [openDeletePopup, setDeletePopup] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [idToDelete, setIdToDelete] = useState('');
  const [deleteType, setDeleteType] = useState('');

  const handlePagination = async (
    pageNumber: SetStateAction<number>,
    pageSize: number,
    searchKey: string
  ) => {
    setLoader(true);

    try {
      const notifRes = await axios.get(
        `/api/admin/notifications?type=2&page=${pageNumber}&perPage=${pageSize}&searchKey=${searchKey}`
      );

      const response = notifRes.data;

      if (response) {
        if (response?.data?.meta?.code === 1) {
          setCurrentPage(pageNumber);
          setNotificationList(response?.data?.data);
          setTotalCount(response?.data?.meta?.totalNotifications);
          setLoader(false);
        } else if (response?.data?.meta?.code === 0) {
          setCurrentPage(1);
          setNotificationList([]);
          setTotalCount(0);
          setLoader(false);
          ErrorToast(response?.data?.meta?.message);
        } else {
          setLoader(false);
        }
      }
    } catch (error: any) {
      setLoader(false);
      ErrorToast(error?.response?.data?.message);
    }
  };

  const deleteHandler = (id: SetStateAction<string>, type: string) => {
    setIdToDelete(id);
    setDeleteType(type);
    setDeletePopup(true);
  };

  const handleDeletePopup = async () => {
    setLoader(true);
    try {
      const notifRes = await axios.delete('/api/admin/notifications', {
        params: { idToDelete, deleteType },
      });
      const response = notifRes.data;
      if (response) {
        if (response?.data?.meta?.code === 1) {
          SuccessToast(response?.data?.meta?.message);
          handlePagination(1, PAGE_SIZE, '');
          setLoader(false);
          setDeletePopup(false);
        } else {
          ErrorToast(response?.data?.meta?.message || 'Something went wrong');
        }
      }
    } catch (error: any) {
      setLoader(false);
      ErrorToast(error?.response?.data?.message);
    }
    setIdToDelete('');
    setDeleteType('');
  };

  useEffect(() => {
    handlePagination(1, PAGE_SIZE, '');
  }, []);

  return (
    <>
      {loader && <Loader />}
      <Breadcrumb pageList={pages} />
      {notificationList?.length > 0 ? (
        <div className='mt-3'>
          <div className='text-right'>
            <button
              onClick={() => deleteHandler('', '2')}
              type='button'
              className='inline-flex justify-center w-full px-6 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 shadow-sm rounded-3xl hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
            >
              Clear All Notifications
            </button>
          </div>
          <div className='mt-3 overflow-hidden bg-white border border-gray-200 rounded-t-md'>
            <ul role='list' className=''>
              {notificationList?.map((item, index) => (
                <li
                  key={index}
                  className={`group px-4 py-2 hover:bg-gray-50 cursor-pointer ${
                    item?.isRead
                      ? 'border-gray-200 border-b'
                      : 'shadow-sm bg-white border-b-2 border-gray-300'
                  }`}
                >
                  <div className='justify-between w-full md:flex'>
                    <div className='md:flex md:w-[calc(100%-150px)]'>
                      <div className='flex justify-between md:w-[220px] md:pr-3'>
                        <div className='flex'>
                          <div className='flex-shrink-0 w-8 h-8'>
                            {item?.fromUser?.userProfile ? (
                              <LazyLoadImageProp
                                imageSrc={item?.fromUser?.userProfile}
                                className='w-8 h-8 rounded-full'
                              />
                            ) : (
                              <div className='flex items-center justify-center w-8 h-8 text-sm bg-black rounded-full'>
                                <span className='text-white'>
                                  {item?.fromUser?.name
                                    ?.split(' ')[0]
                                    ?.charAt(0)}
                                </span>
                                <span className='text-white'>
                                  {item?.fromUser?.name
                                    ?.split(' ')[1]
                                    ?.charAt(0)}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className='self-center ml-2'>
                            <div
                              className={`text-sm ${
                                item?.isRead
                                  ? 'text-gray-500'
                                  : 'text-gray-500 font-bold'
                              }`}
                            >
                              {item?.fromUser?.name}
                            </div>
                          </div>
                        </div>
                        <div className='block md:hidden'>
                          <p className='text-right group-hover:hidden block text-gray-400 self-center text-[12px]'>
                            {moment(item.publishedOn).format('lll')}
                          </p>
                          <p className='group-hover:block hidden ml-auto text-gray-400 text-[12px]'>
                            <HiTrash
                              onClick={() => deleteHandler(item?.id, '1')}
                              className='text-right ml-auto w-[20px] text-red-500'
                            />
                          </p>
                        </div>
                      </div>
                      <p className='flex md:mt-0 mt-2 md:w-[calc(100%-220px)]'>
                        <p
                          className={`md:ml-5 inline-block whitespace-nowrap overflow-hidden overflow-ellipsis text-sm self-center ${
                            item?.isRead
                              ? 'text-gray-500'
                              : 'text-gray-500 font-bold'
                          }`}
                        >
                          {item.title}{' '}
                          <span className='font-normal text-gray-400'>
                            - {item.message}
                          </span>
                        </p>
                      </p>
                    </div>
                    <div className='self-center hidden md:block'>
                      <p className='md:w-[150px] group-hover:hidden block text-right text-gray-400 text-[12px]'>
                        {moment(item.createdAt).format('lll')}
                      </p>
                      <p className='md:w-[150px] group-hover:block hidden ml-auto text-gray-400 text-[12px]'>
                        <HiTrash
                          onClick={() => deleteHandler(item?.id, '1')}
                          className='text-right ml-auto w-[20px] text-red-500'
                        />
                      </p>
                    </div>
                  </div>
                  {/*<EyeIcon className='w-[24px]' />*/}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p className='mt-6 text-center'>
          <div className='py-[20px] bg-white border-t border-[#EAEAEA] w-full'>
            <NoDataFoundImg
              className={`m-auto text-indigo-50 border border-admin-blue rounded-lg`}
            />
            <p className='mt-3 text-sm text-center text-admin-gray4'>
              No Notifications
            </p>
          </div>
        </p>
      )}
      <div>
        {totalCount > PAGE_SIZE ? (
          <Pagination
            currentPage={currentPage}
            totalCount={totalCount}
            pageSize={PAGE_SIZE}
            onPageChange={(page) =>
              handlePagination(Number(page), PAGE_SIZE, '')
            }
          />
        ) : (
          <span />
        )}
      </div>
      {openDeletePopup && (
        <DeletePopup
          open={openDeletePopup}
          title={
            deleteType === '1'
              ? 'Delete notification'
              : 'Delete all notifications'
          }
          message={`Are you sure you want to delete ${
            deleteType === '1' ? 'this notification' : 'all notifications'
          }? This action cannot be undone.`}
          setOpen={setDeletePopup}
          setDelete={handleDeletePopup}
        />
      )}
    </>
  );
}

export default Notification;
