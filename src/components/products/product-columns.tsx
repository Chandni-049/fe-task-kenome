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
      <div className="relative h-12 w-12 overflow-hidden rounded-md">
        <Image
          src={row.getValue("thumbnail")}
          alt={row.getValue("title")}
          fill
          className="object-cover"
          sizes="48px"
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
          className="font-medium cursor-pointer hover:text-primary truncate"
          onClick={() => onView(row.original)}
        >
          {row.getValue("title")}
        </div>
        <div className="text-sm text-muted-foreground truncate">
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
      <Badge variant="secondary" className="capitalize">
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

      return <div className="font-medium">{formatted}</div>;
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
        <div className="flex items-center">
          <span className="mr-1">⭐</span>
          <span>{rating.toFixed(1)}</span>
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
          className="capitalize"
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