"use client";

import React, { useEffect, useState } from "react";
import { ProductDropdown } from "@/app/components/ProductDropdown";
import { getLoggedInUser, uploadFileToCloudinary } from "@/utils/client";
import { toast } from "sonner";
import { useProductDropdown } from "@/hooks/useProductDropdown";
import DocsView from "@/app/components/DocsView";
import { OtherDocsUpload } from "@/app/components/investments/OtherDocsUpload";
import GalleryView from "@/app/components/GalleryView";

const ProductManualsPage = () => {
  const userRole = getLoggedInUser()?.role;
  const { selectedProduct, setSelectedProduct, options, isLoading, error } =
    useProductDropdown();

  const [manual, setManual] = useState<(File | string)[]>([]); // ⬅️ single manual
  const [productManuals, setProductManuals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);

  useEffect(() => {
    fetchProductManuals();
  }, []);

  const fetchProductManuals = async () => {
    try {
      const res = await fetch(`/api/product-manuals`);
      const response = await res.json();

      if (response.statusCode !== 200) {
        toast.error(response.message);
        throw new Error(response.message);
      }

      setProductManuals(response.data);
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

    if (!manual) {
      toast.error("Please upload a manual");
      return;
    }

    if (typeof manual[0] !== "string" && manual[0]?.size > 5 * 1024 * 1024) {
      toast.error("File size should not exceed 5 MB");
      return;
    }

    setButtonLoading(true);

    const uploadedUrl =
      typeof manual[0] === "string"
        ? manual[0]
        : await uploadFileToCloudinary(manual[0] as File, "manuals");

    const res = await fetch("/api/product-manuals", {
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
    setManual([]);
    setSelectedProduct("");
    fetchProductManuals();
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
            productItems={productManuals}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            fetchProductItems={fetchProductManuals}
            type="manuals"
          />

          {userRole === "Admin" && selectedProduct && (
            <>
              <OtherDocsUpload
                docs={manual}
                setDocs={(docs) => setManual(docs)}
                type="manual"
              />

              <div className="flex gap-5">
                <button
                  onClick={() => {
                    setManual([]);
                    setSelectedProduct("");
                  }}
                  className={`bg-white hover:bg-white text-xs font-bold text-primaryColor py-2 px-4`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={buttonLoading || manual.length === 0}
                  className={`bg-secondaryColor hover:bg-secondaryColor text-xs font-bold text-textColor py-2 px-4 ${
                    buttonLoading || manual.length === 0
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  Save
                </button>
                <p className="text-sm">
                  (Max file size <span className="font-extrabold">5 MB</span>)
                </p>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ProductManualsPage;
