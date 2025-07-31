import { connectToDatabase } from "@/lib/db";
import ProductVideo from "@/models/ProductVideo";
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

    const productVideos = await ProductVideo.find()
      .sort({ createdAt: -1 })
      .lean();

    return sendSuccessResponse(
      200,
      "Product videos fetched successfully!",
      productVideos
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

    const result = await ProductVideo.deleteMany({
      _id: { $in: ids },
    });

    if (result.deletedCount === 0) {
      return sendErrorResponse(404, "No videos were deleted");
    }

    return sendSuccessResponse(
      200,
      `${result.deletedCount} videos deleted successfully`
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
    const newProductVideo = new ProductVideo({
      url,
      pId,
    });

    await newProductVideo.save();

    return sendSuccessResponse(
      201,
      "Product video added successfully!",
      newProductVideo
    );
  } catch (error) {
    return sendErrorResponse(500, "Internal server error", error);
  }
}
