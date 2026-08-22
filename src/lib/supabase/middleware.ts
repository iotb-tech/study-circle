import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { Database } from '@/types/database.types';
import { env } from '../env';

/** Routes that require authentication */
const PROTECTED_PATHS = [
  '/dashboard',
  '/discussions',
  '/bookmarks',
  '/profile',
  '/settings',
];

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  const isProtectedRoute = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path)
  );

  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone();

    url.pathname = '/signin';
    url.searchParams.set('redirect', pathname);
    
    return NextResponse.redirect(url);
  }

  if (user && (pathname === '/signin' || pathname === '/signup')) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return response;
}