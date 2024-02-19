import axios from 'axios';
import { getJWTToken, ErrorHandler } from '@/lib/utils';
import { NextApiRequest, NextApiResponse } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function PUT(req: NextApiRequest, res: NextApiResponse) {
  try {
    const headers = {
      accept: 'application/json',
      Authorization: getJWTToken(),
    };

    const response = await axios.put(`${BASE_URL}/change-password`, req.body, {
      headers: headers,
    });

    if (response.status === 200) {
      res.status(200).json(response.data);
    } else {
      res.status(response.status).json(response.data);
    }
  } catch (error) {
    ErrorHandler(error as any);
    if (axios.isAxiosError(error) && error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
