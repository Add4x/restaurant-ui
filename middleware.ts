import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // For protected routes, check if authentication cookie exists
  if (isProtectedRoute(req.nextUrl.pathname)) {
    // Check for auth cookie set by the Java backend
    // Since we're using HTTP-only cookies, we don't need to manage them manually
    // We just need to check if they exist
    const hasAuthCookie = req.cookies.has("access_token");

    if (!hasAuthCookie) {
      // Redirect to auth endpoint to attempt authentication via client credentials
      // This will try to get a token from the Java backend
      return NextResponse.redirect(new URL("/api/auth", req.url));
    }
  }

  // Allow the request to continue
  return NextResponse.next();
}

/**
 * Check if a route should be protected
 */
function isProtectedRoute(pathname: string): boolean {
  const protectedRoutes = ["/dashboard", "/admin", "/checkout", "/orders"];

  return protectedRoutes.some((route) => pathname.startsWith(route));
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api/auth route (to prevent redirect loops)
     */
    "/((?!_next/static|_next/image|favicon.ico|public/|api/auth/).*)",
  ],
};
