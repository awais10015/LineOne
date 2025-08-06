"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeProvider } from "@/components/theme-provider";



const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  return (
    
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {isAuthPage ? (
            <>
              {children}
              <Toaster />
            </>
          ) : (
            <SidebarProvider>
              <div className="flex h-screen w-full overflow-hidden">
                <AppSidebar children={children} />
                {/* <main className="flex-1 overflow-y-auto">
                {children}
              </main> */}
              </div>
              <Toaster />
            </SidebarProvider>
          )}
        </ThemeProvider>
      
  );
};

export default Layout;
