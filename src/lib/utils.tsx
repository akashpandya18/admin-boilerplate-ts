'use client';

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CONTENT_TYPE } from './constants';
import React, {
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  ReactPortal,
  useEffect,
  useState,
} from 'react';
import toast, { Renderable, Toast, ValueFunction } from 'react-hot-toast';
import { DEADOMAINS } from './dead-domains';
import { HiInformationCircle } from 'react-icons/hi';
import {
  IoMale as Male,
  IoFemale as Female,
  IoTransgender as Trans,
} from 'react-icons/io5';
import {
  PiGenderNonbinaryBold as NonBinary,
  PiGenderIntersexBold as InterSex,
} from 'react-icons/pi';
import { deleteCookie, getCookie } from 'cookies-next';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const MaxCharlimit = 100;
export const MaxCharlimitLongText = 1000;
export const getLocalStorageItem = (key: string) => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
};
export const setLocalStorageItem = (key: string, value: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, value);
  }
};
export const removeLocalStorageItem = (key: string) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
};
export const cleanLocalStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.clear();
  }
};
export const cleanCookies = () => {
  if (typeof window !== 'undefined') {
    deleteCookie('admin-token');
    deleteCookie('refreshToken');
    deleteCookie('admin-userData');
    deleteCookie('deviceToken');
  }
};
export const getJWTToken = () => {
  const token = getCookie('admin-token');
  if (typeof window !== 'undefined') {
    return 'Bearer ' + token;
  }
};
export const getDeviceToken = () => {
  const deviceToken = getCookie('deviceToken');
  if (typeof window !== 'undefined') {
    return deviceToken;
  }
};
export const getUserType = (type: number) =>
  type === 0 ? 'Super Admin' : 'Sub Admin';

export const getAccountType = (type: number) =>
  type === 0
    ? 'In Trial'
    : type === 1
      ? 'Not Subscribed'
      : type === 2
        ? 'Subscribed'
        : type === 3
          ? 'Expired'
          : '━━';

export const getContentApprovalStatus = (type: number) => {
  return (
    <p
      className={`inline-flex m-0 rounded-full ${
        type === 1
          ? 'bg-green-100'
          : type === 2
            ? 'bg-red-100'
            : 'bg-orange-100'
      } px-4 py-[6px] text-sm leading-5 capitalize ${
        type === 1
          ? 'text-green-400'
          : type === 2
            ? 'text-red-400'
            : 'text-orange-400'
      }`}
    >
      {type === 1 ? 'Active' : type === 2 ? 'Rejected' : 'Draft'}
    </p>
  );
};

export const getSentToUser = (type: number) =>
  type === 1
    ? 'All'
    : type === 2
      ? 'In Trial'
      : type === 3
        ? 'Subscribed'
        : type === 4
          ? 'Custom User'
          : type === 5
            ? 'Expired'
            : type === 6
              ? 'Not Subscribed'
              : '━━';

// COMMENTED FOR IN FUTURE USE
// let returnValue = '';
// // eslint-disable-next-line
// sentToUser?.map((item) => {
//   if (item?.value === parseInt(type)) {
//     returnValue = item.name;
//   }
// });
// return returnValue ? returnValue : '━━';

export const getContentType = (type: string) => {
  let returnValue = '';
  CONTENT_TYPE?.map((item) => {
    if (item?.value === parseInt(type)) {
      returnValue = item.name;
    }
  });
  return returnValue ? returnValue : '━━';
};

export const ErrorToast = (
  msg: Renderable | ValueFunction<Renderable, Toast>,
  toastId = ''
) =>
  toast.error(msg, {
    duration: 2000,
    id: toastId,
  });

export const SuccessToast = (
  msg: Renderable | ValueFunction<Renderable, Toast>,
  duration = 2000
) =>
  toast.success(msg, {
    duration,
  });

export const informativeToast = (
  msg:
    | string
    | number
    | boolean
    | ReactElement<any, string | JSXElementConstructor<any>>
    | Iterable<ReactNode>
    | ReactPortal
    | null
    | undefined,
  duration = 3000
) =>
  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className='flex-1 w-0 p-2'>
          <div className='flex items-start'>
            <div className='self-center'>
              <HiInformationCircle className='w-[24px] text-admin-secondary' />
            </div>
            <div className='self-center ml-3'>
              <p className='mt-1 text-gray-500'>{msg}</p>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      duration,
    }
  );

export const useOutsideClick = (
  ref: { current: { contains: (arg0: any) => any } },
  callback: () => void
) => {
  const handleClick = (e: { target: any }) => {
    if (ref.current && !ref.current.contains(e.target)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  });
};

export const capitalize = (value: string) => {
  const lowerCase = value?.toLowerCase();
  return lowerCase.replace(/(^\w{1})|(\s+\w{1})/g, (letter: string) =>
    letter.toUpperCase()
  );
};

export const getFilterKey = (value: {
  match: (arg0: RegExp) => string | any[];
}) => {
  const key = value?.match(/([A-Z]?[^A-Z]*)/g).slice(0, -1);
  const returnKey = key?.toString()?.replaceAll(',', ' ');
  return capitalize(returnKey);
};

export const isSuperAdmin = () => {
  const userDataMain = getCookie('admin-userData');
  const userData = userDataMain && JSON.parse(userDataMain);
  return userData.userType;
};

export const DeadDomainEmail = (email: string) => {
  const emailDomain = '@' + email.split('@')[1];
  return DEADOMAINS.includes(emailDomain);
};

export const ValueToPercentage = (value: number, max: number) => {
  return (value * 100) / max;
};

export const IsLastIndex = (j: number, length: number) => {
  return j === length - 1;
};

export const getGender = (type: any, flag: any) => {
  switch (type) {
    case 1:
      return flag ? Male : 'Male';
    case 2:
      return flag ? Female : 'Female';
    case 3:
      return flag ? NonBinary : 'Nonbinary';
    case 4:
      return flag ? InterSex : 'Intersex';
    case 5:
      return flag ? Trans : 'Transgender';
    default:
      return 'Not Preferred';
  }
};

function getWindowDimensions() {
  if (typeof window !== 'undefined') {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height,
    };
  }
  // Return undefined if window is not defined (e.g., during SSR)
  return {
    width: undefined,
    height: undefined,
  };
}

export const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    // Ensure this code is not executed on the server
    if (typeof window !== 'undefined') {
      function handleResize() {
        setWindowDimensions(getWindowDimensions());
      }

      window.addEventListener('resize', handleResize);
      // Clean up the event listener on unmount
      return () => window.removeEventListener('resize', handleResize);
    }

    // Add a return statement to fix the problem
    return undefined;
  }, []);

  return windowDimensions;
};

export const getFileType = (value: { name: string; type: string }) => {
  const fileExtension = value?.name?.split('.');
  const finalType = `${value?.type?.split('/')[0]}/${
    fileExtension[fileExtension?.length - 1]
  }`;
  return finalType;
};

export const classNames = (...classes: any[]) => {
  return classes.filter(Boolean).join(' ');
};

export const ErrorHandler = (error: {
  response: { data: any; status: any; headers: any };
  request: any;
  message: any;
}) => {
  console.error(error);

  // You can integrate with an error tracking service like Sentry here
  // if (process.env.NODE_ENV === 'production') {
  //   Sentry.captureException(error);
  // }

  if (error.response) {
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
    ErrorToast(error.response.data);
    return error.response.data;
  } else if (error.request) {
    console.log(error.request);
    ErrorToast('No response was received from the server');
    return 'No response was received from the server';
  } else {
    console.log('Error', error.message);
    ErrorToast(error.message);
    return error.message;
  }
};

export const capitalizeFirstWord = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const truncateParagraph = (paragraph: string, numWords: number) => {
  paragraph = paragraph.replace(/-/g, ' ');

  const words = paragraph.split(' ');

  const truncatedText = words.slice(0, numWords).join(' ');

  if (words.length > numWords) {
    return truncatedText + '...';
  }

  return truncatedText;
};

export const FONT_TYPE = [
  // { name: 'Select Font', key: '' },
  { name: 'Roboto', key: 'roboto_sans' },
  { name: 'Montserrat', key: 'montserrat' },
  { name: 'Roboto Mono', key: 'roboto_mono' },
  { name: 'Outfit', key: 'outfit' },
  { name: 'Fira Code', key: 'fira_code' },
];
export const FONT_SIZE = [
  { name: 'small' },
  { name: 'medium' },
  { name: 'large' },
];
export const FONT_PREVIEW_DATA = {
  small: {
    header: {
      fontSize: 'text-[44px]',
      fontWeight: 'font-bold',
    },
    subheader: {
      fontSize: 'text-[30px]',
      fontWeight: 'font-semibold',
    },
    description: {
      fontSize: 'text-[16px]',
      fontWeight: 'font-normal',
    },
  },
  medium: {
    header: {
      fontSize: 'text-[56px]',
      fontWeight: 'font-bold',
    },
    subheader: {
      fontSize: 'text-[36px]',
      fontWeight: 'font-semibold',
    },
    description: {
      fontSize: 'text-[20px]',
      fontWeight: 'font-normal',
    },
  },
  large: {
    header: {
      fontSize: 'text-[72px]',
      fontWeight: 'font-bold',
    },
    subheader: {
      fontSize: 'text-[48px]',
      fontWeight: 'font-semibold',
    },
    description: {
      fontSize: 'text-[24px]',
      fontWeight: 'font-normal',
    },
  },
};
export const STATUS = [
  { name: 'Active', value: 1 },
  { name: 'Inactive', value: 0 },
];
