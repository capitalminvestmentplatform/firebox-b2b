"use client";

import React, { useEffect, useState } from "react";
import { ProductDropdown } from "@/app/components/ProductDropdown";
import { getLoggedInUser, uploadFileToCloudinary } from "@/utils/client";
import { toast } from "sonner";
import { useProductDropdown } from "@/hooks/useProductDropdown";
import VideosView from "@/app/components/VideosView";
import { VideosUpload } from "@/app/components/investments/VideoUpload";

const ProductVideosPage = () => {
  const userRole = getLoggedInUser()?.role;
  const { selectedProduct, setSelectedProduct, options, isLoading, error } =
    useProductDropdown();
  const [video, setVideo] = useState<File | string | null>(null); // 🔹 single video
  const [productVideos, setProductVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);

  useEffect(() => {
    fetchProductVideos();
  }, []);

  const fetchProductVideos = async () => {
    try {
      const res = await fetch(`/api/product-videos`);
      const response = await res.json();

      if (response.statusCode !== 200) {
        toast.error(response.message);
        throw new Error(response.message);
      }

      setProductVideos(response.data);
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

    if (!video) {
      toast.error("Please upload a video");
      return;
    }

    setButtonLoading(true);

    const uploadedUrl =
      typeof video === "string"
        ? video
        : await uploadFileToCloudinary(video, "product/videos");

    const res = await fetch("/api/product-videos", {
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
    setVideo(null);
    setSelectedProduct("");
    fetchProductVideos();
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
              <VideosUpload
                videos={video ? [video] : []}
                setVideos={(videos) => setVideo(videos[0] ?? null)} // 🔹 single video
              />

              <button
                onClick={handleSubmit}
                disabled={buttonLoading || !video}
                className={`bg-primaryBG hover:bg-primaryBG text-sm font-bold text-white py-2 px-4 rounded ${
                  buttonLoading || !video ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Upload
              </button>
            </>
          )}

          <VideosView
            productVideos={productVideos}
            selectedProduct={selectedProduct}
            onDelete={() => {}}
          />
        </>
      )}
    </div>
  );
};

export default ProductVideosPage;
