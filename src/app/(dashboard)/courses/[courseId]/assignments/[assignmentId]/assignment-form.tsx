"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { submitAssignment } from "@/actions/course-actions";
import { CheckCircle2, Loader2, Send, Clock, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface AssignmentFormProps {
  assignmentId: string;
  courseId: string;
  hasSubmission: boolean;
  submissionContent?: string;
  submissionScore?: number | null;
  submissionStatus?: string;
  dueDate: string;
  maxScore: number;
}

export function AssignmentForm({
  assignmentId,
  courseId,
  hasSubmission,
  submissionContent,
  submissionScore,
  submissionStatus,
  dueDate,
  maxScore,
}: AssignmentFormProps) {
  const [content, setContent] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [submitted, setSubmitted] = useState(hasSubmission);

  const deadline = new Date(dueDate);
  const isOverdue = new Date() > deadline;
  const isGraded = submissionScore !== null && submissionScore !== undefined;

  if (submitted) {
    return (
      <Card className="neo-card border-4 border-green-500 bg-green-50 dark:bg-green-950/30">
        <CardContent className="pt-8 pb-8 text-center space-y-4">
          <div className="mx-auto w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-black">Tugas Sudah Dikumpulkan!</h2>

          {isGraded ? (
            <div className="space-y-2">
              <p className="text-muted-foreground font-medium">Dosen telah memberikan nilai.</p>
              <div className="flex justify-center gap-4">
                <Badge variant="default" className="text-lg px-4 py-2 font-black">
                  Nilai: {submissionScore}/{maxScore}
                </Badge>
                <Badge variant="secondary" className="text-lg px-4 py-2 font-black">
                  {submissionStatus}
                </Badge>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground font-medium max-w-md mx-auto">
              Tugas Anda sudah berhasil dikumpulkan. Menunggu penilaian dari dosen.
            </p>
          )}

          {(submissionContent || content) && (
            <div className="text-left mt-6 border-t-2 pt-4">
              <p className="text-xs font-bold text-muted-foreground mb-2">Jawaban Anda:</p>
              <div className="bg-background rounded-lg p-4 border-2 text-sm font-medium whitespace-pre-wrap">
                {submissionContent || content}
              </div>
            </div>
          )}
          <Link href={`/courses/${courseId}`}>
            <Button variant="outline" className="neo-button font-bold mt-4">
              Kembali ke Mata Kuliah
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (isOverdue) {
    return (
      <Card className="neo-card border-4 border-red-500 bg-red-50 dark:bg-red-950/30">
        <CardContent className="pt-8 pb-8 text-center space-y-4">
          <div className="mx-auto w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
            <AlertTriangle className="h-10 w-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-black text-red-700 dark:text-red-400">Tenggat Waktu Habis</h2>
          <p className="text-muted-foreground font-medium">
            Batas pengumpulan tugas ini sudah lewat pada {deadline.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}.
          </p>
          <Link href={`/courses/${courseId}`}>
            <Button variant="outline" className="neo-button font-bold mt-4">
              Kembali ke Mata Kuliah
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error("Harap isi jawaban tugas sebelum mengirim.");
      return;
    }

    setIsPending(true);
    try {
      const res = await submitAssignment(assignmentId, content);
      if (res.success) {
        setSubmitted(true);
        toast.success("Tugas berhasil dikumpulkan!");
      } else {
        toast.error(res.error || "Gagal mengumpulkan tugas.");
      }
    } catch {
      toast.error("Terjadi kesalahan sistem.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 p-3 rounded-lg border-2 bg-orange-50 dark:bg-orange-950/30 border-orange-300">
        <Clock className="h-5 w-5 text-orange-600 shrink-0" />
        <p className="text-sm font-bold text-orange-700 dark:text-orange-400">
          Tenggat: {deadline.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>

      <Card className="neo-card">
        <CardContent className="pt-6">
          <label className="font-bold text-sm block mb-2">Jawaban Anda</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            placeholder="Tulis jawaban tugas Anda di sini..."
            className="w-full rounded-lg border-2 border-border bg-background p-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors resize-y neo-border"
          />
          <p className="text-xs text-muted-foreground mt-2 font-medium">
            {content.length} karakter ditulis
          </p>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center pt-2">
        <Link href={`/courses/${courseId}`}>
          <Button variant="ghost" className="font-bold">Batal</Button>
        </Link>
        <Button
          onClick={handleSubmit}
          disabled={isPending || !content.trim()}
          className="neo-button font-black text-lg h-12 px-8"
        >
          {isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Send className="mr-2 h-5 w-5" />}
          Kumpulkan Tugas
        </Button>
      </div>
    </div>
  );
}
