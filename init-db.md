# 数据库初始化指南

## 步骤

### 1. 推送数据库Schema
```bash
pnpm --filter @ai-web/backend prisma:push
```

### 2. 生成Prisma客户端
```bash
pnpm --filter @ai-web/backend prisma:generate
```

### 3. 运行种子数据
```bash
cd backend
npx ts-node prisma/seed.ts
```

或者直接运行：
```bash
node -r ts-node/register backend/prisma/seed.ts
```

## 测试账号

运行种子数据后，将创建以下测试账号：

### 管理员
- 邮箱：admin@example.com
- 密码：password
- 角色：SUPER_ADMIN

### 教师
- 邮箱：teacher1@example.com
- 密码：password
- 角色：TEACHER

### 学生
- 邮箱：student1@example.com
- 密码：password
- 角色：STUDENT

## 数据统计

种子数据将创建：
- 3个用户账号
- 5个教师记录
- 10个学生记录
