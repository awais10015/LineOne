import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar2";
import { ChatSidebar } from "@/components/ChatSidebar";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden srollbar-hide">
        <ChatSidebar>{children}</ChatSidebar>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
