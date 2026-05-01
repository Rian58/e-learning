"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { markMaterialComplete } from "@/actions/course-actions";
import { useRouter } from "next/navigation";

interface MarkCompleteButtonProps {
  materialId: string;
  isCompleted: boolean;
  nextMaterialId?: string;
  courseId: string;
}

export function MarkCompleteButton({ materialId, isCompleted, nextMaterialId, courseId }: MarkCompleteButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const [completed, setCompleted] = useState(isCompleted);
  const router = useRouter();

  const handleComplete = async () => {
    setIsPending(true);
    try {
      const result = await markMaterialComplete(materialId);

      if (result.success) {
        setCompleted(true);
        toast.success("Materi ditandai selesai!");

        if (nextMaterialId) {
          setTimeout(() => {
            router.push(`/courses/${courseId}/materials/${nextMaterialId}`);
          }, 1000);
        }
      } else {
        toast.error(result.error || "Gagal menyimpan progres");
      }
    } catch {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsPending(false);
    }
  };

  if (completed) {
    return (
      <Button disabled className="w-full sm:w-auto neo-button bg-green-500 text-white hover:bg-green-600 font-bold border-2 border-foreground opacity-100">
        <CheckCircle2 className="mr-2 h-5 w-5" /> Selesai
      </Button>
    );
  }

  return (
    <Button
      onClick={handleComplete}
      disabled={isPending}
      className="w-full sm:w-auto neo-button bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
    >
      {isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
      Tandai Selesai & Lanjut
    </Button>
  );
}
