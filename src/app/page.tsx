"use client"
import Navbar from "@/components/navbar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to products page on load
    router.push("/products");
  }, [router]);

  return (
    <main className="min-h-screen overflow-auto">
      <Navbar />
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Redirecting to products...</div>
        </div>
      </div>
    </main>
  );
}
