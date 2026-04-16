export const ResponseCode = {
  SUCCESS: '0000',
  BAD_REQUEST: '4000',
  UNAUTHORIZED: '4010',
  FORBIDDEN: '4030',
  NOT_FOUND: '4040',
  CONFLICT: '4090',
  INTERNAL_SERVER_ERROR: '5000',
  VALIDATION_ERROR: '4420'
};

export const ResponseMessage = {
  SUCCESS: '操作成功',
  BAD_REQUEST: '请求参数错误',
  UNAUTHORIZED: '未授权访问',
  FORBIDDEN: '无权限访问',
  NOT_FOUND: '资源不存在',
  CONFLICT: '资源冲突',
  INTERNAL_SERVER_ERROR: '服务器内部错误',
  VALIDATION_ERROR: '数据验证失败'
};
