"use client";

import React, { useEffect, useState } from "react";
import { ProductDropdown } from "@/app/components/ProductDropdown";
import { getLoggedInUser, uploadFileToCloudinary } from "@/utils/client";
import { toast } from "sonner";
import { useProductDropdown } from "@/hooks/useProductDropdown";
import DocsView from "@/app/components/DocsView";
import { OtherDocsUpload } from "@/app/components/investments/OtherDocsUpload";

const ProductCertificatesPage = () => {
  const userRole = getLoggedInUser()?.role;
  const { selectedProduct, setSelectedProduct, options, isLoading, error } =
    useProductDropdown();

  const [certificate, setCertificate] = useState<File | string | null>(null); // ⬅️ single catalog
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

    setButtonLoading(true);

    const uploadedUrl =
      typeof certificate === "string"
        ? certificate
        : await uploadFileToCloudinary(certificate, "product/certificates");

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
    setCertificate(null);
    setSelectedProduct("");
    fetchProductCertificates();
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
                docs={certificate ? [certificate] : []}
                setDocs={(docs) => setCertificate(docs[0] ?? null)}
                type="certificate"
              />

              <button
                onClick={handleSubmit}
                disabled={buttonLoading || !certificate}
                className={`bg-primaryBG hover:bg-primaryBG text-sm font-bold text-white py-2 px-4 rounded ${
                  buttonLoading || !certificate
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                Upload
              </button>
            </>
          )}

          <DocsView
            productDocs={productCertificates}
            selectedProduct={selectedProduct}
            onDelete={() => {}}
            type="certificates"
          />
        </>
      )}
    </div>
  );
};

export default ProductCertificatesPage;
