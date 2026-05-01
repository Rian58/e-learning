"use client";

import { useState, useEffect } from "react";
import { Leaf, Menu } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

export default function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const NavLinks = ({ mobile }: { mobile?: boolean }) => (
    <>
      <Link href="/#fitur" onClick={() => mobile && setIsOpen(false)} className={`font-bold text-foreground hover:text-primary transition-colors ${mobile ? 'block py-3 px-4 rounded-lg hover:bg-muted' : ''}`}>Fitur</Link>
      <Link href="/#ai-clustering" onClick={() => mobile && setIsOpen(false)} className={`font-bold text-foreground hover:text-primary transition-colors ${mobile ? 'block py-3 px-4 rounded-lg hover:bg-muted' : ''}`}>AI Clustering</Link>
      <Link href="/about" onClick={() => mobile && setIsOpen(false)} className={`font-bold text-foreground hover:text-primary transition-colors ${mobile ? 'block py-3 px-4 rounded-lg hover:bg-muted' : ''}`}>Tentang Kami</Link>
      <Link href="/help" onClick={() => mobile && setIsOpen(false)} className={`font-bold text-foreground hover:text-primary transition-colors ${mobile ? 'block py-3 px-4 rounded-lg hover:bg-muted' : ''}`}>Pusat Bantuan</Link>
    </>
  );

  return (
    <>
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-background/70 backdrop-blur-lg border-b-[3px] border-border shadow-sm' : 'bg-background border-b-[3px] border-transparent'}`}>
        <div className="container mx-auto px-4 h-16 sm:h-20 flex items-center justify-between gap-2">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 font-black text-xl sm:text-2xl tracking-tight flex-shrink-0">
          <div className="bg-primary/20 p-1.5 sm:p-2 rounded-xl border-2 border-primary/50">
            <Leaf className="h-5 w-5 sm:h-7 sm:w-7 text-primary" strokeWidth={3} />
          </div>
          <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent whitespace-nowrap">Stack Sinau</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8 mx-4">
          <NavLinks />
        </nav>

        {/* Actions (Desktop & Mobile) */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <ThemeToggle />
          
          <div className="hidden sm:flex items-center gap-2 sm:gap-4">
            <Link href="/login">
              <Button variant="outline" className="neo-button font-bold text-base px-6 h-11">
                Masuk
              </Button>
            </Link>
            <Link href="/register">
              <Button className="neo-button font-bold text-base px-6 h-11">Daftar</Button>
            </Link>
          </div>

          {/* Mobile Menu Hamburger */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger render={<Button variant="outline" size="icon" className="lg:hidden neo-button h-10 w-10" />}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-sm border-l-[3px] border-border flex flex-col p-6">
              <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
              <div className="flex flex-col gap-6 mt-10">
                <nav className="flex flex-col gap-2 text-lg">
                  <NavLinks mobile />
                </nav>
                <div className="h-[2px] w-full bg-border"></div>
                <div className="flex flex-col gap-3">
                  <Link href="/login" className="w-full" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full neo-button font-bold text-base h-12">
                      Masuk
                    </Button>
                  </Link>
                  <Link href="/register" className="w-full" onClick={() => setIsOpen(false)}>
                    <Button className="w-full neo-button font-bold text-base h-12">Daftar</Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      {/* Spacer to prevent content from jumping up behind the fixed navbar */}
      <div className="h-16 sm:h-20 w-full flex-shrink-0"></div>
    </>
  );
}
