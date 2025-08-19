// app/api/recent-products/route.ts
import { sendErrorResponse, sendSuccessResponse } from "@/utils/apiResponse";

export async function GET() {
  try {
    const endpoints = [
      "product-images",
      "product-videos",
      "product-documents",
      "product-manuals",
      "product-certificates",
      "product-catalogs",
    ];

    // Fetch all endpoints in parallel
    const responses = await Promise.all(
      endpoints.map((endpoint) =>
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/${endpoint}`)
      )
    );

    // Convert all to JSON
    const results = await Promise.all(responses.map((res) => res.json()));

    // Extract top 5 from each by createdAt (descending)
    const getTop5Recent = (items: any[]) =>
      items
        ?.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 5);

    const combined = {
      images: getTop5Recent(results[0].data),
      videos: getTop5Recent(results[1].data),
      documents: getTop5Recent(results[2].data),
      manuals: getTop5Recent(results[3].data),
      certificates: getTop5Recent(results[4].data),
      catalogs: getTop5Recent(results[5].data),
    };

    return sendSuccessResponse(
      200,
      "Recent products fetched successfully",
      combined
    );
  } catch (error) {
    return sendErrorResponse(500, "Internal server error", error);
  }
}
