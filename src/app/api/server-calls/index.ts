import { cookies } from 'next/headers';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const getAuthHeaders = () => {
  const authToken = cookies().get('admin-token');
  const deviceToken = cookies().get('deviceToken');
  const headers = new Headers({
    'Content-Type': 'application/json',
    Accept: 'application/json',
  });
  if (authToken) {
    headers.append('Authorization', `Bearer ${authToken.value}`);
  }
  if (deviceToken) {
    headers.append('deviceToken', deviceToken.value);
  }
  return headers;
};

const handleError = (error: any) => {
  const status = error.status;
  switch (status) {
    case 401:
      cookies().delete('admin-token');
      cookies().delete('refreshToken');
      cookies().delete('admin-userData');
      cookies().delete('deviceToken');
      console.error(error.statusText);
      break;
    case 403:
      console.error('Forbidden');
      break;
    case 400:
      console.error('Bad Request');
      break;
    case 404:
      console.error('Not Found');
      break;
    case 406:
      console.error('Not Acceptable');
      break;
    case 498:
      RefreshToken();
      console.error('Token Expired');
      break;
    case 500:
      console.error('Internal Server Error');
      break;
    default:
      console.error('Unexpected error:', error);
      break;
  }
  throw error;
};

const fetchWithInterceptors = async (url: string, options: any) => {
  options.headers = getAuthHeaders();

  try {
    const response = await fetch(`${BASE_URL}${url}`, options);
    if (!response.ok) {
      handleError({
        status: response.status,
        statusText: response.statusText,
      });
    }
    return await response.json();
  } catch (error) {
    console.error('Network error:', error);
    throw error;
  }
};

const RefreshToken = async () => {
  const refreshToken = cookies().get('refreshToken').value;
  try {
    const response = await fetch(`${BASE_URL}/refresh-token`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'refresh-token': refreshToken,
      }),
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token: ' + response.statusText);
    }

    const data = await response.json();
    if (data.meta.code === 1) {
      cookies().set('admin-token', data.meta.token, {
        maxAge: 60 * 60 * 24 * 3, // 3 days
        path: '/',
      });
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
  }
};

const GetApi = async (tag = '') =>
  await fetchWithInterceptors(tag, {
    method: 'GET',
    next: {
      revalidate: 30,
    },
  })
    .then((data) => data.data)
    .catch((error) => console.error('Error during fetch:', error));

export const ServerApi = {
  getUsers: (
    page = 1,
    per_page = 10,
    search = '',
    sort_by = 'created_at',
    sort_type = 'DESC'
  ) =>
    GetApi(
      `/admin/v1/user?page=${page}&per_page=${per_page}&search=${search}&sort_by=${sort_by}&sort_type=${sort_type}`
    ),

  getGymDetails: (
    page = 1,
    per_page = 10,
    search = '',
    sort_by = 'created_at',
    sort_type = 'DESC',
    status = ''
  ) =>
    GetApi(
      `/admin/v1/gym?page=${page}&per_page=${per_page}&search=${search}&sort_by=${sort_by}&sort_type=${sort_type}&status=${status}`
    ),
};
