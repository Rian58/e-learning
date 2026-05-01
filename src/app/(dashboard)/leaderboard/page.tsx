import { requireUser } from "@/actions/user-actions";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Star } from "lucide-react";

export const metadata = {
  title: "Papan Peringkat - Stack Sinau",
};

async function getLeaderboardData() {
  const students = await prisma.user.findMany({
    where: { role: "MAHASISWA" },
    select: {
      id: true,
      name: true,
      avatarUrl: true,
      quizAttempts: { select: { score: true } },
      assignmentSubmissions: { where: { status: "GRADED" }, select: { score: true } },
      badges: { select: { name: true } },
      _count: { select: { enrollments: true, materialCompletions: true } },
    },
  });

  const ranked = students.map((s) => {
    const avgQuiz = s.quizAttempts.length > 0
      ? Math.round(s.quizAttempts.reduce((a, b) => a + b.score, 0) / s.quizAttempts.length)
      : 0;
    const avgAssignment = s.assignmentSubmissions.length > 0
      ? Math.round(s.assignmentSubmissions.reduce((a, b) => a + (b.score ?? 0), 0) / s.assignmentSubmissions.length)
      : 0;
    const totalScore = avgQuiz + avgAssignment + s._count.materialCompletions * 5;
    return {
      id: s.id,
      name: s.name,
      avatarUrl: s.avatarUrl,
      avgQuiz,
      avgAssignment,
      materialsCompleted: s._count.materialCompletions,
      badgeCount: s.badges.length,
      totalScore,
    };
  });

  return ranked.sort((a, b) => b.totalScore - a.totalScore);
}

const RANK_STYLES = [
  { bg: "bg-yellow-100 dark:bg-yellow-900/30 border-yellow-400 dark:border-yellow-600", icon: Trophy, color: "text-yellow-600 dark:text-yellow-400" },
  { bg: "bg-gray-100 dark:bg-gray-800/50 border-gray-400 dark:border-gray-600", icon: Medal, color: "text-gray-500 dark:text-gray-400" },
  { bg: "bg-orange-100 dark:bg-orange-900/30 border-orange-400 dark:border-orange-600", icon: Award, color: "text-orange-500 dark:text-orange-400" },
];

export default async function LeaderboardPage() {
  const user = await requireUser();

  if (user.role === "DOSEN") redirect("/manage");
  if (user.role === "SUPER_ADMIN") redirect("/admin");

  const leaderboard = await getLeaderboardData();

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 space-y-6">
      <div className="bg-primary/10 border-4 neo-border p-6 md:p-8 rounded-3xl neo-shadow relative overflow-hidden">
        <div className="absolute -top-8 -right-8 opacity-10">
          <Trophy className="w-48 h-48" />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Papan Peringkat</h1>
          <p className="text-muted-foreground font-medium">Peringkat mahasiswa berdasarkan skor kuis, tugas, dan materi yang diselesaikan.</p>
        </div>
      </div>

      {leaderboard.length === 0 ? (
        <Card className="neo-card text-center py-12">
          <CardContent>
            <p className="text-muted-foreground font-medium">Belum ada data peringkat.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {leaderboard.map((student, idx) => {
            const style = idx < 3 ? RANK_STYLES[idx] : null;
            const isCurrentUser = student.id === user.id;

            return (
              <Card
                key={student.id}
                className={`neo-card border-3 transition-all ${isCurrentUser ? "ring-2 ring-primary ring-offset-2" : ""} ${style ? style.bg : ""}`}
              >
                <CardContent className="flex items-center gap-4 py-4 px-4 md:px-6">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl border-2 neo-border bg-background flex items-center justify-center font-black text-lg">
                    {style ? (
                      <style.icon className={`h-5 w-5 ${style.color}`} />
                    ) : (
                      <span className="text-muted-foreground">{idx + 1}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm md:text-base truncate">{student.name}</span>
                      {isCurrentUser && <Badge className="text-[10px] px-1.5 py-0">Anda</Badge>}
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground font-medium mt-0.5">
                      <span>Kuis: {student.avgQuiz}</span>
                      <span>Tugas: {student.avgAssignment}</span>
                      <span>Materi: {student.materialsCompleted}</span>
                      {student.badgeCount > 0 && (
                        <span className="flex items-center gap-0.5"><Star className="h-3 w-3" />{student.badgeCount} Badge</span>
                      )}
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="text-xl md:text-2xl font-black">{student.totalScore}</div>
                    <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Poin</div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
