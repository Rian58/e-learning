"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { enrollInCourse } from "@/actions/course-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight } from "lucide-react";

export function EnrollForm() {
  const [code, setCode] = useState("");
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      toast.error("Silakan masukkan kode akses");
      return;
    }

    setIsPending(true);
    try {
      const res = await enrollInCourse(code.trim().toUpperCase());
      if (res.success) {
        toast.success("Berhasil bergabung ke mata kuliah!");
        router.push(`/courses/${res.courseId}`);
      } else {
        toast.error(res.error || "Gagal bergabung ke mata kuliah");
      }
    } catch {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleEnroll} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="code" className="text-sm font-bold">Kode Akses</Label>
        <Input
          id="code"
          type="text"
          placeholder="Contoh: A8B9C0"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className="uppercase tracking-widest neo-input h-14 text-center font-bold text-lg"
          maxLength={10}
        />
      </div>
      <Button 
        type="submit" 
        className="w-full neo-button h-14 bg-primary text-primary-foreground font-black text-lg gap-2"
        disabled={isPending}
      >
        {isPending ? <Loader2 className="animate-spin w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
        Cek & Gabung
      </Button>
    </form>
  );
}
