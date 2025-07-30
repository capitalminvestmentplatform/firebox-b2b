import { connectToDatabase } from "@/lib/db";
import ProductCatalog from "@/models/ProductCatalog";
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

    const productCatalogs = await ProductCatalog.find()
      .sort({ createdAt: -1 })
      .lean();

    return sendSuccessResponse(
      200,
      "Product catalogs fetched successfully!",
      productCatalogs
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
    const newProductCatalog = new ProductCatalog({
      url,
      pId,
    });

    await newProductCatalog.save();

    return sendSuccessResponse(
      201,
      "Product catalog added successfully!",
      newProductCatalog
    );
  } catch (error) {
    return sendErrorResponse(500, "Internal server error", error);
  }
}
