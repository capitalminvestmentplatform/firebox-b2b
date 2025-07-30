import mongoose, { Schema, Document, models } from "mongoose";

const ProductImageSchema = new Schema(
  {
    url: { type: String },
    pId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  },
  { timestamps: true }
);

const ProductImage =
  models.ProductImage || mongoose.model("ProductImage", ProductImageSchema);

export default ProductImage;
