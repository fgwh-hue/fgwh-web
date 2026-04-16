-- 插入测试学生数据
INSERT INTO "Student" ("studentNo", name, gender, phone, email, major, "className", "enrollYear", "userId", "createdAt", "updatedAt")
SELECT
  '2024001',
  '张三',
  '男',
  '13800138001',
  'zhangsan@student.com',
  '计算机科学',
  '计算机 2401 班',
  2024,
  u.id,
  NOW(),
  NOW()
FROM "User" u
WHERE u.email = 'zhangsan@student.com'
ON CONFLICT DO NOTHING;

INSERT INTO "Student" ("studentNo", name, gender, phone, email, major, "className", "enrollYear", "userId", "createdAt", "updatedAt")
SELECT
  '2024002',
  '李四',
  '男',
  '13800138002',
  'lisi@student.com',
  '计算机科学',
  '计算机 2401 班',
  2024,
  u.id,
  NOW(),
  NOW()
FROM "User" u
WHERE u.email = 'lisi@student.com'
ON CONFLICT DO NOTHING;

INSERT INTO "Student" ("studentNo", name, gender, phone, email, major, "className", "enrollYear", "userId", "createdAt", "updatedAt")
SELECT
  '2024003',
  '王五',
  '男',
  '13800138003',
  'wangwu@student.com',
  '计算机科学',
  '计算机 2401 班',
  2024,
  u.id,
  NOW(),
  NOW()
FROM "User" u
WHERE u.email = 'wangwu@student.com'
ON CONFLICT DO NOTHING;
