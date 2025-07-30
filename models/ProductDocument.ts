import mongoose, { Schema, Document, models } from "mongoose";

const ProductDocumentSchema = new Schema(
  {
    url: { type: String, required: true },
    pId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  },
  { timestamps: true }
);

const ProductDocument =
  models.ProductDocument ||
  mongoose.model("ProductDocument", ProductDocumentSchema);

export default ProductDocument;
