# AI Web Backend

基于 NestJS 的后端 API 项目

## 技术栈

- **Runtime**: Node.js 20+
- **Framework**: NestJS 10.x
- **ORM**: Prisma
- **Database**: PostgreSQL 16
- **Authentication**: JWT + Passport

## 项目结构

```
backend/
├── prisma/                 # Prisma Schema
├── src/
│   ├── common/            # 公共模块（Filters, Guards, Interceptors）
│   ├── config/            # 配置模块
│   ├── database/          # 数据库模块
│   └── modules/          # 业务模块
│       ├── auth/          # 认证模块
│       ├── user/          # 用户模块
│       ├── student/       # 学生模块
│       └── teacher/       # 教师模块
```

## 快速开始

### 1. 安装依赖

```bash
cd backend
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env
```

修改 `.env` 文件中的数据库连接信息：

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/ai_web
JWT_SECRET=your-super-secret-key
```

### 3. 初始化数据库

```bash
# 生成 Prisma Client
npm run prisma:generate

# 运行数据库迁移
npm run prisma:migrate

# 或者直接同步数据库结构（开发环境）
npm run prisma:push
```

### 4. 启动开发服务器

```bash
npm run start:dev
```

### 5. 访问 API 文档

打开浏览器访问：http://localhost:3000/api/docs

## API 接口

### 认证模块 `/api/auth`

| 方法 | 路径 | 说明 | 公开 |
|------|------|------|------|
| POST | /auth/register | 用户注册 | ✓ |
| POST | /auth/login | 用户登录 | ✓ |
| POST | /auth/refresh | 刷新Token | |
| POST | /auth/logout | 退出登录 | |

### 用户模块 `/api/users`

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| POST | /users | 创建用户 | ADMIN |
| GET | /users | 获取用户列表 | ADMIN |
| GET | /users/:id | 获取用户详情 | 登录用户 |
| PATCH | /users/:id | 更新用户 | 登录用户 |
| DELETE | /users/:id | 删除用户 | SUPER_ADMIN |

### 学生模块 `/api/students`

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| POST | /students | 创建学生 | ADMIN/TEACHER |
| GET | /students | 获取学生列表 | ADMIN/TEACHER |
| GET | /students/:id | 获取学生详情 | 登录用户 |
| PATCH | /students/:id | 更新学生 | ADMIN/TEACHER |
| DELETE | /students/:id | 删除学生 | ADMIN |

### 教师模块 `/api/teachers`

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| POST | /teachers | 创建教师 | ADMIN |
| GET | /teachers | 获取教师列表 | ADMIN/TEACHER |
| GET | /teachers/:id | 获取教师详情 | 登录用户 |
| PATCH | /teachers/:id | 更新教师 | ADMIN/TEACHER |
| DELETE | /teachers/:id | 删除教师 | ADMIN |

## 角色说明

| 角色 | Code | 说明 |
|------|------|------|
| 超级管理员 | SUPER_ADMIN | 拥有所有权限 |
| 管理员 | ADMIN | 系统管理 |
| 教师 | TEACHER | 教学管理 |
| 学生 | STUDENT | 普通用户 |

## 开发规范

### 模块结构

每个业务模块遵循以下结构：

```
module/
├── dto/
│   ├── create-{module}.dto.ts
│   ├── update-{module}.dto.ts
│   └── query-{module}.dto.ts
├── entities/
│   └── {module}.entity.ts
├── {module}.controller.ts
├── {module}.service.ts
├── {module}.repository.ts
└── {module}.module.ts
```

### 代码风格

- 类名：`PascalCase`
- 接口名：`PascalCase`
- 变量名：`camelCase`
- 文件名：`kebab-case.ts`

## 测试

```bash
# 运行单元测试
npm test

# 运行覆盖率报告
npm run test:cov

# 运行 E2E 测试
npm run test:e2e
```

## 构建生产版本

```bash
npm run build
npm run start:prod
```

## License

MIT
