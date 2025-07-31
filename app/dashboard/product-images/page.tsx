"use client";
import React, { useEffect, useState } from "react";
import { GalleryImagesUpload } from "@/app/components/investments/GalleryImagesUpload";
import { getLoggedInUser, uploadFileToCloudinary } from "@/utils/client";
import { toast } from "sonner";
import { useProductDropdown } from "@/hooks/useProductDropdown";
import GalleryView from "@/app/components/GalleryView";

const ProductImagesPage = () => {
  const userRole = getLoggedInUser()?.role;
  const { selectedProduct, setSelectedProduct, options, isLoading, error } =
    useProductDropdown();
  const [images, setImages] = useState<(File | string)[]>([]);
  const [productImages, setProductImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);

  useEffect(() => {
    fetchProductImages();
  }, []);

  const fetchProductImages = async () => {
    try {
      const res = await fetch(`/api/product-images`);
      const response = await res.json();

      if (response.statusCode !== 200) {
        toast.error(response.message);
        throw new Error(response.message);
      }

      setProductImages(response.data);
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
      url: [...images],
    };

    // ✅ Upload to Cloudinary
    if (Array.isArray(formattedData.url)) {
      const galleryUrls = await Promise.all(
        formattedData.url.map(async (file: any) =>
          (typeof window !== "undefined" && file instanceof window.File) ||
          (file && file.constructor && file.constructor.name === "File")
            ? await uploadFileToCloudinary(file, "product/images")
            : file
        )
      );
      formattedData.url = galleryUrls.filter(Boolean);
    }

    const res = await fetch("/api/product-images", {
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
    setImages([]);
    setSelectedProduct("");
    fetchProductImages();
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
            productItems={productImages}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            fetchProductItems={fetchProductImages}
            type="images"
          />

          {userRole === "Admin" && selectedProduct && (
            <>
              <GalleryImagesUpload images={images} setImages={setImages} />

              <div className="flex gap-5">
                <button
                  onClick={() => {
                    setImages([]);
                    setSelectedProduct("");
                  }}
                  className={`bg-white hover:bg-white text-xs font-bold text-primaryColor py-2 px-4 rounded`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={buttonLoading || images.length === 0}
                  className={`bg-secondaryColor hover:bg-secondaryColor text-xs font-bold text-textColor py-2 px-4 rounded ${
                    buttonLoading || images.length === 0
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

export default ProductImagesPage;
