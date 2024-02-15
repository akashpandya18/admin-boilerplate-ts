// app/api/login.ts
import { ErrorHandler } from '@/lib/utils';
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface LoginRequestBody {
  flag?: boolean;
}
export async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const reqBody: LoginRequestBody = req.body;
    const flag = reqBody.flag;

    let flagCheck = flag
      ? 'multipart/form-data; boundary=----WebKitFormBoundaryueI4YvrqiXxUgVGA'
      : 'application/json';

    const response = await axios.post(BASE_URL + '/login', reqBody, {
      headers: {
        'Content-Type': flagCheck,
        accept: 'application/json',
        deviceToken: 'yourDeviceToken', // Modify as needed
        deviceType: 3,
        Authorization: 'yourAuthorizationToken', // Modify as needed
      },
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
