import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session');
  const { pathname } = request.nextUrl;
  
  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/api/auth/login', '/api/ping'];
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith('/api/ping/'));
  const isApiAuth = pathname === '/api/auth/login';
  
  // Allow access to public routes
  if (isPublicRoute && !isApiAuth) {
    // If user is authenticated and visits root, redirect to dashboard
    if (session && pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }
  
  // Redirect to login if no session for protected routes
  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

