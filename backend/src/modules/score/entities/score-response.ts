export class ScoreResponse {
  id: string = '';
  score?: number | null;
  grade?: string | null;
  semester?: string | null;
  examDate?: Date | null;
  status: number = 1;
  remarks?: string | null;
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
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
  records: ScoreResponse[] = [];
  total: number = 0;
  current: number = 1;
  size: number = 10;
}

export class ScoreStatistics {
  totalCount: number = 0;
  averageScore: number = 0;
  highestScore: number = 0;
  lowestScore: number = 0;
  passCount: number = 0;
  failCount: number = 0;
  passRate: number = 0;
  gradeDistribution: {
    grade: string;
    count: number;
  }[] = [];
}
