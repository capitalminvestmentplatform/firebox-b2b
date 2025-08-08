import { X } from "lucide-react";
import { useEffect, useRef } from "react";

type VideosUploadProps = {
  videos: (File | string)[];
  setVideos: (videos: (File | string)[]) => void;
  defaultPreviews?: string[];
};

export function VideosUpload({
  videos,
  setVideos,
  defaultPreviews = [],
}: VideosUploadProps) {
  const hydrated = useRef(false);

  useEffect(() => {
    if (
      !hydrated.current &&
      defaultPreviews.length > 0 &&
      videos.length === 0
    ) {
      setVideos([...defaultPreviews]);
      hydrated.current = true;
    }
  }, [defaultPreviews, videos, setVideos]);

  const previews = videos.map((item) =>
    typeof item === "string" ? item : URL.createObjectURL(item)
  );

  const handleAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length > 0) {
      setVideos([selected[0]]); // Only allow one video
    }
  };

  const handleRemove = (index: number) => {
    const updated = [...videos];
    updated.splice(index, 1);
    setVideos(updated);
  };

  return (
    <>
      <label className="relative block h-48 w-full border-4 border-dotted cursor-pointer">
        <input
          type="file"
          accept="video/*"
          onChange={handleAdd}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-sm text-center">Upload product video</p>
        </div>
      </label>

      <div className="flex flex-wrap gap-3 mt-4">
        {previews.map((src, index) => (
          <div key={index} className="relative w-40 h-24">
            <video src={src} controls className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute top-0 right-0 bg-red-600 text-white text-xs p-1 transform translate-x-1/2 -translate-y-1/2 hover:bg-red-700"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
