import { prisma } from "@/lib/prisma";
import { requireUser } from "@/actions/user-actions";
import { redirect } from "next/navigation";
import { getMyBehaviorProfile } from "@/actions/ai-actions";
import { logActivity } from "@/actions/activity-actions";
import { StatCard } from "@/components/dashboard/stat-card";
import { BehaviorCard } from "@/components/dashboard/behavior-card";
import { BookOpen, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const user = await requireUser();
  if (user.role === "DOSEN") return redirect("/manage");
  if (user.role === "SUPER_ADMIN") return redirect("/admin");

  await logActivity("LOGIN");

  const enrolledCourses = await prisma.enrollment.count({
    where: { userId: user.id }
  });

  const completedAssignments = await prisma.assignmentSubmission.count({
    where: { userId: user.id }
  });

  const quizAttempts = await prisma.quizAttempt.count({
    where: { userId: user.id }
  });

  const recentEnrollments = await prisma.enrollment.findMany({
    where: { userId: user.id },
    include: { course: true },
    orderBy: { enrolledAt: 'desc' },
    take: 3
  });

  const { profile, badges } = await getMyBehaviorProfile();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Selamat datang kembali, {user.name.split(' ')[0]}!</h1>
        <p className="text-muted-foreground font-medium mt-1">Lanjutkan progres belajarmu hari ini.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          title="Mata Kuliah Terdaftar"
          value={enrolledCourses}
          icon={BookOpen}
          description="Total mata kuliah yang diikuti"
        />
        <StatCard
          title="Tugas Selesai"
          value={completedAssignments}
          icon={CheckCircle}
          description="Tugas yang telah dikumpulkan"
        />
        <StatCard
          title="Kuis Dikerjakan"
          value={quizAttempts}
          icon={Clock}
          description="Total percobaan kuis"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card className="neo-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Mata Kuliah Terakhir Diikuti</CardTitle>
            <BookOpen className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {recentEnrollments.length > 0 ? (
              <div className="space-y-4 mb-4 mt-2">
                {recentEnrollments.map(en => (
                  <div key={en.id} className="flex justify-between items-center bg-muted/50 p-3 rounded-lg border-2 border-border">
                    <span className="font-bold truncate mr-2">{en.course.title}</span>
                    <Link href={`/courses/${en.course.id}`}>
                      <Button variant="outline" size="sm" className="neo-button">Buka</Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm font-medium text-muted-foreground mb-4 py-2">
                Belum ada mata kuliah yang Anda ikuti. Silakan cari mata kuliah di katalog!
              </div>
            )}
            <Link href="/courses">
              <Button variant="outline" className="w-full neo-button">Jelajahi Semua Mata Kuliah</Button>
            </Link>
          </CardContent>
        </Card>

        <BehaviorCard profile={profile} badges={badges} />
      </div>
    </div>
  );
}
