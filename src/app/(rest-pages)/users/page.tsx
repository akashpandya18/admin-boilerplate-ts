'use client';

import { useState, useEffect, SetStateAction } from 'react';
import { useRouter } from 'next/navigation';
import { PER_PAGE } from '@/lib/constants';
import { ErrorToast, SuccessToast } from '@/lib/utils';
// import Breadcrumb from '@/app/components/common/Breadcrumb';
// import SelectMenu from '@/app/components/common/SelectMenu';
// import SearchInput from '@/app/components/common/Input/SearchInput';
// import Table from '@/app/components/common/Table';
// import Pagination from '@/app/components/common/Pagination';
import axios from 'axios';

const pages = [{ name: 'Users', href: '/users' }];

const columns = [
  {
    title: '',
    key: '',
    sortable: false,
    type: 'checkBox',
    align: 'left',
  },
  {
    title: 'First Name',
    key: 'first_name',
    sortable: true,
    sortKey: 'first_name',
    type: 'text',
    align: 'left',
  },
  {
    title: 'Last Name',
    key: 'last_name',
    sortable: true,
    sortKey: 'last_name',
    type: 'text',
    align: 'left',
  },
  {
    title: 'Email',
    key: 'email',
    type: 'profile',
    align: 'center',
  },
  {
    title: 'Gym',
    key: 'gym_name',
    type: 'text',
    align: 'center',
  },
  {
    title: 'Status',
    key: 'status',
    sortable: false,
    sortKey: 'status',
    type: 'badge',
    align: 'center',
  },
  {
    title: 'Action',
    key: 'action',
    type: 'action',
    align: 'right',
    isView: '/users/view',
    isEdit: '/users/edit',
    isDelete: true,
  },
];

const Users = () => {
  const router = useRouter();

  const [loader, setLoader] = useState(true);
  const [usersList, setUsersList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortType, setSortType] = useState('DESC');
  const [selectedPerPage, setSelectedPerPage] = useState(PER_PAGE[0]);

  const handlePagination = async (
    pageN: SetStateAction<number>,
    perPage: number,
    query: string,
    sortBy: SetStateAction<string>,
    sortType: string
  ) => {
    setLoader(true);

    try {
      const usersRes = await axios.get(
        `/api/admin/users?page=${pageN}&per_page=${perPage}&search=${query}&sort_by=${sortBy}&sort_type=${sortType}`
      );
      const res = usersRes.data;
      if (res) {
        if (res?.data?.meta?.code === 1) {
          setUsersList(res?.data?.data);
          setPage(pageN);
          setTotalCount(res?.data?.meta?.totalCount);
          setLoader(false);
        } else if (res?.code === 401) {
          setLoader(false);
          ErrorToast(res?.message);
        } else if (res?.data?.meta?.code === 0) {
          setPage(1);
          setUsersList([]);
          setTotalCount(0);
          setLoader(false);
          ErrorToast(res?.data?.meta?.message);
        } else {
          setLoader(false);
        }
      }
    } catch (error: any) {
      setLoader(false);
      ErrorToast(error?.response?.data?.message);
    }
  };

  const handleSortBy = (sortByValue: SetStateAction<string>) => {
    setSortBy(sortByValue);
    if (sortByValue === sortBy) {
      let tempSortOrder = sortType === 'ASC' ? 'DESC' : 'ASC';
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

  const handlePerPage = (perPage) => {
    setSelectedPerPage(perPage);
    handlePagination(1, perPage.value, search, sortBy, sortType);
  };

  const refreshTable = () =>
    handlePagination(1, selectedPerPage?.value, '', sortBy, sortType);

  const deleteHandler = async (id) => {
    setLoader(true);
    setSearch('');
    try {
      const delRes = await axios.delete(`/api/admin/users?${id}`);
      const response = delRes.data;
      if (response) {
        if (response?.data?.meta?.code === 1) {
          handlePagination(1, selectedPerPage?.value, '', sortBy, sortType);
          successToast(response?.data?.meta?.message);
        } else if (response?.data?.meta?.code === 0) {
          setLoader(false);
          errorToast(response?.data?.meta?.message);
        } else {
          setLoader(false);
        }
      }
    } catch (error) {
      setLoader(false);
      errorToast(error?.response?.data?.message);
    }
  };

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
                placeholder='Search by first name last name or email'
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
                  onClick={() => {
                    router.push('/users/add');
                  }}
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
          <Table
            columns={columns}
            data={usersList}
            name={'users_table'}
            setDeleteId={deleteHandler}
            bottomBorder={totalCount > selectedPerPage?.value}
            refreshTable={refreshTable}
            setSortBy={(sort) => handleSortBy(sort)}
            loader={loader}
            setSearchTerm={(data) => setSearch(data)}
            message={
              'Are you sure you want to delete this record? This action cannot be undone.'
            }
          />
        </div>
      </div>
      <div>
        {usersList.length > 0 && !loader ? (
          <Pagination
            currentPage={page}
            totalCount={totalCount}
            pageSize={selectedPerPage?.value}
            onPageChange={(page) =>
              handlePagination(
                page,
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
};

export default Users;