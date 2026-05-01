"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion, MoveLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Decorative background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-24 w-72 h-72 bg-orange-500 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
      </div>

      <div className="z-10 text-center max-w-lg mx-auto w-full space-y-8">
        <div className="relative inline-block">
          <div className="absolute -inset-2 bg-black rounded-3xl translate-x-3 translate-y-3 neo-shadow" />
          <div className="relative bg-white border-8 border-black rounded-3xl p-10 flex flex-col items-center justify-center">
            {/* Pulsing Question Mark Icon */}
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-red-200 blur-xl rounded-full scale-110 animate-pulse" />
              <FileQuestion className="h-32 w-32 text-red-500 relative z-10" />
            </div>

            <h1 className="text-8xl font-black text-black tracking-tighter mb-2">404</h1>
            <div className="h-2 w-24 bg-black rounded-full mb-6 mx-auto" />
            
            <h2 className="text-2xl font-bold text-black mb-3">Halaman Tidak Ditemukan</h2>
            <p className="text-muted-foreground font-medium mb-8 text-sm px-4">
              Oops! Endpoint atau halaman yang Anda cari tidak tersedia. Mungkin URL salah atau halaman sudah dihapus.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
              <Button 
                variant="outline" 
                className="w-full neo-button font-bold text-base h-12"
                onClick={() => window.history.back()}
              >
                <MoveLeft className="mr-2 h-5 w-5" /> Kembali
              </Button>
              
              <Link href="/" className="w-full">
                <Button className="w-full neo-button bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base h-12">
                  <Home className="mr-2 h-5 w-5" /> Ke Beranda
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
