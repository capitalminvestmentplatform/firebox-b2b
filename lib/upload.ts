import cloudinary from "@/lib/cloudinary";
import fs from "fs";
import { File } from "formidable";

export const uploadFileToCloudinary = async (file: File, folder: string) => {
  try {
    const isLargeFile = file.size > 100 * 1024 * 1024; // >100MB

    const upload = isLargeFile
      ? await cloudinary.uploader.upload_large(file.filepath, {
          folder,
          resource_type: "auto",
          chunk_size: 6_000_000, // 6MB chunks
        })
      : await cloudinary.uploader.upload(file.filepath, {
          folder,
          resource_type: "auto",
        });

    fs.unlinkSync(file.filepath); // Clean up temp file
    return upload.secure_url;
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);
    throw new Error("File upload failed");
  }
};

export const uploadMultipleFilesToCloudinary = async (
  files: File[],
  folder: string
) => {
  const urls: string[] = [];

  for (const file of files) {
    if (file?.filepath && file?.originalFilename && file?.size > 0) {
      const url = await uploadFileToCloudinary(file, folder);
      urls.push(url);
    }
  }

  return urls;
};
