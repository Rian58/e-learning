"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { runBehaviorClustering } from "@/actions/ai-actions";
import { Loader2, Brain } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function RunClusteringButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleRun = () => {
    startTransition(async () => {
      try {
        const res = await runBehaviorClustering();
        if (res.success) {
          toast.success(`Clustering berhasil! ${res.clusters?.length || 3} cluster terbentuk.`);
          router.refresh();
        } else {
          toast.error(res.error || "Gagal menjalankan clustering.");
        }
      } catch {
        toast.error("Terjadi kesalahan sistem.");
      }
    });
  };

  return (
    <Button
      onClick={handleRun}
      disabled={isPending}
      className="neo-button font-bold gap-2"
    >
      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Brain className="h-4 w-4" />}
      {isPending ? "Menganalisis..." : "Jalankan Clustering"}
    </Button>
  );
}
