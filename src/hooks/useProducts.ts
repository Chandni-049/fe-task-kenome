import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { productsApi } from "@/api/products";
import { type ProductFormData } from "@/types/product";

export const useProducts = (limit = 10, skip = 0) => {
  return useQuery({
    queryKey: ["products", limit, skip],
    queryFn: () => productsApi.getProducts(limit, skip),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => productsApi.getProduct(id),
    enabled: !!id,
  });
};

export const useAddProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (product: ProductFormData) => productsApi.addProduct(product),
    onSuccess: (newProduct) => {
      // Update the cache with the new product
      queryClient.setQueryData(["products"], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          products: [newProduct, ...oldData.products],
          total: oldData.total + 1,
        };
      });
      
      // Invalidate and refetch products
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product added successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to add product");
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, product }: { id: number; product: Partial<ProductFormData> }) =>
      productsApi.updateProduct(id, product),
    onSuccess: (updatedProduct) => {
      // Update the specific product in cache
      queryClient.setQueryData(["product", updatedProduct.id], updatedProduct);
      
      // Update the product in the products list
      queryClient.setQueryData(["products"], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          products: oldData.products.map((product: any) =>
            product.id === updatedProduct.id ? updatedProduct : product
          ),
        };
      });
      
      toast.success("Product updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update product");
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productsApi.deleteProduct(id),
    onSuccess: (_, deletedId) => {
      // Remove the product from cache
      queryClient.setQueryData(["products"], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          products: oldData.products.filter((product: any) => product.id !== deletedId),
          total: oldData.total - 1,
        };
      });
      
      // Remove the individual product cache
      queryClient.removeQueries({ queryKey: ["product", deletedId] });
      toast.success("Product deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete product");
    },
  });
};

export const useSearchProducts = (query: string) => {
  return useQuery({
    queryKey: ["products", "search", query],
    queryFn: () => productsApi.searchProducts(query),
    enabled: !!query && query.length > 0,
    staleTime: 5 * 60 * 1000,
  });
};