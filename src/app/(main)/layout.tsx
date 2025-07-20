import { AppSidebar } from "@/components/app-sidebar";
import "./../globals.css";
import Header from "@/components/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Header />
          <main className="px-2">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
