"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  UserPlus,
  LogIn,
  BookOpen,
  FileUp,
  BarChart3,
  MessageSquare,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const FAQ_ITEMS = [
  {
    question: "Bagaimana cara mendaftar akun di Stack Sinau?",
    answer: "Klik tombol \"Daftar\" di halaman utama. Isi formulir pendaftaran dengan nama lengkap, email aktif, dan kata sandi minimal 6 karakter. Anda juga bisa mendaftar langsung menggunakan akun Google.",
    icon: UserPlus,
  },
  {
    question: "Bagaimana cara masuk ke akun saya?",
    answer: "Klik tombol \"Masuk\" di halaman utama, lalu masukkan email dan kata sandi yang telah didaftarkan. Alternatifnya, gunakan opsi \"Masuk dengan Google\" untuk akses yang lebih cepat.",
    icon: LogIn,
  },
  {
    question: "Bagaimana cara mengakses materi pembelajaran?",
    answer: "Setelah masuk, buka menu \"Kelas Saya\" di dasbor. Pilih kelas yang ingin Anda pelajari, lalu klik pada modul atau topik yang tersedia untuk membuka materi dalam bentuk teks, video, atau file unduhan.",
    icon: BookOpen,
  },
  {
    question: "Bagaimana cara mengumpulkan tugas?",
    answer: "Masuk ke kelas Anda, lalu pilih tugas yang sedang aktif. Klik tombol \"Kumpulkan Tugas\", unggah file tugas Anda pada kolom yang disediakan, lalu tekan \"Kirim\". Pastikan Anda mengumpulkan sebelum batas waktu yang ditentukan.",
    icon: FileUp,
  },
  {
    question: "Bagaimana cara melihat nilai dan progres belajar?",
    answer: "Buka menu \"Dasbor\" atau \"Analitik\" di sidebar navigasi. Di sana Anda dapat melihat ringkasan nilai, statistik pengerjaan tugas, progres per mata kuliah, serta pencapaian badge dan XP dari sistem gamifikasi.",
    icon: BarChart3,
  },
  {
    question: "Bagaimana cara berkomunikasi dengan dosen?",
    answer: "Setiap kelas memiliki fitur diskusi. Anda bisa membuka halaman kelas dan menggunakan kolom komentar atau forum diskusi untuk mengajukan pertanyaan langsung kepada dosen atau berdiskusi dengan sesama mahasiswa.",
    icon: MessageSquare,
  },
];

function FaqItem({ item }: { item: typeof FAQ_ITEMS[number] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className={`border-[3px] border-border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? "shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)]" : "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]"}`}>
      <CardHeader className="p-0">
        <Button
          variant="ghost"
          className="w-full h-auto p-5 sm:p-6 flex items-center gap-4 justify-start text-left rounded-none hover:bg-muted/50"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="h-10 w-10 sm:h-12 sm:w-12 bg-primary/20 rounded-xl flex items-center justify-center border-2 border-primary flex-shrink-0">
            <item.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </div>
          <CardTitle className="flex-1 text-base sm:text-lg font-black leading-snug whitespace-normal">
            {item.question}
          </CardTitle>
          <ChevronDown className={`h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
        </Button>
      </CardHeader>
      {isOpen && (
        <CardContent className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0 ml-14 sm:ml-16">
          <p className="text-muted-foreground font-medium leading-relaxed text-base">
            {item.answer}
          </p>
        </CardContent>
      )}
    </Card>
  );
}

export function FaqList() {
  return (
    <div className="space-y-4">
      {FAQ_ITEMS.map((item) => (
        <FaqItem key={item.question} item={item} />
      ))}
    </div>
  );
}
