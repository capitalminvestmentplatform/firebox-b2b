"use client";

import React, { useEffect, useState } from "react";
import { ProductDropdown } from "@/app/components/ProductDropdown";
import { getLoggedInUser, uploadFileToCloudinary } from "@/utils/client";
import { toast } from "sonner";
import { useProductDropdown } from "@/hooks/useProductDropdown";
import DocsView from "@/app/components/DocsView";
import { OtherDocsUpload } from "@/app/components/investments/OtherDocsUpload";
import GalleryView from "@/app/components/GalleryView";

const ProductCertificatesPage = () => {
  const userRole = getLoggedInUser()?.role;
  const { selectedProduct, setSelectedProduct, options, isLoading, error } =
    useProductDropdown();

  const [certificate, setCertificate] = useState<(File | string)[]>([]); // ⬅️ single catalog
  const [productCertificates, setProductCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);

  useEffect(() => {
    fetchProductCertificates();
  }, []);

  const fetchProductCertificates = async () => {
    try {
      const res = await fetch(`/api/product-certificates`);
      const response = await res.json();

      if (response.statusCode !== 200) {
        toast.error(response.message);
        throw new Error(response.message);
      }

      setProductCertificates(response.data);
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

    if (!certificate) {
      toast.error("Please upload a certificate");
      return;
    }

    if (
      typeof certificate[0] !== "string" &&
      certificate[0]?.size > 5 * 1024 * 1024
    ) {
      toast.error("File size should not exceed 5 MB");
      return;
    }
    setButtonLoading(true);

    const uploadedUrl =
      typeof certificate === "string"
        ? certificate
        : await uploadFileToCloudinary(certificate[0] as File, "certificates");

    const res = await fetch("/api/product-certificates", {
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
    setCertificate([]);
    setSelectedProduct("");
    fetchProductCertificates();
    toast.success(response.message);
  };

  return (
    <div className="space-y-6">
      {isLoading ? (
        <p className="font-body">Loading products...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <GalleryView
            products={options}
            productItems={productCertificates}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            fetchProductItems={fetchProductCertificates}
            type="certificates"
          />

          {userRole === "Admin" && selectedProduct && (
            <>
              <OtherDocsUpload
                docs={certificate}
                setDocs={(docs) => setCertificate(docs)}
                type="certificate"
              />

              <div className="flex gap-5">
                <button
                  onClick={() => {
                    setCertificate([]);
                    setSelectedProduct("");
                  }}
                  className={`bg-white hover:bg-white text-xs font-bold text-primaryColor py-2 px-4`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={buttonLoading || certificate.length === 0}
                  className={`bg-secondaryColor hover:bg-secondaryColor text-xs font-bold text-textColor py-2 px-4 ${
                    buttonLoading || certificate.length === 0
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

export default ProductCertificatesPage;
