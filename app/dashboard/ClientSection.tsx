"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import {
  FaFilePdf,
  FaFileAlt,
  FaImage,
  FaVideo,
  FaFileSignature,
  FaBook,
} from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const mediaIcons: Record<string, React.ReactNode> = {
  images: <FaImage className="text-blue-500 text-2xl" />,
  videos: <FaVideo className="text-red-500 text-2xl" />,
  documents: <FaFilePdf className="text-green-600 text-2xl" />,
  manuals: <FaBook className="text-purple-600 text-2xl" />,
  certificates: <FaFileSignature className="text-yellow-600 text-2xl" />,
  catalogs: <FaFileAlt className="text-teal-600 text-2xl" />,
};
const ClientSection = () => {
  const [loading, setLoading] = useState(true);
  const [recentProducts, setRecentProducts] = useState([]);
  const [pageError, setPageError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecentProducts();
  }, []);

  const fetchRecentProducts = async () => {
    try {
      const res = await fetch(`/api/recent-products`, {
        method: "GET",
      });
      const response = await res.json();

      if (response.statusCode !== 200) {
        toast.error(response.message);
        throw new Error(response.message);
      }

      setRecentProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch download logs:", error);
      setPageError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (pageError) {
    return <p className="text-red-500 text-center">{pageError}</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      {Object.entries(recentProducts).map(([type, items]: any) => (
        <Card key={type} className="shadow-md rounded-none">
          <CardHeader>
            <div className="flex items-center gap-2">
              {mediaIcons[type]}
              <CardTitle className="capitalize">
                {type.replace(/s$/, "")}s
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex gap-4 overflow-x-auto">
            {items.length === 0 ? (
              <p className="text-sm m-auto text-muted-foreground">
                No data found
              </p>
            ) : (
              items.map((item: any, idx: number) => (
                <a
                  key={idx}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-28 shrink-0"
                >
                  {type === "images" ? (
                    <Image
                      src={item.url}
                      alt="Recent Image"
                      width={112}
                      height={112}
                      className="rounded object-cover w-28 h-28"
                    />
                  ) : type === "videos" ? (
                    <video
                      src={item.url}
                      muted
                      className="w-28 h-28 rounded object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-sm p-2 border border-secondaryColor h-28 w-28 text-center bg-primaryColor_1 hover:bg-primaryColor_1 transition-colors rounded-md">
                      <FaFileAlt className="text-2xl mb-1" />
                      <span className="line-clamp-2 break-words">
                        {item.name || "Document"}
                      </span>
                    </div>
                  )}
                </a>
              ))
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ClientSection;
