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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            {...register("title")}
            placeholder="Enter product title"
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="brand">Brand</Label>
          <Input
            id="brand"
            {...register("brand")}
            placeholder="Enter brand name"
          />
          {errors.brand && (
            <p className="text-sm text-destructive">{errors.brand.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select
            value={watchedCategory}
            onValueChange={(value) => setValue("category", value)}
          >
            <SelectTrigger>
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
            <p className="text-sm text-destructive">{errors.category.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="sku">SKU *</Label>
          <Input
            id="sku"
            {...register("sku")}
            placeholder="Enter SKU"
          />
          {errors.sku && (
            <p className="text-sm text-destructive">{errors.sku.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            {...register("price", { valueAsNumber: true })}
            placeholder="0.00"
          />
          {errors.price && (
            <p className="text-sm text-destructive">{errors.price.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="discountPercentage">Discount Percentage</Label>
          <Input
            id="discountPercentage"
            type="number"
            step="0.01"
            min="0"
            max="100"
            {...register("discountPercentage", { valueAsNumber: true })}
            placeholder="0.00"
          />
          {errors.discountPercentage && (
            <p className="text-sm text-destructive">{errors.discountPercentage.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="rating">Rating</Label>
          <Input
            id="rating"
            type="number"
            step="0.1"
            min="0"
            max="5"
            {...register("rating", { valueAsNumber: true })}
            placeholder="0.0"
          />
          {errors.rating && (
            <p className="text-sm text-destructive">{errors.rating.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock">Stock *</Label>
          <Input
            id="stock"
            type="number"
            min="0"
            {...register("stock", { valueAsNumber: true })}
            placeholder="0"
          />
          {errors.stock && (
            <p className="text-sm text-destructive">{errors.stock.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight">Weight (kg) *</Label>
          <Input
            id="weight"
            type="number"
            step="0.01"
            min="0"
            {...register("weight", { valueAsNumber: true })}
            placeholder="0.00"
          />
          {errors.weight && (
            <p className="text-sm text-destructive">{errors.weight.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="minimumOrderQuantity">Minimum Order Quantity *</Label>
          <Input
            id="minimumOrderQuantity"
            type="number"
            min="1"
            {...register("minimumOrderQuantity", { valueAsNumber: true })}
            placeholder="1"
          />
          {errors.minimumOrderQuantity && (
            <p className="text-sm text-destructive">{errors.minimumOrderQuantity.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="availabilityStatus">Availability Status *</Label>
          <Select
            value={watchedAvailabilityStatus}
            onValueChange={(value) => setValue("availabilityStatus", value)}
          >
            <SelectTrigger>
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
            <p className="text-sm text-destructive">{errors.availabilityStatus.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Enter product description"
          rows={3}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="warrantyInformation">Warranty Information *</Label>
        <Textarea
          id="warrantyInformation"
          {...register("warrantyInformation")}
          placeholder="Enter warranty information"
          rows={2}
        />
        {errors.warrantyInformation && (
          <p className="text-sm text-destructive">{errors.warrantyInformation.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="shippingInformation">Shipping Information *</Label>
        <Textarea
          id="shippingInformation"
          {...register("shippingInformation")}
          placeholder="Enter shipping information"
          rows={2}
        />
        {errors.shippingInformation && (
          <p className="text-sm text-destructive">{errors.shippingInformation.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="returnPolicy">Return Policy *</Label>
        <Textarea
          id="returnPolicy"
          {...register("returnPolicy")}
          placeholder="Enter return policy"
          rows={2}
        />
        {errors.returnPolicy && (
          <p className="text-sm text-destructive">{errors.returnPolicy.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : product ? "Update Product" : "Add Product"}
        </Button>
      </div>
    </form>
  );
}