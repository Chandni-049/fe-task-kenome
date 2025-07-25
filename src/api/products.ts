import axios from "axios";
import { type Product, type ProductsResponse, type ProductFormData } from "@/types/product";

const API_BASE_URL = "https://dummyjson.com";

export const productsApi = {
  // Get all products with pagination
  getProducts: async (limit = 10, skip = 0): Promise<ProductsResponse> => {
    const response = await axios.get(`${API_BASE_URL}/products`, {
      params: { limit, skip }
    });
    return response.data;
  },

  // Get single product by ID
  getProduct: async (id: number): Promise<Product> => {
    const response = await axios.get(`${API_BASE_URL}/products/${id}`);
    return response.data;
  },

  // Add new product
  addProduct: async (product: ProductFormData): Promise<Product> => {
    const response = await axios.post(`${API_BASE_URL}/products/add`, product);
    return response.data;
  },

  // Update product
  updateProduct: async (id: number, product: Partial<ProductFormData>): Promise<Product> => {
    const response = await axios.put(`${API_BASE_URL}/products/${id}`, product);
    return response.data;
  },

  // Delete product
  deleteProduct: async (id: number): Promise<{ id: number; isDeleted: boolean }> => {
    const response = await axios.delete(`${API_BASE_URL}/products/${id}`);
    return response.data;
  },

  // Search products
  searchProducts: async (query: string): Promise<ProductsResponse> => {
    const response = await axios.get(`${API_BASE_URL}/products/search`, {
      params: { q: query }
    });
    return response.data;
  }
};