import { connectToDatabase } from "@/lib/db";
import ProductManual from "@/models/ProductManual";
import { sendErrorResponse, sendSuccessResponse } from "@/utils/apiResponse";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const deleted = await ProductManual.findByIdAndDelete(id);

    if (!deleted) {
      return sendErrorResponse(404, "Manual not found");
    }

    return sendSuccessResponse(200, "Manual deleted successfully");
  } catch (error) {
    return sendErrorResponse(500, "Internal server error", error);
  }
}
