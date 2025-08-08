import { X } from "lucide-react";
import { useEffect, useRef } from "react";

type OtherDocsUploadProps = {
  docs: (File | string)[];
  setDocs: (docs: (File | string)[]) => void;
  defaultPreviews?: string[];
  type: string;
};

export function OtherDocsUpload({
  docs,
  setDocs,
  defaultPreviews = [],
  type,
}: OtherDocsUploadProps) {
  const hydrated = useRef(false);

  useEffect(() => {
    if (!hydrated.current && defaultPreviews.length > 0 && docs.length === 0) {
      setDocs([defaultPreviews[0]]); // Only use the first default
      hydrated.current = true;
    }
  }, [defaultPreviews, docs, setDocs]);

  const handleAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length > 0) {
      setDocs([selected[0]]); // Only one document allowed
    }
  };

  const handleRemove = () => {
    setDocs([]);
  };

  const getDocName = (doc: File | string) =>
    typeof doc === "string" ? doc.split("/").pop() || "Document" : doc.name;

  return (
    <>
      <label className="relative block h-48 w-full border-4 border-dotted cursor-pointer">
        <input
          type="file"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv"
          onChange={handleAdd}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-sm text-center">Upload a product {type}</p>
        </div>
      </label>

      {docs.length > 0 && (
        <ul className="mt-4 space-y-2">
          <li className="flex items-center justify-between bg-secondaryColor p-2 text-sm">
            <span className="truncate">{getDocName(docs[0])}</span>
            <button
              type="button"
              onClick={handleRemove}
              className="ml-2 text-primaryColor hover:text-primaryColor"
            >
              <X size={16} />
            </button>
          </li>
        </ul>
      )}
    </>
  );
}
