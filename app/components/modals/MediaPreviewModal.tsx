// components/MediaPreviewDialog.tsx
"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  FaChevronLeft,
  FaChevronRight,
  FaDownload,
  FaFileAlt,
} from "react-icons/fa";
import React from "react";

interface MediaItem {
  _id: string;
  url: string;
  name?: string;
  type?: "image" | "video" | "document";
}

interface MediaPreviewDialogProps {
  open: boolean;
  setOpen: (val: boolean) => void;
  items: MediaItem[];
  currentIndex: number;
  setCurrentIndex: (val: number) => void;
  onDownload: (url: string, id: string) => void;
  showDownload?: boolean;
}

const getMediaType = (url: string): "image" | "video" | "document" => {
  if (/\.(jpg|jpeg|png|gif|webp|avif)$/i.test(url)) return "image";
  if (/\.(mp4|webm|ogg)$/i.test(url)) return "video";
  return "document";
};

const MediaPreviewDialog: React.FC<MediaPreviewDialogProps> = ({
  open,
  setOpen,
  items,
  currentIndex,
  setCurrentIndex,
  onDownload,
  showDownload = true,
}) => {
  const currentItem = items[currentIndex];
  const type = currentItem?.type || getMediaType(currentItem?.url);

  const prev = () =>
    setCurrentIndex((currentIndex - 1 + items.length) % items.length);
  const next = () => setCurrentIndex((currentIndex + 1) % items.length);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="md:max-w-4xl bg-black p-0 text-white [&>button]:hidden">
        <div className="relative w-full flex items-center justify-center bg-black min-h-[60vh]">
          {/* Main Preview */}
          {type === "image" ? (
            <img
              src={currentItem?.url}
              alt={`Slide ${currentIndex + 1}`}
              className="max-h-[30vh] md:max-h-[80vh] w-auto object-contain"
            />
          ) : type === "video" ? (
            <video
              src={currentItem?.url}
              controls
              className="max-h-[30vh] md:max-h-[80vh] w-auto object-contain"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center">
              <FaFileAlt className="text-5xl mb-2" />
              <p className="text-lg font-semibold">
                {currentItem?.name || "Document"}
              </p>
              <a
                href={currentItem?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline mt-2 text-sm"
              >
                Open in new tab
              </a>
            </div>
          )}

          {/* Navigation */}
          {items.length > 1 && (
            <>
              <button
                className="absolute left-4 md:-ms-16 top-1/2 transform -translate-y-1/2 text-white text-3xl hover:text-gray-400"
                onClick={prev}
              >
                <FaChevronLeft />
              </button>
              <button
                className="absolute right-4 md:-me-16 top-1/2 transform -translate-y-1/2 text-white text-3xl hover:text-gray-400"
                onClick={next}
              >
                <FaChevronRight />
              </button>
            </>
          )}

          {/* Download */}
          {showDownload && (
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => onDownload(currentItem.url, currentItem._id)}
                className="bg-secondaryColor hover:bg-secondaryColor text-sm font-bold text-white p-1"
              >
                <FaDownload />
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MediaPreviewDialog;
