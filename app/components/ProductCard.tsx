// components/ProductCard.tsx
"use client";

import { FaEdit, FaPlus } from "react-icons/fa";
import Image from "next/image";

const ProductCard = ({
  product,
  items,
  userRole,
  onViewGallery,
  onAddItem,
  onEditItems,
}: {
  product: any;
  items: any[];
  userRole: string;
  onViewGallery: () => void;
  onAddItem: () => void;
  onEditItems: () => void;
}) => {
  return (
    <div
      className="relative group cursor-pointer rounded overflow-hidden shadow-lg p-5"
      onClick={() => {
        if (items.length === 0) return;
        onViewGallery();
      }}
    >
      <Image
        src={product?.image}
        alt={product?.name || "Product Image"}
        width={500}
        height={288}
        className="w-full h-72 object-cover object-center transition-transform duration-300 group-hover:scale-105 rounded"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-primaryColor_1 bg-opacity-60 flex flex-col justify-between p-3">
        <h3 className="text-white font-semibold text-lg">{product?.name}</h3>
        <span className="text-white text-xs self-start bg-secondaryColor py-1 px-2 font-bold">
          {items.length} item{items.length > 1 ? "s" : ""}
        </span>
      </div>

      {userRole === "Admin" && (
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddItem();
            }}
            className="p-1 shadow bg-secondaryColor"
            title="Add Image"
          >
            <FaPlus size={15} className="text-white" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditItems();
            }}
            className="p-1 shadow bg-secondaryColor"
            title="Edit"
          >
            <FaEdit size={15} className="text-white" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
