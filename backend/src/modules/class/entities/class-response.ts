export class ClassResponse {
  id: string;
  classNo: string;
  name: string;
  grade?: number | null;
  major?: string | null;
  teacherId?: string | null;
  courseId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  course?: {
    id: string;
    name: string;
    code: string;
  } | null;
  _count?: {
    students: number;
  };
}

export class ClassListResponse {
  records: ClassResponse[];
  total: number;
  current: number;
  size: number;
}
