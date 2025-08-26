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
      .populate({
        path: "pId", // field in ProductImage
        select: "name _id", // only bring back name and _id
      })
      .sort({ createdAt: -1 })
      .lean();

    const transformed = productManual.map((man) => ({
      ...man,
      pId: man.pId?._id || null,
      name: man.pId?.name || null,
    }));
    return sendSuccessResponse(
      200,
      "Product manuals fetched successfully!",
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

    const result = await ProductManual.deleteMany({
      _id: { $in: ids },
    });

    if (result.deletedCount === 0) {
      return sendErrorResponse(404, "No manuals were deleted");
    }

    return sendSuccessResponse(
      200,
      `${result.deletedCount} manuals deleted successfully`
    );
  } catch (error) {
    return sendErrorResponse(500, "Internal server error", error);
  }
}
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();

    const { url, pId, isArabic } = body;

    // 5. Create product
    const newProductManuals = new ProductManual({
      url,
      pId,
      isArabic,
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
