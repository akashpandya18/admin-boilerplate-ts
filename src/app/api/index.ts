import axios, { AxiosHeaders, AxiosRequestHeaders } from 'axios';
import { toast } from 'sonner';
import { getCookie, setCookie } from 'cookies-next';
import useAuthStore from '@/store/userStore';
import { cleanCookies } from '@/lib/utils';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

const getAuthHeaders = (): AxiosRequestHeaders => {
  const { authToken, deviceToken } = useAuthStore.getState();

  const headers: AxiosHeaders = new AxiosHeaders({
    'Content-Type': 'application/json',
    accept: 'application/json',
  });

  if (authToken) {
    headers.set('Authorization', `Bearer ${authToken}`);
  }

  if (deviceToken) {
    headers.set('deviceToken', deviceToken);
  }

  return headers;
};

api.interceptors.request.use((config) => {
  config.headers = getAuthHeaders();
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      useAuthStore.getState().clearTokens();
      cleanCookies();
      window.location.href = '/login';
      toast.error(error.meta.message);
      return Promise.reject(error.meta.message);
    }
    if (error?.response?.status === 403) {
      toast.error('Forbidden');
      return Promise.reject(error.meta.message);
    }
    if (error?.response?.status === 400) {
      toast.error('Bad Request');
      return Promise.reject(error.response.data.meta.message);
    }
    if (error?.response?.status === 404) {
      toast.error('Not Found');
      return Promise.reject(error.response.data.meta.message);
    }
    if (error?.response?.status === 406) {
      toast.error('Not Acceptable');
      return Promise.reject(error.response.data.meta.message);
    }
    if (error?.response?.status === 498) {
      RefreshToken();
      toast.error('Token Expired');
      return Promise.reject(error.response.data.meta.message);
    }
    if (error?.response?.status === 500) {
      toast.error('Internal Server Error');
      return Promise.reject(error.response.data.meta.message);
    }
    toast.error('Something went wrong');
    return Promise.reject(error.response.data.meta.message);
  }
);

const GetApi = async (tag = '') => await api.get(tag).then((data) => data.data);

const PostApi = async (tag = '', reqBody: null) =>
  await api.post(tag, reqBody === null ? {} : reqBody).then((data) => data);

const DeleteApi = async (tag = '') =>
  await api.delete(tag).then((data) => data);

const PutApi = async (tag = '', reqBody: null) =>
  await api.put(tag, reqBody === null ? {} : reqBody).then((data) => data);

const RefreshToken = async () =>
  await api
    .post(
      '/refresh-token',
      {},
      { headers: { 'refresh-token': getCookie('refreshToken') } }
    )
    .then((response) => {
      if (response.data.meta.code === 1) {
        setCookie('admin-token', response.data.meta.token, {
          maxAge: 60 * 60 * 24 * 3,
          path: '/',
        });
        window.location.reload();
      }
    });

export const Api = {
  //LRF FLOW APIs
  login: (reqBody: any) => PostApi('/admin/v1/login', reqBody),
  forgotPassword: (reqBody: any) => PostApi('/forgot-password', reqBody),
  resetPassword: (reqBody: any) => PostApi('/reset-password', reqBody),
  changePassword: (reqBody: any) => PutApi('/change-password', reqBody),

  // bulk Apis

  postUserBulkAction: (reqBody: any) => PutApi('/admin/v1/user', reqBody),
  postGymBulkAction: (reqBody: any) => PutApi('/admin/v1/gym', reqBody),

  //User APIs
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
  addEditUser: (reqBody: any) => PostApi(`/admin/v1/user`, reqBody),
  deleteUser: (id: any) => DeleteApi(`/admin/v1/user?id=${id}`),
  getUserById: (id: any) => GetApi(`/admin/v1/user/${id}`),
  getGymDropdownList: (page = 1, per_page = 10, search = '') =>
    GetApi(
      `/admin/v1/gym-name?page=${page}&per_page=${per_page}&search=${search}`
    ),

  // Gym Details
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
  addEditGym: (reqBody: any) => PostApi(`/admin/v1/gym`, reqBody),
  getGymById: (id: any) => GetApi(`/admin/v1/gym/${id}`),
  deleteGym: (id: any) => DeleteApi(`/admin/v1/gym?id=${id}`),
  // logout
  logoutUser: () => DeleteApi(`/`),
  adminAccess: () => GetApi(`/`),
};
