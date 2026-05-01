import { getQuizDetails } from "@/actions/course-actions";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, HelpCircle, Target } from "lucide-react";
import Link from "next/link";
import { QuizForm } from "./quiz-form";
import { APP_CONFIG } from "@/lib/constants";

export async function generateMetadata({ params }: { params: Promise<{ courseId: string, quizId: string }> }) {
  const { courseId, quizId } = await params;
  const quiz = await getQuizDetails(courseId, quizId);
  return {
    title: quiz ? `${quiz.title} - ${APP_CONFIG.name}` : "Kuis Tidak Ditemukan",
  };
}

export default async function QuizPage({ params }: { params: Promise<{ courseId: string, quizId: string }> }) {
  const { courseId, quizId } = await params;
  const quiz = await getQuizDetails(courseId, quizId);

  if (!quiz) {
    notFound();
  }

  const previousAttempt = quiz.attempts[0] || null;
  const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);

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
            <HelpCircle className="mr-1 h-3 w-3" /> Kuis
          </Badge>
          <Badge variant="secondary" className="font-bold border-2">
            <Target className="mr-1 h-3 w-3" /> Nilai Minimum: {quiz.passingScore}%
          </Badge>
          {quiz.timeLimitMinutes && (
            <Badge variant="secondary" className="font-bold border-2">
              <Clock className="mr-1 h-3 w-3" /> {quiz.timeLimitMinutes} menit
            </Badge>
          )}
        </div>

        <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
          {quiz.title}
        </h1>
        {quiz.description && (
          <p className="text-muted-foreground font-medium text-lg">{quiz.description}</p>
        )}

        <div className="flex flex-wrap gap-6 text-sm font-bold pt-2">
          <span className="text-muted-foreground">{quiz.course.title}</span>
          <span>{quiz.questions.length} Soal</span>
          <span className="text-primary">{totalPoints} Total Poin</span>
        </div>
      </div>

      <QuizForm
        quizId={quiz.id}
        courseId={courseId}
        questions={quiz.questions.map(q => ({
          ...q,
          options: q.options as string[],
        }))}
        passingScore={quiz.passingScore}
        timeLimitMinutes={quiz.timeLimitMinutes}
        previousAttempt={previousAttempt ? {
          score: previousAttempt.score,
          answers: previousAttempt.answers as Record<string, number>,
        } : null}
      />
    </div>
  );
}
