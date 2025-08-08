"use client";

import React from "react";
import { FaTrash, FaDownload } from "react-icons/fa";
import { getLoggedInUser } from "@/utils/client";

const VideosView = ({
  productVideos,
  onDelete,
  selectedProduct,
}: {
  productVideos: any[];
  onDelete?: (index: number) => void;
  selectedProduct: string;
}) => {
  const uId = getLoggedInUser()?.id;
  const userRole = getLoggedInUser()?.role;

  const handleDownload = async (mediaUrl: string, mediaId: string) => {
    try {
      await fetch("/api/download-logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mediaId, uId, type: "videos" }),
      });

      // Trigger file download manually
      setTimeout(() => {
        const link = document.createElement("a");
        link.href = mediaUrl;
        link.target = "_blank";
        link.download = mediaUrl.split("/").pop() || "download";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, 2000);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {productVideos && productVideos.length > 0 ? (
        productVideos
          .filter((video) => !selectedProduct || video.pId === selectedProduct)
          .map((video: any, index: number) => (
            <div
              key={index}
              className="relative group border border-gray-300 overflow-hidden"
            >
              <video
                src={video.url}
                controls
                className="w-full h-48 object-cover"
              />

              <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {userRole === "Admin" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete?.(index);
                    }}
                    className="p-1 bg-red-500 text-white text-xs hover:bg-red-600"
                  >
                    <FaTrash />
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(video.url, video._id);
                  }}
                  className="bg-primaryBG hover:bg-primaryBG text-sm font-bold text-white p-1"
                >
                  <FaDownload />
                </button>
              </div>
            </div>
          ))
      ) : (
        <p>No product videos found.</p>
      )}
    </div>
  );
};

export default VideosView;
