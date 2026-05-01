import { Leaf } from "lucide-react";

export const metadata = {
  title: "Kebijakan Privasi",
  description:
    "Kebijakan Privasi Stack Sinau — pelajari bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda.",
  robots: { index: false, follow: false },
};

export default function PrivacyPage() {
  return (
    <main className="container mx-auto px-4 py-16 max-w-4xl min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-primary/20 p-3 rounded-2xl border-2 border-primary/50">
          <Leaf className="h-8 w-8 text-primary" strokeWidth={3} />
        </div>
        <h1 className="text-4xl font-black tracking-tight">Kebijakan Privasi</h1>
      </div>
      <div className="space-y-6 text-lg text-muted-foreground font-medium leading-relaxed bg-card p-8 sm:p-12 rounded-3xl border-[3px] border-border shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)]">
        <p>
          Terakhir diperbarui: <strong className="text-foreground">{new Date().toLocaleDateString('id-ID')}</strong>
        </p>
        <p>
          <strong className="text-foreground">Stack Sinau</strong> sangat menghargai privasi Anda. Halaman ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda saat menggunakan platform kami.
        </p>
        <h2 className="text-2xl font-black text-foreground mt-8">Informasi yang Kami Kumpulkan</h2>
        <p>
          Kami mengumpulkan informasi yang Anda berikan langsung saat mendaftar, seperti nama, alamat email, dan data akademis terkait. Selain itu, sistem secara otomatis mencatat aktivitas penggunaan, seperti alamat IP dan data log untuk meningkatkan keamanan dan kualitas layanan.
        </p>
        <h2 className="text-2xl font-black text-foreground mt-8">Penggunaan Informasi</h2>
        <p>
          Data yang dikumpulkan digunakan secara eksklusif untuk memfasilitasi proses pembelajaran, menyediakan analitik kemajuan belajar bagi pengguna dan institusi terkait, serta memberitahukan pembaruan platform.
        </p>
        <h2 className="text-2xl font-black text-foreground mt-8">Keamanan Data</h2>
        <p>
          Kami menggunakan standar enkripsi terkini untuk melindungi semua data pengguna. Informasi pribadi Anda tidak akan pernah dijual kepada pihak ketiga mana pun tanpa persetujuan tertulis Anda.
        </p>
      </div>
    </main>
  );
}
