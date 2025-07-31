import { connectToDatabase } from "@/lib/db";
import DownloadLog from "@/models/DownloadLog";
import ProductImage from "@/models/ProductImage";
import ProductVideo from "@/models/ProductVideo";
import ProductDocument from "@/models/ProductDocument";
import ProductManual from "@/models/ProductManual";
import ProductCatalog from "@/models/ProductCatalog";
import { sendErrorResponse, sendSuccessResponse } from "@/utils/apiResponse";
import { NextRequest } from "next/server";
import mongoose from "mongoose";
import ProductCertificate from "@/models/ProductCertificate";

export const config = {
  api: {
    bodyParser: false,
  },
};

const mediaModelMap: Record<string, any> = {
  images: ProductImage,
  videos: ProductVideo,
  documents: ProductDocument,
  catalogs: ProductCatalog,
  manuals: ProductManual,
  certificates: ProductCertificate,
};

const mediaTypeMap: Record<string, string> = {
  images: "ProductImage",
  videos: "ProductVideo",
  documents: "ProductDocument",
  catalogs: "ProductCatalog",
  manuals: "ProductManual",
  certificates: "ProductCertificate",
};

const allMediaTypes = [
  "ProductImage",
  "ProductVideo",
  "ProductDocument",
  "ProductCatalog",
  "ProductManual",
  "ProductCertificate",
];

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const pId = searchParams.get("pId");
    const uId = searchParams.get("uId");

    const filter: Record<string, any> = {};

    const pIdParam = searchParams.get("pId");
    const uIdParam = searchParams.get("uId");

    if (pIdParam && mongoose.Types.ObjectId.isValid(pIdParam)) {
      filter.pId = new mongoose.Types.ObjectId(pIdParam);
    }
    if (uIdParam && mongoose.Types.ObjectId.isValid(uIdParam)) {
      filter.uId = new mongoose.Types.ObjectId(uIdParam);
    }

    // 1. Fetch filtered download logs
    const rawLogs = await DownloadLog.find(filter)
      .sort({ createdAt: -1 })
      .populate("pId", "name")
      .populate("uId", "firstName lastName role")
      .populate("mediaId", "url")
      .lean();

    const downloadLogs = rawLogs.map((log) => ({
      _id: log._id,
      productName: log.pId?.name || "-",
      userName: log.uId ? `${log.uId.firstName} ${log.uId.lastName}` : "-",
      uId: log.uId.role,
      mediaUrl: log.mediaId?.url || "-",
      mediaType: log.mediaType,
      createdAt: log.createdAt,
    }));
    // 2. Count by mediaType with same filter
    const countsByMediaType = await DownloadLog.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$mediaType",
          count: { $sum: 1 },
        },
      },
    ]);

    const defaultCounts: Record<string, number> = allMediaTypes.reduce(
      (acc, type) => {
        acc[type] = 0;
        return acc;
      },
      {} as Record<string, number>
    );

    const mediaTypeCounts = countsByMediaType.reduce(
      (acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      },
      { ...defaultCounts }
    ); // start with all types at 0

    return sendSuccessResponse(200, "Download logs fetched successfully!", {
      logs: downloadLogs,
      mediaTypeCounts,
    });
  } catch (error) {
    return sendErrorResponse(500, "Internal server error", error);
  }
}
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { mediaId, uId, type } = body;

    const Model = mediaModelMap[type];
    const mediaType = mediaTypeMap[type];

    if (!Model || !mediaType) {
      return sendErrorResponse(400, "Invalid media type provided");
    }
    console.log("mediaId", mediaId, "uId", uId, "type", type);
    const media = await Model.findById(mediaId);

    if (!media) {
      return sendErrorResponse(404, "Media not found");
    }

    const newDownloadLog = new DownloadLog({
      pId: media.pId,
      uId,
      mediaId,
      mediaType, // 🔑 required for refPath
    });

    await newDownloadLog.save();

    return sendSuccessResponse(
      201,
      "Download log added successfully!",
      newDownloadLog
    );
  } catch (error) {
    return sendErrorResponse(500, "Internal server error", error);
  }
}
