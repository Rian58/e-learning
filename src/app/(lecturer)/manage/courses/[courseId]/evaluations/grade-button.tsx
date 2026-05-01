"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Award } from "lucide-react";
import { toast } from "sonner";
import { gradeSubmission } from "@/actions/lecturer-actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface GradeButtonProps {
  submissionId: string;
  currentScore: number | null;
  maxScore: number;
  studentName: string;
}

export function GradeAssignmentButton({ submissionId, currentScore, maxScore, studentName }: GradeButtonProps) {
  const [open, setOpen] = useState(false);
  const [score, setScore] = useState(currentScore !== null ? currentScore.toString() : "");
  const [isPending, setIsPending] = useState(false);

  async function handleGrade() {
    const numScore = parseInt(score, 10);
    if (isNaN(numScore) || numScore < 0 || numScore > maxScore) {
      toast.error(`Nilai harus berupa angka antara 0 dan ${maxScore}`);
      return;
    }

    setIsPending(true);
    try {
      const res = await gradeSubmission(submissionId, numScore);
      if (res.success) {
        toast.success("Berhasil memberikan nilai!");
        setOpen(false);
      } else {
        toast.error(res.error || "Gagal memberikan nilai.");
      }
    } catch {
      toast.error("Terjadi kesalahan sistem.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={"inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 px-3 font-bold gap-1 " + (currentScore === null ? "bg-primary text-primary-foreground shadow hover:bg-primary/90 neo-button" : "border neo-border bg-background shadow-sm hover:bg-accent hover:text-accent-foreground neo-button border-2")}>
        <Award className="h-4 w-4" />
        {currentScore === null ? "Beri Nilai" : "Edit Nilai"}
      </DialogTrigger>
      <DialogContent className="neo-card sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-black text-xl">Penilaian Tugas</DialogTitle>
          <DialogDescription className="font-medium">
            Berikan nilai untuk tugas yang dikumpulkan oleh <strong>{studentName}</strong>.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 mt-4">
          <div className="grid flex-1 gap-2">
            <span className="text-xs font-bold text-muted-foreground">Skor (Maksimal: {maxScore})</span>
            <Input
              type="number"
              min={0}
              max={maxScore}
              value={score}
              onChange={(e) => setScore(e.target.value)}
              placeholder={`0 - ${maxScore}`}
              className="neo-input text-lg font-black h-12"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="ghost" className="font-bold" onClick={() => setOpen(false)}>Batal</Button>
          <Button disabled={isPending} onClick={handleGrade} className="neo-button font-bold text-base h-10 px-6">
            {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Simpan Nilai
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
