// Importing necessary modules for NextAuth and MongoDB connection
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./db"; // Assuming this is a utility for connecting to MongoDB
import User from "@/models/User"; // The User model for MongoDB
import bcrypt from "bcryptjs"; // Library for comparing hashed passwords

// Defining the NextAuth configuration
export const authOptions: NextAuthOptions = {

    // Providers array is where we specify the authentication method
    providers: [
        CredentialsProvider({
            // The name for this provider in case we need it
            name: "Credentials",

            // Defining the credentials needed for authentication
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },

            // The authorize function checks the credentials entered by the user
            async authorize(credentials) {
                // Step 1: Check if the credentials are present
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing email or password"); // If either is missing, throw an error
                }

                try {
                    // Step 2: Connect to the MongoDB database
                    await connectToDatabase();

                    // Step 3: Find the user in the database by their email
                    const user = await User.findOne({ email: credentials.email });

                    // Step 4: If the user doesn't exist, throw an error
                    if (!user) {
                        throw new Error("User not found");
                    }

                    // Step 5: Compare the provided password with the stored hashed password
                    const isValid = await bcrypt.compare(credentials.password, user.password);

                    // Step 6: If the password is invalid, throw an error
                    if (!isValid) {
                        throw new Error("Invalid password");
                    }

                    // Step 7: If authentication is successful, return the user information (id and email)
                    return {
                        id: user._id,
                        email: user.email
                    };

                } catch (error) {
                    // Step 8: Catch any errors during the authentication process and throw a generic error
                    throw new Error("Failed to log in");
                }
            }
        })
    ],

    // Callbacks allow customization of the JWT and session behavior
    callbacks: {
        // jwt callback modifies the JWT token, here we store the user id
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id; // Store user id in the token if user exists
            }
            return token; // Return the modified token
        },

        // session callback modifies the session object, adding the user id to the session
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string; // Attach the user id from the token to the session
            }
            return session; // Return the modified session
        }
    },

    // Pages configuration to define the custom routes for sign-in and errors
    pages: {
        signIn: "/login", // Custom login page
        error: "/login" // Custom error page, will redirect users here if an error occurs
    },

    // Session configuration, uses JWT strategy and sets the session expiry
    session: {
        strategy: "jwt", // Using JSON Web Tokens to handle session
        maxAge: 30 * 24 * 60 * 60 // Set session expiration to 30 days
    },

    // Secret to sign and verify JWT tokens, should be stored securely in an environment variable
    secret: process.env.NEXTAUTH_SECRET
};
