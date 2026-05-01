import { getAssignmentDetails } from "@/actions/course-actions";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CalendarDays, FileEdit, Trophy } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { AssignmentForm } from "./assignment-form";
import { APP_CONFIG } from "@/lib/constants";

export async function generateMetadata({ params }: { params: Promise<{ courseId: string, assignmentId: string }> }) {
  const { courseId, assignmentId } = await params;
  const assignment = await getAssignmentDetails(courseId, assignmentId);
  return {
    title: assignment ? `${assignment.title} - ${APP_CONFIG.name}` : "Tugas Tidak Ditemukan",
  };
}

export default async function AssignmentPage({ params }: { params: Promise<{ courseId: string, assignmentId: string }> }) {
  const { courseId, assignmentId } = await params;
  const assignment = await getAssignmentDetails(courseId, assignmentId);

  if (!assignment) {
    notFound();
  }

  const existingSubmission = assignment.submissions[0];
  const isOverdue = new Date() > new Date(assignment.dueDate);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <Link href={`/courses/${courseId}`}>
        <Button variant="ghost" className="pl-0 gap-2 hover:bg-transparent font-bold">
          <ArrowLeft className="h-4 w-4" /> Kembali ke Mata Kuliah
        </Button>
      </Link>

      <div className="bg-primary/10 rounded-2xl border-4 neo-border p-6 md:p-10 space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-primary text-primary-foreground font-bold px-3 py-1">
            <FileEdit className="mr-1 h-3 w-3" /> Tugas
          </Badge>
          <Badge variant="secondary" className="font-bold border-2">
            <Trophy className="mr-1 h-3 w-3" /> Skor Maksimum: {assignment.maxScore}
          </Badge>
          <Badge
            variant={isOverdue ? "destructive" : "secondary"}
            className="font-bold border-2"
          >
            <CalendarDays className="mr-1 h-3 w-3" />
            Tenggat: {format(new Date(assignment.dueDate), "d MMMM yyyy, HH:mm", { locale: id })}
          </Badge>
        </div>

        <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
          {assignment.title}
        </h1>

        <p className="text-muted-foreground font-medium text-lg leading-relaxed">
          {assignment.description}
        </p>

        <div className="flex flex-wrap gap-6 text-sm font-bold pt-2">
          <span className="text-muted-foreground">{assignment.course.title}</span>
          {existingSubmission && (
            <span className="text-green-600">Sudah Dikumpulkan</span>
          )}
          {isOverdue && !existingSubmission && (
            <span className="text-red-500">Melewati Tenggat Waktu</span>
          )}
        </div>
      </div>

      <AssignmentForm
        assignmentId={assignment.id}
        courseId={courseId}
        hasSubmission={!!existingSubmission}
        submissionContent={existingSubmission?.content}
        submissionScore={existingSubmission?.score}
        submissionStatus={existingSubmission?.status}
        dueDate={assignment.dueDate.toISOString()}
        maxScore={assignment.maxScore}
      />
    </div>
  );
}
