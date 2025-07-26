import React from "react";
import { Package, Sparkles } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { Badge } from "./ui/badge";

export default function Navbar() {
  return (
    <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
            <Package className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MyShop
            </h1>
            <div className="flex items-center space-x-1">
              <Badge variant="secondary" className="text-xs">
                <Sparkles className="w-3 h-3 mr-1" />
                Pro
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
        <ModeToggle />
        </div>
      </div>
    </div>
  );
}
