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
      .populate({
        path: "pId", // field in ProductImage
        select: "name _id", // only bring back name and _id
      })
      .sort({ createdAt: -1 })
      .lean();

    const transformed = productCatalogs.map((cat) => ({
      ...cat,
      pId: cat.pId?._id || null,
      name: cat.pId?.name || null,
    }));
    return sendSuccessResponse(
      200,
      "Product catalogs fetched successfully!",
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

    const result = await ProductCatalog.deleteMany({
      _id: { $in: ids },
    });

    if (result.deletedCount === 0) {
      return sendErrorResponse(404, "No catalogs were deleted");
    }

    return sendSuccessResponse(
      200,
      `${result.deletedCount} catalogs deleted successfully`
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
