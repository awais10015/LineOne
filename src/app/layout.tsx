import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Layout from "@/components/layout/Layout";
import CurrentUserContextProvider from "@/context/CurrentUserContextProvider";
import AnotherUserContextProvider from "@/context/AnotherUserContextProvider";
import NotificationContextProvider from "@/context/NotificationContextProvider"
import NewMessageContextProvider from "@/context/NewMessageContextProvider"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LineOne",
  description: "Lets connect",
  icons: {
    icon: "/logo.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CurrentUserContextProvider>
          <AnotherUserContextProvider>
            <NewMessageContextProvider>
              <NotificationContextProvider>
                <Layout>{children}</Layout>
              </NotificationContextProvider>
            </NewMessageContextProvider>
          </AnotherUserContextProvider>
        </CurrentUserContextProvider>
      </body>
    </html>
  );
}
