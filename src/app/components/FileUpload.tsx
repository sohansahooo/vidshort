"use client"; // Ensures this component runs on the client side in Next.js.

import React, { useState } from "react"; // Import React and useState for managing component state.
import { IKUpload } from "imagekitio-next"; // Import IKUpload from ImageKit for file uploads.
import { Loader2 } from "lucide-react"; // Import Loader2 icon for displaying a loading spinner.
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props"; // Import types for ImageKit response.

/**
 * Define the props expected by the FileUpload component.
 * - `onSuccess`: A callback function that is called when the upload is successful.
 * - `onProgress`: A callback function to track upload progress percentage.
 * - `fileType`: Specifies whether the upload is an image or video.
 */
interface FileUploadProps {
  onSuccess: (res: IKUploadResponse) => void;
  onProgress: (progress: number) => void;
  fileType: "image" | "video"; // Restricts the file type to either "image" or "video".
}

// Retrieve ImageKit configuration from environment variables.
const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;
const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;

/**
 * The FileUpload component allows users to upload images or videos.
 * It includes validation, progress tracking, and error handling.
 */
export default function FileUpload({
  onSuccess,
  onProgress,
  fileType = "image", // Default file type is set to "image".
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false); // State to track if a file is uploading.
  const [error, setError] = useState<string | null>(null); // State to store any error messages.

  /**
   * Handles errors during file upload.
   * @param err - An object containing the error message.
   */
  const onError = (err: { message: string }) => {
    console.log("Error", err);
    setError(err.message); // Update the error state.
    setUploading(false); // Stop the uploading state.
  };

  /**
   * Handles successful file uploads.
   * @param response - The response from ImageKit after a successful upload.
   */
  const handleSuccess = (response: IKUploadResponse) => {
    console.log("Success", response);
    setUploading(false); // Stop the uploading state.
    setError(null); // Clear any previous errors.
    onSuccess(response); // Call the success callback function with the response data.
  };

  /**
   * Tracks upload progress and updates the UI.
   * @param evt - Progress event from the upload process.
   */
  const handleProgress = (evt: ProgressEvent<EventTarget>) => {
    if (evt.lengthComputable && onProgress) {
      const percentComplete = (evt.loaded / evt.total) * 100;
      onProgress(Math.round(percentComplete)); // Convert to a whole number and pass to onProgress callback.
    }
  };

  /**
   * Handles the start of an upload.
   * @param evt - The file input change event.
   */
  const handleStartUpload = (evt: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Start", evt);
  };

  /**
   * Validates the selected file before uploading.
   * Ensures correct file type and size limits.
   * @param file - The file selected by the user.
   * @returns {boolean} - Returns true if valid, false otherwise.
   */
  const validateFile = (file: File) => {
    if (fileType === "video") {
      if (!file.type.startsWith("video/")) {
        setError("Please upload a video file");
        return false;
      }
      if (file.size > 100 * 1024 * 1024) {
        // Limit video size to 100MB.
        setError("Video must be less than 100MB");
        return false;
      }
    } else {
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        setError("Please upload an image file");
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        // Limit image size to 5MB.
        setError("Image must be less than 5MB");
        return false;
      }
    }
    return true; // Return true if file is valid.
  };

  return (
    <div className="space-y-2">
      {" "}
      {/* Container with spacing between elements */}
      {/**
       * IKUpload component from ImageKit for handling file uploads.
       * - `fileName`: Determines the filename type.
       * - `validateFile`: Calls the validation function before uploading.
       * - `onError`: Handles any upload errors.
       * - `onSuccess`: Calls handleSuccess when the upload is successful.
       * - `onUploadStart`: Calls handleStartUpload when upload starts.
       * - `onUploadProgress`: Calls handleProgress to track progress.
       * - `accept`: Defines the allowed file types based on fileType.
       * - `folder`: Specifies the upload folder ("videos" or "images").
       */}
      <IKUpload
        fileName={fileType === "video" ? "video" : "image"}
        validateFile={validateFile}
        onError={onError}
        onSuccess={handleSuccess}
        onUploadStart={handleStartUpload}
        onUploadProgress={handleProgress}
        accept={fileType === "video" ? "video/*" : "image/*"} // Accepts only images or videos based on fileType.
        className="file-input file-input-bordered w-full" // Tailwind CSS classes for styling.
        useUniqueFileName={true} // Ensures each file has a unique name.
        folder={fileType === "video" ? "/videos" : "/images"} // Upload folder based on file type.
      />
      {/* Show a loading spinner when uploading */}
      {uploading && (
        <div className="flex items-center gap-2 text-sm text-primary">
          <Loader2 className="animate-spin w-4 h-4" />{" "}
          {/* Animated loading icon */}
          <span>Uploading...</span>
        </div>
      )}
      {/* Display an error message if any */}
      {error && <div className="text-error text-sm">{error}</div>}
    </div>
  );
}
