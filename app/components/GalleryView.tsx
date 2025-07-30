"use client";

import React, { Fragment, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  FaTrash,
  FaDownload,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaPlus,
  FaEdit,
} from "react-icons/fa";
import { getLoggedInUser } from "@/utils/client";
import Image from "next/image";
import { toast } from "sonner";

const GalleryView = ({
  products,
  productImages,
  onDelete,
  selectedProduct,
  setSelectedProduct,
  fetchProductImages,
}: {
  products: any[];
  productImages: any[];
  onDelete?: (index: number) => void;
  selectedProduct: string;
  setSelectedProduct: (productId: string) => void;
  fetchProductImages: () => void;
}) => {
  const [gallery, setGallery] = useState<any[]>([]);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);
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
        body: JSON.stringify({ mediaId, uId, type: "images" }),
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

  const next = () => setCurrentIndex((prev) => (prev + 1) % gallery.length);
  const prev = () =>
    setCurrentIndex((prev) => (prev - 1 + gallery.length) % gallery.length);

  const groupedImages = productImages.reduce(
    (acc, image) => {
      if (!acc[image.pId]) acc[image.pId] = [];
      acc[image.pId].push(image);
      return acc;
    },
    {} as Record<string, typeof productImages>
  );

  const handleDeleteImages = async () => {
    if (deletedImages.length === 0) return;
    setButtonLoading(true);
    try {
      const query = new URLSearchParams({
        images: deletedImages.join(","),
      }).toString();
      const res = await fetch(`/api/product-images?${query}`, {
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
      fetchProductImages();
      setDeletedImages([]);
      setGallery([]);
    } catch (error) {
      console.error("Error deleting images:", error);
    } finally {
      setButtonLoading(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-4 mb-20">
        {products.map((product) => {
          const images = groupedImages[product._id] || [];

          return (
            <Fragment>
              <div
                className="relative group cursor-pointer rounded overflow-hidden shadow-lg p-5"
                onClick={() => {
                  setGallery(images);
                  setCurrentIndex(0);
                  setOpen(true);
                }}
              >
                <Image
                  src={product?.image}
                  alt={product?.name || "Product Image"}
                  width={500}
                  height={288}
                  className="w-full h-72 object-cover object-center transition-transform duration-300 group-hover:scale-105 rounded"
                />

                {/* Overlay with product name and image count */}
                <div className="absolute inset-0 bg-primaryColor_1 bg-opacity-60 flex flex-col justify-between p-3">
                  <h3 className="text-white font-semibold text-lg">
                    {product?.name}
                  </h3>
                  <span className="text-white text-xs self-start bg-secondaryColor py-1 px-2 font-bold">
                    {images.length} images
                  </span>
                </div>

                {/* Hover Action Buttons */}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setGallery([]);
                      setSelectedProduct(product._id);
                      // Add image handler
                    }}
                    className="p-1 shadow bg-secondaryColor"
                    title="Add Image"
                  >
                    <FaPlus size={15} className="text-white" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setGallery(images);
                      setSelectedProduct("");
                    }}
                    className="p-1 shadow bg-secondaryColor"
                    title="Edit"
                  >
                    <FaEdit size={15} className="text-white" />
                  </button>
                </div>
              </div>
            </Fragment>
          );
        })}
      </div>
      {gallery.length > 0 ? (
        <Fragment>
          <div className="flex gap-4">
            {gallery?.map((img: string, index: number) => (
              <div
                key={index}
                className={`relative group border-2 ${
                  deletedImages.includes(img._id)
                    ? "border-red-600 opacity-50"
                    : "border-transparent"
                }`}
              >
                <img
                  src={img?.url}
                  alt={`Image ${index + 1}`}
                  className="w-32 h-20 object-cover cursor-pointer"
                  onClick={() => {
                    setOpen(true);
                    setCurrentIndex(index);
                  }}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeletedImages(
                      (prev) =>
                        prev.includes(img._id)
                          ? prev.filter((_id) => _id !== img._id) // remove from deleted
                          : [...prev, img._id] // add to deleted
                    );
                  }}
                  className="absolute top-1 right-1 p-1 bg-red-600 text-white shadow-md"
                  title="Delete Image"
                >
                  <FaTrash size={10} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-5">
            <button
              onClick={() => {
                setDeletedImages([]);
              }}
              className={`bg-white hover:bg-white text-sm font-bold text-primaryColor py-2 px-4 rounded`}
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteImages}
              disabled={buttonLoading || deletedImages.length === 0}
              className={`bg-secondaryColor hover:bg-secondaryColor text-sm font-bold text-textColor py-2 px-4 rounded ${
                buttonLoading || deletedImages.length === 0
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              Confirm
            </button>
          </div>
        </Fragment>
      ) : null}
      {/* Dialog Lightbox */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {/* Hidden trigger (open handled programmatically) */}
          <button className="hidden">Open</button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl bg-black p-0 rounded-lg text-white [&>button]:hidden">
          <div className="relative w-full flex items-center justify-center bg-black rounded-lg">
            <img
              src={gallery[currentIndex]?.url}
              alt={`Slide ${currentIndex + 1}`}
              className="max-h-[80vh] w-auto object-contain rounded-lg"
            />

            {/* Navigation Arrows */}
            {gallery.length > 1 && (
              <>
                <button
                  className="absolute left-4 -ms-16 top-1/2 transform -translate-y-1/2 text-white text-3xl hover:text-gray-400"
                  onClick={prev}
                >
                  <FaChevronLeft />
                </button>
                <button
                  className="absolute right-4 -me-16 top-1/2 transform -translate-y-1/2 text-white text-3xl hover:text-gray-400"
                  onClick={next}
                >
                  <FaChevronRight />
                </button>
              </>
            )}

            {/* Download & Delete in Full View */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() =>
                  handleDownload(
                    gallery[currentIndex].url,
                    gallery[currentIndex]._id
                  )
                }
                className="bg-secondaryColor hover:bg-secondaryColor text-sm font-bold text-white p-1 rounded"
              >
                <FaDownload />
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GalleryView;
