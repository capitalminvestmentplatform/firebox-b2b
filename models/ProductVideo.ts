import mongoose, { Schema, Document, models } from "mongoose";

const ProductVideoSchema = new Schema(
  {
    url: { type: String, required: true },
    pId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  },
  { timestamps: true }
);

const ProductVideo =
  models.ProductVideo || mongoose.model("ProductVideo", ProductVideoSchema);

export default ProductVideo;
