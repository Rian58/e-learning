"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { createCourse } from "@/actions/lecturer-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function NewCoursePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [semester, setSemester] = useState("");
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    try {
      const res = await createCourse(title, description, semester || null);
      if (res.success) {
        toast.success("Mata Kuliah berhasil dibuat!");
        router.push(`/manage/courses/${res.courseId}`);
      } else {
        toast.error(res.error || "Gagal membuat mata kuliah.");
      }
    } catch {
      toast.error("Terjadi kesalahan sistem.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href="/manage">
        <Button variant="ghost" className="pl-0 gap-2 hover:bg-transparent font-bold">
          <ArrowLeft className="h-4 w-4" /> Kembali ke Manajemen
        </Button>
      </Link>

      <Card className="neo-card border-4">
        <CardHeader>
          <CardTitle className="text-2xl font-black">Buat Mata Kuliah Baru</CardTitle>
          <CardDescription className="font-medium">
            Isi informasi dasar mata kuliah Anda. Anda bisa menambahkan materi, kuis, dan tugas setelah mata kuliah dibuat.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="font-bold">Judul Mata Kuliah</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Pemrograman Dasar Python"
                required
                className="neo-input font-medium"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="font-bold">Deskripsi</Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Jelaskan isi mata kuliah ini secara singkat..."
                required
                rows={5}
                className="w-full rounded-lg border-2 border-border bg-background p-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors resize-y neo-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="semester" className="font-bold">Semester (opsional)</Label>
              <Input
                id="semester"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                placeholder="Contoh: Ganjil 2025/2026"
                className="neo-input font-medium"
              />
            </div>
            <Button type="submit" disabled={isPending} className="w-full neo-button font-black text-lg h-12">
              {isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Plus className="mr-2 h-5 w-5" />}
              Buat Mata Kuliah
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
