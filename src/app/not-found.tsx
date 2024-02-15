'use client';

import { useRouter } from 'next/navigation';

const NotFound = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.push('/');
  };

  return (
    <>
      <div className='flex flex-col h-screen pt-16 pb-12 bg-white'>
        <main className='flex flex-col justify-center flex-grow w-full px-4 mx-auto max-w-7xl sm:px-6 lg:px-8'>
          <div className='py-16'>
            <div className='text-center'>
              <p className='text-base font-semibold text-admin-primary'>404</p>
              <h1 className='mt-2 text-4xl font-bold tracking-tight text-gray-900 capitalize sm:text-5xl'>
                Page not found!
              </h1>
              <p className='mt-2 text-base text-gray-500'>
                Sorry, we couldn’t find the page you’re looking for.
              </p>
              <div className='mt-6'>
                <button
                  onClick={handleGoBack}
                  type='button'
                  className='text-base font-medium text-admin-primary hover:text-admin-primary'
                >
                  Go back home
                  <span aria-hidden='true'> &rarr;</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default NotFound;
