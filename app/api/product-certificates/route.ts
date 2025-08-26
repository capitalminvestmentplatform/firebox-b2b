import { connectToDatabase } from "@/lib/db";
import ProductCertificate from "@/models/ProductCertificate";
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
      .populate({
        path: "pId", // field in ProductImage
        select: "name _id", // only bring back name and _id
      })
      .sort({ createdAt: -1 })
      .lean();

    const transformed = certificates.map((cer) => ({
      ...cer,
      pId: cer.pId?._id || null,
      name: cer.pId?.name || null,
    }));
    return sendSuccessResponse(
      200,
      "Certificates fetched successfully!",
      transformed
    );
  } catch (error) {
    return sendErrorResponse(500, "Internal server error", error);
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();

    const url = new URL(request.url);
    const params = url.searchParams.get("items");

    if (!params) {
      return sendErrorResponse(400, "No IDs provided");
    }

    const ids = params.split(",");

    const result = await ProductCertificate.deleteMany({
      _id: { $in: ids },
    });

    if (result.deletedCount === 0) {
      return sendErrorResponse(404, "No certificates were deleted");
    }

    return sendSuccessResponse(
      200,
      `${result.deletedCount} certificates deleted successfully`
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
