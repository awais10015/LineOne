"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeProvider } from "@/components/theme-provider";
import NextTopLoader from "nextjs-toploader";


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
          <NextTopLoader color="#ff6500" showSpinner={false} />
          {children}
          <Toaster />
        </>
      ) : (
        <SidebarProvider>
          <div className="flex h-screen w-full overflow-hidden srollbar-hide">
            <NextTopLoader color="#ff6500" showSpinner={false} />
            <AppSidebar>{children}</AppSidebar>
          </div>
          <Toaster />
        </SidebarProvider>
      )}
      
    </ThemeProvider>
   
  );
};

export default Layout;
