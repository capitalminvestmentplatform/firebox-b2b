"use client";

import React, { useEffect, useState } from "react";
import { ProductDropdown } from "@/app/components/ProductDropdown";
import { getLoggedInUser, uploadFileToCloudinary } from "@/utils/client";
import { toast } from "sonner";
import { useProductDropdown } from "@/hooks/useProductDropdown";
import DocsView from "@/app/components/DocsView";
import { OtherDocsUpload } from "@/app/components/investments/OtherDocsUpload";

const ProductCatalogsPage = () => {
  const userRole = getLoggedInUser()?.role;
  const { selectedProduct, setSelectedProduct, options, isLoading, error } =
    useProductDropdown();

  const [catalog, setCatalog] = useState<File | string | null>(null); // ⬅️ single catalog
  const [productCatalogs, setProductCatalogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);

  useEffect(() => {
    fetchProductCatalogs();
  }, []);

  const fetchProductCatalogs = async () => {
    try {
      const res = await fetch(`/api/product-catalogs`);
      const response = await res.json();

      if (response.statusCode !== 200) {
        toast.error(response.message);
        throw new Error(response.message);
      }

      setProductCatalogs(response.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedProduct) {
      toast.error("Please select a product");
      return;
    }

    if (!catalog) {
      toast.error("Please upload a catalog");
      return;
    }

    setButtonLoading(true);

    const uploadedUrl =
      typeof catalog === "string"
        ? catalog
        : await uploadFileToCloudinary(catalog, "product/catalogs");

    const res = await fetch("/api/product-catalogs", {
      method: "POST",
      body: JSON.stringify({
        pId: selectedProduct,
        url: uploadedUrl,
      }),
    });

    const response = await res.json();

    if (response.statusCode !== 201) {
      toast.error(response.message);
      throw new Error(response.message);
    }

    setButtonLoading(false);
    setCatalog(null);
    setSelectedProduct("");
    fetchProductCatalogs();
    toast.success(response.message);
  };

  return (
    <div className="space-y-6">
      {isLoading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <ProductDropdown
            label="Product"
            selected={selectedProduct}
            onChange={setSelectedProduct}
            options={options}
          />

          {userRole === "Admin" && (
            <>
              <OtherDocsUpload
                docs={catalog ? [catalog] : []}
                setDocs={(docs) => setCatalog(docs[0] ?? null)}
                type="catalog"
              />

              <button
                onClick={handleSubmit}
                disabled={buttonLoading || !catalog}
                className={`bg-primaryBG hover:bg-primaryBG text-sm font-bold text-white py-2 px-4 rounded ${
                  buttonLoading || !catalog
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                Upload
              </button>
            </>
          )}

          <DocsView
            productDocs={productCatalogs}
            selectedProduct={selectedProduct}
            onDelete={() => {}}
            type="catalogs"
          />
        </>
      )}
    </div>
  );
};

export default ProductCatalogsPage;
