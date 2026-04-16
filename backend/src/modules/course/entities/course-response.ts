export class CourseResponse {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  credit?: number | null;
  semester?: string | null;
  academicYear?: string | null;
  maxStudents?: number | null;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
  teacherId?: string;
  teacher?: {
    id: string;
    name: string;
    teacherNo: string;
  } | null;
  classes?: any[];
  _count?: {
    scores: number;
  };
}

export class CourseListResponse {
  records: CourseResponse[];
  total: number;
  current: number;
  size: number;
}
