import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, Target, Eye, Users, Code, Palette, Megaphone } from "lucide-react";

export const metadata = {
  title: "Tentang Kami",
  description:
    "Kenali lebih dalam Stack Sinau — tim, visi, dan misi di balik platform e-learning dengan AI Clustering dan Gamifikasi untuk mahasiswa Indonesia.",
  openGraph: {
    title: "Tentang Kami | Stack Sinau",
    description:
      "Kenali lebih dalam Stack Sinau — tim, visi, dan misi di balik platform e-learning dengan AI Clustering dan Gamifikasi.",
  },
};

const TEAM_MEMBERS = [
  {
    name: "Hendri Hariansah",
    role: "Arsitektur Sistem Utama",
    icon: Code,
    color: "bg-blue-500/20 text-blue-500 border-blue-500",
    description: "Bertanggung jawab atas perancangan dan pengembangan arsitektur inti platform Stack Sinau.",
  },
  {
    name: "Yulian Slamet Prasetyo",
    role: "UI/UX Desain Sistem",
    icon: Palette,
    color: "bg-purple-500/20 text-purple-500 border-purple-500",
    description: "Merancang antarmuka dan pengalaman pengguna yang intuitif, modern, dan responsif.",
  },
  {
    name: "Mayzal Arif Nurrizqi",
    role: "Manajemen Pemasaran Produk",
    icon: Megaphone,
    color: "bg-orange-500/20 text-orange-500 border-orange-500",
    description: "Mengelola strategi pemasaran dan pertumbuhan produk agar menjangkau lebih banyak pengguna.",
  },
];

export default function AboutPage() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 lg:py-24 max-w-5xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-primary/20 p-3 rounded-2xl border-2 border-primary/50">
            <Leaf className="h-8 w-8 text-primary" strokeWidth={3} />
          </div>
          <Badge variant="outline" className="text-sm font-bold border-2 px-4 py-1.5">Tentang Platform</Badge>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-6">Tentang Kami</h1>
        <p className="text-lg sm:text-xl text-muted-foreground font-medium max-w-3xl leading-relaxed">
          <strong className="text-foreground">Stack Sinau</strong> adalah platform E-Learning modern yang didedikasikan untuk membawa inovasi dan kemudahan dalam dunia pendidikan digital. Kami percaya bahwa belajar haruslah menjadi pengalaman yang interaktif, cerdas, dan dapat diakses dari mana saja.
        </p>
      </section>

      {/* Visi & Misi Section */}
      <section className="bg-muted py-20 lg:py-28 border-y-[3px] border-border relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-primary/5 to-transparent pointer-events-none"></div>
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-center mb-16">Visi & Misi</h2>
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <Card className="border-[3px] border-border shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] rounded-3xl overflow-hidden">
              <CardContent className="p-8 sm:p-10 space-y-6">
                <div className="h-16 w-16 bg-primary/20 rounded-2xl flex items-center justify-center border-2 border-primary">
                  <Eye className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-black">Visi</h3>
                <p className="text-muted-foreground font-medium text-lg leading-relaxed">
                  Menjadi ekosistem digital utama bagi institusi pendidikan di Indonesia, yang menghubungkan pendidik dan peserta didik melalui teknologi pembelajaran yang inovatif dan inklusif.
                </p>
              </CardContent>
            </Card>
            <Card className="border-[3px] border-border shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] rounded-3xl overflow-hidden">
              <CardContent className="p-8 sm:p-10 space-y-6">
                <div className="h-16 w-16 bg-blue-500/20 rounded-2xl flex items-center justify-center border-2 border-blue-500">
                  <Target className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-2xl font-black">Misi</h3>
                <ul className="text-muted-foreground font-medium text-lg leading-relaxed space-y-3 list-disc list-inside">
                  <li>Menyediakan alat pembelajaran yang diperkaya dengan kecerdasan buatan.</li>
                  <li>Membangun sistem evaluasi yang transparan dan akurat.</li>
                  <li>Memfasilitasi kolaborasi aktif antara dosen dan mahasiswa.</li>
                  <li>Menjamin aksesibilitas platform dari berbagai perangkat.</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Tim Developer Section */}
      <section className="container mx-auto px-4 py-20 lg:py-28 max-w-5xl">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 mx-auto">
            <Users className="h-6 w-6 text-primary" />
            <Badge variant="outline" className="text-sm font-bold border-2 px-4 py-1.5">Tim Pengembang</Badge>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Dibalik Layar Stack Sinau
          </h2>
          <p className="text-lg text-muted-foreground font-medium">
            Dikembangkan oleh tim ahli yang penuh semangat dalam memadukan teknologi terbaru dengan kebutuhan edukasi.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {TEAM_MEMBERS.map((member) => (
            <Card key={member.name} className="group border-[3px] border-border shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)] rounded-3xl overflow-hidden hover:-translate-y-2 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[10px_10px_0px_0px_rgba(255,255,255,0.1)] transition-all duration-300">
              <CardContent className="p-8 flex flex-col items-center text-center space-y-5">
                <div className="relative">
                  <div className={`h-20 w-20 ${member.color.split(" ")[0]} rounded-2xl flex items-center justify-center border-2 ${member.color.split(" ")[2]} group-hover:scale-110 transition-transform duration-300`}>
                    <member.icon className={`h-10 w-10 ${member.color.split(" ")[1]}`} />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black">{member.name}</h3>
                  <Badge className={`${member.color.split(" ")[0]} ${member.color.split(" ")[1]} border ${member.color.split(" ")[2]} font-bold text-xs`}>
                    {member.role}
                  </Badge>
                </div>
                <p className="text-muted-foreground font-medium leading-relaxed">
                  {member.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
