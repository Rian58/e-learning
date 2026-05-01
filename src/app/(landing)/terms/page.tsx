import { Leaf } from "lucide-react";

export const metadata = {
  title: "Syarat & Ketentuan",
  description:
    "Baca Syarat & Ketentuan penggunaan platform Stack Sinau. Ketahui hak dan kewajiban Anda sebagai pengguna layanan e-learning kami.",
  robots: { index: false, follow: false },
};

export default function TermsPage() {
  return (
    <main className="container mx-auto px-4 py-16 max-w-4xl min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-primary/20 p-3 rounded-2xl border-2 border-primary/50">
          <Leaf className="h-8 w-8 text-primary" strokeWidth={3} />
        </div>
        <h1 className="text-4xl font-black tracking-tight">Syarat & Ketentuan</h1>
      </div>
      <div className="space-y-6 text-lg text-muted-foreground font-medium leading-relaxed bg-card p-8 sm:p-12 rounded-3xl border-[3px] border-border shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)]">
        <p>
          Terakhir diperbarui: <strong className="text-foreground">{new Date().toLocaleDateString('id-ID')}</strong>
        </p>
        <p>
          Dengan mengakses dan menggunakan platform <strong className="text-foreground">Stack Sinau</strong>, Anda setuju untuk terikat pada Syarat dan Ketentuan berikut. Jika Anda tidak menyetujui bagian mana pun dari persyaratan ini, Anda dilarang menggunakan layanan kami.
        </p>
        <h2 className="text-2xl font-black text-foreground mt-8">1. Penggunaan Layanan</h2>
        <p>
          Anda hanya boleh menggunakan platform ini untuk tujuan pendidikan yang sah. Anda dilarang mendistribusikan konten ilegal, melakukan aktivitas peretasan, atau mencoba memanipulasi sistem evaluasi (kecurangan).
        </p>
        <h2 className="text-2xl font-black text-foreground mt-8">2. Akun Pengguna</h2>
        <p>
          Anda bertanggung jawab menjaga kerahasiaan kata sandi akun Anda. Anda juga bertanggung jawab penuh atas setiap aktivitas yang terjadi di bawah akun Anda.
        </p>
        <h2 className="text-2xl font-black text-foreground mt-8">3. Hak Kekayaan Intelektual</h2>
        <p>
          Semua materi, desain, teks, grafik, dan sistem perangkat lunak yang membentuk platform Stack Sinau adalah hak cipta kami. Namun, hak cipta materi pembelajaran milik masing-masing pendidik atau institusi tetap menjadi milik mereka.
        </p>
      </div>
    </main>
  );
}
