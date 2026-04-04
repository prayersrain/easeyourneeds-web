import Sidebar from "@/components/dashboard/sidebar";
import Topbar from "@/components/dashboard/topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 relative">
        <Topbar />
        
        <main className="flex-1 px-4 lg:px-8 pb-12 w-full animate-fade-in relative z-10">
          {children}
        </main>
      </div>
      
      {/* Background Decorators */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none translate-x-1/3 translate-y-1/3" />
    </div>
  );
}
