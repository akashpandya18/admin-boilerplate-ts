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
    sort_by = 'first_name',
    sort_type = 'DESC',
  } = req.query;

  try {
    let url = `${BASE_URL}/admin/v1/user`;
    let params: IParams = { page, per_page, search, sort_by, sort_type };

    if (id) {
      url += `/${id}`;
      params = {
        page: '',
        per_page: '',
        search: '',
        sort_by: '',
        sort_type: '',
      };
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
    console.error('Error fetching users:', error);
    ErrorHandler(error);
    if (axios.isAxiosError(error) && error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({
        message: 'Error fetching users',
        error: error.message,
      });
    }
  }
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { tag = '/admin/v1/user', reqBody, isHeader = true, flag } = req.body;
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
        : {},
    });

    // Assuming success and error handling is similar to the GET and DELETE
    if (response.status === 200) {
      res.status(200).json(response.data);
    } else {
      res.status(response.status).json(response.data);
    }
  } catch (error: any) {
    console.error('Error in POST request:', error);
    ErrorHandler(error);
    if (axios.isAxiosError(error) && error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({
        message: 'Error in POST request',
        error: error.message,
      });
    }
  }
}

export async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'Missing user ID' });
  }

  try {
    const response = await axios.delete(`${BASE_URL}/admin/v1/user`, {
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
        Authorization: getJWTToken(),
        deviceToken: getDeviceToken(),
      },
      data: { id },
    });

    if (response.status === 200) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(response.status).json(response.data);
    }
  } catch (error: any) {
    console.error('Error deleting user:', error);
    ErrorHandler(error);
    if (axios.isAxiosError(error) && error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({
        message: 'Error deleting user',
        error: error.message,
      });
    }
  }
}
