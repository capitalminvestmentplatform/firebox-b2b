import mongoose, { Schema, Document, models } from "mongoose";

const ProductCertificateSchema = new Schema(
  {
    url: { type: String, required: true },
    pId: { type: Schema.Types.ObjectId, ref: "Product" },
  },
  { timestamps: true }
);

const ProductCertificate =
  models.ProductCertificate ||
  mongoose.model("ProductCertificate", ProductCertificateSchema);

export default ProductCertificate;
