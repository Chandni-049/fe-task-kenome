"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { DataTableRowActions } from "@/components/table/data-table-row-actions";
import { type Product } from "@/types/product";
import Image from "next/image";

interface ProductColumnsProps {
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onView: (product: Product) => void;
}

export const createProductColumns = ({
  onEdit,
  onDelete,
  onView,
}: ProductColumnsProps): ColumnDef<Product>[] => [
  {
    accessorKey: "thumbnail",
    header: "Image",
    cell: ({ row }) => (
      <div className="relative h-14 w-14 overflow-hidden rounded-xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-700">
        <Image
          src={row.getValue("thumbnail")}
          alt={row.getValue("title")}
          fill
          className="object-cover transition-transform hover:scale-110"
          sizes="56px"
        />
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[200px]">
        <div 
          className="font-semibold cursor-pointer hover:text-blue-600 truncate transition-colors"
          onClick={() => onView(row.original)}
        >
          {row.getValue("title")}
        </div>
        <div className="text-sm text-muted-foreground truncate mt-1">
          {row.original.brand}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => (
      <Badge variant="secondary" className="capitalize font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
        {row.getValue("category")}
      </Badge>
    ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price);

      return <div className="font-semibold text-green-600 dark:text-green-400">{formatted}</div>;
    },
  },
  {
    accessorKey: "rating",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rating" />
    ),
    cell: ({ row }) => {
      const rating = parseFloat(row.getValue("rating"));
      return (
        <div className="flex items-center space-x-1">
          <div className="flex items-center">
            <span className="text-yellow-400">★</span>
            <span className="ml-1 font-medium">{rating.toFixed(1)}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "stock",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stock" />
    ),
    cell: ({ row }) => {
      const stock = parseInt(row.getValue("stock"));
      return (
        <Badge
          variant={stock > 10 ? "default" : stock > 0 ? "secondary" : "destructive"}
          className={`font-medium ${
            stock > 10 
              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" 
              : stock > 0 
              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
              : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
          }`}
        >
          {stock}
        </Badge>
      );
    },
  },
  {
    accessorKey: "availabilityStatus",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("availabilityStatus") as string;
      return (
        <Badge
          variant={status === "In Stock" ? "default" : "secondary"}
          className={`capitalize font-medium ${
            status === "In Stock"
              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
              : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
          }`}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions
        row={row.original}
        onEdit={() => onEdit(row.original)}
        onDelete={() => onDelete(row.original)}
      />
    ),
  },
];