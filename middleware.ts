// Importing necessary modules for Next.js middleware
import withAuth from "next-auth/middleware"; // Next.js middleware for integrating with NextAuth
import { NextResponse } from "next/server"; // Used to send the response from the middleware
import path from "path"; // Path module for handling and transforming file paths

// Exporting the middleware with NextAuth integration
export default withAuth(
    // Middleware function
    function middleware() {
        return NextResponse.next(); // Allow the request to proceed to the next handler
    },
    {
        // Custom callbacks for the NextAuth middleware
        callbacks: {
            // The 'authorized' callback determines if the request is authorized
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl; // Get the URL pathname of the request

                // Step 1: Allow auth-related routes (sign-in, sign-up, and auth API)
                if (pathname.startsWith("/api/auth") ||
                    pathname.startsWith("/login") ||
                    pathname.startsWith("/register")
                ) {
                    return true; // If the route is related to authentication, allow it
                }

                // Step 2: Allow public routes (home page or public API routes)
                if (pathname === "/" || pathname.startsWith("/api/videos")) {
                    return true; // Public routes can be accessed by anyone, so allow
                }

                // Step 3: Check for valid authentication (ensure token exists)
                return !!token; // If a token exists, allow access; otherwise, deny
            }
        }
    }
);

// The config object defines which routes are affected by this middleware
export const config = {
    // Matcher pattern defines which routes the middleware should apply to
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*) "]
}
