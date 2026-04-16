export class ScoreResponse {
  id: string;
  score?: number | null;
  grade?: string | null;
  semester?: string | null;
  examDate?: Date | null;
  status: number;
  remarks?: string | null;
  createdAt: Date;
  updatedAt: Date;
  studentId?: string;
  courseId?: string;
  createdBy?: string | null;
  student?: {
    id: string;
    name: string;
    studentNo: string;
  } | null;
  course?: {
    id: string;
    name: string;
    code: string;
  } | null;
}

export class ScoreListResponse {
  records: ScoreResponse[];
  total: number;
  current: number;
  size: number;
}

export class ScoreStatistics {
  totalCount: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  passCount: number;
  failCount: number;
  passRate: number;
  gradeDistribution: {
    grade: string;
    count: number;
  }[];
}
