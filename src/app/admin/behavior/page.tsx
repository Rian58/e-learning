import { requireUser } from "@/actions/user-actions";
import { getAllBehaviorProfiles } from "@/actions/ai-actions";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Brain, Users, Flame, Leaf, Clock } from "lucide-react";
import { RunClusteringButton } from "./run-clustering-button";

export const metadata = {
  title: "Analitik AI - Stack Sinau",
};

export default async function BehaviorAnalyticsPage() {
  const user = await requireUser();

  if (user.role !== "SUPER_ADMIN" && user.role !== "DOSEN") {
    redirect("/dashboard");
  }

  const { profiles, clusterCounts, total } = await getAllBehaviorProfiles();

  const CLUSTER_STYLE: Record<string, { variant: "default" | "secondary" | "destructive"; icon: any }> = {
    AKTIF: { variant: "default", icon: Flame },
    PASIF: { variant: "secondary", icon: Leaf },
    PROCRASTINATOR: { variant: "destructive", icon: Clock },
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" /> Analitik AI
          </h1>
          <p className="text-muted-foreground font-medium mt-1">
            Distribusi clustering perilaku belajar mahasiswa.
          </p>
        </div>
        <RunClusteringButton />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="neo-card border-green-500 border-4">
          <CardContent className="pt-6 text-center">
            <Flame className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-4xl font-black text-green-700">{clusterCounts.AKTIF}</p>
            <p className="text-sm font-bold text-muted-foreground mt-1">Mahasiswa Aktif</p>
          </CardContent>
        </Card>
        <Card className="neo-card border-blue-500 border-4">
          <CardContent className="pt-6 text-center">
            <Leaf className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-4xl font-black text-blue-700">{clusterCounts.PASIF}</p>
            <p className="text-sm font-bold text-muted-foreground mt-1">Mahasiswa Pasif</p>
          </CardContent>
        </Card>
        <Card className="neo-card border-orange-500 border-4">
          <CardContent className="pt-6 text-center">
            <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-4xl font-black text-orange-700">{clusterCounts.PROCRASTINATOR}</p>
            <p className="text-sm font-bold text-muted-foreground mt-1">Procrastinator</p>
          </CardContent>
        </Card>
      </div>

      <Card className="neo-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" /> Detail Profil Mahasiswa ({total})
          </CardTitle>
          <CardDescription>Hasil clustering terakhir berdasarkan data aktivitas 30 hari.</CardDescription>
        </CardHeader>
        <CardContent>
          {profiles.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground font-medium border-2 border-dashed rounded-xl">
              Belum ada data clustering. Klik tombol &quot;Jalankan Clustering&quot; di atas.
            </div>
          ) : (
            <div className="rounded-xl border neo-border overflow-hidden overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead className="font-bold">Nama</TableHead>
                    <TableHead className="font-bold">Email</TableHead>
                    <TableHead className="font-bold text-center">Cluster</TableHead>
                    <TableHead className="font-bold text-center">Login</TableHead>
                    <TableHead className="font-bold text-center">Belajar (mnt)</TableHead>
                    <TableHead className="font-bold text-center">Completion</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profiles.map((p: any) => {
                    const style = CLUSTER_STYLE[p.cluster] || CLUSTER_STYLE.PASIF;
                    return (
                      <TableRow key={p.id}>
                        <TableCell className="font-bold">{p.user.name}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{p.user.email}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={style.variant} className="font-bold gap-1">
                            {p.cluster}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center font-bold">{p.loginFrequency}</TableCell>
                        <TableCell className="text-center font-bold">{p.studyTime}</TableCell>
                        <TableCell className="text-center font-bold">{p.completionRate}%</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
