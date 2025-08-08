"use client";

import React, { useEffect, useState } from "react";
import { ProductDropdown } from "@/app/components/ProductDropdown";
import { getLoggedInUser, uploadFileToCloudinary } from "@/utils/client";
import { toast } from "sonner";
import { useProductDropdown } from "@/hooks/useProductDropdown";
import DocsView from "@/app/components/DocsView";
import { DocumentsUpload } from "@/app/components/investments/DocumentsUpload";
import GalleryView from "@/app/components/GalleryView";

const ProductDocumentsPage = () => {
  const userRole = getLoggedInUser()?.role;
  const { selectedProduct, setSelectedProduct, options, isLoading, error } =
    useProductDropdown();
  const [docs, setDocs] = useState<(File | string)[]>([]);
  const [productDocuments, setProductDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);

  useEffect(() => {
    fetchProductDocuments();
  }, []);

  const fetchProductDocuments = async () => {
    try {
      const res = await fetch(`/api/product-documents`);
      const response = await res.json();

      if (response.statusCode !== 200) {
        toast.error(response.message);
        throw new Error(response.message);
      }

      setProductDocuments(response.data);
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

    setButtonLoading(true);

    const formattedData = {
      pId: selectedProduct,
      url: [...docs],
    };

    // ✅ Upload to Cloudinary
    if (Array.isArray(formattedData.url)) {
      const galleryUrls = await Promise.all(
        formattedData.url.map(async (file: any) =>
          (typeof window !== "undefined" && file instanceof window.File) ||
          (file && file.constructor && file.constructor.name === "File")
            ? await uploadFileToCloudinary(file, "product/docs")
            : file
        )
      );
      formattedData.url = galleryUrls.filter(Boolean);
    }

    const res = await fetch("/api/product-documents", {
      method: "POST",
      body: JSON.stringify({
        ...formattedData,
      }),
    }); // Now send formattedData to your backend

    const response = await res.json();

    if (response.statusCode !== 201) {
      toast.error(response.message);
      throw new Error(response.message);
    }
    setButtonLoading(false);
    setDocs([]);
    setSelectedProduct("");
    fetchProductDocuments();
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
            productItems={productDocuments}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            fetchProductItems={fetchProductDocuments}
            type="documents"
          />

          {userRole === "Admin" && selectedProduct && (
            <>
              <DocumentsUpload docs={docs} setDocs={setDocs} />

              <div className="flex gap-5">
                <button
                  onClick={() => {
                    setDocs([]);
                    setSelectedProduct("");
                  }}
                  className={`bg-white hover:bg-white text-xs font-bold text-primaryColor py-2 px-4`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={buttonLoading || docs.length === 0}
                  className={`bg-secondaryColor hover:bg-secondaryColor text-xs font-bold text-textColor py-2 px-4 ${
                    buttonLoading || docs.length === 0
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

export default ProductDocumentsPage;
