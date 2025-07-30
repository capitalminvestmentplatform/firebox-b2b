import mongoose, { Schema, Document, models } from "mongoose";

// Define the User schema
const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: function (v: string) {
          return /^\d{4}$/.test(v); // Ensures password is exactly 4 digits
        },
        message: "Password must be a 4-digit PIN",
      },
    },
    role: {
      type: String,
      enum: ["Admin", "User"],
      default: "User",
    },
    portfolioId: {
      type: Number,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Prevent model re-compilation in Next.js
const User = models.User || mongoose.model("User", UserSchema);

export default User;
