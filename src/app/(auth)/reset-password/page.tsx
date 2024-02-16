'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ErrorToast, getLocalStorageItem, SuccessToast } from '@/lib/utils';
import Loader from '@/components/common/Loader';
import CommonInput from '@/components/common/Input/CommonInput';
import resetPasswordValidation from '@/validation/resetPasswordValidation';
import Timer from '@/components/common/Timer';
import axios from 'axios';
import validator from 'validator';
import { HiChevronLeft, HiArrowPath } from 'react-icons/hi2';

const PasswordReset = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = searchParams.get('email');

  const [form, setForm] = useState({
    otp: '',
    new_password: '',
    confirm_password: '',
  });
  const [loader, setLoader] = useState(false);
  const [timeUp, setTimeUp] = useState(false);

  timeUp;
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

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const { errors, isValid } = resetPasswordValidation(form);
    if (isValid) {
      setLoader(true);
      const payload = {
        email: email,
        otp: form.otp,
        newPassword: form.new_password,
      };
      try {
        const reset = await axios.post('/app/api/reset-password', payload);
        const response = reset.data;

        if (response) {
          if (response?.data?.meta?.code === 1) {
            setLoader(false);
            SuccessToast(response?.data?.meta?.message);
            router.push('/login');
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

  const handleResendOtp = async () => {
    setLoader(true);
    const payload = {
      email: email,
    };
    try {
      const forgotPass = await axios.post('/api/auth/forgot-password', payload);
      const response = forgotPass.data;

      if (response) {
        if (response?.data?.meta?.code === 3) {
          setLoader(false);
          SuccessToast(response?.data?.meta?.message);
          router.push(`/reset-password?email=${email}`);
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
  };

  useEffect(() => {
    if (getLocalStorageItem('token') && getLocalStorageItem('userData')) {
      router.push('/users');
    }
  }, []);

  useEffect(() => {
    if (form.new_password?.length > 5 && form.confirm_password?.length > 5) {
      if (!validator.equals(form.new_password, form.confirm_password)) {
        setError({
          confirm_password: 'New password and confirm password do not match.',
          new_password: 'New password and confirm password do not match.',
          otp: error.otp,
        });
      } else {
        setError({
          confirm_password: '',
          new_password: '',
          otp: error.otp,
        });
      }
    } else {
      setError({
        confirm_password: '',
        new_password: '',
        otp: error.otp,
      });
    }
  }, [form.new_password, form.confirm_password]);

  return (
    <>
      {loader && <Loader />}
      <div className='flex h-screen'>
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
                Reset <span className='text-admin-secondary'>Password</span>
              </h2>
              <p className='mt-2 mb-3 text-[#0B0F18]'>
                Enter the OTP which has been sent to your registered email
                address.
              </p>
            </div>

            <div className='mt-8'>
              <div className='mt-6'>
                <form onSubmit={handleSubmit}>
                  <div className='space-y-6'>
                    <div className='relative'>
                      <CommonInput
                        id='otp'
                        name='otp'
                        type='text'
                        value={form.otp}
                        onChange={handleChange}
                        error={error.otp}
                        label='Enter OTP'
                        classNames='px-4 py-2 sm:px-5 sm:py-3'
                        placeholder='Enter OTP'
                        isRequired
                      />
                      <div
                        className={`flex justify-between ${
                          error.otp ? '' : 'mt-2'
                        }`}
                      >
                        {timeUp ? (
                          <div className={`flex`}>
                            <span className='ml-1 text-sm text-admin-secondary'>
                              Didn&lsquo;t receive code?
                            </span>
                          </div>
                        ) : (
                          <div className={`flex`}>
                            <Timer setTimeUp={setTimeUp} />
                          </div>
                        )}
                        <div
                          className={`flex ${
                            timeUp
                              ? 'text-admin-secondary cursor-pointer'
                              : 'text-gray-300'
                          }`}
                          onClick={() => {
                            timeUp ? handleResendOtp() : undefined;
                          }}
                        >
                          <HiArrowPath className='w-[20px]' />
                          <span className='ml-1 text-sm'>Resend OTP</span>
                        </div>
                      </div>
                    </div>
                    <CommonInput
                      id='new_password'
                      name='new_password'
                      type='password'
                      value={form.new_password}
                      onChange={handleChange}
                      label='Enter new password'
                      error={error.new_password}
                      classNames='px-4 py-2 sm:px-5 sm:py-3'
                      placeholder='Enter new password'
                      isRequired
                      isIcon
                    />

                    <CommonInput
                      id='confirm_password'
                      name='confirm_password'
                      type='password'
                      value={form.confirm_password}
                      onChange={handleChange}
                      label='Confirm New Password'
                      error={error.confirm_password}
                      classNames='px-4 py-2 sm:px-5 sm:py-3'
                      placeholder='Enter your password'
                      isRequired
                      isIcon
                    />
                  </div>

                  <div className='mt-10 text-center'>
                    <button
                      type='submit'
                      className='w-full px-10 py-2 text-sm font-medium text-white border border-transparent shadow-sm rounded-3xl bg-gradient-to-r from-admin-primary to-admin-secondary sm:py-3 hover:bg-admin-primary focus:outline-none focus:ring-2 focus:ring-admin-primary focus:ring-offset-2'
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
              <div className='flex items-center justify-center w-auto mx-auto mt-10'>
                <div onClick={() => router.push('/login')}>
                  <HiChevronLeft className='cursor-pointer self-center w-[25px] h-[25px] ml-auto text-admin-secondary border border-admin-secondary rounded-full' />
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

export default PasswordReset;
