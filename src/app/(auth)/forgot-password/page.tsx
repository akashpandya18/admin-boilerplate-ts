'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ErrorToast, getLocalStorageItem, SuccessToast } from '@/lib/utils';
import Loader from '@/components/common/Loader';
import CommonInput from '@/components/common/Input/CommonInput';
import forgotPassValidation from '@/validation/forgotPasswordValidation';
import axios from 'axios';
import { HiChevronLeft } from 'react-icons/hi2';
import { Button } from '@/components/ui/button';

const ForgotPassword = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    email: '',
  });

  const [loader, setLoader] = useState(false);
  const [error, setError] = useState<any>({});

  const handleChange = (e: any) => {
    setError((prevState: any) => ({
      ...prevState,
      [e.target.name]: '',
    }));

    setForm((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    if (getLocalStorageItem('token') && getLocalStorageItem('userData')) {
      router.push('/users');
    }
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const { errors, isValid } = forgotPassValidation(form);
    if (isValid) {
      setLoader(true);
      const payload = {
        email: form.email,
      };
      try {
        const forgotPass = await axios.post(
          '/api/auth/forgot-password',
          payload
        );
        const response = forgotPass.data;

        if (response) {
          if (response?.data?.meta?.code === 3) {
            setLoader(false);
            SuccessToast(response?.data?.meta?.message);
            router.push(`/reset-password?email=${form.email}`);
          } else if (response?.data?.meta?.code === 0) {
            setLoader(false);
            ErrorToast(response?.data?.meta?.message);
          } else {
            setLoader(false);
          }
        }
      } catch (error) {
        setLoader(false);
        setError(error);
      }
    } else {
      setLoader(false);
      setError(errors);
    }
  };

  return (
    <>
      {loader && <Loader />}
      <div className='flex h-screen '>
        <div className='md:w-[50%] relative hidden md:block'>
          <div className='absolute inset-0 w-full h-screen opacity-80 bg-admin-primary'>
            <div className='flex flex-col items-center justify-center h-screen'>
              <p className='text-5xl font-bold text-white'>Admin</p>
            </div>
          </div>
        </div>
        <div className='w-full md:w-[50%] flex flex-col justify-center bg-white'>
          <div className='mx-auto w-full px-4 sm:px-[100px] md:px-[30px] xl:px-[100px] 2xl:px-[230px]'>
            <div>
              <h2 className='text-3xl font-semibold md:text-4xl'>
                Forgot <span className='text-admin-secondary'>Password</span>
              </h2>
              <p className='mt-2 mb-3 text-[#0B0F18]'>
                Enter registered email address to get the OTP for reset password
              </p>
            </div>

            <div className='mt-8'>
              <div className='mt-6'>
                <form onSubmit={handleSubmit} className='space-y-10'>
                  <CommonInput
                    id='email'
                    name='email'
                    type='email'
                    value={form.email}
                    onChange={handleChange}
                    label='Email Address'
                    error={error.email}
                    classNames='px-4 py-2 sm:px-5 sm:py-3'
                    placeholder='Enter your email'
                    isRequired
                  />

                  <div className='text-center'>
                    <Button
                      type='submit'
                      variant={'default'}
                      className='w-full px-10 py-2 text-sm font-medium text-white border border-transparent shadow-sm rounded-3xl bg-gradient-to-r from-admin-primary to-admin-secondary sm:py-3 hover:bg-admin-primary focus:outline-none focus:ring-2 focus:ring-admin-primary focus:ring-offset-2'
                    >
                      Submit
                    </Button>
                  </div>
                </form>
              </div>
              <div className='flex items-center justify-center w-auto mx-auto mt-10'>
                <div onClick={() => router.push('/login')}>
                  <HiChevronLeft className='cursor-pointer self-center h-[25px] w-[25px] ml-auto text-admin-secondary border border-admin-secondary rounded-full' />
                </div>
                <span
                  onClick={() => router.push('/login')}
                  className='self-center ml-2 text-base cursor-pointer text-admin-secondary'
                >
                  Back to login
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
