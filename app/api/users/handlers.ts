import User from "@/models/User";
import { connectToDatabase } from "@/lib/db";
import { loggedIn } from "@/utils/server";
import { sendErrorResponse, sendSuccessResponse } from "@/utils/apiResponse";
import { NextRequest } from "next/server";

export async function getUsers() {
  try {
    await connectToDatabase();

    const users = await User.find({}, "-password"); // Exclude passwords from response
    return sendSuccessResponse(200, "Users fetched successfully", users);
  } catch (error) {
    return sendErrorResponse(500, "Internal server error", error);
  }
}

export async function createUser(req: NextRequest) {
  try {
    await connectToDatabase();
    const {
      firstName,
      lastName,
      username,
      phone,
      email,
      password,
      confirmPassword,
      role,
    } = await req.json();

    const decoded: any = await loggedIn();

    // Check if the user is an admin
    if (decoded.role !== "Admin") {
      return sendErrorResponse(403, "Access denied");
    }

    // Validate PIN format (exactly 4 digits)
    if (!/^\d{4}$/.test(password)) {
      return sendErrorResponse(400, "Password must be a 4-digit PIN");
    }

    // Ensure password and confirmPassword match
    if (password !== confirmPassword) {
      return sendErrorResponse(400, "Passwords do not match");
    }
    // Check if the user already exists
    let existingUser = null;
    existingUser = await User.findOne({
      $or: [{ email }],
    });
    if (existingUser) {
      return sendErrorResponse(409, "User already exists");
    }

    const newUser = new User({
      firstName,
      lastName,
      username,
      phone,
      email,
      password, // Store PIN as plain text (ensure database security measures)
      role,
      isVerified: true,
    });

    await newUser.save();

    return sendSuccessResponse(201, "User created successfully!", newUser);
  } catch (error) {
    return sendErrorResponse(500, "Internal server error", error);
  }
}
