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
