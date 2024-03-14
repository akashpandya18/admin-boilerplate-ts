'use client';

import { useState } from 'react';
import { SuccessToast } from '@/lib/utils';
import Loader from '@/components/common/Loader';
import CommonInput from '@/components/common/Input/CommonInput';
import changePassValidations from '@/validation/changePassValidations';
import PrimaryButton from '@/components/common/Buttons/PrimaryButton';
import Breadcrumb from '@/components/common/Breadcrumb';
import { Api } from '@/app/api';

const pages = [
  { name: 'Change Password', href: '/change-password', current: true },
];

const ChangePassword = () => {
  const [loader, setLoader] = useState(false);
  const [form, setForm] = useState({
    password: '',
    newPassword: '',
    confirmPassword: '',
  });
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
        const changePass = await Api.changePassword(payload);
        const response = changePass.data;

        if (response) {
          setForm({
            password: '',
            newPassword: '',
            confirmPassword: '',
          });
          setLoader(false);
          SuccessToast(response?.data?.meta?.message);
        } else {
          setLoader(false);
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
      {!loader && (
        <div className='relative'>
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
        </div>
      )}
    </>
  );
};

export default ChangePassword;
