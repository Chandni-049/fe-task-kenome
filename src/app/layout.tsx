import QueryProvider from "@/lib/query-provider";
import "@/styles/globals.css";
import Navbar from "@/components/navbar";

import "react-toastify/dist/ReactToastify.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "All Products – MyShop",
  description: "Product management system with CRUD operations",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <ToastContainer />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
              <Navbar />
              {children}
            </div>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
