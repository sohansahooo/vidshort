import { DefaultSession } from "next-auth";

/**
 * ✅ Extends the NextAuth module to add a custom `id` field to the Session user object.
 */
declare module "next-auth" {
    interface Session {
        user: {
            id: String; // 🔹 Adds a custom `id` field to the session's user object
        } & DefaultSession["user"]; // 🔹 Merges default user properties (name, email, image)
    }
}
