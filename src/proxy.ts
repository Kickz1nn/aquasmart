import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/dashboard", "/history", "/settings"];

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const hasAccess = request.cookies.get("aquasmart_access")?.value === "true";
    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

    if (pathname === "/") {
        if (!hasAccess) {
            return NextResponse.redirect(new URL("/access", request.url));
        }

        return NextResponse.next();
    }

    if (isProtectedRoute && !hasAccess) {
        return NextResponse.redirect(new URL("/access", request.url));
    }

    if (pathname === "/access" && hasAccess) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/access", "/dashboard/:path*", "/history/:path*", "/settings/:path*"],
};