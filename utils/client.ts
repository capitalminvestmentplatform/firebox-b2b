import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

// Define the shape of your token's payload
type TokenPayload = {
  id: string; // adjust according to your token structure
  role: string; // optional, adjust as needed
  email: string; // optional, adjust as needed
  firstName: string;
  lastName: string;
  image: string;
  // ... other claims if needed
};

export const uploadFileToCloudinary = async (
  file: File,
  folder: string
): Promise<string | null> => {
  const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || ""
  );
  formData.append("folder", folder);

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
};

export const getLoggedInUser = (): TokenPayload | null => {
  const token = Cookies.get("token");

  if (token) {
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      return decoded; // or decoded.email, depending on your requirement
    } catch (error) {
      console.error("Invalid token", error);

      return null;
    }
  }

  return null;
};
