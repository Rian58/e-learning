import { requireUser } from "@/actions/user-actions";
import { getPublishedCourses } from "@/actions/course-actions";
import { CourseCard } from "@/components/courses/course-card";
import { BookOpen } from "lucide-react";
import { SearchInput } from "@/components/search-input";

import { redirect } from "next/navigation";

export const metadata = {
  title: "Katalog Mata Kuliah - Stack Sinau",
};

export default async function CoursesCatalogPage({ searchParams }: { searchParams: Promise<{ query?: string }> }) {
  const user = await requireUser();
  if (user.role === "DOSEN") return redirect("/manage");
  if (user.role === "SUPER_ADMIN") return redirect("/admin");

  const params = await searchParams;
  const query = params?.query || "";
  
  // Ambil semua mata kuliah yang dipublish dari database (beserta info kreator dan jumlah materi)
  const courses = await getPublishedCourses(query);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            Katalog Mata Kuliah
          </h1>
          <p className="text-muted-foreground font-medium mt-1">
            Eksplorasi dan pelajari berbagai materi baru untuk meningkatkan level Anda.
          </p>
        </div>
        <SearchInput placeholder="Cari mata kuliah atau dosen..." />
      </div>

      {courses.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-muted/30 rounded-xl border-2 border-dashed border-muted-foreground/20">
          <BookOpen className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-bold">Belum ada mata kuliah</h3>
          <p className="text-muted-foreground font-medium text-center max-w-sm mt-2">
            Saat ini belum ada mata kuliah yang tersedia. Dosen akan segera menambahkan materi baru.
          </p>
        </div>
      )}
    </div>
  );
}
