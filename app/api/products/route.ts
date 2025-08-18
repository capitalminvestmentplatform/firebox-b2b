import { connectToDatabase } from "@/lib/db";
import Product from "@/models/Product";
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

    const products = await Product.find().sort({ order: 1 }).lean();

    return sendSuccessResponse(200, "Products fetched successfully!", products);
  } catch (error) {
    return sendErrorResponse(500, "Internal server error", error);
  }
}
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();

    const { name } = body;

    // 5. Create product
    const newProduct = new Product({
      name,
    });

    await newProduct.save();

    return sendSuccessResponse(201, "Product added successfully!", newProduct);
  } catch (error) {
    return sendErrorResponse(500, "Internal server error", error);
  }
}
