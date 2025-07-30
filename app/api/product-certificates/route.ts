import { connectToDatabase } from "@/lib/db";
import Certificate from "@/models/ProductCertificate";
import { sendErrorResponse, sendSuccessResponse } from "@/utils/apiResponse";
import { NextRequest } from "next/server";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function GET() {
  try {
    await connectToDatabase();

    const certificates = await Certificate.find()
      .sort({ createdAt: -1 })
      .lean();

    return sendSuccessResponse(
      200,
      "Certificates fetched successfully!",
      certificates
    );
  } catch (error) {
    return sendErrorResponse(500, "Internal server error", error);
  }
}
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();

    const { url, pId } = body;

    // 5. Create product
    const certificates = new Certificate({
      url,
      pId,
    });

    await certificates.save();

    return sendSuccessResponse(
      201,
      "Certificate added successfully!",
      certificates
    );
  } catch (error) {
    return sendErrorResponse(500, "Internal server error", error);
  }
}
