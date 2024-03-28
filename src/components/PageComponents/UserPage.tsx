/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect, SetStateAction } from 'react';
import { useRouter } from 'next/navigation';
import { PER_PAGE } from '@/lib/constants';
import { ErrorToast, SuccessToast } from '@/lib/utils';
import Breadcrumb from '@/components/common/Breadcrumb';
import SelectMenu from '@/components/common/SelectMenu';
import SearchInput from '@/components/common/Input/SearchInput';
import Pagination from '@/components/common/Pagination/Pagination';
import { Api } from '@/app/api';
import Table from '@/components/common/Table';
import Loader from '@/components/common/Loader';

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

const Users = ({ data }: { data: any }) => {
  const router = useRouter();
  const [usersList, setUsersList] = useState(data);
  const [searchList, setSearchList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortType, setSortType] = useState('DESC');
  const [inactive, setInactive] = useState(false);
  const [selectedPerPage, setSelectedPerPage] = useState(PER_PAGE[0]);

  const handlePagination = async (
    pageN: number,
    perPage: number,
    query: string,
    sortBy: string,
    sortType: string
  ) => {
    const usersRes = await Api.getUsers(
      pageN,
      perPage,
      query,
      sortBy,
      sortType
    );
    const res = usersRes.data;

    if (res) {
      if (query !== '' && search.length >= 3) {
        setSearchList(res);
      } else {
        setUsersList(res);
      }
      setPage(pageN);
      setTotalCount(res.length);
    }

    if (res?.length === 0) {
      setUsersList(data);
      setSearchList([]);
      setPage(1);
      setTotalCount(0);
      ErrorToast("Couldn't fetch users. Such Data does not exist.");
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
      handlePagination(page, selectedPerPage?.value, search, sortBy, 'ASC');
    }
  };

  const handlePerPage = (perPage: any) => {
    setSelectedPerPage(perPage);
    handlePagination(1, perPage.value, search, sortBy, sortType);
  };

  const refreshTable = () =>
    handlePagination(1, selectedPerPage?.value, '', sortBy, sortType);

  const deleteHandler = async (id: any) => {
    setSearch('');
    try {
      const delRes = await Api.deleteUser(id);
      const response = delRes.data;
      if (response) {
        handlePagination(1, selectedPerPage?.value, '', sortBy, sortType);
        SuccessToast(response?.data?.meta?.message);
      }
    } catch (error: any) {
      ErrorToast("Couldn't delete user. Something went wrong.");
    }
  };

  const handleActivity = () => {
    setInactive(!inactive);
  };

  useEffect(() => {
    if (search !== '' && search.length >= 3) {
      const delayDebounceFn = setTimeout(() => {
        handlePagination(1, selectedPerPage?.value, search, sortBy, sortType);
      }, 1000);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [search]);

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
    <>
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
                  type='search'
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
              data={
                search !== '' && search.length >= 3 ? searchList : usersList
              }
              name={'users_table'}
              setDeleteId={deleteHandler}
              // bottomBorder={totalCount > selectedPerPage?.value}
              refreshTable={refreshTable}
              setSortBy={(sort: string) => handleSortBy(sort)}
              setSearchTerm={(data: SetStateAction<string>) => setSearch(data)}
              message={
                'Are you sure you want to delete this record? This action cannot be undone.'
              }
            />
          </div>
        </div>
        <div>
          {usersList.length > 10 || searchList.length > 10 ? (
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
    </>
  );
};

export default Users;
