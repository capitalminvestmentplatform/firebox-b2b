import { connectToDatabase } from "@/lib/db";
import Certificate from "@/models/ProductCertificate";
import { sendErrorResponse, sendSuccessResponse } from "@/utils/apiResponse";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const deleted = await Certificate.findByIdAndDelete(id);

    if (!deleted) {
      return sendErrorResponse(404, "Certificate not found");
    }

    return sendSuccessResponse(200, "Certificate deleted successfully");
  } catch (error) {
    return sendErrorResponse(500, "Internal server error", error);
  }
}
