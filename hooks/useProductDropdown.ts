// src/hooks/useProductDropdown.ts
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

type ProductOption = {
  _id: string;
  name: string;
};

export function useProductDropdown(initialValue: string = "") {
  const pathname = usePathname();

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
      const isCatalogsPage = pathname
        .toLowerCase()
        .includes("product-catalogue");

      const productsToSet = isCatalogsPage
        ? response.data
        : response.data.filter(
            (p: any) => (p?.name || "").toLowerCase() !== "full catalogue"
          );

      setProducts(productsToSet);
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
