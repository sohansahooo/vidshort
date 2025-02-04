import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";

/**
 * ✅ Handles POST requests for user registration.
 */
export async function POST(request: NextRequest) {
    try {
        /**
         * ✅ Parse JSON body from request
         */
        const { email, password } = await request.json();

        // 🔴 Validation: Ensure email and password are provided
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 } // Bad Request
            );
        }

        /**
         * ✅ Connect to the MongoDB database
         */
        await connectToDatabase();

        /**
         * ✅ Check if the email already exists in the database
         */
        const existingUser = await User.findOne({ email });

        // 🔴 If the user already exists, return an error response
        if (existingUser) {
            return NextResponse.json(
                { error: "Email already exists" },
                { status: 400 } // Bad Request
            );
        }

        /**
         * ✅ Create a new user (password will be hashed automatically due to Mongoose middleware)
         */
        await User.create({ email, password });

        // 🟢 Success: User registered successfully
        return NextResponse.json(
            { message: "User registered successfully" },
            { status: 201 } // Created
        );

    } catch (error) {
        console.error("Error:", error);

        // 🔴 Server Error: Handle any unexpected issues
        return NextResponse.json(
            { error: "Failed to register user" },
            { status: 500 } // Internal Server Error
        );
    }
}
