import mongoose, { Schema, Document, models } from "mongoose";

const ProductManualSchema = new Schema(
  {
    url: { type: String, required: true },
    pId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    isArabic: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ProductManual =
  models.ProductManual || mongoose.model("ProductManual", ProductManualSchema);

export default ProductManual;
