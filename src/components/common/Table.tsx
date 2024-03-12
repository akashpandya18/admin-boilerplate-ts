/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
'use client';

import React, { Fragment, useLayoutEffect, useRef, useState } from 'react';
import {
  // ErrorToast,
  getAccountType,
  getContentType,
  getSentToUser,
  getUserType,
  // SuccessToast,
} from '@/lib/utils';
import { useRouter } from 'next/navigation';
import {
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineEye,
  HiOutlineChevronUpDown,
  HiCheckCircle,
  HiClock,
  HiXCircle,
} from 'react-icons/hi2';
import NoDataFoundImg from '@/assets/images/no-data-found.svg';
import moment from 'moment';
import AudioPlayer from './AudioPlayer/AudioPlayer';
import VideoPlayer from './modals/VideoPlayer';
import BulkOperationPopup from './modals/BulkOperationPopup';
import ConfirmPopup from './modals/ConfirmPopup';
import ActiveInactiveToggle from './ActiveInactiveToggle';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { CONTENT_APPROVAL_TYPE } from '@/lib/constants';
import { Listbox, Transition } from '@headlessui/react';
import Loader from './Loader';
import LazyLoadImageProp from './LazyLoadImage';
import FocusPopup from './modals/FocusPopup';
import Image from 'next/image';
import DeletePopup from './modals/DeletePopup';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface TableProps {
  columns: any;
  data: any;
  setDeleteId: any;
  setSelectedRow?: any;
  name: string;
  setSortBy: any;
  refreshTable: any;
  loader: boolean;
  setSearchTerm: any;
  message?: string;
}

const Table = ({
  columns,
  data = [],
  setDeleteId,
  setSelectedRow,
  name,
  setSortBy,
  refreshTable,
  loader,
  setSearchTerm,
  message,
}: TableProps) => {
  const router = useRouter();

  const checkbox = useRef<any>({ indeterminate: false });
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedData, setSelectedData] = useState<any[]>([]);
  const [selectedRowOfTable, setSelectedRowOfTable] = useState(null);

  useLayoutEffect(() => {
    if (data?.length > 0) {
      const isIndeterminate =
        selectedData.length > 0 && selectedData.length < data.length;
      setChecked(selectedData.length === data.length);
      setIndeterminate(isIndeterminate);
      checkbox.current.indeterminate = isIndeterminate;
    }
  }, [selectedData]);

  function toggleAll() {
    setSelectedData(
      checked || indeterminate ? [] : data?.map((temp: { id: any }) => temp.id)
    );
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  }

  const [openDeletePopup, setDeletePopup] = useState(false);
  const [bulkOperationPopup, setBulkOperationPopup] = useState(false);
  const [openConfirmPopup, setOpenConfirmPopup] = useState(false);
  const [openVideoPlayer, setVideoPlayer] = useState(false);
  const [idToDelete, setIdToDelete] = useState('');
  const [activePlaying, setActivePlaying] = useState<any>(null);
  const [actionType, setActionType] = useState('');
  const [open, setOpen] = React.useState(false);
  const [openFocusPopup, setOpenFocusPopup] = useState(false);
  const [focusData, setFocusData] = useState<any[]>([]);

  const deleteHandler = (id: React.SetStateAction<string>) => {
    setIdToDelete(id);
    setDeletePopup(true);
  };

  const bulkOperationHandler = (actionType: React.SetStateAction<string>) => {
    setActionType(actionType);
    setBulkOperationPopup(true);
  };

  const activePlayerHandler = (id: React.SetStateAction<string>) => {
    setActivePlaying(id);
  };

  const pauseHandler = () => {
    setActivePlaying(null);
  };

  const focusPopUpHandler = (data: React.SetStateAction<any[]>) => {
    setFocusData([]);
    setOpenFocusPopup(true);
    setFocusData(data);
  };

  const handleOldNew = (data: any, column: any) => {
    const pathname = column.isTwoOption;
    const option = data?.value == 1 ? 1 : 2;
    const routeData = { pathname, query: { action: 'view', option } };
    router.push(JSON.stringify(routeData));
  };

  const formattedData = (rowData: any, data: any, type: any, column: any) => {
    if (type === 'badge') {
      return (
        <p
          className={`inline-flex m-0 rounded-full ${
            data === '1' ? 'bg-green-100' : 'bg-red-100'
          } px-3 py-[3px] text-md leading-5 capitalize font-semibold tracking-normal ${
            data === '1' ? 'text-green-700' : 'text-red-700'
          }`}
        >
          {data === '1' ? 'active' : 'inactive'}
        </p>
      );
    } else if (type === 'userType') {
      return getUserType(data);
    } else if (type === 'contentType') {
      return getContentType(data);
    } else if (type === 'contentStatus') {
      return (
        <div>{data === 0 ? 'Draft' : data === 1 ? 'Approved' : 'Rejected'}</div>
      );
    } else if (type === 'accountType') {
      return getAccountType(data);
    } else if (type === 'sentToUser') {
      return getSentToUser(data);
    } else if (type === 'profile') {
      const name = rowData.name?.split(' ');
      return (
        <div className='flex items-center justify-center text-center'>
          <div className='flex-shrink-0'>
            <div>
              {data ? (
                <LazyLoadImageProp
                  imageSrc={
                    data ? data : '/public/assets/images/dummy_profile.png'
                  }
                />
              ) : (
                <div className='flex items-center justify-center w-10 h-10 bg-black rounded-full'>
                  <span className='text-white'>{name[0]?.charAt(0)}</span>
                  <span className='text-white'>{name[1]?.charAt(0)}</span>
                </div>
              )}
            </div>
          </div>
          <div className='ml-4'>
            <div className='font-medium text-gray-900'>{rowData.name}</div>
            <div className='text-gray-500 lowercase'>{rowData?.email}</div>
          </div>
        </div>
      );
    } else if (type === 'action') {
      return (
        <div className='flex items-center justify-end'>
          {column.isEdit && (
            <HiOutlinePencilSquare
              className='w-[20px] ml-2 text-admin-secondary cursor-pointer'
              onClick={() => {
                const routeData = {
                  pathname: column.isEdit,
                  query: { ...rowData, action: 'edit' },
                };
                return router.push(JSON.stringify(routeData));
              }}
            />
          )}
          {column?.isView && (
            <HiOutlineEye
              className='w-[20px] ml-2 text-admin-secondary cursor-pointer'
              onClick={() => {
                const routeData = {
                  pathname: column.isView,
                  query: { ...rowData, action: 'view' },
                };
                return router.push(JSON.stringify(routeData));
              }}
            />
          )}
          {column?.isTwoOption &&
            (rowData.parentId !== null ? (
              <div>
                <HiOutlineEye
                  className='w-[20px] ml-2 text-admin-secondary cursor-pointer'
                  onClick={() => setOpen(!open)}
                />
                {open ? (
                  <Listbox onChange={(data) => handleOldNew(data, column)}>
                    {() => (
                      <>
                        <div className='relative'>
                          <Transition
                            show={open}
                            as={Fragment}
                            leave='transition ease-in duration-100'
                            leaveFrom='opacity-100'
                            leaveTo='opacity-0'
                          >
                            <Listbox.Options className='absolute right-0 z-10 w-full py-1 mt-1 overflow-auto text-base text-left bg-white rounded-md shadow-lg cursor-pointer max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
                              {CONTENT_APPROVAL_TYPE.map((menu, index) => (
                                <Listbox.Option
                                  key={index}
                                  className='relative py-2 pl-3 text-gray-900 cursor-default pr-9 hover:text-white hover:bg-admin-primary'
                                  disabled={!menu?.value}
                                  value={menu}
                                >
                                  <span className='font-normal cursor-pointer'>
                                    {menu?.name}
                                  </span>
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </>
                    )}
                  </Listbox>
                ) : null}
              </div>
            ) : (
              <HiOutlineEye
                className='w-[20px] ml-2 text-admin-secondary cursor-pointer'
                onClick={() => {
                  const routeData = {
                    pathname: column.isView,
                    query: { ...rowData, action: 'view' },
                  };
                  return router.push(JSON.stringify(routeData));
                }}
              />
            ))}
          {column.isDelete && (
            <HiOutlineTrash
              className='w-[20px] ml-2 text-red-500 cursor-pointer'
              onClick={() => deleteHandler(rowData?.id)}
            />
          )}
          {column.isResend && (
            <div
              className='cursor-pointer text-admin-secondary'
              onClick={() => {
                setSelectedRowOfTable(rowData);
                setOpenConfirmPopup(true);
              }}
            >
              Resend
            </div>
          )}
        </div>
      );
    } else if (type === 'text') {
      return data ? (
        <>
          {column.longText ? (
            <p
              className='w-[20rem] min-w-[8rem] inline-block overflow-hidden overflow-ellipsis'
              id={column.key + rowData.id}
            >
              {data}
              {data.length >= 45 && (
                <Tooltip>
                  <TooltipTrigger id={`${column.key}${rowData.id}`}>
                    Trigger Element
                  </TooltipTrigger>
                  <TooltipContent className='w-[350px] whitespace-normal break-all text-center max-h-[250px] overflow-y-hidden'>
                    {data}
                  </TooltipContent>
                </Tooltip>
              )}
            </p>
          ) : (
            data
          )}
        </>
      ) : (
        '━━'
      );
    } else if (type === 'date') {
      return data ? moment(data).format('lll') : '━━';
    } else if (type === 'image') {
      return (
        <LazyLoadImageProp
          imageSrc={data ? data : '/public/assets/images/thumbnail.png'}
          className='w-full max-w-[70px] h-auto rounded-md'
        />
      );
    } else if (type === 'array') {
      const array = data.slice(0, 2);
      return (
        <div>
          {array?.map((value: any, key: number) => (
            <div key={key}>
              {key === array.length - 1
                ? value?.display_name
                : value?.display_name + ','}
            </div>
          ))}
          {data?.length > 2 ? (
            <div
              className='font-medium text-blue-800 cursor-pointer'
              onClick={() => focusPopUpHandler(data)}
            >
              +{data.length - array.length} more
            </div>
          ) : null}
        </div>
      );
    } else if (type === 'play') {
      return (
        <>
          <div className='flex items-start justify-center '>
            <AudioPlayer
              onPlay={() => activePlayerHandler(rowData.id)}
              pauseHandler={pauseHandler}
              playing={activePlaying === rowData.id}
              audioPath={rowData[column.key]}
            />
          </div>
        </>
      );
    } else if (type === 'toggle') {
      return (
        <>
          <ActiveInactiveToggle
            accountStatus={rowData.accountStatus}
            userId={rowData.id}
          />
        </>
      );
    } else if (type === 'verified') {
      return (
        <p
          className={`inline-flex m-0 rounded-full ${
            data === false || data == null ? 'bg-red-100' : 'bg-green-100'
          } px-3 py-[3px] text-md leading-5 capitalize font-semibold tracking-normal ${
            data === false || data == null ? 'text-red-700' : 'text-green-700'
          }`}
        >
          {data === false || data == null ? 'Pending' : 'Verified'}
        </p>
      );
    } else if (type === 'platform' || type === 'purchase_platform') {
      const anchorId =
        type === 'purchase_platform' ? rowData.transactionId : rowData.id;
      const content =
        data === 0
          ? 'admin'
          : data === 1 && type === 'purchase_platform'
            ? 'Google'
            : data === 1 && type === 'platform'
              ? 'Apple'
              : data === 2 && type === 'purchase_platform'
                ? 'Apple'
                : data === 2 && type === 'platform'
                  ? 'Google'
                  : 'Facebook';

      return (
        <div className='relative flex justify-center w-full'>
          {
            <Image
              src={
                data === 0
                  ? '/public/assets/images/mail.png'
                  : data === 1 && type === 'purchase_platform'
                    ? '/public/assets/images/google.png'
                    : data === 1 && type === 'platform'
                      ? '/public/assets/images/apple.png'
                      : data === 2 && type === 'purchase_platform'
                        ? '/public/assets/images/apple.png'
                        : data === 2 && type === 'platform'
                          ? '/public/assets/images/google.png'
                          : '/public/assets/images/fb.png'
              }
              alt='platform'
              className='w-6 h-6 cursor-pointer'
              id={
                type === 'purchase_platform'
                  ? rowData.transactionId
                  : rowData.id
              }
            />
          }
          <Tooltip>
            <TooltipTrigger id={anchorId}>Trigger Element</TooltipTrigger>
            <TooltipContent className='bg-admin-secondary'>
              {content}
            </TooltipContent>
          </Tooltip>
        </div>
      );
    } else if (type === 'badge-domain') {
      return (
        <p
          className={`inline-flex gap-1 m-0 rounded-full ${
            data === '1'
              ? 'bg-green-100'
              : data === '2'
                ? 'bg-yellow-100'
                : 'bg-red-100'
          } px-3 py-[3px] text-md leading-5 capitalize font-semibold tracking-normal ${
            data === '1'
              ? 'text-green-700'
              : data === '2'
                ? 'text-yellow-700'
                : 'text-red-700'
          }`}
        >
          {' '}
          {data === '1' ? (
            <HiCheckCircle className='w-5 h-5' />
          ) : data === '2' ? (
            <HiClock className='w-5 h-5' />
          ) : (
            <HiXCircle className='w-5 h-5' />
          )}
          {data === '1' ? 'active' : data === '2' ? 'pending' : 'failed'}
        </p>
      );
    }
  };

  const handleDeletePopup = () => {
    setDeletePopup(false);
    setDeleteId(idToDelete);
    setIdToDelete('');
  };

  // const userTableBulk = () => {
  //   // const payload = {
  //   //   ids: selectedData,
  //   //   status: `${actionType}`,
  //   // };
  //   // TODO: new call method when api is ready
  //   // Api.postUserBulkAction(payload).then((response) => {
  //   //   if (response.meta.code === 1) {
  //   //     successToast(response.meta.message);
  //   //     setSelectedData([]);
  //   //     setChecked(false);
  //   //     setIndeterminate(false);
  //   //     refreshTable();
  //   //   } else if (response.meta.code === 0) {
  //   //     errorToast(response.meta.message);
  //   //   }
  //   // });
  // };

  // const gymTableBulk = () => {
  //   // const payload = {
  //   //   ids: selectedData,
  //   //   status: `${actionType}`,
  //   // };
  //   // TODO: new call method when api is ready
  //   // Api.postGymBulkAction(payload).then((response) => {
  //   //   if (response.meta.code === 1) {
  //   //     successToast(response.meta.message);
  //   //     setSelectedData([]);
  //   //     setChecked(false);
  //   //     setIndeterminate(false);
  //   //     refreshTable();
  //   //   } else if (response.meta.code === 0) {
  //   //     errorToast(response.meta.message);
  //   //   }
  //   // });
  // };

  // const otherBulk = () => {
  //   const payload = {
  //     contentIds: selectedData,
  //     contentType: contentType,
  //     contentStatus: actionType,
  //   };
  //   Api.postBulkAction(payload).then((response) => {
  //     if (response.data.meta.code === 1) {
  //       successToast(response.data.meta.message);
  //       setSelectedData([]);
  //       setChecked(false);
  //       setIndeterminate(false);
  //       refreshTable();
  //     } else if (response.data.meta.code === 0) {
  //       errorToast(response.data.meta.message);
  //     }
  //   });
  // };

  const handleBulkOperation = () => {
    setBulkOperationPopup(false);
    setSearchTerm('');
    // switch (name) {
    //   case 'users_table':
    //     userTableBulk();
    //     break;

    //   // case 'gym_table':
    //   //   gymTableBulk();
    //   //   break;
    //   default:
    //     // otherBulk();
    //     break;
    // }
  };

  const handleResendNotification = (e: any, row: any) => {
    e.preventDefault();
    setSelectedRow(row);
  };

  return (
    <>
      <div className='flex flex-col'>
        <div className='overflow-x-auto'>
          <div className='inline-block min-w-full pt-2 align-middle '>
            <div
              className={`overflow-hidden border border-gray-200 shadow rounded-t-[15px]`}
            >
              <table className='min-w-full divide-y divide-[#EAEAEA]'>
                <thead className='bg-admin-tableHeader'>
                  <tr>
                    {columns?.map((column: any, index: number) => {
                      return (
                        <Fragment key={index}>
                          {column.type === 'checkBox' ? (
                            <th
                              scope='col'
                              className='relative w-12 px-6 sm:w-16 sm:px-8'
                            >
                              <Input
                                ref={checkbox}
                                type='checkbox'
                                className={`${
                                  data.length != 0 && 'cursor-pointer'
                                } absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 accent-admin-primary sm:left-6`}
                                checked={checked}
                                onChange={toggleAll}
                                disabled={data.length == 0}
                              />
                              {selectedData.length > 0 && (
                                <div
                                  className='absolute top-0 flex items-center space-x-3 left-12 bg-admin-tableHeader sm:left-16'
                                  style={{ height: '-webkit-fill-available' }}
                                >
                                  {(name === 'users_table' ||
                                    name === 'gym_table') && (
                                    <Button
                                      onClick={() => bulkOperationHandler('2')}
                                      type='button'
                                      variant={'destructive'}
                                      className='inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-30'
                                    >
                                      Delete
                                    </Button>
                                  )}
                                  <Button
                                    onClick={() => bulkOperationHandler('1')}
                                    type='button'
                                    variant={'default'}
                                    className='inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-30'
                                  >
                                    Active
                                  </Button>
                                  <Button
                                    onClick={() => bulkOperationHandler('0')}
                                    type='button'
                                    variant={'secondary'}
                                    className='inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-30'
                                  >
                                    Inactive
                                  </Button>
                                </div>
                              )}
                            </th>
                          ) : (
                            <th
                              key={index}
                              scope='col'
                              className={`p-3 ${
                                column.sortable ? 'cursor-pointer' : ''
                              } ${
                                columns[0]?.type === 'checkBox' &&
                                index === 1 &&
                                column.type !== 'play'
                                  ? 'min-w-[6rem]'
                                  : ''
                              } ${
                                column.align === 'left'
                                  ? 'text-left'
                                  : column.align === 'center'
                                    ? 'text-center'
                                    : 'text-right'
                              } text-sm font-semibold text-[#0B0F18]`}
                            >
                              {column.sortable ? (
                                <div
                                  className='flex'
                                  onClick={() =>
                                    setSortBy(
                                      column?.sortKey
                                        ? column?.sortKey
                                        : column.key
                                    )
                                  }
                                >
                                  <span className='self-center'>
                                    {column.title}{' '}
                                  </span>
                                  <span className='self-center'>
                                    {column.sortable ? (
                                      <HiOutlineChevronUpDown className='w-[20px]' />
                                    ) : (
                                      ''
                                    )}
                                  </span>
                                </div>
                              ) : (
                                column.title
                              )}
                            </th>
                          )}
                        </Fragment>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className='divide-y divide-[#EAEAEA] bg-white'>
                  {loader ? (
                    <tr>
                      <td>
                        <Loader />
                      </td>
                    </tr>
                  ) : (
                    <>
                      {data?.length > 0 ? (
                        data?.map((data: any, index: number) => {
                          return (
                            <tr key={index}>
                              {columns?.map((column: any, index1: number) => {
                                return (
                                  <Fragment key={index1}>
                                    {column.type === 'checkBox' ? (
                                      <td className='relative w-12 px-6 sm:w-16 sm:px-8'>
                                        {selectedData.includes(data.id) && (
                                          <div className='absolute inset-y-0 left-0 w-0.5 bg-admin-primary' />
                                        )}
                                        <Input
                                          type='checkbox'
                                          className='absolute w-4 h-4 -mt-2 border-gray-300 rounded cursor-pointer left-4 top-1/2 accent-admin-primary sm:left-6'
                                          value={data.id}
                                          checked={selectedData.includes(
                                            data.id
                                          )}
                                          onChange={(e) =>
                                            setSelectedData(
                                              e.target.checked
                                                ? [...selectedData, data.id]
                                                : selectedData.filter(
                                                    (p) => p !== data.id
                                                  )
                                            )
                                          }
                                        />
                                      </td>
                                    ) : (
                                      <td
                                        key={index}
                                        className={`whitespace-nowrap ${
                                          column.align === 'left'
                                            ? 'text-left'
                                            : column.align == 'center'
                                              ? 'text-center'
                                              : 'text-right'
                                        } p-3 text-sm text-[#606060] ${
                                          column.transform
                                            ? column.transform
                                            : 'capitalize'
                                        }`}
                                      >
                                        {column?.nested
                                          ? formattedData(
                                              data,
                                              data[column.key1]?.[column.key2],
                                              column.type,
                                              column
                                            )
                                          : formattedData(
                                              data,
                                              data[column.key],
                                              column.type,
                                              column
                                            )}
                                      </td>
                                    )}
                                  </Fragment>
                                );
                              })}
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={columns.length}>
                            <div className='py-[20px] bg-white border-t border-[#EAEAEA] w-full'>
                              <NoDataFoundImg
                                className={`m-auto text-indigo-50 border border-admin-blue rounded-lg`}
                              />
                              <p className='mt-3 text-sm text-center text-admin-gray4'>
                                No results
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {openConfirmPopup && (
        <ConfirmPopup
          open={openConfirmPopup}
          setOpen={setOpenConfirmPopup}
          message={'Are you sure you want to resend notification?'}
          setAccepted={(e) => handleResendNotification(e, selectedRowOfTable)}
        />
      )}
      {openDeletePopup && (
        <DeletePopup
          open={openDeletePopup}
          setOpen={setDeletePopup}
          setDelete={handleDeletePopup}
          message={message}
        />
      )}
      {bulkOperationPopup && (
        <BulkOperationPopup
          open={bulkOperationPopup}
          setOpen={setBulkOperationPopup}
          setDelete={handleBulkOperation}
          actionType={Number(actionType)}
        />
      )}
      <FocusPopup
        open={openFocusPopup}
        setOpen={setOpenFocusPopup}
        data={focusData}
      />
      {openVideoPlayer && (
        <VideoPlayer open={openVideoPlayer} setOpen={setVideoPlayer} />
      )}
    </>
  );
};

export default Table;
