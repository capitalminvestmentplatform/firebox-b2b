import mongoose, { Schema, Document, models } from "mongoose";

const DownloadLogSchema = new Schema(
  {
    pId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    uId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    mediaId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "mediaType", // 🔑 dynamically resolve model
    },

    mediaType: {
      type: String,
      required: true,
      enum: [
        "ProductImage",
        "ProductVideo",
        "ProductDocument",
        "ProductCatalog",
        "ProductManual",
        "ProductCertificate",
      ], // 🔒 limit to specific model names
    },
  },
  { timestamps: true }
);

const DownloadLog =
  models.DownloadLog || mongoose.model("DownloadLog", DownloadLogSchema);

export default DownloadLog;
