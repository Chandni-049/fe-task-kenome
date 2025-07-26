"use client"
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to products page on load
    router.push("/products");
  }, [router]);

  return (
    <main className="min-h-screen">
      <div className="container mx-auto py-16">
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <div className="text-lg font-medium text-muted-foreground">Redirecting to products...</div>
          </div>
        </div>
      </div>
    </main>
  );
}
