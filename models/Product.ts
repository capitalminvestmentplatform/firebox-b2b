import mongoose, { Schema, Document, models } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String },
  },

  { timestamps: true }
);

const Product = models.Product || mongoose.model("Product", ProductSchema);

export default Product;
