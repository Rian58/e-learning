"use client";

import { useActionState } from "react";
import { enrollInCourse } from "@/actions/course-actions";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function EnrollButton({ courseId }: { courseId: string }) {
  // Wrap enroll action for useActionState since it requires formData/prevState mapping normally,
  // or we can handle it via a manual transition for simpler UX without form.
  
  const handleEnroll = async () => {
    try {
      const result = await enrollInCourse(courseId);
      if (result.success) {
        toast.success("Berhasil mendaftar mata kuliah!");
      } else {
        toast.error(result.error || "Gagal mendaftar mata kuliah.");
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan sistem");
    }
  };

  return (
    <form action={handleEnroll}>
      <Button 
        type="submit" 
        className="w-full neo-button h-14 text-lg font-black bg-primary hover:bg-primary/90"
      >
        <span className="flex items-center">
            Mendaftar Mata Kuliah
        </span>
      </Button>
    </form>
  );
}
