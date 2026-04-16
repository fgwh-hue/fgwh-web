export interface StudentResponse {
  id: string;
  studentNo: string;
  studentName: string;
  studentGender: number | null;
  studentPhone: string | null;
  studentEmail: string | null;
  studentMajor: string | null;
  studentClass: string | null;
  enrollYear: number | null;
  status: number;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    email: string;
    nickname: string | null;
    avatar: string | null;
  };
}

export interface StudentListResponse {
  records: StudentResponse[];
  total: number;
  page: number;
  pageSize: number;
}
