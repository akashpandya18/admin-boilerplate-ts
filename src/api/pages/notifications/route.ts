import axios from 'axios';
import { getJWTToken, getDeviceToken, ErrorHandler } from '@/lib/utils';
import { NextApiRequest, NextApiResponse } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const { type, page, perPage, searchKey } = req.query;
  try {
    const headers = req.query.isHeader
      ? {
          'Content-Type': 'application/json',
          accept: 'application/json',
          Authorization: getJWTToken(),
          ...(req.method === 'DELETE' && { deviceToken: getDeviceToken() }),
        }
      : {};
    const response = await axios.get(`${BASE_URL}/notification`, {
      params: {
        page,
        perPage,
        searchKey,
        notificationListType: type,
      },
      headers,
    });
    if (response.status === 200) {
      res.status(200).json(response.data);
    } else {
      res.status(response.status).json(response.data);
    }
  } catch (error: any) {
    ErrorHandler(error);
    if (axios.isAxiosError(error) && error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res
        .status(500)
        .json({ message: 'Error fetching notification', error: error.message });
    }
  }
}

export async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  const { idToDelete, deleteType } = req.query;
  try {
    const headers = req.query.isHeader
      ? {
          'Content-Type': 'application/json',
          accept: 'application/json',
          Authorization: getJWTToken(),
          deviceToken: getDeviceToken(),
        }
      : {};
    const response = await axios.delete(`${BASE_URL}/notification`, {
      params: {
        deleteType,
        idToDelete,
      },
      headers,
    });
    if (response.status === 200) {
      res.status(200).json(response.data);
    } else {
      res.status(response.status).json(response.data);
    }
  } catch (error: any) {
    ErrorHandler(error);
    if (axios.isAxiosError(error) && error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({
        message: 'Error deleting notifications',
        error: error.message,
      });
    }
  }
}
