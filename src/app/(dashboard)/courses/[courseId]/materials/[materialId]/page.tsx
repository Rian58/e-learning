import { getCourseMaterial } from "@/actions/course-actions";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, PlayCircle, FileText, CheckCircle } from "lucide-react";
import Link from "next/link";
import { MarkCompleteButton } from "./mark-complete-button";

export async function generateMetadata({ params }: { params: Promise<{ courseId: string, materialId: string }> }) {
  const { courseId, materialId } = await params;
  const data = await getCourseMaterial(courseId, materialId);
  return {
    title: data ? `${data.currentMaterial.title} - Stack Sinau` : "Materi Tidak Ditemukan",
  };
}

export default async function MaterialViewerPage({ params }: { params: Promise<{ courseId: string, materialId: string }> }) {
  const { courseId, materialId } = await params;
  const data = await getCourseMaterial(courseId, materialId);

  if (!data) {
    notFound();
  }

  const { course, currentMaterial } = data;
  
  // Find prev / next materials
  const currentIndex = course.materials.findIndex(m => m.id === currentMaterial.id);
  const prevMaterial = currentIndex > 0 ? course.materials[currentIndex - 1] : null;
  const nextMaterial = currentIndex < course.materials.length - 1 ? course.materials[currentIndex + 1] : null;

  const isVideo = currentMaterial.type === 'VIDEO';

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex items-center justify-between">
        <Link href={`/courses/${course.id}`}>
          <Button variant="ghost" className="pl-0 gap-2 hover:bg-transparent font-bold">
            <ArrowLeft className="h-4 w-4" /> Kembali ke Silabus
          </Button>
        </Link>
        <span className="text-sm font-bold text-muted-foreground bg-muted px-3 py-1 rounded-full">
          Materi {currentIndex + 1} dari {course.materials.length}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="font-bold border-2 capitalize">
            {isVideo ? (
              <><PlayCircle className="mr-1 h-3 w-3" /> Video</>
            ) : (
              <><FileText className="mr-1 h-3 w-3" /> Teks</>
            )}
          </Badge>
          <span className="text-sm font-bold text-muted-foreground">{course.title}</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
          {currentMaterial.title}
        </h1>
      </div>

      <Card className="neo-card border-4 border-foreground overflow-hidden">
        {isVideo && (
          <div className="aspect-video bg-black flex items-center justify-center border-b-4 border-foreground relative group cursor-pointer">
            <PlayCircle className="h-20 w-20 text-white/50 group-hover:text-white group-hover:scale-110 transition-all" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
            <p className="absolute bottom-4 left-4 text-white/70 font-bold text-sm">Simulasi Video Player</p>
          </div>
        )}
        <CardContent className="p-6 md:p-10 prose prose-neutral dark:prose-invert max-w-none prose-headings:font-black prose-p:font-medium prose-p:leading-relaxed">
          {/* For dummy data, the content is plain text. In real app, we might use MDX. */}
          <div className="whitespace-pre-wrap">{currentMaterial.content}</div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t-2 border-dashed">
        <div className="w-full sm:w-auto">
          {prevMaterial ? (
            <Link href={`/courses/${course.id}/materials/${prevMaterial.id}`}>
              <Button variant="outline" className="w-full sm:w-auto neo-button font-bold border-2">
                &larr; Materi Sebelumnya
              </Button>
            </Link>
          ) : (
            <div className="w-[160px] hidden sm:block" /> // Spacer
          )}
        </div>

        <MarkCompleteButton
          materialId={currentMaterial.id}
          isCompleted={false}
          nextMaterialId={nextMaterial?.id}
          courseId={course.id}
        />

        <div className="w-full sm:w-auto">
          {nextMaterial ? (
            <Link href={`/courses/${course.id}/materials/${nextMaterial.id}`}>
              <Button variant="outline" className="w-full sm:w-auto neo-button font-bold border-2">
                Materi Selanjutnya &rarr;
              </Button>
            </Link>
          ) : (
            <Link href={`/courses/${course.id}`}>
                <Button variant="outline" className="w-full sm:w-auto neo-button font-bold border-2">
                Selesai &rarr;
                </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
