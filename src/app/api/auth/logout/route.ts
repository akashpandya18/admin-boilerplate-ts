import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function DELETE(req: NextRequest) {
  const { isHeader } = await req.json();
  const token = req.cookies.toString().split('token=')[1].split(';')[0];

  try {
    const response = await axios.delete(`${BASE_URL}/`, {
      headers: isHeader
        ? {
            'Content-Type': 'application/json',
            accept: 'application/json',
            Authorization: `Bearer ${token}`,
          }
        : {},
    });

    if (response.status === 200) {
      const nextRes = NextResponse.rewrite(req.nextUrl);

      // Clear token cookie
      nextRes.headers.append(
        'Set-Cookie',
        'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure'
      );

      // Clear refreshToken cookie
      nextRes.headers.append(
        'Set-Cookie',
        'refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure'
      );

      // Clear userData cookie
      nextRes.headers.append(
        'Set-Cookie',
        'userData=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure'
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
