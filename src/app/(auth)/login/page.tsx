'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Loader from '@/components/common/Loader';
import CommonInput from '@/components/common/Input/CommonInput';
import loginValidation from '@/validation/loginValidation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Api } from '@/app/api';
import { setCookie, getCookie } from 'cookies-next';
import useAuthStore from '@/store/userStore';

const Login = () => {
  const { setAuthToken, setUser } = useAuthStore();
  const router = useRouter();
  const [form, setForm] = useState({
    email: '',
    password: '',
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

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setLoader(true);

    const { errors, isValid } = loginValidation(form);

    if (!isValid) {
      setLoader(false);
      setError(errors);
      return;
    }

    const payload = {
      email: form.email,
      password: form.password,
    };

    try {
      const { data: response } = await Api.login(JSON.stringify(payload));

      if (response) {
        if (response.meta.refreshToken) {
          setCookie('refreshToken', response.meta.refreshToken, {
            maxAge: 60 * 60 * 24 * 6,
            path: '/',
          });
        }
        setCookie('admin-token', response.meta.token, {
          maxAge: 60 * 60 * 24 * 3,
          path: '/',
        });
        setAuthToken(response.meta.token);
        setCookie('admin-userData', JSON.stringify(response.data), {
          maxAge: 60 * 60 * 24 * 3,
          path: '/',
        });
        setUser(response.data);
        router.push('/users');
      }
    } catch (error) {
      console.log('error', error);
      setLoader(false);
    }
  };

  useEffect(() => {
    const token = getCookie('admin-token');
    const userData = getCookie('admin-userData');
    if (token && userData) {
      router.push('/users');
    }
  }, []);

  return (
    <>
      {loader && <Loader />}
      <div className='flex h-screen bg-white'>
        <div className='md:w-[50%] relative hidden md:block'>
          <div className='absolute inset-0 w-full h-screen opacity-80 bg-admin-primary'>
            <div className='flex flex-col items-center justify-center h-screen'>
              <p className='text-5xl font-bold text-white'>Admin</p>
            </div>
          </div>
        </div>

        <div className='w-full md:w-[50%] flex flex-col justify-center'>
          <div className='mx-auto w-full px-4 sm:px-[100px] md:px-[30px] xl:px-[100px] 2xl:px-[180px]'>
            <div>
              <h2 className='text-3xl font-semibold md:text-4xl'>
                Welcome <span className='text-admin-secondary'>back!</span>
              </h2>
              <p className='mt-2 mb-3 text-[#0B0F18]'>
                Please login to your account
              </p>
            </div>

            <div className='mt-8'>
              <div className='mt-6'>
                <form className='space-y-6' onSubmit={handleSubmit}>
                  <CommonInput
                    id='email'
                    name='email'
                    type='email'
                    value={form.email}
                    onChange={handleChange}
                    label='Email'
                    error={error.email}
                    classNames='px-4 py-2 sm:px-5 sm:py-3'
                    placeholder='Enter your email'
                    isRequired
                  />

                  <div className='space-y-1'>
                    <CommonInput
                      id='password'
                      name='password'
                      type='password'
                      value={form.password}
                      onChange={handleChange}
                      label='Password'
                      error={error.password}
                      classNames='px-4 py-2 sm:px-5 sm:py-3'
                      placeholder='Enter your password'
                      isRequired
                      isIcon
                    />
                    <div className='flex items-center justify-between w-full !mt-4'>
                      <div className='flex items-center'>
                        <Input
                          id='remember-me'
                          name='remember-me'
                          type='checkbox'
                          className='w-4 h-4 border-gray-300 rounded cursor-pointer accent-admin-primary text-admin-primary focus:ring-admin-primary'
                        />
                        <Label
                          htmlFor='remember-me'
                          className='block ml-2 text-sm text-gray-900 cursor-pointer'
                        >
                          Remember me
                        </Label>
                      </div>

                      <div className='text-sm'>
                        <Link
                          href={'/forgot-password'}
                          className='font-medium text-admin-primary hover:text-admin-secondary'
                        >
                          Forgot your password?
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className='text-center'>
                    <Button
                      type='submit'
                      variant={'default'}
                      className='w-full px-10 py-2 text-sm font-medium text-white border border-transparent shadow-sm rounded-3xl bg-gradient-to-r from-admin-primary to-admin-secondary sm:py-3 hover:bg-admin-primary focus:outline-none focus:ring-2 focus:ring-admin-primary focus:ring-offset-2'
                    >
                      Login
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
