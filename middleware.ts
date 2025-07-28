import { NextRequest, NextResponse } from 'next/server';

// Routes that require authentication
const protectedRoutes = ['/account', '/merge'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check for authentication cookies
  const userSession = request.cookies.get('UserSession');
  const userAccount = request.cookies.get('UserAccount');
  const isAuthenticated = userSession && userAccount;

  // Handle protected routes
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/?error=auth_required', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 