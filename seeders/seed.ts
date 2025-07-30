import { connectToDatabase } from "../lib/db";
import Product from "../models/Product"; // Make sure this model exists and is correct
import { products } from "@/data/products"; // Assuming products are exported from here

async function seed() {
  try {
    await connectToDatabase();

    // Clear existing products
    await Product.deleteMany({});

    // Prepare product documents
    const productDocs = products.map((name) => ({ name }));

    // Insert products
    await Product.insertMany(productDocs);

    console.log("Products seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seed();
