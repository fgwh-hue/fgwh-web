export class OperationLogResponse {
  id: string;
  action: string;
  module: string;
  method: string;
  path: string;
  ip?: string;
  userAgent?: string;
  params?: string;
  result?: string;
  statusCode?: number;
  duration?: number;
  createdAt: Date;
  user?: {
    id: string;
    nickname: string;
  };
}

export class OperationLogListResponse {
  records: OperationLogResponse[];
  total: number;
  current: number;
  size: number;
}
