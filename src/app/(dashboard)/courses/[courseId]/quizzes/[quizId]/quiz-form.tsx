"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { submitQuizAttempt } from "@/actions/course-actions";
import { CheckCircle2, XCircle, Loader2, Trophy, Clock, Eye } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  points: number;
  orderIndex: number;
}

interface QuizFormProps {
  quizId: string;
  courseId: string;
  questions: QuizQuestion[];
  passingScore: number;
  timeLimitMinutes?: number | null;
  previousAttempt?: {
    score: number;
    answers: Record<string, number>;
  } | null;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function QuizForm({ quizId, courseId, questions, passingScore, timeLimitMinutes, previousAttempt }: QuizFormProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isPending, setIsPending] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    correctCount: number;
    totalQuestions: number;
    passed: boolean;
  } | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(
    timeLimitMinutes ? timeLimitMinutes * 60 : null
  );
  const hasAutoSubmitted = useRef(false);
  const router = useRouter();

  const doSubmit = useCallback(async (answers: Record<string, number>, isAutoSubmit = false) => {
    if (isPending) return;
    setIsPending(true);
    try {
      const res = await submitQuizAttempt(quizId, answers);
      if (res.success) {
        setResult({
          score: res.score!,
          correctCount: res.correctCount!,
          totalQuestions: res.totalQuestions!,
          passed: res.passed!,
        });
        if (isAutoSubmit) {
          toast.info(`Waktu habis! Nilai Anda: ${res.score}%`);
        } else if (res.passed) {
          toast.success("Selamat! Anda lulus kuis ini!");
        } else {
          toast.error("Anda belum mencapai nilai minimum.");
        }
      } else {
        toast.error(res.error || "Gagal mengirim jawaban.");
      }
    } catch {
      toast.error("Terjadi kesalahan sistem.");
    } finally {
      setIsPending(false);
    }
  }, [isPending, quizId]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || result || previousAttempt) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          if (!hasAutoSubmitted.current) {
            hasAutoSubmitted.current = true;
            doSubmit(selectedAnswers, true);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, result, previousAttempt, doSubmit, selectedAnswers]);

  if (previousAttempt) {
    return (
      <Card className="neo-card border-4 border-blue-500 bg-blue-50 dark:bg-blue-950/30">
        <CardContent className="pt-8 pb-8 text-center space-y-6">
          <div className="mx-auto w-24 h-24 rounded-full flex items-center justify-center bg-blue-100 dark:bg-blue-900/50">
            <Eye className="h-12 w-12 text-blue-600" />
          </div>

          <div>
            <h2 className="text-3xl font-black mb-2">Kuis Sudah Dikerjakan</h2>
            <p className="text-muted-foreground font-medium">
              Anda sudah mengerjakan kuis ini dan tidak bisa mengulang.
            </p>
          </div>

          <div className="flex justify-center gap-8">
            <div className="text-center">
              <p className="text-4xl font-black text-primary">{previousAttempt.score}%</p>
              <p className="text-sm font-bold text-muted-foreground">Nilai Anda</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black">{previousAttempt.score >= passingScore ? "Lulus" : "Tidak Lulus"}</p>
              <p className="text-sm font-bold text-muted-foreground">Status</p>
            </div>
          </div>

          <div className="text-left space-y-3 mt-6 border-t-2 pt-6">
            {questions.map((q, idx) => {
              const selected = previousAttempt.answers[q.id];
              const isCorrect = selected === q.correctIndex;
              return (
                <div key={q.id} className={`p-3 rounded-lg border-2 ${isCorrect ? "border-green-300 bg-green-50/50 dark:bg-green-900/20" : "border-red-300 bg-red-50/50 dark:bg-red-900/20"}`}>
                  <div className="flex items-start gap-2">
                    {isCorrect ? <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" /> : <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />}
                    <div>
                      <p className="font-bold text-sm">{idx + 1}. {q.question}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Jawaban Anda: <strong>{selected !== undefined ? (q.options as string[])[selected] : "Tidak dijawab"}</strong>
                        {!isCorrect && <span className="text-green-600 ml-2">✓ Benar: {(q.options as string[])[q.correctIndex]}</span>}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Link href={`/courses/${courseId}`}>
            <Button variant="outline" className="neo-button font-bold">
              Kembali ke Mata Kuliah
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const handleSelect = (questionId: string, optionIndex: number) => {
    if (result) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = async () => {
    if (Object.keys(selectedAnswers).length < questions.length) {
      toast.error("Harap jawab semua pertanyaan sebelum mengirim.");
      return;
    }
    await doSubmit(selectedAnswers);
  };

  if (result) {
    return (
      <Card className={`neo-card border-4 ${result.passed ? "border-green-500 bg-green-50 dark:bg-green-950/30" : "border-destructive bg-red-50 dark:bg-red-950/30"}`}>
        <CardContent className="pt-8 pb-8 text-center space-y-6">
          <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center ${result.passed ? "bg-green-100 dark:bg-green-900/50" : "bg-red-100 dark:bg-red-900/50"}`}>
            {result.passed ? (
              <Trophy className="h-12 w-12 text-green-600" />
            ) : (
              <XCircle className="h-12 w-12 text-red-600" />
            )}
          </div>

          <div>
            <h2 className="text-3xl font-black mb-2">
              {result.passed ? "Lulus!" : "Belum Lulus"}
            </h2>
            <p className="text-muted-foreground font-medium">
              {result.passed
                ? "Selamat, Anda berhasil melewati kuis ini!"
                : `Nilai minimum adalah ${passingScore}%.`}
            </p>
          </div>

          <div className="flex justify-center gap-8">
            <div className="text-center">
              <p className="text-4xl font-black text-primary">{result.score}%</p>
              <p className="text-sm font-bold text-muted-foreground">Nilai Anda</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black">{result.correctCount}/{result.totalQuestions}</p>
              <p className="text-sm font-bold text-muted-foreground">Jawaban Benar</p>
            </div>
          </div>

          <div className="text-left space-y-3 mt-6 border-t-2 pt-6">
            {questions.map((q, idx) => {
              const selected = selectedAnswers[q.id];
              const isCorrect = selected === q.correctIndex;
              return (
                <div key={q.id} className={`p-3 rounded-lg border-2 ${isCorrect ? "border-green-300 bg-green-50/50 dark:bg-green-900/20" : "border-red-300 bg-red-50/50 dark:bg-red-900/20"}`}>
                  <div className="flex items-start gap-2">
                    {isCorrect ? <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" /> : <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />}
                    <div>
                      <p className="font-bold text-sm">{idx + 1}. {q.question}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Jawaban Anda: <strong>{selected !== undefined ? (q.options as string[])[selected] : "Tidak dijawab"}</strong>
                        {!isCorrect && <span className="text-green-600 ml-2">✓ Benar: {(q.options as string[])[q.correctIndex]}</span>}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Link href={`/courses/${courseId}`}>
            <Button variant="outline" className="neo-button font-bold">
              Kembali ke Mata Kuliah
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const timerWarning = timeLeft !== null && timeLeft <= 60;
  const timerDanger = timeLeft !== null && timeLeft <= 30;

  return (
    <div className="space-y-6">
      {timeLeft !== null && (
        <div className={`sticky top-20 z-30 flex items-center justify-between p-4 rounded-xl border-2 font-bold transition-colors ${timerDanger ? "bg-red-100 dark:bg-red-950/50 border-red-500 text-red-700 dark:text-red-400 animate-pulse" : timerWarning ? "bg-orange-100 dark:bg-orange-950/50 border-orange-500 text-orange-700 dark:text-orange-400" : "bg-blue-100 dark:bg-blue-950/50 border-blue-300 text-blue-700 dark:text-blue-400"}`}>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <span>Sisa Waktu</span>
          </div>
          <span className="text-2xl font-black tabular-nums">{formatTime(timeLeft)}</span>
        </div>
      )}

      {questions.map((q, idx) => (
        <Card key={q.id} className="neo-card">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-base font-bold">
                <span className="text-primary mr-2">#{idx + 1}</span>
                {q.question}
              </CardTitle>
              <Badge variant="secondary" className="shrink-0 font-bold">{q.points} poin</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {(q.options as string[]).map((option: string, optIdx: number) => {
              const isSelected = selectedAnswers[q.id] === optIdx;
              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelect(q.id, optIdx)}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all font-medium text-sm flex items-center gap-3
                    ${isSelected
                      ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                    }`}
                >
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 font-bold text-xs
                    ${isSelected ? "bg-primary text-primary-foreground border-primary" : "border-muted-foreground/30"}`}>
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  {option}
                </button>
              );
            })}
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-between items-center pt-4 border-t-2 border-dashed">
        <p className="text-sm font-medium text-muted-foreground">
          {Object.keys(selectedAnswers).length} / {questions.length} soal dijawab
        </p>
        <Button
          onClick={handleSubmit}
          disabled={isPending || Object.keys(selectedAnswers).length < questions.length}
          className="neo-button font-black text-lg h-12 px-8"
        >
          {isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <CheckCircle2 className="mr-2 h-5 w-5" />}
          Kirim Jawaban
        </Button>
      </div>
    </div>
  );
}
