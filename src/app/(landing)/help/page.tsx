import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, HelpCircle } from "lucide-react";
import { FaqList } from "./faq-list";

export const metadata: Metadata = {
  title: "Pusat Bantuan",
  description:
    "Temukan jawaban atas pertanyaan umum seputar penggunaan platform Stack Sinau \u2014 dari cara mendaftar, mengakses materi, hingga mengumpulkan tugas.",
  openGraph: {
    title: "Pusat Bantuan | Stack Sinau",
    description:
      "Temukan jawaban atas pertanyaan umum seputar penggunaan platform Stack Sinau.",
  },
};

export default function HelpPage() {
  return (
    <main className="flex-1">
      <section className="container mx-auto px-4 py-16 lg:py-24 max-w-4xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-primary/20 p-3 rounded-2xl border-2 border-primary/50">
            <Leaf className="h-8 w-8 text-primary" strokeWidth={3} />
          </div>
          <Badge variant="outline" className="text-sm font-bold border-2 px-4 py-1.5">Dukungan</Badge>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">Pusat Bantuan</h1>
        <p className="text-lg sm:text-xl text-muted-foreground font-medium max-w-3xl leading-relaxed mb-12">
          Temukan jawaban atas pertanyaan umum seputar penggunaan platform <strong className="text-foreground">Stack Sinau</strong>. Klik pada setiap pertanyaan untuk melihat jawabannya.
        </p>

        <div className="flex items-center gap-3 mb-8">
          <HelpCircle className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-black">Pertanyaan Umum (FAQ)</h2>
        </div>

        <FaqList />

        <Card className="mt-16 border-[3px] border-border shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] rounded-3xl overflow-hidden">
          <CardContent className="p-8 sm:p-12 text-center space-y-4">
            <h3 className="text-2xl font-black">Masih butuh bantuan?</h3>
            <p className="text-muted-foreground font-medium text-lg max-w-md mx-auto">
              Jika Anda tidak menemukan jawaban yang dicari, silakan hubungi tim dukungan kami.
            </p>
            <p className="text-foreground font-black text-lg">support@stacksinau.com</p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
