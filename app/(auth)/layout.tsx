
import { Sparkles } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex w-full bg-slate-50 dark:bg-slate-950 font-sans selection:bg-blue-500/30">
      {/* Left Pane - Decorative (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-zinc-900 overflow-hidden items-end p-20">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-blue-600/20 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-600/20 blur-[100px]" />
          <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-cyan-500/10 blur-[80px]" />
        </div>

        {/* Diagonal stripes overlay */}
        <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#fff_10px,#fff_11px)]" />

        <div className="relative z-10 w-full text-white">
          <div className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold font-heading tracking-tight">Ease Your Needs</h1>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black font-heading tracking-tight leading-tight mb-6">
            Everything you need for a <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-indigo-400">Perfect Event</span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-lg mb-8">
            Manage your Zoom rentals, hire professional MCs, and get expert Operators all in one seamless platform.
          </p>
          
          {/* Testimonial snippet */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 mt-12 w-fit">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-zinc-900 bg-zinc-800 flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-linear-to-tr from-blue-400 to-indigo-500 opacity-80" />
                </div>
              ))}
            </div>
            <div className="text-sm">
              <p className="font-semibold text-white">Trusted by 1000+ clients</p>
              <p className="text-zinc-500">Across Indonesia</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Pane - Form Area */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
         {/* Mobile Decorative Blobs */}
         <div className="absolute inset-0 overflow-hidden lg:hidden z-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3" />
        </div>

        <div className="w-full max-w-md relative z-10">
           {children}
        </div>
      </div>
    </div>
  );
}
