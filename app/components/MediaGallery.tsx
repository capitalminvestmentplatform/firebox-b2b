// components/MediaGallery.tsx
"use client";

import React, { Fragment } from "react";
import { FaTrash, FaFileAlt } from "react-icons/fa";

interface MediaItem {
  _id: string;
  url: string;
  name?: string;
  type?: "image" | "video" | "document"; // Optional: can infer from file extension if needed
}

interface MediaGalleryProps {
  items: MediaItem[];
  deletedItems: string[];
  setDeletedItems: React.Dispatch<React.SetStateAction<string[]>>;
  userRole: string;
  onPreview: (index: number) => void;
  onDeleteConfirm?: () => void;
  onCancel?: () => void;
  buttonLoading?: boolean;
  showActions?: boolean;
}

const MediaGallery: React.FC<MediaGalleryProps> = ({
  items,
  deletedItems,
  setDeletedItems,
  userRole,
  onPreview,
  onDeleteConfirm,
  onCancel,
  buttonLoading = false,
  showActions = true,
}) => {
  const getMediaType = (url: string): "image" | "video" | "document" => {
    if (/\.(jpg|jpeg|png|gif|webp|avif)$/i.test(url)) return "image";
    if (/\.(mp4|webm|ogg)$/i.test(url)) return "video";
    return "document";
  };

  return items.length > 0 ? (
    <Fragment>
      <div className="flex gap-4 flex-wrap">
        {items.map((item, index) => {
          const isDeleted = deletedItems.includes(item._id);
          const type = item.type || getMediaType(item.url);

          return (
            <div
              key={item._id}
              className={`relative group border-2 ${
                isDeleted
                  ? "border-red-600 opacity-50"
                  : "border border-secondaryColor"
              } p-1`}
            >
              <div
                className="cursor-pointer w-32 h-20 flex items-center justify-center overflow-hidden"
                onClick={() => onPreview(index)}
              >
                {type === "image" ? (
                  <img
                    src={item.url}
                    alt="media"
                    className="w-full h-full object-cover"
                  />
                ) : type === "video" ? (
                  <video
                    src={item.url}
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-sm p-2 text-center">
                    <FaFileAlt className="text-2xl mb-1" />
                    <span className="line-clamp-2 break-words text-xs">
                      {item.name || "Document"}
                    </span>
                  </div>
                )}
              </div>

              {userRole === "Admin" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeletedItems((prev) =>
                      prev.includes(item._id)
                        ? prev.filter((_id) => _id !== item._id)
                        : [...prev, item._id]
                    );
                  }}
                  className="absolute top-1 right-1 p-1 bg-red-600 text-white shadow-md"
                  title="Delete"
                >
                  <FaTrash size={10} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {userRole === "Admin" && showActions && (
        <div className="mt-4 flex gap-3">
          <button
            onClick={onDeleteConfirm}
            disabled={buttonLoading || deletedItems.length === 0}
            className={`bg-secondaryColor hover:bg-secondaryColor text-white text-xs font-bold py-2 px-4 ${
              buttonLoading || deletedItems.length === 0
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {buttonLoading ? "Deleting..." : "Delete"}
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-black text-xs font-bold py-2 px-4"
          >
            Cancel
          </button>
        </div>
      )}
    </Fragment>
  ) : null;
};

export default MediaGallery;
