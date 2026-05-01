export const APP_CONFIG = {
  name: "Stack Sinau",
  description: "Platform E-Learning Interaktif & Modern",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://stacksinau.henss.my.id",
} as const;


export const NAV_ITEMS = {
  mahasiswa: [
    { href: "/dashboard", label: "Dasbor", icon: "LayoutDashboard" },
    { href: "/courses", label: "Mata Kuliah", icon: "BookOpen" },
    { href: "/enroll", label: "Gabung Kelas", icon: "KeyRound" },
    { href: "/leaderboard", label: "Papan Peringkat", icon: "Trophy" },
    { href: "/profile", label: "Pengaturan Profil", icon: "Settings" },
  ],
  dosen: [
    { href: "/manage", label: "Kelola Mata Kuliah", icon: "BookOpen" },
    { href: "/manage/students", label: "Progres Mahasiswa", icon: "Users" },
    { href: "/admin/behavior", label: "Analitik AI", icon: "Brain" },
    { href: "/profile", label: "Pengaturan Profil", icon: "Settings" },
  ],
  admin: [
    { href: "/admin", label: "Daftar Pengguna", icon: "Users" },
    { href: "/admin/courses", label: "Semua Mata Kuliah", icon: "BookOpen" },
    { href: "/admin/behavior", label: "Analitik AI", icon: "Brain" },
    { href: "/admin/settings", label: "Pengaturan Sistem", icon: "Settings" },
  ],
} as const;
