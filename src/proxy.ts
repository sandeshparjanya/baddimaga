import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const userId = request.cookies.get('baddi_user_id')?.value;
  const isLoginPage = request.nextUrl.pathname === '/login';

  if (!userId && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (userId && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|opengraph-image|icon.svg|apple-icon).*)'],
};
