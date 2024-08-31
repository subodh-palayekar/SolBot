import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath = ['/login', '/register', '/'].includes(path);
  const token = request.cookies.get('token')?.value || '';

  // Redirect authenticated users away from login or register pages
  if (isPublicPath && token && path !== '/') {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }

  // Redirect unauthenticated users to the login page
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  return NextResponse.next();
}

// Middleware configuration
export const config = {
  matcher: [
    '/',
    '/login',
    '/register',
    '/api/account/:path*',
    '/wallet/:path*',
  ],
};
