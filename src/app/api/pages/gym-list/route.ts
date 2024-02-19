import axios from 'axios';
import { getJWTToken, ErrorHandler } from '@/lib/utils';
import { NextApiRequest, NextApiResponse } from 'next';
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const { page = 1, per_page = 10, search = '', isHeader = true } = req.query;

  try {
    const response = await axios.get(`${BASE_URL}/admin/v1/gym-name`, {
      params: {
        page,
        per_page,
        search,
        isHeader,
      },
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
    console.error('Error fetching users:', error);
    if (axios.isAxiosError(error) && error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res
        .status(500)
        .json({ message: 'Error fetching users', error: error.message });
    }
  }
}
