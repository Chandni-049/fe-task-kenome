"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/table/data-table";
import { ProductDialog } from "@/components/products/product-dialog";
import { DeleteProductDialog } from "@/components/products/delete-product-dialog";
import { createProductColumns } from "@/components/products/product-columns";
import { useProducts, useAddProduct, useUpdateProduct, useDeleteProduct, useSearchProducts } from "@/hooks/useProducts";
import { type Product } from "@/types/product";
import { type ProductFormData } from "@/lib/validations/product";
import { usePaginationStore } from "@/store/pagination";
import { useDebounce } from "@/hooks/useDebounce";

export default function ProductsPage() {
  const router = useRouter();
  const [productDialog, setProductDialog] = useState<{
    open: boolean;
    product?: Product;
  }>({ open: false });
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    product?: Product;
  }>({ open: false });
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const { pagination } = usePaginationStore();
  const limit = pagination.pageSize;
  const skip = pagination.pageIndex * pagination.pageSize;

  // Use search query if available, otherwise use regular products query
  const { data: productsData, isLoading } = useProducts(limit, skip);
  const { data: searchData, isLoading: isSearching } = useSearchProducts(debouncedSearchQuery);
  
  const addProductMutation = useAddProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  // Use search results if searching, otherwise use regular products
  const displayData = debouncedSearchQuery ? searchData : productsData;
  const isLoadingData = debouncedSearchQuery ? isSearching : isLoading;

  const columns = useMemo(
    () =>
      createProductColumns({
        onEdit: (product) => setProductDialog({ open: true, product }),
        onDelete: (product) => setDeleteDialog({ open: true, product }),
        onView: (product) => router.push(`/products/${product.id}`),
      }),
    [router]
  );

  const handleAddProduct = (data: ProductFormData) => {
    addProductMutation.mutate(data, {
      onSuccess: () => {
        setProductDialog({ open: false });
      },
    });
  };

  const handleUpdateProduct = (data: ProductFormData) => {
    if (!productDialog.product) return;
    
    updateProductMutation.mutate(
      { id: productDialog.product.id, product: data },
      {
        onSuccess: () => {
          setProductDialog({ open: false });
        },
      }
    );
  };

  const handleDeleteProduct = () => {
    if (!deleteDialog.product) return;
    
    deleteProductMutation.mutate(deleteDialog.product.id, {
      onSuccess: () => {
        setDeleteDialog({ open: false });
      },
    });
  };

  if (isLoadingData) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading products...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">All Products – MyShop</h1>
          <p className="text-muted-foreground">
            Manage your product inventory
          </p>
        </div>
        <Button onClick={() => setProductDialog({ open: true })}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={displayData?.products || []}
      />

      <ProductDialog
        open={productDialog.open}
        onOpenChange={(open) => setProductDialog({ open })}
        product={productDialog.product}
        onSubmit={productDialog.product ? handleUpdateProduct : handleAddProduct}
        isLoading={addProductMutation.isPending || updateProductMutation.isPending}
      />

      <DeleteProductDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open })}
        product={deleteDialog.product}
        onConfirm={handleDeleteProduct}
        isLoading={deleteProductMutation.isPending}
      />
    </div>
  );
}