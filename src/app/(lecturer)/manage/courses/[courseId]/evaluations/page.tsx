import { prisma } from "@/lib/prisma";
import { requireUser } from "@/actions/user-actions";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, CheckCircle2, XCircle, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GradeAssignmentButton } from "./grade-button";
import { ViewSubmissionButton } from "./view-submission-button";
import { redirect } from "next/navigation";

export default async function CourseEvaluationsPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const user = await requireUser();

  if (user.role !== "DOSEN" && user.role !== "SUPER_ADMIN") {
    redirect("/");
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId, creatorId: user.id },
    select: { title: true }
  });

  if (!course) {
    redirect("/manage");
  }

  // Ambil data kuis
  const quizAttempts = await prisma.quizAttempt.findMany({
    where: { quiz: { courseId } },
    include: {
      user: true,
      quiz: true
    },
    orderBy: { completedAt: "desc" }
  });

  // Ambil data tugas
  const assignmentSubmissions = await prisma.assignmentSubmission.findMany({
    where: { assignment: { courseId } },
    include: {
      user: true,
      assignment: true
    },
    orderBy: { submittedAt: "desc" }
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Link href={`/manage/courses/${courseId}`}>
            <Button variant="ghost" className="pl-0 gap-2 hover:bg-transparent font-bold">
              <ArrowLeft className="h-4 w-4" /> Kembali ke Manajemen Mata Kuliah
            </Button>
          </Link>
          <h1 className="text-3xl font-black tracking-tight mt-2">Evaluasi: {course.title}</h1>
          <p className="text-muted-foreground font-medium mt-1">
            Lihat hasil kuis dan kelola nilai tugas mahasiswa.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Kuis Section */}
        <Card className="neo-card border-4 h-fit">
          <CardHeader>
            <CardTitle className="text-xl font-black">Hasil Kuis Mahasiswa</CardTitle>
            <CardDescription className="font-medium text-sm">
              Sistem menilai otomatis, hanya untuk ditinjau.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0 sm:px-6 overflow-x-auto">
            {quizAttempts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground font-medium border-t-2">
                Belum ada kuis yang dikerjakan mahasiswa.
              </div>
            ) : (
              <Table className="min-w-[500px]">
                <TableHeader className="bg-muted neo-border-b">
                  <TableRow>
                    <TableHead className="font-bold">Mahasiswa</TableHead>
                    <TableHead className="font-bold">Kuis</TableHead>
                    <TableHead className="font-bold">Nilai</TableHead>
                    <TableHead className="font-bold text-right">Tanggal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quizAttempts.map((qa) => {
                    const isPassed = qa.score >= qa.quiz.passingScore;
                    return (
                      <TableRow key={qa.id}>
                        <TableCell>
                          <div className="font-bold">{qa.user.name}</div>
                          <div className="text-xs text-muted-foreground line-clamp-1">{qa.user.email}</div>
                        </TableCell>
                        <TableCell className="font-medium line-clamp-2 max-w-[150px]">{qa.quiz.title}</TableCell>
                        <TableCell>
                          <Badge variant={isPassed ? "default" : "destructive"} className="gap-1 border-2 font-bold whitespace-nowrap">
                            {isPassed ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                            {qa.score} Nilai
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-xs whitespace-nowrap font-medium text-muted-foreground">
                          {qa.completedAt ? format(new Date(qa.completedAt), "dd MMM yy, HH:mm", { locale: localeId }) : "-"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Tugas Section */}
        <Card className="neo-card border-4 h-fit">
          <CardHeader>
            <CardTitle className="text-xl font-black">Pengumpulan Tugas</CardTitle>
            <CardDescription className="font-medium text-sm">
              Berikan nilai manual (Grading) untuk tugas mahasiswa.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0 sm:px-6 overflow-x-auto">
            {assignmentSubmissions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground font-medium border-t-2">
                Belum ada tugas yang dikumpulkan mahasiswa.
              </div>
            ) : (
              <Table className="min-w-[500px]">
                <TableHeader className="bg-muted neo-border-b">
                  <TableRow>
                    <TableHead className="font-bold">Mahasiswa</TableHead>
                    <TableHead className="font-bold">Tugas & File</TableHead>
                    <TableHead className="font-bold">Status/Nilai</TableHead>
                    <TableHead className="font-bold text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignmentSubmissions.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell>
                        <div className="font-bold">{sub.user.name}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">{sub.user.email}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-bold line-clamp-2 max-w-[150px]">{sub.assignment.title}</div>
                        <ViewSubmissionButton 
                          content={sub.content} 
                          studentName={sub.user.name} 
                          assignmentTitle={sub.assignment.title} 
                        />
                      </TableCell>
                      <TableCell>
                        {sub.status === "GRADED" ? (
                          <span className="font-black text-sm text-primary">
                            {sub.score} / {sub.assignment.maxScore}
                          </span>
                        ) : (
                          <Badge variant="secondary" className="border-2 text-xs">Menunggu Dinilai</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <GradeAssignmentButton 
                          submissionId={sub.id} 
                          currentScore={sub.score} 
                          maxScore={sub.assignment.maxScore} 
                          studentName={sub.user.name}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
