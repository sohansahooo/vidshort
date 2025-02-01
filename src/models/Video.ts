import mongoose, { Schema, model, models } from "mongoose";

/**
 * ✅ VIDEO_DIMENSIONS Constant
 * - Defines default width and height for videos.
 * - `as const` makes it a read-only object (prevents accidental modification).
 */
export const VIDEO_DIMENSIONS = {
    width: 1080,
    height: 1920
} as const;

/**
 * ✅ IVideo Interface (TypeScript)
 * - Ensures type safety when interacting with the Video model.
 */
export interface IVideo {
    _id: mongoose.Types.ObjectId; // MongoDB ObjectId (auto-generated)
    title: string; // Title of the video
    description: string; // Description of the video
    videoUrl: string; // URL of the uploaded video
    thumbnailUrl: string; // URL of the video thumbnail
    controls?: boolean; // Whether video controls are enabled (default: true)
    transformation?: { // Optional transformation settings
        height: number; // Video height
        width: number; // Video width
        quality?: number; // Quality percentage (1 - 100)
    };
    createdAt?: Date; // Timestamp (auto-managed by Mongoose)
    updatedAt?: Date; // Timestamp (auto-managed by Mongoose)
}

/**
 * ✅ Creating the Video Schema (Mongoose)
 * - Defines how the `Video` data is structured in MongoDB.
 * - Uses `timestamps: true` to auto-manage `createdAt` and `updatedAt`.
 */
const videoSchema = new Schema<IVideo>({
    title: { type: String, required: true }, // Video title (required)
    description: { type: String, required: true }, // Video description (required)
    videoUrl: { type: String, required: true }, // Video URL (required)
    thumbnailUrl: { type: String, required: true }, // Thumbnail URL (required)
    controls: { type: Boolean, default: true }, // Default: Controls enabled
    transformation: { // Optional transformation settings
        height: { type: Number, default: VIDEO_DIMENSIONS.height }, // Default height (1920px)
        width: { type: Number, default: VIDEO_DIMENSIONS.width }, // Default width (1080px)
        quality: { type: Number, min: 1, max: 100 } // Quality (1-100)
    }
}, { timestamps: true }); // ✅ Auto-adds `createdAt` & `updatedAt` fields

/**
 * ✅ Creating the Video Model
 * - Uses `models?.Video` to prevent model redefinition in Next.js (avoids hot-reload errors).
 * - If the model exists, reuse it; otherwise, create a new one.
 */
const Video = models?.Video || model<IVideo>("Video", videoSchema);

export default Video; // ✅ Export the Video model
