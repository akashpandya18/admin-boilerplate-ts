'use client';

import { useState } from 'react';
import { ErrorToast, SuccessToast } from '@/lib/utils';
import Loader from '@/components/common/Loader';
import CommonInput from '@/components/common/Input/CommonInput';
import changePassValidations from '@/validation/changePassValidations';
import axios from 'axios';
import PrimaryButton from '@/components/common/Buttons/PrimaryButton';
import Breadcrumb from '@/components/common/Breadcrumb';

const pages = [
  { name: 'Change Password', href: '/change-password', current: true },
];

const ChangePassword = () => {
  const [form, setForm] = useState({
    password: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loader, setLoader] = useState(false);
  const [error, setError] = useState<{
    password: string;
    newPassword: string;
    confirmPassword: string;
  }>({
    password: '',
    newPassword: '',
    confirmPassword: '',
  });

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

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const { errors, isValid } = changePassValidations(form);
    if (isValid) {
      setLoader(true);
      const payload = {
        old_password: form.password,
        password: form.newPassword,
      };
      try {
        const changePass = await axios.post(
          '/api/admin/change-password',
          payload
        );
        const response = changePass.data;

        if (response) {
          if (response?.data?.meta?.code === 1) {
            setForm({
              password: '',
              newPassword: '',
              confirmPassword: '',
            });
            setLoader(false);
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
        setError(error);
      }
    } else {
      setLoader(false);
      setError({
        password: errors.password || '',
        newPassword: errors.newPassword || '',
        confirmPassword: errors.confirmPassword || '',
      });
    }
  };

  return (
    <>
      {loader && <Loader />}
      <Breadcrumb pageList={pages} />
      <div className='mt-6 flex-wrap md:flex px-4 py-10 rounded-[10px] bg-white gap-4'>
        {/* <div className='text-[28px] font-bold'>Change Password</div> */}
        <div className='sm:w-[430px] w-full'>
          <form onSubmit={handleSubmit}>
            <div className='space-y-6'>
              <CommonInput
                id='password'
                name='password'
                type='password'
                value={form.password}
                onChange={handleChange}
                label='Enter old password'
                error={error.password}
                classNames='px-4 py-2 sm:px-5 sm:py-3'
                isRequired
                placeholder='Please enter your old password'
                isIcon
              />
              <CommonInput
                id='newPassword'
                name='newPassword'
                type='password'
                value={form.newPassword}
                onChange={handleChange}
                label='Enter new password'
                classNames='px-4 py-2 sm:px-5 sm:py-3'
                error={error.newPassword}
                isRequired
                placeholder='Please enter new password'
                isIcon
              />
              <CommonInput
                id='confirmPassword'
                name='confirmPassword'
                type='password'
                value={form.confirmPassword}
                onChange={handleChange}
                label='Confirm new password'
                error={error.confirmPassword}
                classNames='px-4 py-2 sm:px-5 sm:py-3'
                placeholder='Please re-enter new password'
                isRequired
                isIcon
              />
              <div className='text-end'>
                <PrimaryButton
                  btnText={'Save'}
                  btnType='submit'
                  disabled={false}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
