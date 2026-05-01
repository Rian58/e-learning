export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/actions/user-actions";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, FileText, HelpCircle, FileEdit, Eye, EyeOff, Users, Trash2 } from "lucide-react";
import Link from "next/link";
import { togglePublishCourse, deleteCourse } from "@/actions/lecturer-actions";
import { CourseContentManager } from "./content-manager";

export async function generateMetadata({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const course = await prisma.course.findUnique({ where: { id: courseId }, select: { title: true } });
  return { title: course ? `Kelola: ${course.title} - Stack Sinau` : "Mata Kuliah Tidak Ditemukan" };
}

export default async function ManageCoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const user = await requireUser();

  if (user.role !== "DOSEN" && user.role !== "SUPER_ADMIN") {
    redirect("/");
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      materials: { orderBy: { orderIndex: "asc" } },
      quizzes: { include: { questions: true } },
      assignments: true,
      _count: { select: { enrollments: true } }
    }
  });

  if (!course || course.creatorId !== user.id) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <Link href="/manage">
        <Button variant="ghost" className="pl-0 gap-2 hover:bg-transparent font-bold">
          <ArrowLeft className="h-4 w-4" /> Kembali ke Manajemen
        </Button>
      </Link>

      {/* Course Header */}
      <div className="bg-primary/10 rounded-2xl border-4 neo-border p-6 md:p-8 space-y-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-black tracking-tight">{course.title}</h1>
              <Badge variant={course.isPublished ? "default" : "secondary"} className="font-bold">
                {course.isPublished ? <><Eye className="h-3 w-3 mr-1" /> Publik</> : <><EyeOff className="h-3 w-3 mr-1" /> Draf</>}
              </Badge>
            </div>
            <p className="text-muted-foreground font-medium">{course.description}</p>
            {course.enrollmentCode && (
              <div className="inline-flex items-center gap-2 mt-2 bg-yellow-100 border-2 border-yellow-400 text-yellow-800 px-3 py-1.5 rounded-xl text-xs font-bold neo-shadow-sm">
                <span className="opacity-80 uppercase tracking-wider">Kode Akses Mahasiswa:</span>
                <span className="font-mono text-sm tracking-widest">{course.enrollmentCode}</span>
              </div>
            )}
            <div className="flex flex-wrap gap-4 text-sm font-bold text-muted-foreground pt-2">
              <span className="flex items-center gap-1"><FileText className="h-4 w-4" /> {course.materials.length} Materi</span>
              <span className="flex items-center gap-1"><HelpCircle className="h-4 w-4" /> {course.quizzes.length} Kuis</span>
              <span className="flex items-center gap-1"><FileEdit className="h-4 w-4" /> {course.assignments.length} Tugas</span>
              <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {course._count.enrollments} Mahasiswa</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap shrink-0">
            <Link href={`/manage/courses/${courseId}/evaluations`}>
              <Button variant="secondary" className="neo-button font-bold gap-2">
                <Users className="h-4 w-4" /> Evaluasi Mahasiswa
              </Button>
            </Link>
            <form action={async () => { "use server"; await togglePublishCourse(courseId); }}>
              <Button type="submit" variant={course.isPublished ? "outline" : "default"} className="neo-button font-bold gap-2">
                {course.isPublished ? <><EyeOff className="h-4 w-4" /> Arsipkan</> : <><Eye className="h-4 w-4" /> Publikasikan</>}
              </Button>
            </form>
            <form action={async () => { "use server"; await deleteCourse(courseId); }}>
              <Button type="submit" variant="destructive" className="neo-button font-bold gap-2">
                <Trash2 className="h-4 w-4" /> Hapus
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Content Manager (Client Component) */}
      <CourseContentManager
        courseId={course.id}
        materials={course.materials}
        quizzes={course.quizzes}
        assignments={course.assignments}
      />
    </div>
  );
}
