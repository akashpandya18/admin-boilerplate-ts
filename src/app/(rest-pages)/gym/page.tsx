/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
'use client';

import { SetStateAction, useEffect, useState } from 'react';
import Breadcrumb from '@/components/common/Breadcrumb';
// import Table from '@/components/common/Table';
import Pagination from '@/components/common/Pagination/Pagination';
import { ErrorToast, SuccessToast } from '@/lib/utils';
import SearchInput from '@/components/common/Input/SearchInput';
import SelectMenu from '@/components/common/SelectMenu';
import { PER_PAGE } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const pages = [{ name: 'Gym', href: '/gym' }];

const columns = [
  {
    title: '',
    key: '',
    sortable: false,
    type: 'checkBox',
    align: 'left',
  },
  {
    title: 'Name',
    key: 'name',
    sortable: true,
    type: 'text',
    align: 'left',
  },
  {
    title: 'Address',
    key: 'address',
    type: 'text',
    align: 'left',
  },
  // {
  //   title: 'Domain Status',
  //   key: 'domain_status',
  //   type: 'badge-domain',
  //   align: 'center',
  // },
  {
    title: 'Status',
    key: 'status',
    type: 'badge',
    align: 'center',
  },
  {
    title: 'Actions',
    key: 'action',
    type: 'action',
    align: 'right',
    isView: '/gym/view',
    isEdit: '/gym/edit',
    isDelete: true,
  },
];

function Gym() {
  const router = useRouter();
  const [loader, setLoader] = useState(false);
  const [gymList, setGymList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortType, setSortType] = useState('DESC');
  const [inactive, setInactive] = useState(false);
  const [selectedPerPage, setSelectedPerPage] = useState(PER_PAGE[0]);

  const handlePagination = async (
    pageN: SetStateAction<number>,
    perPage: number,
    query: string,
    sortBy: string,
    sortType: string,
    status?: string
  ) => {
    setLoader(true);
    try {
      const gymRes = await axios.get(
        `/api/admin/gym?page=${pageN}&per_page=${perPage}&search=${query}&sort_by=${sortBy}&sort_type=${sortType}&status=${status}`
      );
      const response = gymRes.data;

      if (response) {
        if (response?.data?.meta?.code === 1) {
          setGymList(response?.data?.data);
          setPage(pageN);
          setTotalCount(response?.data?.meta?.totalCount);
          setLoader(false);
        } else if (response?.code === 401) {
          setLoader(false);
          ErrorToast(response?.message);
        } else if (response?.data?.meta?.code === 0) {
          setPage(1);
          setGymList([]);
          setTotalCount(0);
          setLoader(false);
          ErrorToast(response?.data?.meta?.message);
        } else {
          setLoader(false);
        }
      }
    } catch (error: any) {
      setLoader(false);
      ErrorToast(error);
    }
  };

  const handleSortBy = (sortByValue: string) => {
    setSortBy(sortByValue);
    if (sortByValue === sortBy) {
      const tempSortOrder = sortType === 'ASC' ? 'DESC' : 'ASC';
      setSortType(tempSortOrder);
      handlePagination(
        page,
        selectedPerPage?.value,
        search,
        sortByValue,
        tempSortOrder
      );
    } else {
      setSortType('ASC');
      handlePagination(
        page,
        selectedPerPage?.value,
        search,
        sortByValue,
        'ASC'
      );
    }
  };

  useEffect(() => {
    if (search) {
      const delayDebounceFn = setTimeout(() => {
        handlePagination(1, selectedPerPage?.value, search, sortBy, sortType);
      }, 800);

      return () => clearTimeout(delayDebounceFn);
    } else {
      handlePagination(1, 10, '', sortBy, sortType);
    }
  }, [search]);

  const handlePerPage = (perPage: any) => {
    setSelectedPerPage(perPage);
    handlePagination(1, perPage.value, search, sortBy, sortType);
  };

  const handleActivity = () => {
    if (inactive) {
      setInactive(false);
    }
  };

  const refreshTable = () =>
    handlePagination(1, selectedPerPage?.value, '', sortBy, sortType);

  const deleteHandler = (id: any) => {
    setLoader(true);
    setSearch('');
    try {
      const gymRes: any = axios.delete(`/api/admin/gym/${id}`);
      const response = gymRes?.data;

      if (response) {
        if (response?.data?.meta?.code === 1) {
          handlePagination(1, selectedPerPage?.value, '', sortBy, sortType);
          SuccessToast(response?.data?.meta?.message);
        } else if (response?.data?.meta?.code === 0) {
          setLoader(false);
          ErrorToast(response?.data?.meta?.message);
        } else {
          setLoader(false);
        }
      }
    } catch (error: any) {
      setLoader(false);
      ErrorToast(error);
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);

    const inactivityTimer = setInterval(() => {
      setInactive(true);
      if (inactive) {
        console.log('inactive');
        refreshTable();
      }
    }, 30000);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      clearTimeout(inactivityTimer);
    };
  }, [inactive]);

  return (
    <div className='relative'>
      <Breadcrumb pageList={pages} />
      <div className='mt-6'>
        <div className='justify-between sm:flex'>
          <div className='flex'>
            <div className='self-center hidden mr-3 sm:flex'>
              <span className='self-center mr-2 text-sm'>Per page:</span>
              <div className='w-[80px]'>
                <SelectMenu
                  menuList={PER_PAGE}
                  showLabel={false}
                  defaultSelected={selectedPerPage}
                  setSelectedMenu={handlePerPage}
                />
              </div>
            </div>
            <div className='self-center'>
              <SearchInput
                id='searchKey'
                name='searchKey'
                type='text'
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Search by gym name'
              />
            </div>
          </div>
          <div className='flex justify-between mt-3 sm:mt-0'>
            <div className='flex self-center sm:hidden'>
              <span className='self-center mr-2 text-sm'>Per page:</span>
              <div className='w-[80px]'>
                <SelectMenu
                  menuList={PER_PAGE}
                  showLabel={false}
                  defaultSelected={selectedPerPage}
                  setSelectedMenu={handlePerPage}
                />
              </div>
            </div>
            <div className='flex'>
              <div className='self-center ml-3'>
                <button
                  onClick={() => router.push('/gym/add')}
                  type='button'
                  className='inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white border border-transparent shadow-sm rounded-3xl bg-gradient-to-r from-admin-primary to-admin-secondary hover:admin-primary focus:outline-none focus:ring-2 focus:ring-admin-primary focus:ring-offset-2 sm:w-auto'
                >
                  Add New
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className='mt-4'>
          {/* <Table
            columns={columns}
            data={gymList}
            name={'gym_table'}
            setDeleteId={deleteHandler}
            // bottomBorder={totalCount > selectedPerPage?.value}
            refreshTable={refreshTable}
            setSortBy={(sort: string) => handleSortBy(sort)}
            loader={loader}
            setSearchTerm={(data: SetStateAction<string>) => setSearch(data)}
          /> */}
        </div>
      </div>
      <div>
        {gymList.length > 0 && !loader ? (
          <Pagination
            currentPage={page}
            totalCount={totalCount}
            pageSize={selectedPerPage?.value}
            onPageChange={(page) =>
              handlePagination(
                Number(page),
                selectedPerPage?.value,
                search,
                sortBy,
                sortType
              )
            }
          />
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}

export default Gym;
