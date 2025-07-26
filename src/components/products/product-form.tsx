"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { productSchema, type ProductFormData } from "@/lib/validations/product";
import { type Product } from "@/types/product";

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const categories = [
  "beauty",
  "fragrances", 
  "furniture",
  "groceries",
  "home-decoration",
  "kitchen-accessories",
  "laptops",
  "mens-shirts",
  "mens-shoes",
  "mens-watches",
  "mobile-accessories",
  "motorcycle",
  "skin-care",
  "smartphones",
  "sports-accessories",
  "sunglasses",
  "tablets",
  "tops",
  "vehicle",
  "womens-bags",
  "womens-dresses",
  "womens-jewellery",
  "womens-shoes",
  "womens-watches"
];

const availabilityStatuses = [
  "In Stock",
  "Low Stock",
  "Out of Stock"
];

export function ProductForm({ product, onSubmit, onCancel, isLoading }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product ? {
      title: product.title,
      description: product.description,
      category: product.category,
      price: product.price,
      discountPercentage: product.discountPercentage,
      rating: product.rating,
      stock: product.stock,
      brand: product.brand || "",
      sku: product.sku,
      weight: product.weight,
      warrantyInformation: product.warrantyInformation,
      shippingInformation: product.shippingInformation,
      availabilityStatus: product.availabilityStatus,
      returnPolicy: product.returnPolicy,
      minimumOrderQuantity: product.minimumOrderQuantity,
    } : {
      title: "",
      description: "",
      category: "",
      price: 0,
      discountPercentage: 0,
      rating: 0,
      stock: 0,
      brand: "",
      sku: "",
      weight: 0,
      warrantyInformation: "",
      shippingInformation: "",
      availabilityStatus: "In Stock",
      returnPolicy: "",
      minimumOrderQuantity: 1,
    },
  });

  const watchedCategory = watch("category");
  const watchedAvailabilityStatus = watch("availabilityStatus");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Title *
          </Label>
          <Input
            id="title"
            {...register("title")}
            placeholder="Enter product title"
            className="h-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
          />
          {errors.title && (
            <p className="text-sm text-red-500 flex items-center mt-1">
              <span className="mr-1">⚠</span>
              {errors.title.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="brand" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Brand
          </Label>
          <Input
            id="brand"
            {...register("brand")}
            placeholder="Enter brand name"
            className="h-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
          />
          {errors.brand && (
            <p className="text-sm text-red-500 flex items-center mt-1">
              <span className="mr-1">⚠</span>
              {errors.brand.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Category *
          </Label>
          <Select
            value={watchedCategory}
            onValueChange={(value) => setValue("category", value)}
          >
            <SelectTrigger className="h-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-sm text-red-500 flex items-center mt-1">
              <span className="mr-1">⚠</span>
              {errors.category.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="sku" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            SKU *
          </Label>
          <Input
            id="sku"
            {...register("sku")}
            placeholder="Enter SKU"
            className="h-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
          />
          {errors.sku && (
            <p className="text-sm text-red-500 flex items-center mt-1">
              <span className="mr-1">⚠</span>
              {errors.sku.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="price" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Price *
          </Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            {...register("price", { valueAsNumber: true })}
            placeholder="0.00"
            className="h-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
          />
          {errors.price && (
            <p className="text-sm text-red-500 flex items-center mt-1">
              <span className="mr-1">⚠</span>
              {errors.price.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="discountPercentage" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Discount Percentage
          </Label>
          <Input
            id="discountPercentage"
            type="number"
            step="0.01"
            min="0"
            max="100"
            {...register("discountPercentage", { valueAsNumber: true })}
            placeholder="0.00"
            className="h-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
          />
          {errors.discountPercentage && (
            <p className="text-sm text-red-500 flex items-center mt-1">
              <span className="mr-1">⚠</span>
              {errors.discountPercentage.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="rating" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Rating
          </Label>
          <Input
            id="rating"
            type="number"
            step="0.1"
            min="0"
            max="5"
            {...register("rating", { valueAsNumber: true })}
            placeholder="0.0"
            className="h-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
          />
          {errors.rating && (
            <p className="text-sm text-red-500 flex items-center mt-1">
              <span className="mr-1">⚠</span>
              {errors.rating.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Stock *
          </Label>
          <Input
            id="stock"
            type="number"
            min="0"
            {...register("stock", { valueAsNumber: true })}
            placeholder="0"
            className="h-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
          />
          {errors.stock && (
            <p className="text-sm text-red-500 flex items-center mt-1">
              <span className="mr-1">⚠</span>
              {errors.stock.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Weight (kg) *
          </Label>
          <Input
            id="weight"
            type="number"
            step="0.01"
            min="0"
            {...register("weight", { valueAsNumber: true })}
            placeholder="0.00"
            className="h-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
          />
          {errors.weight && (
            <p className="text-sm text-red-500 flex items-center mt-1">
              <span className="mr-1">⚠</span>
              {errors.weight.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="minimumOrderQuantity" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Minimum Order Quantity *
          </Label>
          <Input
            id="minimumOrderQuantity"
            type="number"
            min="1"
            {...register("minimumOrderQuantity", { valueAsNumber: true })}
            placeholder="1"
            className="h-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
          />
          {errors.minimumOrderQuantity && (
            <p className="text-sm text-red-500 flex items-center mt-1">
              <span className="mr-1">⚠</span>
              {errors.minimumOrderQuantity.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="availabilityStatus" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Availability Status *
          </Label>
          <Select
            value={watchedAvailabilityStatus}
            onValueChange={(value) => setValue("availabilityStatus", value)}
          >
            <SelectTrigger className="h-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {availabilityStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.availabilityStatus && (
            <p className="text-sm text-red-500 flex items-center mt-1">
              <span className="mr-1">⚠</span>
              {errors.availabilityStatus.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Description *
        </Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Enter product description"
          rows={3}
          className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
        />
        {errors.description && (
          <p className="text-sm text-red-500 flex items-center mt-1">
            <span className="mr-1">⚠</span>
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="warrantyInformation" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Warranty Information *
        </Label>
        <Textarea
          id="warrantyInformation"
          {...register("warrantyInformation")}
          placeholder="Enter warranty information"
          rows={2}
          className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
        />
        {errors.warrantyInformation && (
          <p className="text-sm text-red-500 flex items-center mt-1">
            <span className="mr-1">⚠</span>
            {errors.warrantyInformation.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="shippingInformation" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Shipping Information *
        </Label>
        <Textarea
          id="shippingInformation"
          {...register("shippingInformation")}
          placeholder="Enter shipping information"
          rows={2}
          className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
        />
        {errors.shippingInformation && (
          <p className="text-sm text-red-500 flex items-center mt-1">
            <span className="mr-1">⚠</span>
            {errors.shippingInformation.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="returnPolicy" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Return Policy *
        </Label>
        <Textarea
          id="returnPolicy"
          {...register("returnPolicy")}
          placeholder="Enter return policy"
          rows={2}
          className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
        />
        {errors.returnPolicy && (
          <p className="text-sm text-red-500 flex items-center mt-1">
            <span className="mr-1">⚠</span>
            {errors.returnPolicy.message}
          </p>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="px-6"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading}
          className="px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {isLoading ? "Saving..." : product ? "Update Product" : "Add Product"}
        </Button>
      </div>
    </form>
  );
}