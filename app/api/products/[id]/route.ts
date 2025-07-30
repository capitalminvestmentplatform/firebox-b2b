import { connectToDatabase } from "@/lib/db";
import Product from "@/models/Product";
import { sendErrorResponse, sendSuccessResponse } from "@/utils/apiResponse";

import { NextRequest } from "next/server";

// Accepts productId from the route like: /api/products/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const product = await Product.findById(id).lean(); // Important to get plain object

    if (!product) {
      return sendErrorResponse(404, "Product not found");
    }

    return sendSuccessResponse(200, "Product fetched successfully", product);
  } catch (error) {
    return sendErrorResponse(500, "Internal server error", error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return sendErrorResponse(404, "Product not found");
    }

    return sendSuccessResponse(200, "product deleted successfully");
  } catch (error) {
    return sendErrorResponse(500, "Internal server error", error);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { id } = await params;

    let product = await Product.findById(id);
    if (!product) {
      return sendErrorResponse(404, "Product not found");
    }

    // Destructure and clean input
    const { name } = body;

    // Prepare updated payload
    const updatedData = {
      name,
    };

    await Product.findByIdAndUpdate(id, updatedData, { new: true });

    return sendSuccessResponse(200, "Product updated successfully");
  } catch (error) {
    return sendErrorResponse(500, "Internal server error", error);
  }
}
