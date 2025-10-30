import { NextResponse } from 'next/server'

export function middleware(request) {
    const token = getTokenFromCookies(request);

    const { pathname } = request.nextUrl

    const protectedRoutes = ['/dashboard']
    const publicRoutes = ['/']

    const isProtectedRoute = protectedRoutes.some(route =>
        pathname.startsWith(route)
    )

    const isPublicRoute = publicRoutes.includes(pathname)

    if (!token && isProtectedRoute) {
        const loginUrl = new URL('/', request.url)
        return NextResponse.redirect(loginUrl)
    }

    if (token && isPublicRoute && pathname === '/') {
        const dashboardUrl = new URL('/dashboard', request.url)
        return NextResponse.redirect(dashboardUrl)
    }

    return NextResponse.next()
}

function getTokenFromCookies(request) {
    const cookieHeader = request.headers.get('cookie');
    if (!cookieHeader) return null;

    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
        const [name, value] = cookie.trim().split('=');
        acc[name] = value;
        return acc;
    }, {});

    return cookies.token || null;
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};