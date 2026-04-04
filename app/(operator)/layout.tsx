import OperatorSidebar from "@/components/operator/operator-sidebar";
import Topbar from "@/components/dashboard/topbar";
import { requireRole } from "@/lib/auth-guard";

export default async function OperatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Only operators, admins, and super_admins can access /operator routes
  await requireRole(["operator", "admin", "super_admin"]);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-background text-foreground font-sans selection:bg-emerald-500/30">
      <OperatorSidebar />
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 relative">
        <Topbar />
        
        <main className="flex-1 px-4 lg:px-8 pb-12 w-full animate-fade-in relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
}
