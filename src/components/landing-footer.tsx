import { Leaf, MessageSquare, Share2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingFooter() {
  return (
    <footer className="bg-card pt-16 pb-8 border-t-[3px] border-border relative z-10 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16 mb-16">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 font-black text-xl tracking-tight">
              <div className="bg-primary p-2 rounded-lg border-2 border-primary/50 shadow-sm">
                <Leaf className="h-6 w-6 text-primary-foreground" strokeWidth={3} />
              </div>
              <span className="text-2xl">StackSinau</span>
            </div>
            <p className="text-muted-foreground font-medium text-sm leading-relaxed max-w-sm">
              Platform pembelajaran cerdas untuk kampus modern, materi terarah, dan pendampingan akademik yang lebih mudah diakses kapan saja.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" size="icon" className="rounded-full neo-button h-10 w-10 border-2">
                <MessageSquare className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full neo-button h-10 w-10 border-2">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-bold text-lg mb-6">Navigasi</h3>
            <ul className="space-y-4 text-sm font-medium text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors">Beranda</Link></li>
              <li><Link href="/fitur" className="hover:text-primary transition-colors">Fitur AI</Link></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-6">Tentang Kami</h3>
            <ul className="space-y-4 text-sm font-medium text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">Visi & Misi</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">Tim Developer</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-bold text-lg mb-6">Bantuan</h3>
            <ul className="space-y-4 text-sm font-medium text-muted-foreground">
              <li><Link href="/help" className="hover:text-primary transition-colors">Pusat Bantuan</Link></li>
              <li><Link href="/help" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Kebijakan Privasi</Link></li>
            </ul>
          </div>
          
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t-2 border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground font-medium text-sm text-center w-full">
            &copy; 2026 Stack Sinau. Seluruh hak cipta dilindungi undang-undang.
          </p>
        </div>
      </div>
    </footer>
  );
}
