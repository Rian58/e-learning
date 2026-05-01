import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, User, ClipboardList, PenTool } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description: string;
    creator: {
      name: string;
      avatarUrl: string | null;
    };
    semester?: string | null;
    _count?: {
      materials: number;
      quizzes: number;
      assignments: number;
    };
    enrollments?: any[];
  };
  isEnrolled?: boolean;
}

export function CourseCard({ course, isEnrolled = false }: CourseCardProps) {
  // If we pass enrollments array, we can check ourselves
  const userIsEnrolled = isEnrolled || (course.enrollments && course.enrollments.length > 0);
  
  const initials = course.creator.name 
    ? course.creator.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'C';

  return (
    <Card className="neo-card flex flex-col h-full group transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_[-2px]_rgba(0,0,0,1)]">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          {userIsEnrolled ? (
            <Badge className="bg-primary text-primary-foreground neo-shadow-sm font-bold">Terdaftar</Badge>
          ) : (
            <Badge variant="outline" className="font-bold border-2">Tersedia</Badge>
          )}
          {course.semester && (
            <Badge variant="secondary" className="font-bold border-2 shrink-0">
              {course.semester}
            </Badge>
          )}
        </div>
        <CardTitle className="text-xl font-bold line-clamp-2 leading-tight">
          {course.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4 font-medium">
          {course.description}
        </p>

        <div className="flex items-center gap-2 mb-4">
          <Avatar className="h-6 w-6 border-2 border-foreground">
            <AvatarImage src={course.creator.avatarUrl || ''} />
            <AvatarFallback className="text-[10px] font-bold">{initials}</AvatarFallback>
          </Avatar>
          <span className="text-xs font-bold text-muted-foreground">
            {course.creator.name}
          </span>
        </div>

        {course._count && (
          <div className="flex flex-wrap gap-3 text-xs font-semibold text-muted-foreground">
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>{course._count.materials} Materi</span>
            </div>
            <div className="flex items-center gap-1">
              <ClipboardList className="h-4 w-4" />
              <span>{course._count.quizzes} Kuis</span>
            </div>
            <div className="flex items-center gap-1">
              <PenTool className="h-4 w-4" />
              <span>{course._count.assignments} Tugas</span>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-4 border-t-2">
        <Link href={`/courses/${course.id}`} className="w-full">
          <Button className="w-full neo-button font-bold" variant={userIsEnrolled ? "default" : "secondary"}>
            {userIsEnrolled ? "Lanjutkan Belajar" : "Lihat Detail"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
