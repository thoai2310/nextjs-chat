import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = ['/login', '/register', '/api', '/favicon.ico'];

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (
        publicPaths.some((path) => pathname.startsWith(path)) ||
        pathname.startsWith('/_next')
    ) {
        return NextResponse.next();
    }

    // Kiểm tra cookie
    const token = req.cookies.get('token')?.value;
    console.log('token', token);

    if (!token) {
        const loginUrl = new URL('/login', req.url);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next|favicon.ico|login|register|api).*)'],
};

