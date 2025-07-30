import { connectToDatabase } from "@/lib/db";
import ProductCatalog from "@/models/ProductCatalog";
import { sendErrorResponse, sendSuccessResponse } from "@/utils/apiResponse";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const deleted = await ProductCatalog.findByIdAndDelete(id);

    if (!deleted) {
      return sendErrorResponse(404, "Catalog not found");
    }

    return sendSuccessResponse(200, "Catalog deleted successfully");
  } catch (error) {
    return sendErrorResponse(500, "Internal server error", error);
  }
}
