'use client';

const Loader = () => {
  return (
    <div
      className={`left-0 z-50 flex items-center fixed top-0 right-0 bottom-0 bg-opacity-90 justify-center p-5 bg-gray-100`}
    >
      <div className='flex space-x-2 animate-pulse'>
        <div className='w-3 h-3 rounded-full bg-admin-primary'></div>
        <div className='w-3 h-3 rounded-full bg-admin-secondary'></div>
        <div className='w-3 h-3 rounded-full bg-admin-primary'></div>
      </div>
    </div>
  );
};

export default Loader;
