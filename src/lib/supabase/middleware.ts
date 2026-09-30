import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { Database } from '@/types/database';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const isAdminPath = request.nextUrl.pathname.startsWith('/admin');
  const isLoginPage = request.nextUrl.pathname === '/admin/login';
  const isAdminApiPath = request.nextUrl.pathname.startsWith('/api/admin');

  // If Supabase environment variables are missing
  if (!supabaseUrl || !supabaseAnonKey) {
    if (isAdminPath && !isLoginPage) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('notice', 'setup_required');
      return NextResponse.redirect(url);
    }
    if (isAdminApiPath) {
      return NextResponse.json(
        { error: 'Unauthorized: Supabase credentials not configured' },
        { status: 401 }
      );
    }
    return supabaseResponse;
  }

  const supabase = createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Authenticate user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const restrictedAdminEmail = process.env.ADMIN_EMAIL;
  const isAuthorizedAdmin = user && (!restrictedAdminEmail || user.email === restrictedAdminEmail);

  // 1. API route protection: Reject unauthenticated callers immediately with 401 / 403
  if (isAdminApiPath) {
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized: Valid admin session required' },
        { status: 401 }
      );
    }
    if (!isAuthorizedAdmin) {
      return NextResponse.json(
        { error: 'Forbidden: Admin access restricted' },
        { status: 403 }
      );
    }
    return supabaseResponse;
  }

  // 2. Admin page route protection: Redirect unauthenticated visitors to /admin/login
  if (isAdminPath && !isLoginPage) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      const redirectResponse = NextResponse.redirect(url);
      supabaseResponse.cookies.getAll().forEach((c) => {
        redirectResponse.cookies.set(c.name, c.value);
      });
      return redirectResponse;
    }

    if (!isAuthorizedAdmin) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('error', 'forbidden');
      const redirectResponse = NextResponse.redirect(url);
      supabaseResponse.cookies.getAll().forEach((c) => {
        redirectResponse.cookies.set(c.name, c.value);
      });
      return redirectResponse;
    }
  }

  // 3. If already authenticated and visiting /admin/login, redirect to /admin dashboard
  if (isLoginPage && isAuthorizedAdmin) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin';
    const redirectResponse = NextResponse.redirect(url);
    supabaseResponse.cookies.getAll().forEach((c) => {
      redirectResponse.cookies.set(c.name, c.value);
    });
    return redirectResponse;
  }

  return supabaseResponse;
}

