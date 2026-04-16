export class AnnouncementResponse {
  id: string;
  title: string;
  content: string;
  type: string;
  priority: string;
  isTop: boolean;
  startDate?: Date | null;
  endDate?: Date | null;
  status: boolean;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  authorId?: string;
  author?: {
    id: string;
    nickname: string | null;
  } | null;
}

export class AnnouncementListResponse {
  records: AnnouncementResponse[];
  total: number;
  current: number;
  size: number;
}
