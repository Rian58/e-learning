import { UserRole } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface StudentTableProps {
  students: {
    id: string;
    name: string;
    email: string;
    level: number;
    behaviorProfile: { clusterType: string } | null;
  }[];
}

export function StudentTable({ students }: StudentTableProps) {
  return (
    <div className="rounded-xl border neo-card overflow-hidden bg-card">
      <Table>
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead className="font-bold">Nama</TableHead>
            <TableHead className="font-bold">Email</TableHead>
            <TableHead className="font-bold">Level</TableHead>
            <TableHead className="font-bold text-right"># Klaster AI</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell className="font-semibold">{student.name}</TableCell>
              <TableCell className="text-muted-foreground">{student.email}</TableCell>
              <TableCell className="font-bold">{student.level}</TableCell>
              <TableCell className="text-right">
                {student.behaviorProfile ? (
                  <Badge variant={student.behaviorProfile.clusterType.toLowerCase() as any}>
                    {student.behaviorProfile.clusterType}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground">Belum Diklasifikasi</Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
          {students.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-6 text-muted-foreground font-medium">
                Tidak ada mahasiswa ditemukan.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
