import { X } from "lucide-react";
import { useEffect, useRef } from "react";

type DocumentsUploadProps = {
  docs: (File | string)[];
  setDocs: (docs: (File | string)[]) => void;
  defaultPreviews?: string[];
};

export function DocumentsUpload({
  docs,
  setDocs,
  defaultPreviews = [],
}: DocumentsUploadProps) {
  const hydrated = useRef(false);

  useEffect(() => {
    if (!hydrated.current && defaultPreviews.length > 0 && docs.length === 0) {
      setDocs([...defaultPreviews]);
      hydrated.current = true;
    }
  }, [defaultPreviews, docs, setDocs]);

  const handleAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    const updated = [...docs, ...selected];
    setDocs(updated);
  };

  const handleRemove = (index: number) => {
    const updated = [...docs];
    updated.splice(index, 1);
    setDocs(updated);
  };

  const getDocName = (doc: File | string) =>
    typeof doc === "string" ? doc.split("/").pop() || "Document" : doc.name;

  return (
    <>
      <label className="relative block h-48 w-full border-4 border-dotted rounded-md cursor-pointer">
        <input
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv"
          onChange={handleAdd}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-sm text-center">
            Upload product documents (multiple)
          </p>
        </div>
      </label>

      <ul className="mt-4 flex gap-5">
        {docs.map((doc, index) => (
          <li
            key={index}
            className="flex items-center justify-between bg-secondaryColor rounded p-2 text-sm"
          >
            <span className="truncate">{getDocName(doc)}</span>
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="ml-2 text-primaryColor hover:text-primaryColor"
            >
              <X size={16} />
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
