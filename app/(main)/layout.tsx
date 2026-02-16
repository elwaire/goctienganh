import Header from "@/components/layouts/Header";
import Sidebar from "@/components/layouts/Sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-2">
      <Sidebar />
      <div className="flex-1 py-2 pr-4">
        <Header />
        <main className="flex-1 mt-2 ">
          <div className="min-h-[calc(100vh-2rem)] p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
