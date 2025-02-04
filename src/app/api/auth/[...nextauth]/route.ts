// Importing the 'authOptions' configuration, which contains NextAuth configuration
import { authOptions } from "@/lib/auth";

// Importing the 'NextAuth' function to handle the authentication process
import NextAuth from "next-auth";

// Creating a handler by passing the authOptions to NextAuth
const handler = NextAuth(authOptions);

// Exporting the handler to handle GET and POST requests for authentication
export { handler as GET, handler as POST };
