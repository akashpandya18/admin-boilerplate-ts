/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const flagCheck = 'application/json';

    const response = await axios.post(`${BASE_URL}/admin/v1/login`, reqBody, {
      headers: {
        'Content-Type': flagCheck,
        accept: 'application/json',
      },
    });

    if (response.status === 200) {
      const nextRes = NextResponse.json(response.data);
      // Set token cookie
      nextRes.headers.append(
        'Set-Cookie',
        `token=${response.data.meta.token}; Path=/; HttpOnly; Secure`
      );

      // Set refreshToken cookie
      if (response.data.meta.refreshToken) {
        nextRes.headers.append(
          'Set-Cookie',
          `refreshToken=${response.data.meta.refreshToken}; Path=/; HttpOnly; Secure`
        );
      }

      // Set userData cookie
      const userDataString = encodeURIComponent(
        JSON.stringify(response.data.data)
      );
      nextRes.headers.append(
        'Set-Cookie',
        `userData=${userDataString}; Path=/; HttpOnly; Secure`
      );
      return nextRes;
    } else {
      return NextResponse.json(response.data, { status: response.status });
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(error.response.data, {
        status: error.response.status,
      });
    } else {
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      );
    }
  }
}
