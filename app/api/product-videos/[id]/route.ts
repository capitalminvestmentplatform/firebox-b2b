import { connectToDatabase } from "@/lib/db";
import ProductVideo from "@/models/ProductVideo";
import { sendErrorResponse, sendSuccessResponse } from "@/utils/apiResponse";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const deleted = await ProductVideo.findByIdAndDelete(id);

    if (!deleted) {
      return sendErrorResponse(404, "Video not found");
    }

    return sendSuccessResponse(200, "Video deleted successfully");
  } catch (error) {
    return sendErrorResponse(500, "Internal server error", error);
  }
}
