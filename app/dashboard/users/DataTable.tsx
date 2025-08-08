import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash } from "lucide-react";
import Link from "next/link";

import React from "react";
import { getLoggedInUser } from "@/utils/client";
import { ConfirmModal } from "@/app/components/modals/ConfirmModal";

interface DataTableProps {
  tableCols: string[]; // Array of column headers
  tableRows: Record<string, any>[]; // Array of objects with dynamic keys
  handleDelete: (userId: string) => Promise<boolean>;
  sendEmail: (userId: string) => void;
}

const DataTable: React.FC<DataTableProps> = ({
  tableCols,
  tableRows,
  handleDelete,
  sendEmail,
}) => {
  const loggedInUser = getLoggedInUser();
  const id = loggedInUser ? loggedInUser.id : null;
  if (tableRows.length === 0) {
    return <p className="text-center text-gray-500">No data available</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {tableCols.map((col, index) => (
            <TableHead key={index}>{col}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {tableRows.map((row, index) => (
          <TableRow key={index}>
            <TableCell>
              {row.firstName} {row.lastName}
            </TableCell>
            <TableCell>{row.email}</TableCell>
            <TableCell>{row.phone}</TableCell>
            <TableCell className="capitalize">{row.role}</TableCell>
            <TableCell>
              {row.role === "User" ? (
                <button
                  onClick={() => sendEmail(row._id)}
                  className="bg-secondaryColor hover:bg-secondaryColor text-textColor py-1 px-3 text-xs font-semibold"
                >
                  Send
                </button>
              ) : (
                <>-</>
              )}
            </TableCell>
            <TableCell className="flex gap-2">
              {row._id !== id && (
                <>
                  <ConfirmModal
                    title="Delete User?"
                    description="Are you sure you want to delete this user? This action cannot be undone."
                    onConfirm={() => handleDelete(row._id)}
                  >
                    <button className="bg-secondaryColor p-1">
                      <Trash size={16} className="text-textColor" />
                    </button>
                  </ConfirmModal>

                  <Link
                    href={`/dashboard/users/${row._id}`}
                    className="bg-textColor p-1"
                  >
                    <Pencil size={16} className="text-primaryColor" />
                  </Link>
                </>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DataTable;
