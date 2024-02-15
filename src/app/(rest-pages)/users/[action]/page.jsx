/* eslint-disable no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import UserComponent from '@/app/components/PageComponents/users/UserComps';
import Loader from '@/app/components/common/Loader';
import {
  capitalize,
  errorToast,
  successToast,
  getLocalStorageItem,
  capitalizeFirstWord,
} from '@/app/utils/helper';
import adminAddEditValidation from '@/app/validation/adminAddEditValidation';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const USER_TYPE = [{ name: 'Select Gym', value: '' }];
const STATUS = [
  { name: 'Active', value: 1 },
  { name: 'Inactive', value: 0 },
];

const PerformActionsOnUser = ({ params }) => {
  const action = params.action;
  const router = useRouter();

  const userData =
    getLocalStorageItem('userData') &&
    JSON.parse(getLocalStorageItem('userData'));

  const [error, setError] = useState({});
  const [selectedMenu, setSelectedMenu] = useState({});
  const [userGymType, setUserGymType] = useState([]);
  const [isView, setIsView] = useState(false);
  const [pages, setPages] = useState([
    { name: 'Users', href: '/users' },
    { name: `${capitalizeFirstWord(action)}`, href: `/users/${action}` },
  ]);
  const [loader, setLoader] = useState(false);
  const [form, setForm] = useState({
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

  const radioHandler = (e) => {
    let { name, value } = e.target;
    setForm((prevData) => ({
      ...prevData,
      [name]: parseInt(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { errors, isValid } = adminAddEditValidation(
      form,
      selectedMenu,
      action
    );
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
            successToast(response?.data?.meta?.message);
            router.push({
              pathname: '/users',
              query: { flag: userData?.userType ? 0 : null },
            });
          } else if (response?.data?.meta?.code === 0) {
            setLoader(false);
            errorToast(response?.data?.meta?.message);
          } else {
            setLoader(false);
          }
        } else {
          setError(errors);
        }
      } catch (error) {
        setLoader(false);
        errorToast(error);
      }
    }
  };

  const handleChange = (e) => {
    setError((prevState) => ({
      ...prevState,
      [e.target.name]: '',
    }));

    setForm((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleMenuChange = (menu) => {
    if (menu) {
      setSelectedMenu(menu);
      const { errors } = adminAddEditValidation(form, menu);
      setError(errors);
    }
  };

  const addGymList = async () => {
    setLoader(true);
    try {
      const response = await axios.get('/api/admin/gym-list');
      if (response) {
        if (response?.data?.meta?.code === 1) {
          const updatedArray = response?.data?.data?.map((itx) => {
            return { name: itx?.name, value: itx?.id };
          });
          setUserGymType(USER_TYPE.concat(updatedArray));
          setLoader(false);
        }
      }
    } catch (error) {
      setLoader(false);
      errorToast(error);
    }
  };

  const editGymList = async (data) => {
    setLoader(true);
    try {
      const response = await axios.get('/api/admin/gym-list');
      if (response) {
        if (response?.data?.meta?.code === 1) {
          const updatedArray = response?.data?.data?.map((itx) => {
            return { name: itx?.name, value: itx?.id };
          });
          setUserGymType(updatedArray);
          const prevSelectedMenu = updatedArray.filter(
            (itx) => itx.name === data.gym.name
          );
          setSelectedMenu(prevSelectedMenu[0]);
          setLoader(false);
        }
      }
    } catch (error) {
      errorToast(error);
    }
  };

  const viewGymList = (data) => {
    setLoader(true);
    const defaultMenu = [{ name: data.gym.name, value: data.gym.id }];
    setUserGymType(defaultMenu);
    setSelectedMenu(defaultMenu[0]);
    setLoader(false);
  };

  const setActionTitle = (action) => {
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
          const response = await axios.get(`/api/admin/users/${params.id}`);
          if (response) {
            const singleUserData = response?.data?.data;
            if (response?.data?.meta?.code === 1) {
              setForm({
                id: singleUserData.id || '',
                first_name: singleUserData.first_name || '',
                last_name: singleUserData.last_name || '',
                email: singleUserData.email || '',
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
              errorToast(response?.message);
            } else if (response?.data?.meta?.code === 0) {
              setLoader(false);
              errorToast(response?.data?.meta?.message);
            } else {
              setLoader(false);
            }
          }
        };
        getUserById();
      } catch (error) {
        setLoader(false);
        errorToast(error);
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
