"use client";

import React, { useContext } from "react";
import { usePathname } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeProvider } from "@/components/theme-provider";
import NextTopLoader from "nextjs-toploader";
import CurrentUserContext from "@/context/CurrentUserContext";
import NotificationListener from "@/components/NotificationListener";
import SocketProvider from "@/components/socket-provider"

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/signup" || pathname === "/intro";
  const {currentLoggedInUser} = useContext(CurrentUserContext)
  const userId = currentLoggedInUser?._id;
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
          <NotificationListener userId={userId} />
          {children}
          <Toaster />
        </>
      ) : (
        <SocketProvider userId={userId}>
        <SidebarProvider>
          <NotificationListener userId={userId} />
          <div className="flex h-screen w-full overflow-hidden srollbar-hide">
            <NextTopLoader color="#ff6500" showSpinner={false} />
            <AppSidebar>{children}</AppSidebar>
          </div>
          <Toaster />
        </SidebarProvider>
        </SocketProvider>
      )}
      
    </ThemeProvider>
   
  );
};

export default Layout;
