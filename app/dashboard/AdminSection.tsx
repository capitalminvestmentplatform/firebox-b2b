"use client";
import React, { useEffect, useState } from "react";

import { toast } from "sonner";
import { getLoggedInUser } from "@/utils/client";
import { useProductDropdown } from "@/hooks/useProductDropdown";
import { ProductDropdown } from "../components/ProductDropdown";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";

const mediaTypeLabelMap: Record<string, string> = {
  ProductImage: "Images",
  ProductVideo: "Videos",
  ProductDocument: "Documents",
  ProductManual: "Manuals",
  ProductCatalog: "Catalogs",
  ProductCertificate: "Certificates",
};

const AdminSection = () => {
  const { selectedProduct, setSelectedProduct, options, isLoading, error } =
    useProductDropdown();
  const [selectedUser, setSelectedUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [downloadLogs, setDownloadLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [pageError, setPageError] = useState<string | null>(null);
  const [mediaTypeCounts, setMediaTypeCounts] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    fetchDownloadLogs(selectedProduct, selectedUser);
    fetchUsers();
  }, [selectedProduct, selectedUser]);

  const fetchDownloadLogs = async (pId: string, uId: string) => {
    try {
      const res = await fetch(`/api/download-logs?pId=${pId}&uId=${uId}`, {
        method: "GET",
      });
      const response = await res.json();

      if (response.statusCode !== 200) {
        toast.error(response.message);
        throw new Error(response.message);
      }

      setDownloadLogs(response.data.logs);
      setMediaTypeCounts(response.data.mediaTypeCounts); // ✅ set counts here
    } catch (error) {
      console.error("Failed to fetch download logs:", error);
      setPageError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };
  const fetchUsers = async () => {
    try {
      const res = await fetch(`/api/users`, {
        method: "GET",
      });
      const response = await res.json();

      if (response.statusCode !== 200) {
        toast.error(response.message);
        throw new Error(response.message);
      }

      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch download logs:", error);
      setPageError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center">Loading...</p>;
  }
  return (
    <div>
      <div className="flex gap-5">
        <div className="min-w-40 mb-10">
          <ProductDropdown
            label="Product"
            selected={selectedProduct}
            onChange={setSelectedProduct}
            options={options.map((p) => p)} // assuming _id is the value needed
          />
        </div>

        <div className="min-w-40">
          <Select
            value={selectedUser}
            onValueChange={(value) => setSelectedUser(value)}
          >
            <SelectTrigger className="w-full bg-primaryColor_1 border-none">
              <SelectValue placeholder="All Users" />
            </SelectTrigger>
            <SelectContent className="bg-primaryColor_1 border-none text-textColor">
              {users?.map((user: any) => (
                <SelectItem
                  key={user._id}
                  value={user._id}
                  className="font-body"
                >
                  {user.firstName} {user.lastName} ({user.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {Object.entries(mediaTypeCounts).map(([type, count]) => (
          <div
            key={type}
            className="bg-primaryColor_1 shadow p-4 hover:shadow-md transition"
          >
            <h3 className="text-lg font-semibold capitalize mb-2 font-heading">
              {mediaTypeLabelMap[type] || type}
            </h3>
            <p className="text-5xl font-bold font-heading">{count}</p>
            <p className="text-sm text-gray-500 font-body">Downloads</p>
          </div>
        ))}
      </div>

      {downloadLogs.length > 0 ? (
        <div className="mt-6">
          <p className="text-lg font-semibold mb-5 font-heading">
            Download Logs
          </p>
          <Table>
            <TableHeader>
              <TableRow className="bg-secondaryColor hover:bg-secondaryColor text-textColor border-b-secondaryColor font-heading">
                <TableHead>User</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Media Type</TableHead>
                <TableHead>Media</TableHead>
                <TableHead>Downloaded At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {downloadLogs
                .filter((log: any) => log.uId !== "Admin")
                .map((log: any) => (
                  <TableRow
                    className="bg-primaryColor_1 text-textColor border-b-secondaryColor font-body"
                    key={log._id}
                  >
                    <TableCell>{log.userName || "-"}</TableCell>
                    <TableCell>{log.productName || "-"}</TableCell>
                    <TableCell>
                      {mediaTypeLabelMap[log.mediaType] || log.mediaType}
                    </TableCell>
                    <TableCell>
                      {log.mediaType === "ProductImage" ? (
                        <a
                          href={log.mediaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <div className="relative w-12 h-12 overflow-hidden">
                            {log.mediaUrl ? (
                              <Image
                                src={
                                  log.mediaUrl.startsWith("http") &&
                                  log.mediaUrl
                                }
                                alt="media"
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <> -</>
                            )}
                          </div>
                        </a>
                      ) : (
                        <a
                          href={log.mediaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline text-sm"
                        >
                          View File
                        </a>
                      )}
                    </TableCell>{" "}
                    <TableCell>
                      {new Date(log.createdAt).toLocaleString("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        !loading && (
          <p className="text-sm text-gray-500 mt-4 font-body">
            No download logs found for the selected filters.
          </p>
        )
      )}
    </div>
  );
};

export default AdminSection;
