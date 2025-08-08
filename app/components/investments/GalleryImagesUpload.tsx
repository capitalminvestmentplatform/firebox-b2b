import { X } from "lucide-react";
import { useEffect, useRef } from "react";

type GalleryImagesUploadProps = {
  images: (File | string)[];
  setImages: (images: (File | string)[]) => void;
  defaultPreviews?: string[];
};

export function GalleryImagesUpload({
  images,
  setImages,
  defaultPreviews = [],
}: GalleryImagesUploadProps) {
  const hydrated = useRef(false);

  // Set default previews once on mount
  useEffect(() => {
    if (
      !hydrated.current &&
      defaultPreviews.length > 0 &&
      images.length === 0
    ) {
      setImages([...defaultPreviews]);
      hydrated.current = true;
    }
  }, [defaultPreviews, images, setImages]);

  const previews = images.map((item) =>
    typeof item === "string" ? item : URL.createObjectURL(item)
  );

  const handleAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    const updated = [...images, ...selected];
    setImages(updated);
  };

  const handleRemove = (index: number) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
  };

  return (
    <>
      <label className="relative block h-48 w-full border-2 border-dotted cursor-pointer">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleAdd}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-primaryColor_1">
          <p className="text-sm text-center">
            Upload product images (multiple)
          </p>
        </div>
      </label>

      <div className="flex flex-wrap gap-3 mt-4">
        {previews.map((src, index) => (
          <div key={index} className="relative inline-block">
            <img
              src={src}
              alt={`preview-${index}`}
              className="w-32 h-20 object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute top-0 right-0 bg-secondaryColor text-textColor text-xs p-1 transform translate-x-1/2 -translate-y-1/2 hover:bg-red-700"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
