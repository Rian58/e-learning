import type { UserRole, MaterialType, SubmissionStatus } from "@prisma/client";

// ─── User Types ──────────────────────────────────────────

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string | null;
  createdAt: Date;
}

// ─── Course Types ────────────────────────────────────────

export interface CourseData {
  id: string;
  title: string;
  description: string;
  creatorId: string;
  isPublished: boolean;
  createdAt: Date;
  creator?: { name: string };
  materialCount?: number;
  quizCount?: number;
  assignmentCount?: number;
  enrollmentCount?: number;
  isEnrolled?: boolean;
}

export interface MaterialData {
  id: string;
  courseId: string;
  title: string;
  content: string;
  type: MaterialType;
  orderIndex: number;
}

export interface QuizData {
  id: string;
  courseId: string;
  title: string;
  description: string | null;
  timeLimit: number | null;
  passingScore: number;
  questionCount?: number;
}

export interface QuizQuestionData {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  points: number;
  orderIndex: number;
}

export interface AssignmentData {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: Date;
  maxScore: number;
  submission?: AssignmentSubmissionData;
}

export interface AssignmentSubmissionData {
  id: string;
  content: string;
  score: number | null;
  status: SubmissionStatus;
  submittedAt: Date;
  gradedAt: Date | null;
}

// Re-export Prisma enums for convenience
export type {
  UserRole,
  SubmissionStatus,
  MaterialType,
};
