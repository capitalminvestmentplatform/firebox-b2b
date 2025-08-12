"use client";

import React, { useEffect, useState } from "react";
import { ProductDropdown } from "@/app/components/ProductDropdown";
import { getLoggedInUser, uploadFileToCloudinary } from "@/utils/client";
import { toast } from "sonner";
import { useProductDropdown } from "@/hooks/useProductDropdown";
import VideosView from "@/app/components/VideosView";
import { VideosUpload } from "@/app/components/investments/VideoUpload";
import GalleryView from "@/app/components/GalleryView";

const ProductVideosPage = () => {
  const userRole = getLoggedInUser()?.role;
  const { selectedProduct, setSelectedProduct, options, isLoading, error } =
    useProductDropdown();
  const [video, setVideo] = useState<(File | string)[]>([]); // 🔹 single video
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

    if (typeof video[0] !== "string" && video[0]?.size > 25 * 1024 * 1024) {
      toast.error("File size should not exceed 5 MB");
      return;
    }

    setButtonLoading(true);

    let uploadedUrl: string | null = null;
    if (typeof video === "string") {
      uploadedUrl = video;
    } else if (Array.isArray(video) && video[0] instanceof File) {
      uploadedUrl = await uploadFileToCloudinary(video[0], "videos");
    } else if (video instanceof File) {
      uploadedUrl = await uploadFileToCloudinary(video, "videos");
    } else {
      toast.error("Invalid video file");
      setButtonLoading(false);
      return;
    }

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
    setVideo([]);
    setSelectedProduct("");
    fetchProductVideos();
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
            productItems={productVideos}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            fetchProductItems={fetchProductVideos}
            type="videos"
          />

          {userRole === "Admin" && selectedProduct && (
            <>
              <VideosUpload
                videos={video}
                setVideos={(videos) => setVideo(videos)} // 🔹 single video
              />
              <div className="flex gap-5">
                <button
                  onClick={() => {
                    setVideo([]);
                    setSelectedProduct("");
                  }}
                  className={`bg-white hover:bg-white text-xs font-bold text-primaryColor py-2 px-4`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={buttonLoading || !video}
                  className={`bg-secondaryColor hover:bg-secondaryColor text-xs font-bold text-textColor py-2 px-4 ${
                    buttonLoading || !video
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  Save
                </button>
                <p className="text-sm">
                  (Max file size <span className="font-extrabold">25 MB</span>)
                </p>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ProductVideosPage;
