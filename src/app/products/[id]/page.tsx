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
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading product...</div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-destructive">Product not found</div>
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
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{product.title} – MyShop</h1>
            <p className="text-muted-foreground">{product.brand}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setEditDialog(true)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => setDeleteDialog(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg border">
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(0, 4).map((image, index) => (
                <div key={index} className="relative aspect-square overflow-hidden rounded border">
                  <Image
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant="secondary" className="capitalize">
                {product.category}
              </Badge>
              <Badge 
                variant={product.availabilityStatus === "In Stock" ? "default" : "secondary"}
              >
                {product.availabilityStatus}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="ml-1 font-medium">{product.rating}</span>
              </div>
              <span className="text-muted-foreground">
                ({product.reviews?.length || 0} reviews)
              </span>
            </div>

            <div className="flex items-center space-x-4 mb-4">
              <div className="text-3xl font-bold">
                {formatPrice(discountedPrice)}
              </div>
              {product.discountPercentage > 0 && (
                <>
                  <div className="text-xl text-muted-foreground line-through">
                    {formatPrice(product.price)}
                  </div>
                  <Badge variant="destructive">
                    -{product.discountPercentage}%
                  </Badge>
                </>
              )}
            </div>

            <p className="text-muted-foreground mb-6">
              {product.description}
            </p>
          </div>

          <Separator />

          {/* Product Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-sm">
                  <Package className="mr-2 h-4 w-4" />
                  Stock & SKU
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Stock:</span>
                  <Badge variant={product.stock > 10 ? "default" : product.stock > 0 ? "secondary" : "destructive"}>
                    {product.stock}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">SKU:</span>
                  <span className="text-sm font-mono">{product.sku}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Min Order:</span>
                  <span className="text-sm">{product.minimumOrderQuantity}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-sm">
                  <Truck className="mr-2 h-4 w-4" />
                  Shipping
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {product.shippingInformation}
                </p>
                <div className="mt-2 flex justify-between">
                  <span className="text-sm text-muted-foreground">Weight:</span>
                  <span className="text-sm">{product.weight} kg</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-sm">
                  <Shield className="mr-2 h-4 w-4" />
                  Warranty
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {product.warrantyInformation}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-sm">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Returns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {product.returnPolicy}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
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
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
          <div className="space-y-4">
            {product.reviews.slice(0, 3).map((review, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{review.reviewerName}</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="ml-1 text-sm">{review.rating}</span>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{review.comment}</p>
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