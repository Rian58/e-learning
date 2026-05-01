import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";
import {
  GraduationCap,
  Brain,
  Trophy,
  Flame,
  Zap,
  Target,
  Shield,
  BarChart3,
  Sparkles,
  Users,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Stack Sinau - Platform E-Learning Interaktif",
  description:
    "Platform e-learning pertama dengan AI Clustering K-Means dan Gamifikasi. Kumpulkan XP, raih badge, dan belajar sesuai gaya belajarmu bersama Stack Sinau.",
  openGraph: {
    title: "Stack Sinau - Platform E-Learning Interaktif",
    description:
      "Platform e-learning pertama dengan AI Clustering K-Means dan Gamifikasi. Kumpulkan XP, raih badge, dan belajar sesuai gaya belajarmu.",
  },
};

const FEATURES = [
  {
    icon: Brain,
    title: "AI Clustering K-Means",
    description: "Sistem cerdas mengelompokkan mahasiswa berdasarkan frekuensi login, waktu belajar, dan tingkat penyelesaian tugas secara otomatis.",
    color: "bg-violet-500/20 text-violet-500 border-violet-500",
  },
  {
    icon: Trophy,
    title: "Sistem Gamifikasi",
    description: "Kumpulkan XP, raih badge unik, dan selesaikan tantangan harian untuk membuat proses belajar terasa seperti permainan.",
    color: "bg-yellow-500/20 text-yellow-500 border-yellow-500",
  },
  {
    icon: Target,
    title: "Tantangan Adaptif",
    description: "Setiap mahasiswa mendapat tantangan berbeda sesuai kluster. Mahasiswa aktif mendapat misi lanjutan, yang pasif mendapat dorongan bertahap.",
    color: "bg-green-500/20 text-green-500 border-green-500",
  },
  {
    icon: BarChart3,
    title: "Analitik Progres Real-Time",
    description: "Pantau perkembangan XP, badge yang sudah diraih, statistik kuis, dan progres tugas dalam satu dasbor interaktif.",
    color: "bg-blue-500/20 text-blue-500 border-blue-500",
  },
  {
    icon: Zap,
    title: "Poin Multiplier Dinamis",
    description: "Mahasiswa pasif mendapat multiplier XP lebih tinggi agar termotivasi, sementara yang aktif terus ditantang untuk konsisten.",
    color: "bg-orange-500/20 text-orange-500 border-orange-500",
  },
  {
    icon: Shield,
    title: "Evaluasi Otomatis",
    description: "Kuis dan tugas dinilai secara instan oleh sistem dengan hasil yang akurat, transparan, dan bisa langsung dilihat mahasiswa.",
    color: "bg-pink-500/20 text-pink-500 border-pink-500",
  },
];

const CLUSTERS = [
  {
    label: "AKTIF",
    title: "Pejuang Konsisten",
    emoji: "🔥",
    multiplier: "1.5x",
    description: "Mahasiswa yang sangat aktif dengan frekuensi login tinggi, waktu belajar panjang, dan tingkat penyelesaian tugas yang tinggi.",
    challenges: [
      "Selesaikan semua materi dalam 1 minggu",
      "Raih skor 100 di 3 kuis berturut-turut",
    ],
    badges: ["Pejuang Konsisten", "Master Kuis", "Speed Learner"],
    color: "border-green-500 bg-green-500/10",
    badgeColor: "bg-green-500/20 text-green-500",
    iconColor: "text-green-500",
  },
  {
    label: "PROCRASTINATOR",
    title: "Bangkit Lagi",
    emoji: "💪",
    multiplier: "2.5x",
    description: "Mahasiswa yang sering menunda. Sistem memberikan dorongan ekstra berupa tantangan kecil dan multiplier XP tertinggi.",
    challenges: [
      "Kumpulkan tugas sebelum H-2 deadline",
      "Baca materi selama 15 menit tanpa gangguan",
    ],
    badges: ["Bangkit Lagi", "Deadline Warrior", "Recovery Champion"],
    color: "border-orange-500 bg-orange-500/10",
    badgeColor: "bg-orange-500/20 text-orange-500",
    iconColor: "text-orange-500",
  },
  {
    label: "PASIF",
    title: "Pemula Potensial",
    emoji: "🌱",
    multiplier: "2.0x",
    description: "Mahasiswa baru atau yang kurang aktif. Sistem memberi tantangan ringan untuk membangun kebiasaan belajar yang konsisten.",
    challenges: [
      "Login ke platform minimal 3 kali minggu ini",
      "Baca 1 materi sampai selesai hari ini",
    ],
    badges: ["Pemula Potensial", "Pembaca Pertama", "Langkah Awal"],
    color: "border-blue-500 bg-blue-500/10",
    badgeColor: "bg-blue-500/20 text-blue-500",
    iconColor: "text-blue-500",
  },
];

const STEPS = [
  { step: "01", icon: BarChart3, title: "Kumpulkan Data", description: "Sistem menganalisis frekuensi login, waktu belajar, dan tingkat penyelesaian tugas setiap mahasiswa." },
  { step: "02", icon: Brain, title: "AI Mengkluster", description: "Algoritma K-Means mengelompokkan mahasiswa ke dalam 3 kluster: Aktif, Procrastinator, dan Pasif." },
  { step: "03", icon: Flame, title: "Strategi Diberikan", description: "Setiap kluster mendapat tantangan, badge, dan poin multiplier yang berbeda sesuai kebutuhan mereka." },
];

export default function LandingPage() {
  return (
    <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center relative">
          <div className="absolute top-1/4 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>

          <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-border bg-background/50 backdrop-blur-sm font-bold text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.05)] hover:-translate-y-1 transition-transform">
              <GraduationCap className="h-5 w-5 text-primary" /> 
              <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">E-Learning Gamifikasi + AI</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5rem] font-black tracking-tight leading-[1.1]">
              Belajar Makin <br className="hidden lg:block"/>
              <span className="relative inline-block mt-2">
                <span className="relative z-10 text-primary">Cerdas & Interaktif</span>
                <span className="absolute bottom-1 sm:bottom-2 left-0 w-full h-3 sm:h-4 bg-primary/20 -z-10 -rotate-2"></span>
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground font-medium max-w-xl leading-relaxed">
              Platform e-learning pertama dengan AI Clustering dan Gamifikasi. Kumpulkan XP, raih badge, dan belajar sesuai gaya belajarmu.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-5 pt-4 w-full sm:w-auto">
              <Link href="/login" className="w-full sm:w-auto">
                <Button size="lg" className="w-full neo-button font-black text-lg h-16 px-10 hover:scale-105 transition-transform duration-300">
                  Mulai Sekarang
                </Button>
              </Link>
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full neo-button font-bold text-lg h-16 px-10 bg-background/50 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                  Buat Akun
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center justify-center lg:justify-start gap-4 pt-6 text-sm font-bold text-muted-foreground w-full">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="user" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <p>Bergabung dengan <span className="text-foreground font-black">1,000+</span> mahasiswa</p>
            </div>
          </div>

          <div className="relative flex justify-center items-center lg:h-[600px] mt-10 lg:mt-0 perspective-1000">
             <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-blue-500/20 blur-[100px] rounded-full w-full h-full m-auto animate-pulse duration-3000"></div>
             <div className="relative z-10 w-full max-w-[500px] lg:max-w-[600px] transform-gpu hover:-rotate-2 hover:scale-105 transition-all duration-700 ease-out">
               <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-20 h-full w-full top-[85%]"></div>
               <img 
                 src="/ai-learning.png" 
                 alt="AI Learning System" 
                 className="w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_20px_50px_rgba(255,255,255,0.1)] rounded-3xl"
               />
               
               <div className="absolute top-10 -left-6 bg-card border-2 border-border p-3 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] animate-bounce hidden md:flex items-center gap-3" style={{ animationDelay: '0.1s', animationDuration: '3s' }}>
                 <div className="bg-violet-500/20 p-2 rounded-lg text-violet-500"><Brain className="w-5 h-5" /></div>
                 <div>
                   <p className="text-xs text-muted-foreground font-bold">AI</p>
                   <p className="text-sm font-black">K-Means Clustering</p>
                 </div>
               </div>

               <div className="absolute bottom-20 -right-6 bg-card border-2 border-border p-3 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] animate-bounce hidden md:flex items-center gap-3" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }}>
                 <div className="bg-yellow-500/20 p-2 rounded-lg text-yellow-500"><Trophy className="w-5 h-5" /></div>
                 <div>
                   <p className="text-xs text-muted-foreground font-bold">Gamifikasi</p>
                   <p className="text-sm font-black">XP & Badge</p>
                 </div>
               </div>
             </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="fitur" className="bg-muted py-24 lg:py-32 border-y-[3px] border-border relative overflow-hidden scroll-mt-20">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
              <Badge variant="outline" className="text-sm font-bold border-2 px-4 py-1.5 mb-4">
                <Sparkles className="h-4 w-4 mr-2" /> Keunggulan Platform
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black">
                Fitur yang Membuat Belajar <span className="text-primary">Berbeda</span>
              </h2>
              <p className="text-xl text-muted-foreground font-medium">
                Perpaduan kecerdasan buatan dan gamifikasi untuk pengalaman belajar yang personal, menyenangkan, dan efektif.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {FEATURES.map((feature) => (
                <Card key={feature.title} className="group border-[3px] border-border shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)] rounded-3xl overflow-hidden hover:-translate-y-2 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[10px_10px_0px_0px_rgba(255,255,255,0.1)] transition-all duration-300">
                  <CardContent className="p-8 sm:p-10 space-y-5">
                    <div className={`h-14 w-14 ${feature.color.split(" ")[0]} rounded-2xl flex items-center justify-center border-2 ${feature.color.split(" ")[2]} group-hover:scale-110 transition-transform`}>
                      <feature.icon className={`h-7 w-7 ${feature.color.split(" ")[1]}`} />
                    </div>
                    <h3 className="text-xl font-black">{feature.title}</h3>
                    <p className="text-muted-foreground font-medium leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How Clustering Works */}
        <section id="ai-clustering" className="container mx-auto px-4 py-24 lg:py-32 relative overflow-hidden scroll-mt-20">
          <div className="absolute top-1/3 left-0 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px] -z-10"></div>
          <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10"></div>

          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <Badge variant="outline" className="text-sm font-bold border-2 px-4 py-1.5 mb-4">
              <Brain className="h-4 w-4 mr-2" /> Teknologi AI
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black">
              Cara Kerja <span className="text-primary">AI Clustering</span>
            </h2>
            <p className="text-xl text-muted-foreground font-medium">
              Algoritma K-Means menganalisis perilaku belajar mahasiswa dan mengelompokkan mereka ke dalam 3 kluster unik, masing-masing dengan strategi gamifikasi yang berbeda.
            </p>
          </div>

          {/* How it works steps */}
          <div className="grid sm:grid-cols-3 gap-6 lg:gap-8 mb-20">
            {STEPS.map((item) => (
              <Card key={item.step} className="border-[3px] border-border shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)] rounded-3xl overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                <CardContent className="p-8 space-y-4 text-center">
                  <span className="text-5xl font-black text-primary/30">{item.step}</span>
                  <div className="h-14 w-14 bg-primary/20 rounded-2xl flex items-center justify-center border-2 border-primary mx-auto group-hover:scale-110 transition-transform">
                    <item.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-black">{item.title}</h3>
                  <p className="text-muted-foreground font-medium leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Cluster Cards */}
          <div className="grid lg:grid-cols-3 gap-8">
            {CLUSTERS.map((cluster) => (
              <Card key={cluster.label} className={`border-[3px] ${cluster.color} shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)] rounded-3xl overflow-hidden group hover:-translate-y-2 transition-all duration-300`}>
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{cluster.emoji}</span>
                      <div>
                        <Badge className={`${cluster.badgeColor} font-black text-xs`}>{cluster.label}</Badge>
                        <h3 className="text-xl font-black mt-1">{cluster.title}</h3>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground font-bold">Multiplier</p>
                      <p className={`text-2xl font-black ${cluster.iconColor}`}>{cluster.multiplier}</p>
                    </div>
                  </div>

                  <p className="text-muted-foreground font-medium leading-relaxed text-sm">{cluster.description}</p>

                  <div className="space-y-2">
                    <p className="text-xs font-black text-foreground uppercase tracking-wider">Tantangan</p>
                    {cluster.challenges.map((c) => (
                      <div key={c} className="flex items-start gap-2 text-sm">
                        <ArrowRight className={`h-4 w-4 mt-0.5 flex-shrink-0 ${cluster.iconColor}`} />
                        <span className="text-muted-foreground font-medium">{c}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-black text-foreground uppercase tracking-wider">Badge</p>
                    <div className="flex flex-wrap gap-2">
                      {cluster.badges.map((b) => (
                        <Badge key={b} variant="outline" className="text-xs font-bold border-2">{b}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-muted py-20 lg:py-24 border-y-[3px] border-border relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-blue-500/5 pointer-events-none"></div>
          <div className="container mx-auto px-4 text-center relative z-10 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-background/50 backdrop-blur-sm font-bold text-sm">
              <Users className="h-4 w-4 text-primary" /> Mulai Perjalananmu
            </div>
            <h2 className="text-4xl md:text-5xl font-black max-w-2xl mx-auto">
              Siap Tahu Gaya Belajarmu?
            </h2>
            <p className="text-xl text-muted-foreground font-medium max-w-xl mx-auto">
              Daftar sekarang dan biarkan AI kami menganalisis pola belajarmu. Raih XP, kumpulkan badge, dan belajar dengan cara yang paling cocok untukmu.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4">
              <Link href="/register">
                <Button size="lg" className="neo-button font-black text-lg h-16 px-12 hover:scale-105 transition-transform duration-300">
                  Daftar Gratis Sekarang
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
  );
}
