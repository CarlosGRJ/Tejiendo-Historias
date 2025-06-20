import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from './config/supabase/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isAndrea = user?.email === process.env.NEXT_PUBLIC_AUTH_EMAIL;

  if (isAdminRoute && !isAndrea) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
