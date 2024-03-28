'use client';

import { SetStateAction, useEffect, useState } from 'react';
import Breadcrumb from '@/components/common/Breadcrumb';
import Table from '@/components/common/Table';
import Pagination from '@/components/common/Pagination/Pagination';
import { ErrorToast, SuccessToast } from '@/lib/utils';
import SearchInput from '@/components/common/Input/SearchInput';
import SelectMenu from '@/components/common/SelectMenu';
import { PER_PAGE } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import { Api } from '@/app/api';

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

function Gym({ data }: { data: any }) {
  const router = useRouter();
  const [gymList, setGymList] = useState(data);
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
    sortType: string,
    status?: string
  ) => {
    const gymRes = await Api.getGymDetails(
      pageN,
      perPage,
      query,
      sortBy,
      sortType,
      status
    );
    const response = gymRes.data;

    if (response) {
      if (query !== '' && search.length >= 3) {
        setSearchList(response);
      } else {
        setGymList(response);
      }
      setPage(pageN);
      setTotalCount(response?.length);
    }

    if (response?.length === 0) {
      setPage(1);
      setGymList(data);
      setSearchList([]);
      setTotalCount(0);
      ErrorToast("Couldn't fetch gym details. Such Data does not exist.");
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

  const handlePerPage = (perPage: any) => {
    setSelectedPerPage(perPage);
    handlePagination(1, perPage.value, search, sortBy, sortType);
  };

  const handleActivity = () => {
    setInactive(!inactive);
  };

  const refreshTable = () =>
    handlePagination(1, selectedPerPage?.value, '', sortBy, sortType);

  const deleteHandler = async (id: any) => {
    setSearch('');
    try {
      const gymRes = await Api.deleteGym(id);
      const response = gymRes.data;

      if (response) {
        handlePagination(1, selectedPerPage?.value, '', sortBy, sortType);
        SuccessToast(response?.data?.meta?.message);
      }
    } catch (error: any) {
      ErrorToast("Couldn't delete gym. Something went wrong.");
    }
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
            <Table
              columns={columns}
              data={search !== '' && search.length >= 3 ? searchList : gymList}
              name={'gym_table'}
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
          {gymList.length > 10 || searchList.length > 10 ? (
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
}

export default Gym;
