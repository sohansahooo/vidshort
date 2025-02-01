import mongoose from "mongoose";

// ✅ Load the MongoDB URI from the .env file
const MONGODB_URI = process.env.MONGODB_URI!; // Next.js automatically loads .env variables

// ❌ If the URI is not defined, throw an error to prevent misconfiguration
if (!MONGODB_URI) {
  throw new Error("❌ MongoDB URI is not defined in .env.");
}

/**
 * 🌟 Caching MongoDB Connection in Global Scope
 * --------------------------------------------------
 * - Next.js reloads backend code frequently in development mode.
 * - If we don’t cache the connection, multiple DB connections will be created.
 * - global.mongoose is used to store the connection across reloads.
 */
let cached = global.mongoose || { conn: null, promise: null };

/**
 * ✅ Function to Connect to MongoDB
 * - Uses a cached connection if available.
 * - Creates a new connection only if needed.
 * - Implements error handling to prevent crashes.
 */
export async function connectToDatabase() {
  // 1️⃣ Return existing connection if it's already established
  if (cached.conn) {
    return cached.conn;
  }

  // 2️⃣ If no existing connection promise, create a new one
  if (!cached.promise) {
    const opts = {
      bufferCommands: true, // Ensures Mongoose queues operations while connecting
      maxPoolSize: 10, // Limits max concurrent database connections for efficiency
    };

    // Store the pending connection promise to avoid multiple connection attempts
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => mongoose.connection);
  }

  // 3️⃣ Wait for the connection to complete & handle errors
  try {
    cached.conn = await cached.promise; // Assign resolved connection
  } catch (error) {
    cached.promise = null; // Reset promise so future attempts can reconnect
    console.error("❌ MongoDB Connection Error:", error);
    throw new Error("❌ Database connection failed.");
  }

  // 4️⃣ Return the established database connection
  return cached.conn;
}