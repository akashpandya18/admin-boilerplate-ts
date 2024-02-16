// app/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

const PRIVATE_ROUTES: { path: string[] }[] = [
  {
    path: ['/change-password'],
  },
  {
    path: ['/dashboard'],
  },
  {
    path: ['/notifications'],
  },
  {
    path: ['/sub-admins'],
  },
  {
    path: ['/sub-admins/add-edit'],
  },
  {
    path: ['/users'],
  },
  {
    path: ['/users/view'],
  },
  {
    path: ['/users/edit'],
  },
  {
    path: ['/content-management/focus'],
  },
  {
    path: ['/content-management/focus/view'],
  },
  {
    path: ['/content-management/focus/add-edit'],
  },
  {
    path: ['/content-management/meditation'],
  },
  {
    path: ['/content-management/meditation/add-edit'],
  },
  {
    path: ['/content-management/meditation/view'],
  },
  {
    path: ['/content-management/affirmation'],
  },
  {
    path: ['/content-management/affirmation/add-edit'],
  },
  {
    path: ['/content-management/affirmation/view'],
  },
  {
    path: ['/content-management/gratitude'],
  },
  {
    path: ['/content-management/gratitude/add-edit'],
  },
  {
    path: ['/content-management/rituals'],
  },
  {
    path: ['/content-management/rituals/view'],
  },
  {
    path: ['/content-management/rituals/add-edit'],
  },
  {
    path: ['/content-management/bedtime-stories'],
  },
  {
    path: ['/content-management/sounds'],
  },
  {
    path: ['/content-management/sounds/view'],
  },
  {
    path: ['/content-management/sounds/add-edit'],
  },
  {
    path: ['/content-management/top-picks'],
  },
  {
    path: ['/content-management/top-picks/add-edit'],
  },
  {
    path: ['/content-management/manifestation'],
  },
  {
    path: ['/content-management/manifestation/add-edit'],
  },
  {
    path: ['/push-notification'],
  },
  {
    path: ['/push-notification/add'],
  },
  {
    path: ['/content-approval'],
  },
  {
    path: ['/content-approval/view'],
  },
  {
    path: ['/cms'],
  },
  {
    path: ['/cms/edit-view'],
  },
  {
    path: ['/earning'],
  },
  {
    path: ['/config'],
  },
  // {
  //   path: ['/draft'],
  // },
  // {
  //   path: ['/draft/view'],
  // },
  {
    path: ['/content-management/shoorah-pods'],
  },
  {
    path: ['/content-management/shoorah-pods/view'],
  },
  {
    path: ['/content-management/shoorah-pods/add-edit'],
  },
];
export function middleware(request: NextRequest) {
  console.log('pathname', request);

  const { pathname } = request.nextUrl;

  // Check if the request is for the homepage
  if (pathname === '/') {
    const url = request.url;
    return NextResponse.redirect(new URL('/users', url));
  }

  // Check if the current path is one of the private routes
  const isPrivateRoute = PRIVATE_ROUTES.some((privatePath) =>
    pathname.startsWith(privatePath.path[0])
  );

  if (isPrivateRoute) {
    // Attempt to get tokens and userData from cookies
    const token = request.cookies.get('token');
    const refreshToken = request.cookies.get('refreshToken');
    const userData = request.cookies.get('userData');

    // Redirect to /login if any of the authentication details are missing
    if (!token || !refreshToken || !userData) {
      const url = request.url;
      return NextResponse.redirect(new URL('/login', url));
    }
  }

  return NextResponse.redirect(new URL('/not-found', request.url));
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|site.webmanifest|favicon*).*)'],
};
