import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Check if the user has an auth token
  const authToken = request.cookies.get("auth_token")?.value;
  
  // Public paths that do not require authentication
  const isPublicPath = request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/signup";
  
  // Root path handling
  if (request.nextUrl.pathname === "/") {
    if (!authToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    } else {
      return NextResponse.redirect(new URL("/recruiter-dashboard", request.url));
    }
  }

  if (isPublicPath && authToken) {
    // If the user is logged in and tries to access login/signup, redirect to dashboard
    return NextResponse.redirect(new URL("/recruiter-dashboard", request.url));
  }

  if (!isPublicPath && !authToken) {
    // If the user is not logged in and tries to access a protected route
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
}

export const config = {
  // Match all request paths except for the ones starting with:
  // - api (API routes)
  // - _next/static (static files)
  // - _next/image (image optimization files)
  // - favicon.ico, sitemap.xml, robots.txt (metadata files)
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
