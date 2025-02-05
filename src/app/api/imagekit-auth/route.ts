// Importing the ImageKit SDK for handling image uploads and authentication
import ImageKit from "imagekit";

// Importing Next.js response utility to format API responses
import { NextResponse } from "next/server";

// Initializing ImageKit with API credentials from environment variables
const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!, // Public API key for client-side requests
    privateKey: process.env.PRIVATE_KEY!, // Private API key (must be kept secure)
    urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT!, // URL endpoint for serving images
});

// API route handler for GET requests
export async function GET() {
    try {
        // Generate authentication parameters for client-side uploads
        const authenticationParameters = imagekit.getAuthenticationParameters();

        // Return the authentication parameters in JSON format
        return NextResponse.json(authenticationParameters);
    } catch (error) {
        // Handle errors and return a JSON response with an error message and status 500
        return NextResponse.json(
            { error: "Imagekit Auth Failed" }, // Error message
            { status: 500 } // HTTP status code for server error
        );
    }
}
