import { connectToDatabase } from "@/lib/db";
import ProductImage from "@/models/ProductImage";
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

    const productImages = await ProductImage.find()
      .sort({ createdAt: -1 })
      .lean();

    return sendSuccessResponse(
      200,
      "Product images fetched successfully!",
      productImages
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

    const result = await ProductImage.deleteMany({
      _id: { $in: ids },
    });

    if (result.deletedCount === 0) {
      return sendErrorResponse(404, "No images were deleted");
    }

    return sendSuccessResponse(
      200,
      `${result.deletedCount} images deleted successfully`
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

    // Create multiple ProductImage entries
    await Promise.all(
      url.map((imageUrl: string) => {
        const newImage = new ProductImage({
          url: imageUrl,
          pId,
        });
        return newImage.save();
      })
    );

    return sendSuccessResponse(201, "Product Image added successfully!");
  } catch (error) {
    return sendErrorResponse(500, "Internal server error", error);
  }
}
