import { connectToDatabase } from "@/lib/db";
import ProductDocument from "@/models/ProductDocument";
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

    const productDocuments = await ProductDocument.find()
      .populate({
        path: "pId", // field in ProductImage
        select: "name _id", // only bring back name and _id
      })
      .sort({ createdAt: -1 })
      .lean();

    const transformed = productDocuments.map((doc) => ({
      ...doc,
      pId: doc.pId?._id || null,
      name: doc.pId?.name || null,
    }));

    return sendSuccessResponse(
      200,
      "Product documents fetched successfully!",
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

    const result = await ProductDocument.deleteMany({
      _id: { $in: ids },
    });

    if (result.deletedCount === 0) {
      return sendErrorResponse(404, "No documents were deleted");
    }

    return sendSuccessResponse(
      200,
      `${result.deletedCount} documents deleted successfully`
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

    if (!Array.isArray(url) || !pId) {
      return sendErrorResponse(400, "Invalid request body");
    }

    // Create multiple ProductDocument entries
    await Promise.all(
      url.map((docUrl: string) => {
        const newDoc = new ProductDocument({
          url: docUrl,
          pId,
        });
        return newDoc.save();
      })
    );
    return sendSuccessResponse(201, "Product document added successfully!");
  } catch (error) {
    return sendErrorResponse(500, "Internal server error", error);
  }
}
