import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";

/**
 * ✅ Defining the IUser Interface (TypeScript)
 * - Defines the structure of the `User` document in TypeScript.
 * - Ensures type safety when working with Mongoose models.
 */
export interface IUser {
    email: string; // User's email (unique)
    password: string; // Hashed password
    _id: mongoose.Types.ObjectId; // MongoDB ObjectId (auto-generated)
    createdAt: Date; // Timestamp (auto-managed by Mongoose)
    updatedAt: Date; // Timestamp (auto-managed by Mongoose)
}

/**
 * ✅ Creating the User Schema (Mongoose)
 * - Defines how the `User` data is stored in MongoDB.
 * - Adds timestamps for `createdAt` and `updatedAt` automatically.
 */
const userSchema = new Schema<IUser>(
    {
        email: { type: String, required: true, unique: true }, // Email is required & must be unique
        password: { type: String, required: true } // Password is required
    },
    { timestamps: true } // Mongoose will automatically add createdAt & updatedAt fields
);

/**
 * ✅ Middleware (Pre-save Hook)
 * - Runs before saving the user document to the database.
 * - Hashes the password using `bcryptjs` only if it has been modified.
 */
userSchema.pre("save", async function (next) {
    // Only hash password if it has been modified
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10); // Hash with salt rounds = 10
    }
    next(); // Continue saving the user
});

/**
 * ✅ Creating the User Model
 * - Uses `models?.User` to prevent model redefinition in Next.js (avoids errors during hot reloads).
 * - If the model is already defined, use it; otherwise, create a new one.
 */
const User = models?.User || model<IUser>("User", userSchema);

export default User; // ✅ Export the User model
