/* eslint-disable no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import UserComponent from '@/components/PageComponents/UserComps';
import Loader from '@/components/common/Loader';
import {
  capitalize,
  ErrorToast,
  SuccessToast,
  getLocalStorageItem,
  capitalizeFirstWord,
} from '@/lib/utils';
import adminAddEditValidation from '@/validation/adminAddEditValidation';
import axios from 'axios';
import { useRouter } from 'next/router';

const USER_TYPE = [{ name: 'Select Gym', value: '' }];
const STATUS = [
  { name: 'Active', value: 1 },
  { name: 'Inactive', value: 0 },
];

interface PerformActionsOnUserProps {
  params: {
    action: string;
    id: string;
  };
}

const PerformActionsOnUser = ({ params }: PerformActionsOnUserProps) => {
  const action = params.action;
  const router = useRouter();

  const userData =
    getLocalStorageItem('userData') &&
    JSON.parse(getLocalStorageItem('userData') as string);

  const [error, setError] = useState<{
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    selectedMenu: string;
  }>({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    selectedMenu: '',
  });
  const [selectedMenu, setSelectedMenu] = useState<any>({});
  const [userGymType, setUserGymType] = useState<any[]>([]);
  const [isView, setIsView] = useState(false);
  const [pages, setPages] = useState([
    { name: 'Users', href: '/users' },
    { name: `${capitalizeFirstWord(action)}`, href: `/users/${action}` },
  ]);
  const [loader, setLoader] = useState(false);
  const [form, setForm] = useState<{
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    gym_id: number;
    status: number;
    gym: {
      id: string;
      name: string;
      domain_name: string;
    };
  }>({
    id: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    gym_id: 0,
    status: 1,
    gym: {
      id: '',
      name: '',
      domain_name: '',
    },
  });

  const radioHandler = (e: any) => {
    const { name, value } = e.target;
    setForm((prevData) => ({
      ...prevData,
      [name]: parseInt(value),
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const { errors, isValid } = adminAddEditValidation(form, selectedMenu);
    if (isValid) {
      setLoader(true);
      try {
        const payload = {
          id: form.id,
          first_name: capitalize(form.first_name),
          last_name: capitalize(form.last_name),
          email: form.email,
          password: form.password,
          gym_id: selectedMenu.value,
          status: `${form.status}`,
        };
        const addEditData = await axios.post('/api/admin/user', payload);

        const response = addEditData.data;

        if (response) {
          if (response?.data?.meta?.code === 1) {
            setLoader(false);
            SuccessToast(response?.data?.meta?.message);
            router.push({
              pathname: '/users',
              query: { flag: userData?.userType ? 0 : null },
            });
          } else if (response?.data?.meta?.code === 0) {
            setLoader(false);
            ErrorToast(response?.data?.meta?.message);
          } else {
            setLoader(false);
          }
          setError((prevState) => ({
            ...prevState,
            first_name: errors.first_name || '',
            email: errors.email || '',
          }));
        }
      } catch (error: any) {
        setLoader(false);
        ErrorToast(error);
      }
    }
  };

  const handleChange = (e: any) => {
    setError((prevState) => ({
      ...prevState,
      [e.target.name]: '',
    }));

    setForm((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleMenuChange = (menu: { value: number }) => {
    if (menu) {
      setSelectedMenu(menu);
      const { errors } = adminAddEditValidation(form, menu);
      setError((prevState) => ({
        ...prevState,
        first_name: errors.first_name || '',
        email: errors.email || '',
      }));
    }
  };

  const addGymList = async () => {
    setLoader(true);
    try {
      const response = await axios.get('/api/admin/gym-list');
      if (response) {
        if (response?.data?.meta?.code === 1) {
          const updatedArray = response?.data?.data?.map((itx: any) => {
            return { name: itx?.name, value: itx?.id };
          });
          setUserGymType(USER_TYPE.concat(updatedArray));
          setLoader(false);
        }
      }
    } catch (error: any) {
      setLoader(false);
      ErrorToast(error);
    }
  };

  const editGymList = async (data: { gym: { name: string } }) => {
    setLoader(true);
    try {
      const response = await axios.get('/api/admin/gym-list');
      if (response) {
        if (response?.data?.meta?.code === 1) {
          const updatedArray = response?.data?.data?.map((itx: any) => {
            return { name: itx?.name, value: itx?.id };
          });
          setUserGymType(updatedArray);
          const prevSelectedMenu = updatedArray.filter(
            (itx: any) => itx.name === data.gym.name
          );
          setSelectedMenu(prevSelectedMenu[0]);
          setLoader(false);
        }
      }
    } catch (error: any) {
      ErrorToast(error);
    }
  };

  const viewGymList = (data: { gym: { name: string; id: any } }) => {
    setLoader(true);
    const defaultMenu = [{ name: data.gym.name, value: data.gym.id }];
    setUserGymType(defaultMenu);
    setSelectedMenu(defaultMenu[0]);
    setLoader(false);
  };

  const setActionTitle = (action: string) => {
    switch (action) {
      case 'add':
        return 'Add User';
      case 'edit':
        return 'Edit User';
      case 'view':
        return 'User Details';
      default:
        return '';
    }
  };

  useEffect(() => {
    if (action === 'view' || action === 'edit') {
      setLoader(true);
      setPages([
        { name: 'Users', href: '/users' },
        {
          name: `${setActionTitle(action)}`,
          href: `/users/${action}`,
        },
      ]);
      setIsView(action === 'view');
      try {
        const getUserById = async () => {
          const response: any = await axios.get(
            `/api/admin/users/${params.id}`
          );
          if (response) {
            const singleUserData = response?.data?.data;
            if (response?.data?.meta?.code === 1) {
              setForm({
                id: singleUserData.id || '',
                first_name: singleUserData.first_name || '',
                last_name: singleUserData.last_name || '',
                email: singleUserData.email || '',
                password: '',
                gym_id: 0,
                status: parseInt(singleUserData.status),
                gym: {
                  id: singleUserData.gym.id || '',
                  name: singleUserData.gym.name || '',
                  domain_name: singleUserData.gym.domain_name || '',
                },
              });
              setLoader(false);
              if (action === 'view') {
                viewGymList(singleUserData);
              }
              if (action === 'edit') {
                editGymList(singleUserData);
              }
            } else if (response?.code === 401) {
              setLoader(false);
              ErrorToast(response?.message);
            } else if (response?.data?.meta?.code === 0) {
              setLoader(false);
              ErrorToast(response?.data?.meta?.message);
            } else {
              setLoader(false);
            }
          }
        };
        getUserById();
      } catch (error: any) {
        setLoader(false);
        ErrorToast(error);
      }
    }
  }, []);

  useEffect(() => {
    if (action === 'add') addGymList();
  }, [action]);

  return (
    <>
      {loader && <Loader />}
      {!loader && (
        <UserComponent
          pages={pages}
          form={form}
          error={error}
          isView={isView}
          MainStatus={STATUS}
          propsAction={action}
          radioHandler={radioHandler}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          userGymType={userGymType}
          selectedMenu={selectedMenu}
          handleMenuChange={handleMenuChange}
        />
      )}
    </>
  );
};
export default PerformActionsOnUser;
