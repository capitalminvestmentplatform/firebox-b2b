import mongoose, { Schema, Document, models } from "mongoose";

const ProductCatalogSchema = new Schema(
  {
    url: { type: String, required: true },
    pId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  },
  { timestamps: true }
);

const ProductCatalog =
  models.ProductCatalog ||
  mongoose.model("ProductCatalog", ProductCatalogSchema);

export default ProductCatalog;
