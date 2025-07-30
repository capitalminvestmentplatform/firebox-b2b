// src/hooks/useProductDropdown.ts
import { useState, useEffect } from "react";

type ProductOption = {
  _id: string;
  name: string;
};

export function useProductDropdown(initialValue: string = "") {
  const [selectedProduct, setSelectedProduct] = useState(initialValue);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/products");

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const response = await res.json();

      if (response.statusCode !== 200) {
        throw new Error(response.message);
      }

      setProducts(response.data); // assuming data is an array of products
      setError(null);
    } catch (err) {
      const message = (err as Error).message;
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    selectedProduct,
    setSelectedProduct,
    options: products,
    isLoading,
    error,
  };
}
