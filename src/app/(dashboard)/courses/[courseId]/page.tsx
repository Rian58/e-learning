import { getCourseDetails } from "@/actions/course-actions";
import { requireUser } from "@/actions/user-actions";
import { notFound } from "next/navigation";
import { EnrollButton } from "./enroll-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, BookOpen, Clock, PlayCircle, FileText, CheckCircle2, HelpCircle, FileEdit } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

export async function generateMetadata({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const course = await getCourseDetails(courseId);
  return {
    title: course ? `${course.title} - Stack Sinau` : "Mata Kuliah Tidak Ditemukan",
  };
}

export default async function CourseDetailPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const user = await requireUser();
  const course = await getCourseDetails(courseId);

  if (!course) {
    notFound();
  }

  const isEnrolled = course.enrollments.length > 0;
  
  const initials = course.creator.name 
    ? course.creator.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'C';

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <Link href="/courses">
        <Button variant="ghost" className="pl-0 gap-2 hover:bg-transparent font-bold">
          <ArrowLeft className="h-4 w-4" /> Kembali ke Katalog
        </Button>
      </Link>

      {/* Header Section */}
      <div className="bg-primary/10 rounded-2xl border-4 neo-border p-6 md:p-10 space-y-6">
        <div className="flex flex-wrap gap-2">
          {isEnrolled ? (
            <Badge className="bg-primary text-primary-foreground neo-shadow-sm font-bold px-3 py-1">
              🎉 Anda sudah terdaftar
            </Badge>
          ) : (
            <Badge variant="outline" className="font-bold border-2 bg-background px-3 py-1">
              Mata Kuliah Baru
            </Badge>
          )}
          <Badge variant="secondary" className="font-bold border-2">
            <BookOpen className="mr-1 h-3 w-3" /> {course.materials.length} Materi
          </Badge>
        </div>

        <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
          {course.title}
        </h1>
        
        <p className="text-lg md:text-xl font-medium text-muted-foreground max-w-3xl leading-relaxed">
          {course.description}
        </p>

        <div className="flex flex-wrap items-center gap-6 pt-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-foreground neo-shadow-sm">
              <AvatarImage src={course.creator.avatarUrl || ''} />
              <AvatarFallback className="font-bold">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-bold">Dosen Pengampu</span>
              <span className="text-base font-black">{course.creator.name}</span>
            </div>
          </div>
          
          <div className="h-10 w-1 bg-foreground/20 rounded hidden md:block" />

          <div className="flex flex-col">
            <span className="text-sm font-bold">Terakhir Diperbarui</span>
            <span className="text-base font-black">
              {formatDistanceToNow(new Date(course.updatedAt), { addSuffix: true, locale: id })}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Split */}
      <div className="grid md:grid-cols-3 gap-8 items-start pt-4">
        
        {/* Left Col: Syllabus */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" /> Silabus Mata Kuliah
          </h2>
          
          <Card className="neo-card">
            <CardHeader className="border-b-2 pb-4">
              <CardTitle>Daftar Materi Pembelajaran</CardTitle>
              <CardDescription className="font-medium text-base">
                Anda akan mempelajari topik-topik berikut:
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {course.materials.length > 0 ? (
                <div className="space-y-3">
                  {course.materials.map((m: any, idx: number) => {
                    const isCompleted = isEnrolled && course.completedMaterialIds.includes(m.id);
                    return (
                      <div key={m.id} className={`flex gap-4 p-4 rounded-xl border-2 transition-colors group ${isCompleted ? 'bg-green-50/50 dark:bg-green-950/20 border-green-300 dark:border-green-800' : 'hover:bg-muted/50'}`}>
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center font-black shrink-0 border-2 neo-shadow-sm group-hover:scale-110 transition-transform ${isCompleted ? 'bg-green-500 text-white border-green-600' : 'bg-primary/20 text-primary-foreground border-primary'}`}>
                          {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : idx + 1}
                        </div>
                        <div className="flex-grow space-y-1">
                          <h4 className="font-bold text-lg leading-tight">{m.title}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                            {m.type === 'VIDEO' ? <PlayCircle className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                            <span className="capitalize">{m.type.toLowerCase()}</span>
                            {isCompleted && <span className="text-green-600 font-bold text-xs ml-2">✓ Selesai</span>}
                          </div>
                        </div>
                        {isEnrolled && (
                          <Link href={`/courses/${course.id}/materials/${m.id}`} className="self-center">
                            <Button variant="outline" size="sm" className="neo-button font-bold text-xs shrink-0">
                              {isCompleted ? "Baca Ulang" : "Baca"}
                            </Button>
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground font-medium">
                  Belum ada materi yang ditambahkan.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quiz List */}
          {course.quizzes.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" /> Kuis
              </h2>
              {course.quizzes.map((quiz: any) => {
                const attempt = quiz.attempts?.[0];
                const isPassed = attempt && attempt.score >= quiz.passingScore;
                const hasAttempted = !!attempt;

                return (
                  <Card key={quiz.id} className={`neo-card transition-colors ${isPassed ? 'bg-green-50/50 dark:bg-green-950/20 border-green-300 dark:border-green-800' : 'hover:bg-muted/30'}`}>
                    <CardContent className="p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg border-2 ${isPassed ? 'bg-green-100 dark:bg-green-900/40 border-green-400' : 'bg-blue-100 dark:bg-blue-900/40 border-blue-300'}`}>
                          {isPassed ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <HelpCircle className="h-5 w-5 text-blue-600" />}
                        </div>
                        <div>
                          <h4 className="font-bold flex items-center gap-2">
                            {quiz.title}
                            {hasAttempted && (
                              <Badge variant={isPassed ? "default" : "destructive"} className="text-[10px] font-bold">
                                {attempt.score}%
                              </Badge>
                            )}
                          </h4>
                          <p className="text-xs text-muted-foreground font-medium">
                            Nilai Minimum: {quiz.passingScore}%
                            {isPassed && <span className="text-green-600 ml-2 font-bold">✓ Lulus</span>}
                          </p>
                        </div>
                      </div>
                      {isEnrolled && (
                        <Link href={`/courses/${course.id}/quizzes/${quiz.id}`}>
                          <Button variant="outline" className="neo-button font-bold text-sm">
                            {hasAttempted ? "Lihat Hasil" : "Kerjakan"}
                          </Button>
                        </Link>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Assignment List */}
          {course.assignments.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
                <FileEdit className="h-5 w-5 text-primary" /> Tugas
              </h2>
              {course.assignments.map((assignment: any) => {
                const submission = assignment.submissions?.[0];
                const isSubmitted = !!submission;
                const isGraded = submission?.score !== null && submission?.score !== undefined;

                return (
                  <Card key={assignment.id} className={`neo-card transition-colors ${isSubmitted ? 'bg-green-50/50 dark:bg-green-950/20 border-green-300 dark:border-green-800' : 'hover:bg-muted/30'}`}>
                    <CardContent className="p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg border-2 ${isSubmitted ? 'bg-green-100 dark:bg-green-900/40 border-green-400' : 'bg-orange-100 dark:bg-orange-900/40 border-orange-300'}`}>
                          {isSubmitted ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <FileEdit className="h-5 w-5 text-orange-600" />}
                        </div>
                        <div>
                          <h4 className="font-bold flex items-center gap-2">
                            {assignment.title}
                            {isGraded && (
                              <Badge variant="default" className="text-[10px] font-bold">
                                {submission.score}/{assignment.maxScore}
                              </Badge>
                            )}
                          </h4>
                          <p className="text-xs text-muted-foreground font-medium">
                            Skor Maks: {assignment.maxScore}
                            {isSubmitted && <span className="text-green-600 ml-2 font-bold">✓ Dikumpulkan</span>}
                          </p>
                        </div>
                      </div>
                      {isEnrolled && (
                        <Link href={`/courses/${course.id}/assignments/${assignment.id}`}>
                          <Button variant="outline" className="neo-button font-bold text-sm">
                            {isSubmitted ? "Lihat" : "Kerjakan"}
                          </Button>
                        </Link>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Col: Action Details */}
        <div className="space-y-6 sticky top-24">
          <Card className="neo-card border-4 border-primary">
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <h3 className="font-black text-xl">Siap untuk belajar?</h3>
                <p className="text-muted-foreground font-medium text-sm">
                  Daftar sekarang untuk membuka akses ke semua materi, tugas, dan kuis.
                </p>
              </div>

              {isEnrolled ? (
                <div className="space-y-4">
                  <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-3 rounded-lg flex items-start gap-2 border-2 border-green-500 font-medium">
                    <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                    <p className="text-sm">Anda telah terdaftar dan memiliki akses penuh</p>
                  </div>
                  
                  {course.materials.length > 0 && (
                    <Link href={`/courses/${course.id}/materials/${course.materials[0].id}`} className="block">
                      <Button className="w-full neo-button h-14 text-lg font-black bg-primary hover:bg-primary/90">
                        Mulai Belajar
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <EnrollButton courseId={course.id} />
              )}

              <div className="border-t-2 pt-4 space-y-3">
                <h4 className="font-bold text-sm">Target Mata Kuliah:</h4>
                <ul className="space-y-2 text-sm font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" /> Membaca <b>{course.materials.length}</b> Materi
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" /> Menyelesaikan <b>{course.quizzes.length}</b> Kuis
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" /> Mengumpulkan <b>{course.assignments.length}</b> Tugas
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
