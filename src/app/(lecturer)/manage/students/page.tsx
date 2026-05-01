export const dynamic = "force-dynamic";

import { getLecturerStudents } from "@/actions/lecturer-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, BookOpen } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export const metadata = {
  title: "Progres Mahasiswa - Stack Sinau",
};

export default async function LecturerStudentsPage() {
  const enrollments = await getLecturerStudents();

  // Group by student
  const studentMap = new Map<string, { name: string; email: string; courses: string[] }>();
  for (const e of enrollments) {
    const existing = studentMap.get(e.user.id);
    if (existing) {
      existing.courses.push(e.course.title);
    } else {
      studentMap.set(e.user.id, {
        name: e.user.name,
        email: e.user.email,
        courses: [e.course.title]
      });
    }
  }

  const students = Array.from(studentMap.values());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
          <Users className="h-8 w-8 text-primary" />
          Progres Mahasiswa
        </h1>
        <p className="text-muted-foreground font-medium mt-1">
          Pantau mahasiswa yang mengikuti mata kuliah Anda.
        </p>
      </div>

      <Card className="neo-card">
        <CardHeader>
          <CardTitle>Mahasiswa Terdaftar ({students.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {students.length > 0 ? (
            <div className="rounded-xl border neo-border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead className="font-bold">Nama</TableHead>
                    <TableHead className="font-bold">Email</TableHead>
                    <TableHead className="font-bold">Mata Kuliah Diikuti</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-semibold">{student.name}</TableCell>
                      <TableCell className="text-muted-foreground">{student.email}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {student.courses.map((course, cIdx) => (
                            <Badge key={cIdx} variant="secondary" className="text-xs font-medium">
                              {course}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground font-medium">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>Belum ada mahasiswa yang terdaftar di mata kuliah Anda.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
