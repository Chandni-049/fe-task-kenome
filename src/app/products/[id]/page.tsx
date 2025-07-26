"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit, Trash2, Star, Package, Truck, Shield, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useProduct, useUpdateProduct, useDeleteProduct } from "@/hooks/useProducts";
import { ProductDialog } from "@/components/products/product-dialog";
import { DeleteProductDialog } from "@/components/products/delete-product-dialog";
import { type Product } from "@/types/product";
import { type ProductFormData } from "@/lib/validations/product";
import { useState } from "react";
import Image from "next/image";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const productId = parseInt(id);
  
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  
  const { data: product, isLoading, error } = useProduct(productId);
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  const handleUpdateProduct = (data: ProductFormData) => {
    if (!product) return;
    
    updateProductMutation.mutate(
      { id: product.id, product: data },
      {
        onSuccess: () => {
          setEditDialog(false);
        },
      }
    );
  };

  const handleDeleteProduct = () => {
    if (!product) return;
    
    deleteProductMutation.mutate(product.id, {
      onSuccess: () => {
        router.push("/products");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-lg shimmer"></div>
            <div className="space-y-2 flex-1">
              <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded shimmer"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3 shimmer"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="aspect-square bg-slate-200 dark:bg-slate-700 rounded-2xl shimmer"></div>
            <div className="space-y-4">
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded shimmer"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded shimmer"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3 shimmer"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <div className="text-6xl">😞</div>
            <div className="text-xl font-semibold text-slate-600 dark:text-slate-400">Product not found</div>
            <Button onClick={() => router.push("/products")} variant="outline">
              Back to Products
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const discountedPrice = product.price * (1 - product.discountPercentage / 100);

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="shrink-0"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
              {product.title}
            </h1>
            <p className="text-muted-foreground font-medium">{product.brand}</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => setEditDialog(true)}
            className="hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-950"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => setDeleteDialog(true)}
            className="hover:bg-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-6">
          <div className="relative aspect-square overflow-hidden rounded-2xl border shadow-lg bg-white dark:bg-slate-900">
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
              priority
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.slice(0, 4).map((image, index) => (
                <div key={index} className="relative aspect-square overflow-hidden rounded-xl border shadow-sm bg-white dark:bg-slate-900 hover:shadow-md transition-shadow">
                  <Image
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-200"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border">
            <div className="flex items-center space-x-3 mb-4">
              <Badge variant="secondary" className="capitalize font-medium bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                {product.category}
              </Badge>
              <Badge
                variant={product.availabilityStatus === "In Stock" ? "default" : "secondary"}
                className={`font-medium ${
                  product.availabilityStatus === "In Stock"
                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                    : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                {product.availabilityStatus}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-3 mb-6">
              <div className="flex items-center bg-yellow-50 dark:bg-yellow-950 px-3 py-1 rounded-full">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="ml-1 font-semibold text-yellow-700 dark:text-yellow-300">{product.rating}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.reviews?.length || 0} reviews)
              </span>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400">
                {formatPrice(discountedPrice)}
              </div>
              {product.discountPercentage > 0 && (
                <>
                  <div className="text-xl text-slate-400 line-through">
                    {formatPrice(product.price)}
                  </div>
                  <Badge variant="destructive" className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
                    -{product.discountPercentage}%
                  </Badge>
                </>
              )}
            </div>

            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Product Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-sm font-semibold text-blue-700 dark:text-blue-300">
                  <Package className="mr-2 h-4 w-4" />
                  Stock & SKU
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Stock:</span>
                  <Badge 
                    variant={product.stock > 10 ? "default" : product.stock > 0 ? "secondary" : "destructive"}
                    className="font-medium"
                  >
                    {product.stock}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">SKU:</span>
                  <span className="text-sm font-mono bg-white dark:bg-slate-800 px-2 py-1 rounded">{product.sku}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Min Order:</span>
                  <span className="text-sm font-semibold">{product.minimumOrderQuantity}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-sm font-semibold text-green-700 dark:text-green-300">
                  <Truck className="mr-2 h-4 w-4" />
                  Shipping
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-green-600 dark:text-green-400 mb-3">
                  {product.shippingInformation}
                </p>
                <div className="mt-2 flex justify-between">
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">Weight:</span>
                  <span className="text-sm font-semibold">{product.weight} kg</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-sm font-semibold text-purple-700 dark:text-purple-300">
                  <Shield className="mr-2 h-4 w-4" />
                  Warranty
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-purple-600 dark:text-purple-400">
                  {product.warrantyInformation}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-sm font-semibold text-orange-700 dark:text-orange-300">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Returns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-orange-600 dark:text-orange-400">
                  {product.returnPolicy}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border">
              <h3 className="font-semibold mb-4 text-slate-700 dark:text-slate-300">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      {product.reviews && product.reviews.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">Customer Reviews</h2>
          <div className="space-y-4">
            {product.reviews.slice(0, 3).map((review, index) => (
              <Card key={index} className="bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{review.reviewerName}</span>
                      <div className="flex items-center bg-yellow-50 dark:bg-yellow-950 px-2 py-1 rounded-full">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="ml-1 text-sm font-medium text-yellow-700 dark:text-yellow-300">{review.rating}</span>
                      </div>
                    </div>
                    <span className="text-sm text-slate-500">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Dialogs */}
      <ProductDialog
        open={editDialog}
        onOpenChange={setEditDialog}
        product={product}
        onSubmit={handleUpdateProduct}
        isLoading={updateProductMutation.isPending}
      />

      <DeleteProductDialog
        open={deleteDialog}
        onOpenChange={setDeleteDialog}
        product={product}
        onConfirm={handleDeleteProduct}
        isLoading={deleteProductMutation.isPending}
      />
    </div>
  );
}