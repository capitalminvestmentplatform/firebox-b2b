"use client";

import React, { Fragment, useState } from "react";
import { getLoggedInUser } from "@/utils/client";
import { toast } from "sonner";
import ProductCard from "./ProductCard";
import MediaGallery from "./MediaGallery";
import MediaPreviewDialog from "./modals/MediaPreviewModal";

const GalleryView = ({
  products,
  productItems,
  setSelectedProduct,
  fetchProductItems,
  type,
}: {
  products: any[];
  productItems: any[];
  onDelete?: (index: number) => void;
  selectedProduct: string;
  setSelectedProduct: (productId: string) => void;
  fetchProductItems: () => void;
  type: string;
}) => {
  const [gallery, setGallery] = useState<any[]>([]);
  const [deletedItems, setDeletedItems] = useState<string[]>([]);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const uId = getLoggedInUser()?.id;
  const userRole = getLoggedInUser()?.role;

  const handleDownload = async (imageUrl: string, mediaId: string) => {
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
        link.href = imageUrl;
        link.target = "_blank";
        link.download = imageUrl.split("/").pop() || "download";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, 2000);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  const groupedItems = productItems?.reduce(
    (acc, image) => {
      if (!acc[image.pId]) acc[image.pId] = [];
      acc[image.pId].push(image);
      return acc;
    },
    {} as Record<string, typeof productItems>
  );

  const handleDeleteItems = async () => {
    if (deletedItems.length === 0) return;
    setButtonLoading(true);
    try {
      const query = new URLSearchParams({
        items: deletedItems.join(","),
      }).toString();
      const res = await fetch(`/api/product-${type}?${query}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await res.json();
      if (response.statusCode !== 200) {
        throw new Error(response.message);
      }
      toast.success(response.message);
      fetchProductItems();
      setDeletedItems([]);
      setGallery([]);
    } catch (error) {
      console.error("Error deleting items:", error);
    } finally {
      setButtonLoading(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-4 mb-20">
        {products.map((product) => {
          const items = groupedItems[product._id] || [];

          return (
            <ProductCard
              key={product._id}
              product={product}
              items={items}
              userRole={userRole || ""}
              onViewGallery={() => {
                setGallery(items);
                setCurrentIndex(0);
                setOpen(true);
              }}
              onAddItem={() => {
                setGallery([]);
                setSelectedProduct(product._id);
              }}
              onEditItems={() => {
                setGallery(items);
                setSelectedProduct("");
              }}
            />
          );
        })}
      </div>
      <MediaGallery
        items={gallery}
        deletedItems={deletedItems}
        setDeletedItems={setDeletedItems}
        userRole={userRole || ""}
        onPreview={(index) => {
          setCurrentIndex(index);
          setOpen(true);
        }}
        onDeleteConfirm={handleDeleteItems}
        onCancel={() => {
          setDeletedItems([]);
          setGallery([]);
        }}
        buttonLoading={buttonLoading}
      />
      {/* Dialog Lightbox */}
      <MediaPreviewDialog
        open={open}
        setOpen={setOpen}
        items={gallery}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        onDownload={handleDownload}
      />
    </>
  );
};

export default GalleryView;
