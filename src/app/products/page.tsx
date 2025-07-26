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
    <div className="container mx-auto py-8 px-4">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 mb-8 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">
                Product Management
              </h1>
              <p className="text-blue-100 text-lg">
                Manage your inventory with powerful tools and insights
              </p>
              <div className="flex items-center space-x-4 mt-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
                  <span className="text-sm font-medium">
                    {displayData?.total || 0} Products
                  </span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
                  <span className="text-sm font-medium">
                    {displayData?.products?.filter(p => p.stock > 0).length || 0} In Stock
                  </span>
                </div>
              </div>
            </div>
            <Button 
              onClick={() => setProductDialog({ open: true })}
              size="lg"
              className="bg-white text-blue-600 hover:bg-white/90 shadow-lg"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add Product
            </Button>
          </div>
        </div>
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl"></div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products by name or brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-slate-50 dark:bg-slate-800 border-0 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {debouncedSearchQuery && (
              <div className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950 px-3 py-1 rounded-full">
                Searching for "{debouncedSearchQuery}"
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border overflow-hidden">
        {isLoadingData ? (
          <div className="p-8">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-lg shimmer"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded shimmer"></div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3 shimmer"></div>
                  </div>
                  <div className="w-20 h-4 bg-slate-200 dark:bg-slate-700 rounded shimmer"></div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={displayData?.products || []}
          />
        )}
      </div>

      {/* Stats Cards */}
      {displayData && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-4 rounded-xl border">
              <div className="text-2xl font-bold text-blue-600">{displayData.total}</div>
              <div className="text-sm text-blue-600/70">Total Products</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 p-4 rounded-xl border">
              <div className="text-2xl font-bold text-green-600">
                {displayData.products.filter(p => p.stock > 10).length}
              </div>
              <div className="text-sm text-green-600/70">Well Stocked</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 p-4 rounded-xl border">
              <div className="text-2xl font-bold text-yellow-600">
                {displayData.products.filter(p => p.stock <= 10 && p.stock > 0).length}
              </div>
              <div className="text-sm text-yellow-600/70">Low Stock</div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 p-4 rounded-xl border">
              <div className="text-2xl font-bold text-red-600">
                {displayData.products.filter(p => p.stock === 0).length}
              </div>
              <div className="text-sm text-red-600/70">Out of Stock</div>
            </div>
          </div>
        </div>
      )}

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