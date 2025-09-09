'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ArrowRight, Lock, Palette, Sparkles, BarChart3 } from "lucide-react";

export default function Navigation() {
  const pathname = usePathname();

  const creativeWorkflowItems = [
    { href: "/moodboard", label: "Moodboard", icon: Palette, step: "1" },
    { href: "/lookbook", label: "Lookbook", icon: Sparkles, step: "2" },
  ];

  const isCreativeWorkflow = pathname === "/moodboard" || pathname === "/lookbook";

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-bold text-xl">
            Tessellate
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link
              href="/"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/"
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              Home
            </Link>
            
            {/* Creative Workflow Section */}
            <div className="flex items-center space-x-1">
              <span className="text-xs text-muted-foreground font-medium px-2 py-1 bg-purple-50 rounded">
                Creative Workflow
              </span>
              {creativeWorkflowItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <div key={item.href} className="flex items-center">
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm"
                          : "text-muted-foreground hover:text-primary hover:bg-purple-50"
                      )}
                    >
                      <Icon className="h-3 w-3" />
                      {item.step}. {item.label}
                    </Link>
                    {index < creativeWorkflowItems.length - 1 && (
                      <ArrowRight className="h-3 w-3 text-gray-400 mx-1" />
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Divider */}
            <div className="h-4 w-px bg-gray-300" />
            
            {/* Dashboard */}
            <Link
              href="/dashboard"
              className={cn(
                "flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium transition-all duration-200",
                pathname === "/dashboard"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-muted-foreground hover:text-blue-600 hover:bg-blue-50"
              )}
            >
              <BarChart3 className="h-3 w-3" />
              Dashboard
              <Lock className="h-3 w-3 text-amber-500" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}