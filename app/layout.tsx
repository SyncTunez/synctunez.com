import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {ThemeProvider} from "next-themes";
import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/sidebar/app-sidebar";
import {cookies} from "next/headers";
import { RegisterModal } from "@/components/RegisterModal";
import { Toaster } from "sonner";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SyncTunez",
  description: "SyncTunez",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

    const cookieStore = await cookies()
    const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"
    const userSession = cookieStore.get("UserSession")?.value ?? null;
    const userAccountRaw = cookieStore.get("UserAccount")?.value ?? null;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
      >
          <SidebarProvider defaultOpen={defaultOpen} >
              <AppSidebar />
              <main>
                  <SidebarTrigger />
                  {children}
              </main>
          </SidebarProvider>
          <RegisterModal userSession={userSession} userAccountRaw={userAccountRaw} />
      </ThemeProvider>
      <Toaster theme="system" position="top-center" />
      </body>
    </html>
  );
}
