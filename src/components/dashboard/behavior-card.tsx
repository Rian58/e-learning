"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Flame, Leaf, Clock, Trophy, Target, BookOpen } from "lucide-react";

interface BehaviorProfileData {
  cluster: string;
  loginFrequency: number;
  studyTime: number;
  completionRate: number;
  strategy: any;
  analyzedAt: Date;
}

interface BadgeData {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
}

const CLUSTER_CONFIG: Record<string, { color: string; bgColor: string; borderColor: string; Icon: any }> = {
  AKTIF: { color: "text-green-700", bgColor: "bg-green-50", borderColor: "border-green-500", Icon: Flame },
  PASIF: { color: "text-blue-700", bgColor: "bg-blue-50", borderColor: "border-blue-500", Icon: Leaf },
  PROCRASTINATOR: { color: "text-orange-700", bgColor: "bg-orange-50", borderColor: "border-orange-500", Icon: Clock },
};

export function BehaviorCard({ profile, badges }: { profile: BehaviorProfileData | null; badges: BadgeData[] }) {
  if (!profile) {
    return (
      <Card className="neo-card border-4 border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <Brain className="h-12 w-12 text-muted-foreground/50 mb-3" />
          <h3 className="font-bold text-lg">Analisis Belum Tersedia</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-xs">
            AI belum menganalisis perilaku belajarmu. Tunggu dosen atau admin menjalankan clustering.
          </p>
        </CardContent>
      </Card>
    );
  }

  const config = CLUSTER_CONFIG[profile.cluster] || CLUSTER_CONFIG.PASIF;
  const ClusterIcon = config.Icon;
  const strategy = profile.strategy as any;

  const maxLoginFreq = Math.max(profile.loginFrequency, 1);
  const maxStudyTime = Math.max(profile.studyTime, 1);

  return (
    <div className="space-y-6">
      <Card className={`neo-card border-4 ${config.borderColor}`}>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${config.bgColor} border-2 ${config.borderColor}`}>
                <ClusterIcon className={`h-6 w-6 ${config.color}`} />
              </div>
              <div>
                <CardTitle className="text-lg">{strategy?.title || profile.cluster}</CardTitle>
                <CardDescription className="text-xs font-bold mt-0.5">
                  Tipe Perilaku Belajar
                </CardDescription>
              </div>
            </div>
            <Badge className={`w-fit text-xs font-black px-3 py-1 ${config.bgColor} ${config.color} border-2 ${config.borderColor}`}>
              {profile.cluster}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm font-medium text-muted-foreground">
            {strategy?.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-lg bg-muted/50 border-2 flex sm:flex-col items-center sm:justify-center justify-between">
              <p className="text-sm sm:text-[10px] font-bold text-muted-foreground mt-0 sm:mt-1 order-2 sm:order-none">Login / 30 Hari</p>
              <p className="text-xl sm:text-2xl font-black text-primary order-1 sm:order-none">{profile.loginFrequency}</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50 border-2 flex sm:flex-col items-center sm:justify-center justify-between">
              <p className="text-sm sm:text-[10px] font-bold text-muted-foreground mt-0 sm:mt-1 order-2 sm:order-none">Menit Belajar</p>
              <p className="text-xl sm:text-2xl font-black text-primary order-1 sm:order-none">{profile.studyTime}</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50 border-2 flex sm:flex-col items-center sm:justify-center justify-between">
              <p className="text-sm sm:text-[10px] font-bold text-muted-foreground mt-0 sm:mt-1 order-2 sm:order-none">Penyelesaian</p>
              <p className="text-xl sm:text-2xl font-black text-primary order-1 sm:order-none">{profile.completionRate}%</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold text-muted-foreground flex items-center gap-1">
              <Target className="h-3 w-3" /> TANTANGAN UNTUKMU
            </p>
            <div className="space-y-1.5">
              {strategy?.challenges?.map((challenge: string, i: number) => (
                <div key={i} className="flex items-start gap-2 text-sm font-medium bg-accent/50 p-2 rounded-lg border">
                  <span className="text-primary font-black text-xs mt-0.5">{i + 1}.</span>
                  <span>{challenge}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {badges.length > 0 && (
        <Card className="neo-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" /> Koleksi Badge
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {badges.map((badge) => (
                <div key={badge.id} className="flex items-center gap-3 p-3 rounded-xl border-2 bg-muted/30 hover:bg-muted/60 transition-colors">
                  <span className="text-2xl">{badge.icon}</span>
                  <div>
                    <p className="font-bold text-sm">{badge.name}</p>
                    <p className="text-[10px] text-muted-foreground font-medium">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
