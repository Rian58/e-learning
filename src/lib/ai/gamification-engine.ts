export interface GamificationStrategy {
  title: string;
  description: string;
  challenges: string[];
  badges: { name: string; description: string; icon: string }[];
  pointMultiplier: number;
}

const STRATEGIES: Record<string, GamificationStrategy> = {
  AKTIF: {
    title: "Pejuang Konsisten",
    description: "Kamu adalah mahasiswa yang sangat aktif! Pertahankan konsistensimu dan raih tantangan tingkat lanjut.",
    challenges: [
      "Selesaikan semua materi dalam 1 minggu",
      "Raih skor 100 di 3 kuis berturut-turut",
      "Bantu teman dengan menyelesaikan tugas sebelum deadline",
    ],
    badges: [
      { name: "Pejuang Konsisten", description: "Login dan belajar setiap hari selama 7 hari", icon: "🔥" },
      { name: "Master Kuis", description: "Raih skor sempurna di 3 kuis", icon: "🏆" },
      { name: "Speed Learner", description: "Selesaikan materi lebih cepat dari rata-rata", icon: "⚡" },
    ],
    pointMultiplier: 1.5,
  },
  PASIF: {
    title: "Pemula Potensial",
    description: "Kamu punya potensi besar! Mulai dengan langkah kecil dan bangun kebiasaan belajar yang konsisten.",
    challenges: [
      "Login ke platform minimal 3 kali minggu ini",
      "Baca 1 materi sampai selesai hari ini",
      "Coba kerjakan 1 kuis tanpa tekanan",
    ],
    badges: [
      { name: "Pemula Potensial", description: "Mulai langkah pertama dengan login 3 hari berturut", icon: "🌱" },
      { name: "Pembaca Pertama", description: "Selesaikan membaca materi pertamamu", icon: "📖" },
      { name: "Langkah Awal", description: "Kerjakan kuis pertamamu", icon: "👣" },
    ],
    pointMultiplier: 2.0,
  },
  PROCRASTINATOR: {
    title: "Bangkit Lagi",
    description: "Sepertinya kamu sering menunda. Tidak apa-apa! Mari mulai lagi dengan tantangan-tantangan kecil yang menyenangkan.",
    challenges: [
      "Kumpulkan tugas sebelum H-2 deadline",
      "Baca materi selama 15 menit tanpa gangguan",
      "Selesaikan 1 tugas yang tertunda hari ini",
    ],
    badges: [
      { name: "Bangkit Lagi", description: "Kembali aktif setelah 3 hari tidak login", icon: "💪" },
      { name: "Deadline Warrior", description: "Kumpulkan tugas sebelum deadline", icon: "⏰" },
      { name: "Recovery Champion", description: "Selesaikan 3 tugas yang tertunda", icon: "🎯" },
    ],
    pointMultiplier: 2.5,
  },
};

export function getGamificationStrategy(cluster: string): GamificationStrategy {
  return STRATEGIES[cluster] || STRATEGIES.PASIF;
}

export function calculatePoints(basePoints: number, cluster: string): number {
  const strategy = getGamificationStrategy(cluster);
  return Math.round(basePoints * strategy.pointMultiplier);
}
