import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
    const isStudentRoute = req.nextUrl.pathname.startsWith('/student');

    // Redirect admin routes if user is not an admin
    if (isAdminRoute && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/student/dashboard', req.url));
    }

    // Redirect student routes if user is not a student
    if (isStudentRoute && token?.role !== 'student') {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Ensure user is authenticated
    },
  }
);

// Specify which routes to protect
export const config = {
  matcher: [
    '/admin/:path*',
    '/student/:path*',
    '/api/admin/:path*',
    '/api/student/:path*',
  ],
}; 