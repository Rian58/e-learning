import { Leaf, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col-reverse lg:flex-row bg-background relative overflow-hidden selection:bg-primary selection:text-primary-foreground">
      
      {/* Left Side - Modern Abstract Decoration */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center p-12 overflow-hidden bg-muted/20 border-r-2 border-border/50">
        {/* Subtle Grid Pattern Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        
        {/* Glowing Orbs */}
        <div className="absolute top-1/3 left-1/3 w-[30rem] h-[30rem] bg-primary/20 rounded-full blur-[120px] mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[25rem] h-[25rem] bg-violet-500/20 rounded-full blur-[100px] mix-blend-screen animate-pulse delay-1000"></div>

        <div className="relative z-10 w-full max-w-lg flex flex-col justify-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-border/50 bg-background/80 backdrop-blur-md font-bold text-sm shadow-sm w-max mb-4">
            <Sparkles className="h-4 w-4 text-primary" /> 
            <span>Sistem E-Learning Cerdas</span>
          </div>
          
          <h1 className="text-5xl xl:text-6xl font-black tracking-tight leading-[1.1]">
            Evolusi Cara <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-500">
              Belajarmu
            </span>
          </h1>
          
          <p className="text-lg text-muted-foreground font-medium max-w-md">
            Platform pembelajaran adaptif yang menganalisis gaya belajarmu, memberikan tantangan harian, dan mengubah progres menjadi pencapaian nyata.
          </p>

          {/* Abstract Floating UI Elements */}
          <div className="relative h-48 w-full mt-8 perspective-1000">
            {/* Feature Card 1 */}
            <div className="absolute top-0 left-0 bg-card/80 backdrop-blur-xl border-2 border-border p-4 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] w-64 transform-gpu -rotate-6 hover:rotate-0 hover:-translate-y-2 transition-all duration-500 z-20">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-8 rounded-lg bg-green-500/20 flex items-center justify-center border border-green-500/50">
                  <Leaf className="h-4 w-4 text-green-500" />
                </div>
                <span className="font-bold text-sm">Kluster Aktif</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-[85%] rounded-full"></div>
              </div>
            </div>

            {/* Feature Card 2 */}
            <div className="absolute top-12 left-32 bg-card/80 backdrop-blur-xl border-2 border-border p-4 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] w-64 transform-gpu rotate-3 hover:rotate-0 hover:-translate-y-2 transition-all duration-500 z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-8 rounded-lg bg-violet-500/20 flex items-center justify-center border border-violet-500/50">
                  <Sparkles className="h-4 w-4 text-violet-500" />
                </div>
                <span className="font-bold text-sm">XP Multiplier</span>
              </div>
              <p className="text-2xl font-black">1.5x <span className="text-xs text-muted-foreground font-medium">Boost</span></p>
            </div>
          </div>

        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-16 z-10 w-full lg:w-1/2 overflow-y-auto bg-background">
        <div className="w-full max-w-[400px] space-y-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-8 bg-card px-4 py-2 rounded-xl border-2 border-border shadow-[4px_4px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_rgba(255,255,255,0.1)] hover:-translate-y-1 transition-transform w-max">
            <Leaf className="h-6 w-6 text-primary" strokeWidth={3} />
            <h2 className="text-xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">Stack Sinau</span>
            </h2>
          </Link>
          
          <div className="w-full relative animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </div>
      </div>

    </div>
  );
}
