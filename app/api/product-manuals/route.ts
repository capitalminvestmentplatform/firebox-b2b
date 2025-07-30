import { connectToDatabase } from "@/lib/db";
import ProductManual from "@/models/ProductManual";
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

    const productManual = await ProductManual.find()
      .sort({ createdAt: -1 })
      .lean();

    return sendSuccessResponse(
      200,
      "Product manuals fetched successfully!",
      productManual
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
    const newProductManuals = new ProductManual({
      url,
      pId,
    });

    await newProductManuals.save();

    return sendSuccessResponse(
      201,
      "Product manuals added successfully!",
      newProductManuals
    );
  } catch (error) {
    return sendErrorResponse(500, "Internal server error", error);
  }
}
