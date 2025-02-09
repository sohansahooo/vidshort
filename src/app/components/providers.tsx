"use client"; // This ensures that the component runs on the client side in Next.js.

import { ImageKitProvider } from "imagekitio-next"; // Import ImageKit provider to handle image uploads.
import { SessionProvider } from "next-auth/react"; // Import SessionProvider to manage authentication sessions.

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT; // Get ImageKit URL endpoint from environment variables.
const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY; // Get ImageKit public key from environment variables.

/*
 * The Providers component wraps the entire application with necessary providers.
 * It includes:
 * 1. `SessionProvider` - Manages authentication sessions.
 * 2. `ImageKitProvider` - Manages image and video uploads using ImageKit.
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  /**
   * The `authenticator` function handles authentication with ImageKit.
   * It fetches authentication parameters (`signature`, `expire`, `token`) from our API.
   *
   * @returns {Promise<{signature: string, expire: number, token: string}>}
   */
  const authenticator = async () => {
    try {
      // Send a request to our API endpoint to get authentication parameters.
      const response = await fetch("/api/imagekit-auth");

      // If the response is not successful, throw an error with details.
      if (!response.ok) {
        const errorText = await response.text(); // Read error message from response.
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`
        );
      }

      // Parse the response JSON data.
      const data = await response.json();
      const { signature, expire, token } = data; // Destructure the authentication data.

      return { signature, expire, token }; // Return authentication details to ImageKit.
    } catch (error) {
      console.log(error); // Log any errors to the console.
      throw new Error(`Authentication request failed:`); // Throw a general error message.
    }
  };

  return (
    /**
     * `SessionProvider` manages authentication sessions.
     * It ensures that user session data is available throughout the application.
     */
    <SessionProvider>
      {/**
       * `ImageKitProvider` provides ImageKit-related configurations.
       * - `urlEndpoint` defines the ImageKit server endpoint.
       * - `publicKey` is the public key used for authentication.
       * - `authenticator` is the function that fetches authentication details.
       */}
      <ImageKitProvider
        urlEndpoint={urlEndpoint}
        publicKey={publicKey}
        authenticator={authenticator}
      >
        {children} {/* This renders all child components inside the provider */}
      </ImageKitProvider>
    </SessionProvider>
  );
}
