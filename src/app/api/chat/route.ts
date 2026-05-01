import { gemini, GEMINI_MODEL } from "@/lib/ai/gemini";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

interface ChatMessage {
  role: "user" | "model";
  content: string;
}

interface ChatRequestBody {
  messages: ChatMessage[];
}

const LANDING_SYSTEM_PROMPT = `Kamu adalah "Sinau AI", asisten virtual ramah dari platform e-learning Stack Sinau.
Tugasmu adalah menjawab pertanyaan pengunjung yang BELUM login tentang platform ini.

Tentang Stack Sinau:
- Platform e-learning modern berbasis web untuk mahasiswa dan dosen.
- Menggunakan teknologi AI Clustering (K-Means) untuk mengelompokkan mahasiswa berdasarkan perilaku belajar: frekuensi login, waktu belajar, dan tingkat penyelesaian tugas.
- Terdapat 3 kluster: AKTIF (Pejuang Konsisten), PROCRASTINATOR (Bangkit Lagi), PASIF (Pemula Potensial).
- Memiliki sistem gamifikasi: XP (Experience Points), Badge, Tantangan Harian, dan Poin Multiplier dinamis.
- Fitur utama: Dasbor Cerdas, Kelas Online, Materi Pembelajaran, Kuis & Tugas, Analitik Progres, Leaderboard.
- Untuk mendaftar, klik tombol "Daftar" di halaman utama dan isi formulir, atau gunakan akun Google.
- Untuk masuk, klik tombol "Masuk" dan gunakan email serta kata sandi yang terdaftar.

Aturan:
- Jawab dalam Bahasa Indonesia yang santai tapi profesional.
- Jawaban singkat, padat, dan informatif (maksimal 3-4 kalimat).
- Jika ditanya hal di luar konteks platform, arahkan kembali ke topik Stack Sinau.
- Jangan pernah membuat informasi palsu tentang fitur yang tidak ada.`;

function buildDashboardSystemPrompt(context: string): string {
  return `Kamu adalah "Sinau AI", asisten belajar personal dari platform e-learning Stack Sinau.
Kamu sedang membantu seorang mahasiswa yang sudah login. Berikut data konteks mahasiswa ini:

${context}

Tugasmu:
- Bantu mahasiswa memahami progres belajarnya berdasarkan data kluster dan gamifikasi.
- Berikan saran belajar yang personal sesuai kluster perilaku mereka.
- Jawab pertanyaan seputar penggunaan fitur platform (kelas, tugas, kuis, badge, XP, leaderboard).
- Motivasi mahasiswa untuk terus belajar sesuai tantangan yang diberikan sistem.

Aturan:
- Jawab dalam Bahasa Indonesia yang santai, ramah, dan memotivasi.
- Jawaban singkat dan actionable (maksimal 4-5 kalimat).
- Panggil mahasiswa dengan namanya jika tersedia.
- Jika ditanya hal di luar konteks platform, arahkan kembali ke topik pembelajaran.`;
}

async function getUserContext(userId: string): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, role: true },
  });

  if (!user) return "Data pengguna tidak ditemukan.";

  const behaviorProfile = await prisma.behaviorProfile.findUnique({
    where: { userId },
  });

  const badges = await prisma.badge.findMany({
    where: { userId },
    select: { name: true, description: true },
    take: 10,
  });

  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: { course: { select: { title: true } } },
    take: 5,
  });

  let context = `Nama: ${user.name}\nRole: ${user.role}\n`;

  if (behaviorProfile) {
    const strategy = behaviorProfile.strategy as Record<string, unknown> | null;
    context += `\nKluster Perilaku: ${behaviorProfile.cluster}`;
    context += `\nFrekuensi Login: ${behaviorProfile.loginFrequency}`;
    context += `\nWaktu Belajar: ${behaviorProfile.studyTime} jam`;
    context += `\nTingkat Penyelesaian: ${(behaviorProfile.completionRate * 100).toFixed(0)}%`;
    if (strategy && typeof strategy === "object" && "title" in strategy) {
      context += `\nJudul Strategi: ${strategy.title}`;
      context += `\nDeskripsi: ${strategy.description}`;
    }
  } else {
    context += "\nBelum ada data kluster perilaku (clustering belum dijalankan).";
  }

  if (badges.length > 0) {
    context += `\n\nBadge yang diraih (${badges.length}): ${badges.map(b => b.name).join(", ")}`;
  } else {
    context += "\nBelum ada badge yang diraih.";
  }

  if (enrollments.length > 0) {
    context += `\n\nKelas yang diikuti: ${enrollments.map(e => e.course.title).join(", ")}`;
  } else {
    context += "\nBelum mengikuti kelas apapun.";
  }

  return context;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ChatRequestBody;
    const { messages } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "Pesan tidak boleh kosong." }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    let systemPrompt = LANDING_SYSTEM_PROMPT;

    if (authUser) {
      const context = await getUserContext(authUser.id);
      systemPrompt = buildDashboardSystemPrompt(context);
    }

    const chatHistory = messages.map((msg) => ({
      role: msg.role as "user" | "model",
      parts: [{ text: msg.content }],
    }));

    const response = await gemini.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        { role: "user", parts: [{ text: systemPrompt }] },
        { role: "model", parts: [{ text: "Baik, saya siap membantu!" }] },
        ...chatHistory,
      ],
    });

    const text = response.text ?? "Maaf, saya tidak bisa merespons saat ini.";

    return NextResponse.json({ message: text });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan pada server.";
    console.error("Chat API Error:", errorMessage);
    return NextResponse.json({ error: "Gagal memproses pesan. Silakan coba lagi." }, { status: 500 });
  }
}
