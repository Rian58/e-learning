export const dynamic = "force-dynamic";

import { getLecturerCourses } from "@/actions/lecturer-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, FileText, HelpCircle, FileEdit, Plus, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { SearchInput } from "@/components/search-input";

export const metadata = {
  title: "Manajemen Mata Kuliah - Stack Sinau",
};

export default async function LecturerDashboardPage({ searchParams }: { searchParams: Promise<{ query?: string }> }) {
  const params = await searchParams;
  const query = params?.query || "";
  
  const courses = await getLecturerCourses(query);

  const totalEnrollments = courses.reduce((sum, c) => sum + c._count.enrollments, 0);
  const publishedCount = courses.filter(c => c.isPublished).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            Manajemen Mata Kuliah
          </h1>
          <p className="text-muted-foreground font-medium mt-1">
            Kelola mata kuliah, materi, kuis, dan tugas Anda.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <SearchInput placeholder="Cari judul mata kuliah..." />
          <Link href="/manage/courses/new" className="w-full sm:w-auto">
            <Button className="neo-button font-bold gap-2 w-full">
              <Plus className="h-4 w-4" /> Buat Mata Kuliah Baru
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="neo-card bg-primary text-primary-foreground">
          <CardContent className="pt-6">
            <p className="text-4xl font-black">{courses.length}</p>
            <p className="text-sm font-bold opacity-80 mt-1">Total Mata Kuliah</p>
          </CardContent>
        </Card>
        <Card className="neo-card">
          <CardContent className="pt-6">
            <p className="text-4xl font-black text-primary">{publishedCount}</p>
            <p className="text-sm font-bold text-muted-foreground mt-1">Sudah Dipublikasi</p>
          </CardContent>
        </Card>
        <Card className="neo-card">
          <CardContent className="pt-6">
            <p className="text-4xl font-black text-primary">{totalEnrollments}</p>
            <p className="text-sm font-bold text-muted-foreground mt-1">Total Mahasiswa Terdaftar</p>
          </CardContent>
        </Card>
      </div>

      {/* Course List */}
      {courses.length > 0 ? (
        <div className="space-y-4">
          {courses.map((course) => (
            <Card key={course.id} className="neo-card hover:bg-muted/30 transition-colors">
              <CardContent className="p-5 flex items-center justify-between gap-4">
                <div className="space-y-2 flex-grow">
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-lg">{course.title}</h3>
                    <Badge variant={course.isPublished ? "default" : "secondary"} className="text-[10px] font-bold">
                      {course.isPublished ? <><Eye className="h-3 w-3 mr-1" /> Publik</> : <><EyeOff className="h-3 w-3 mr-1" /> Draf</>}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium line-clamp-1">{course.description}</p>
                  <div className="flex flex-wrap gap-3 text-xs font-bold text-muted-foreground">
                    <span className="flex items-center gap-1"><FileText className="h-3 w-3" /> {course._count.materials} Materi</span>
                    <span className="flex items-center gap-1"><HelpCircle className="h-3 w-3" /> {course._count.quizzes} Kuis</span>
                    <span className="flex items-center gap-1"><FileEdit className="h-3 w-3" /> {course._count.assignments} Tugas</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {course._count.enrollments} Mahasiswa</span>
                  </div>
                </div>
                <Link href={`/manage/courses/${course.id}`}>
                  <Button variant="outline" className="neo-button font-bold shrink-0">
                    Kelola
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-muted/30 rounded-xl border-2 border-dashed border-muted-foreground/20">
          <BookOpen className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-bold">Belum ada mata kuliah</h3>
          <p className="text-muted-foreground font-medium text-center max-w-sm mt-2">
            Mulai dengan membuat mata kuliah baru untuk mahasiswa Anda.
          </p>
          <Link href="/manage/courses/new" className="mt-4">
            <Button className="neo-button font-bold gap-2">
              <Plus className="h-4 w-4" /> Buat Mata Kuliah Pertama
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
