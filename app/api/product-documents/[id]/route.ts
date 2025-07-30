import { connectToDatabase } from "@/lib/db";
import ProductDocument from "@/models/ProductDocument";
import { sendErrorResponse, sendSuccessResponse } from "@/utils/apiResponse";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const deleted = await ProductDocument.findByIdAndDelete(id);

    if (!deleted) {
      return sendErrorResponse(404, "Document not found");
    }

    return sendSuccessResponse(200, "Document deleted successfully");
  } catch (error) {
    return sendErrorResponse(500, "Internal server error", error);
  }
}
