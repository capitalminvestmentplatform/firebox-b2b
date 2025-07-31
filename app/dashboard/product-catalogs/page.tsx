"use client";

import React, { useEffect, useState } from "react";
import { ProductDropdown } from "@/app/components/ProductDropdown";
import { getLoggedInUser, uploadFileToCloudinary } from "@/utils/client";
import { toast } from "sonner";
import { useProductDropdown } from "@/hooks/useProductDropdown";
import DocsView from "@/app/components/DocsView";
import { OtherDocsUpload } from "@/app/components/investments/OtherDocsUpload";
import GalleryView from "@/app/components/GalleryView";

const ProductCatalogsPage = () => {
  const userRole = getLoggedInUser()?.role;
  const { selectedProduct, setSelectedProduct, options, isLoading, error } =
    useProductDropdown();

  const [catalog, setCatalog] = useState<(File | string)[]>([]); // ⬅️ single catalog
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
        : await uploadFileToCloudinary(catalog[0] as File, "product/catalogs");

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
    setCatalog([]);
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
          <GalleryView
            products={options}
            productItems={productCatalogs}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            fetchProductItems={fetchProductCatalogs}
            type="catalogs"
          />
          {userRole === "Admin" && selectedProduct && (
            <>
              <OtherDocsUpload
                docs={catalog}
                setDocs={(docs) => setCatalog(docs)}
                type="catalog"
              />

              <div className="flex gap-5">
                <button
                  onClick={() => {
                    setCatalog([]);
                    setSelectedProduct("");
                  }}
                  className={`bg-white hover:bg-white text-xs font-bold text-primaryColor py-2 px-4 rounded`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={buttonLoading || catalog.length === 0}
                  className={`bg-secondaryColor hover:bg-secondaryColor text-xs font-bold text-textColor py-2 px-4 rounded ${
                    buttonLoading || catalog.length === 0
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  Save
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ProductCatalogsPage;
