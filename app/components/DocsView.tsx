"use client";

import React, { useState } from "react";
import { FaTrash, FaDownload, FaFileAlt } from "react-icons/fa";
import { getLoggedInUser } from "@/utils/client";

const DocsView = ({
  productDocs,
  onDelete,
  selectedProduct,
  type = "documents",
}: {
  productDocs: any[];
  onDelete?: (index: number) => void;
  selectedProduct: string;
  type: string;
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
        body: JSON.stringify({ mediaId, uId, type }),
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
    <>
      <div className="grid grid-cols-3 gap-4">
        {productDocs && productDocs.length > 0 ? (
          productDocs
            .filter((doc) => !selectedProduct || doc.pId === selectedProduct)
            .map((doc: any, index: number) => (
              <div
                key={index}
                className="relative flex items-center justify-between bg-gray-100 rounded p-3 group"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <FaFileAlt className="text-blue-600" />
                  <span className="truncate text-sm">
                    {doc.url.split("/").pop() || `Document ${index + 1}`}
                  </span>
                </div>

                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {userRole === "Admin" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.(index);
                      }}
                      className="p-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                    >
                      <FaTrash />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(doc.url, doc._id);
                    }}
                    className="bg-primaryBG hover:bg-primaryBG text-sm font-bold text-white p-1 rounded"
                  >
                    <FaDownload />
                  </button>
                </div>
              </div>
            ))
        ) : (
          <p>No product docs found.</p>
        )}
      </div>
    </>
  );
};

export default DocsView;
