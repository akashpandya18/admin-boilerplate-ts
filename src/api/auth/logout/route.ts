import axios from 'axios';
import { getJWTToken, getDeviceToken, ErrorHandler } from '@/lib/utils';
import { NextApiRequest, NextApiResponse } from 'next';

export async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  const { tag = '', isHeader = false } = req.query;

  try {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}${tag}`,
      {
        headers: isHeader
          ? {
              'Content-Type': 'application/json',
              accept: 'application/json',
              Authorization: getJWTToken(),
              deviceToken: getDeviceToken(),
            }
          : {},
      }
    );

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
