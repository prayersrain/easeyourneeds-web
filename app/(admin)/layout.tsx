import AdminSidebar from "@/components/admin/admin-sidebar";
import Topbar from "@/components/dashboard/topbar";
import { requireRole } from "@/lib/auth-guard";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Only admin and super_admin can access /admin routes
  await requireRole(["admin", "super_admin"]);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-background text-foreground font-sans selection:bg-blue-500/30">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 relative">
        <Topbar />
        
        <main className="flex-1 px-4 lg:px-8 pb-12 w-full animate-fade-in relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
}
