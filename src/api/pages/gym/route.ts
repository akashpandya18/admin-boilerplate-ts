import axios from 'axios';
import { getJWTToken, ErrorHandler, getDeviceToken } from '@/lib/utils';
import { NextApiRequest, NextApiResponse } from 'next';
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface IParams {
  page: string | number | string[];
  per_page: string | number | string[];
  search: string | string[];
  sort_by: string | string[];
  sort_type: string | string[];
}
export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const {
    id,
    page = 1,
    per_page = 10,
    search = '',
    sort_by = 'name',
    sort_type = 'DESC',
  } = req.query;

  try {
    let url = `${BASE_URL}/admin/v1/gym`;
    let params: IParams = { page, per_page, search, sort_by, sort_type };

    if (id) {
      url += `/${id}`; // Adjust the URL to fetch a single gym
      params = {
        page: '',
        per_page: '',
        search: '',
        sort_by: '',
        sort_type: '',
      }; // Remove the query params
    }

    const response = await axios.get(url, {
      params,
      headers: {
        Authorization: getJWTToken(),
      },
    });

    if (response.status === 200) {
      res.status(200).json(response.data);
    } else {
      res.status(response.status).json(response.data);
    }
  } catch (error: any) {
    ErrorHandler(error);
    console.error('Error fetching gyms:', error);
    if (axios.isAxiosError(error) && error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res
        .status(500)
        .json({ message: 'Error fetching gyms', error: error?.message });
    }
  }
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { tag = '/admin/v1/gym', reqBody, isHeader = true, flag } = req.body;
  let flagCheck = flag
    ? 'multipart/form-data; boundary=----WebKitFormBoundaryueI4YvrqiXxUgVGA'
    : 'application/json';

  try {
    const response = await axios.post(BASE_URL + tag, reqBody, {
      headers: isHeader
        ? {
            'Content-Type': flagCheck,
            accept: 'application/json',
            deviceToken: getDeviceToken(),
            deviceType: 3,
            Authorization: getJWTToken(),
          }
        : {
            deviceToken: getDeviceToken(),
            deviceType: 3,
            Authorization: getJWTToken(),
          },
    });

    if (response.status === 200) {
      res.status(200).json(response.data);
    } else {
      res.status(response.status).json(response.data);
    }
  } catch (error: any) {
    console.error('Error adding/editing gym:', error);
    ErrorHandler(error);
    if (axios.isAxiosError(error) && error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res
        .status(500)
        .json({ message: 'Error adding/editing gym', error: error.message });
    }
  }
}

export async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    const response = await axios.delete(`${BASE_URL}/admin/v1/gym/${id}`, {
      headers: {
        Authorization: getJWTToken(),
      },
    });

    if (response.status === 200) {
      res.status(200).json(response.data);
    } else {
      res.status(response.status).json(response.data);
    }
  } catch (error: any) {
    ErrorHandler(error as any);
    console.error('Error deleting gym:', error);
    if (axios.isAxiosError(error) && error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res
        .status(500)
        .json({ message: 'Error deleting gym', error: error.message });
    }
  }
}
