import "./../globals.css";
import Header from "@/components/header";
import LeftSidebar from "@/components/left-sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <div className="grid lg:grid-cols-7 grid-cols-5 px-2 gap-6 lg:px-20">
        {/* Sidebar: hidden on mobile, visible on lg+ */}
        <div className="col-span-1 hidden sm:block">
          <LeftSidebar />
        </div>
        <main className="lg:col-span-5 md:col-span-3 sm:col-span-4 col-span-5 pt-6">{children}</main>
        <div className="col-span-1 hidden md:block">Sidebar</div>
      </div>
    </>
  );
}
