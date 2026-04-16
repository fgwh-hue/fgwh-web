# 后端项目框架设计方案

## 一、技术栈选型

### 推荐方案：Node.js + NestJS + PostgreSQL + Redis

| 层级 | 技术选型 | 说明 |
|------|----------|------|
| 运行环境 | Node.js 20 LTS | 稳定可靠，生态丰富 |
| Web框架 | NestJS 10.x | 模块化架构，强类型支持，与前端技术栈统一 |
| ORM | Prisma | 类型安全，迁移方便，IDE支持好 |
| 数据库 | PostgreSQL 16 | 功能丰富，扩展性强 |
| 缓存 | Redis 7 | 会话存储，缓存层 |
| 认证 | JWT + RefreshToken | 标准认证方案 |
| 文档 | Swagger/OpenAPI | 自动API文档 |
| 日志 | Pino + Winston | 结构化日志 |

### 备选方案
- **Java + Spring Boot**：适合大型企业项目
- **Go + Gin**：高性能场景
- **Python + FastAPI**：AI/ML集成场景

---

## 二、项目目录结构

```
backend/
├── src/
│   ├── main.ts                      # 应用入口
│   ├── app.module.ts                # 根模块
│   │
│   ├── common/                      # 公共模块
│   │   ├── decorators/              # 自定义装饰器
│   │   │   ├── current-user.decorator.ts
│   │   │   ├── roles.decorator.ts
│   │   │   └── public.decorator.ts
│   │   ├── filters/                 # 全局异常过滤器
│   │   │   └── http-exception.filter.ts
│   │   ├── interceptors/            # 拦截器
│   │   │   ├── logging.interceptor.ts
│   │   │   └── transform.interceptor.ts
│   │   ├── guards/                  # 路由守卫
│   │   │   ├── auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   ├── pipes/                   # 管道
│   │   │   └── validation.pipe.ts
│   │   ├── utils/                   # 工具函数
│   │   │   └── crypto.util.ts
│   │   └── constants/               # 常量定义
│   │       └── role.enum.ts
│   │
│   ├── config/                      # 配置模块
│   │   ├── config.module.ts
│   │   ├── config.service.ts
│   │   └── configuration.ts         # 环境配置
│   │
│   ├── database/                    # 数据库模块
│   │   ├── database.module.ts
│   │   └── prisma.service.ts
│   │
│   ├── modules/                     # 业务模块
│   │   │
│   │   ├── auth/                    # 认证模块
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── strategies/           # Passport策略
│   │   │   │   └── jwt.strategy.ts
│   │   │   ├── dto/                 # 数据传输对象
│   │   │   │   ├── login.dto.ts
│   │   │   │   └── register.dto.ts
│   │   │   └── types/
│   │   │       └── auth.type.ts
│   │   │
│   │   ├── user/                    # 用户模块
│   │   │   ├── user.module.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   ├── user.repository.ts   # 数据访问层
│   │   │   ├── dto/
│   │   │   │   ├── create-user.dto.ts
│   │   │   │   ├── update-user.dto.ts
│   │   │   │   └── query-user.dto.ts
│   │   │   └── entities/
│   │   │       └── user.entity.ts
│   │   │
│   │   ├── role/                    # 角色模块
│   │   │   ├── role.module.ts
│   │   │   ├── role.controller.ts
│   │   │   ├── role.service.ts
│   │   │   └── entities/
│   │   │       └── role.entity.ts
│   │   │
│   │   ├── student/                 # 学生模块
│   │   │   ├── student.module.ts
│   │   │   ├── student.controller.ts
│   │   │   ├── student.service.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-student.dto.ts
│   │   │   │   ├── update-student.dto.ts
│   │   │   │   └── query-student.dto.ts
│   │   │   └── entities/
│   │   │       └── student.entity.ts
│   │   │
│   │   ├── teacher/                 # 教师模块
│   │   │   └── ...
│   │   │
│   │   └── course/                  # 课程模块
│   │       └── ...
│   │
│   └── shared/                      # 共享资源
│       ├── dto/
│       │   └── pagination.dto.ts     # 分页DTO
│       └── interfaces/
│           └── response.interface.ts # 统一响应格式
│
├── prisma/                          # Prisma ORM
│   ├── schema.prisma
│   └── migrations/                  # 数据库迁移
│
├── test/                            # 测试文件
│   ├── unit/
│   └── e2e/
│
├── logs/                            # 日志目录
├── .env.example                     # 环境变量示例
├── .env                             # 环境变量（不提交）
├── package.json
├── tsconfig.json
├── nest-cli.json
└── README.md
```

---

## 三、核心功能模块设计

### 1. 用户认证授权模块

**功能点：**
- 用户注册（邮箱/手机号）
- 用户登录（账号密码）
- JWT Token 签发与刷新
- 密码加密存储（bcrypt）
- 角色权限控制（RBAC）
- 登录日志记录

**数据流：**
```
用户登录 → AuthController → AuthService
    → 验证凭证 → 生成JWT → 返回Token
    → Redis存储RefreshToken
```

### 2. 用户管理模块

**功能点：**
- 用户CRUD操作
- 密码修改与重置
- 用户状态管理（启用/禁用）
- 多条件搜索分页

### 3. 学生/教师管理模块

**功能点：**
- 学生/教师CRUD
- 信息管理（成绩、课程等）
- 批量导入导出
- 搜索筛选

### 4. 课程管理模块

**功能点：**
- 课程CRUD
- 课程与学生/教师关联
- 课程表管理

---

## 四、API接口设计规范

### 统一响应格式

```typescript
// 成功响应
{
  "code": 200,
  "message": "操作成功",
  "data": { ... },
  "meta": {
    "total": 100,
    "page": 1,
    "pageSize": 10
  }
}

// 错误响应
{
  "code": 400,
  "message": "参数错误",
  "error": {
    "field": "email",
    "message": "邮箱格式不正确"
  }
}
```

### RESTful API 规范

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /auth/register | 用户注册 |
| POST | /auth/login | 用户登录 |
| POST | /auth/refresh | 刷新Token |
| GET | /users | 获取用户列表 |
| GET | /users/:id | 获取用户详情 |
| POST | /users | 创建用户 |
| PATCH | /users/:id | 更新用户 |
| DELETE | /users/:id | 删除用户 |

### 路由守卫层级

```
请求 → JwtAuthGuard → RolesGuard → Controller
         ↓              ↓
      验证Token     验证角色权限
```

---

## 五、错误处理机制

### 分层异常处理

```
Controller → Service → Repository
                ↓
        HttpExceptionFilter
                ↓
        返回统一错误格式
```

### 错误码定义

| 错误码 | 说明 |
|--------|------|
| 400 | 请求参数错误 |
| 401 | 未认证/Token过期 |
| 403 | 无权限访问 |
| 404 | 资源不存在 |
| 409 | 资源冲突 |
| 500 | 服务器内部错误 |

---

## 六、日志系统设计

### 日志级别

| 级别 | 用途 |
|------|------|
| error | 错误日志（API异常、数据库错误） |
| warn | 警告日志（业务警告） |
| info | 信息日志（请求记录） |
| debug | 调试日志（开发环境） |

### 日志格式

```json
{
  "timestamp": "2024-01-01T12:00:00.000Z",
  "level": "info",
  "message": "User logged in",
  "context": "AuthService",
  "requestId": "uuid",
  "userId": "user123",
  "method": "POST",
  "path": "/auth/login",
  "duration": 150
}
```

### 日志存储

- **文件存储**：`logs/app-{date}.log`
- **控制台输出**：开发环境
- **ELK可选**：生产环境集中日志

---

## 七、数据库设计（Prisma Schema）

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  nickname  String?
  role      Role     @relation(fields: [roleId], references: [id])
  roleId    String
  status    Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  student   Student?
  teacher   Teacher?
}

model Student {
  id           String   @id @default(uuid())
  studentNo    String   @unique
  name         String
  gender       String?
  major        String?
  className    String?
  user         User     @relation(fields: [userId], references: [id])
  userId       String   @unique
  enrollYear   Int?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Teacher {
  id           String   @id @default(uuid())
  teacherNo    String   @unique
  name         String
  gender       String?
  title        String?
  department   String?
  user         User     @relation(fields: [userId], references: [id])
  userId       String   @unique
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Role {
  id        String   @id @default(uuid())
  name      String   @unique
  code      String   @unique
  permissions String[]
  users     User[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## 八、开发规范与代码风格

### TypeScript 规范

- 使用 `strict` 模式
- 接口命名：`IUserService` / `UserService`
- DTO 使用 `CreateUserDto`、`UpdateUserDto`
- 实体使用 `.entity.ts` 结尾

### 模块导入顺序

```typescript
// 1. Node内置模块
import { join } from 'path';

// 2. 第三方模块
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

// 3. 应用模块
import { UserModule } from './modules/user/user.module';

// 4. 公共模块
import { ConfigModule } from './config/config.module';

// 5. 子模块/组件
import { UserController } from './user.controller';
```

### 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 类名 | PascalCase | `UserService` |
| 接口名 | PascalCase | `CreateUserDto` |
| 变量 | camelCase | `userName` |
| 常量 | UPPER_SNAKE | `MAX_RETRIES` |
| 文件名 | kebab-case | `user-service.ts` |

---

## 九、环境配置

### .env.example

```env
# 应用配置
NODE_ENV=development
PORT=3000

# 数据库配置
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Redis配置
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT配置
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d

# 文件上传
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10mb
```

---

## 十、测试策略

### 单元测试
- Service层业务逻辑
- 工具函数
- DTO验证

### E2E测试
- API端到端测试
- 认证流程测试

### 测试覆盖率
- 目标：核心业务 > 80%

---

## 十一、部署架构

```
                    ┌─────────────┐
                    │   Nginx     │
                    │  (反向代理)  │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
        ┌─────▼─────┐ ┌────▼────┐ ┌────▼────┐
        │  Node.js  │ │  Node.js│ │  Node.js│
        │  Server 1 │ │ Server 2│ │ Server 3│
        └─────┬─────┘ └────┬────┘ └────┬────┘
              │            │            │
              └────────────┼────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
  ┌─────▼─────┐      ┌─────▼─────┐      ┌─────▼─────┐
  │ PostgreSQL│      │   Redis   │      │   对象存储 │
  │  主从集群  │      │   集群    │      │  (MinIO)  │
  └───────────┘      └───────────┘      └───────────┘
```

---

## 十二、下一步实施计划

### Phase 1: 项目初始化（1天）
- [ ] 初始化NestJS项目
- [ ] 配置TypeScript和ESLint
- [ ] 配置Prisma和数据库
- [ ] 配置环境变量

### Phase 2: 架构搭建（2天）
- [ ] 实现配置模块
- [ ] 实现数据库模块
- [ ] 实现日志系统
- [ ] 实现异常过滤器
- [ ] 实现JWT认证

### Phase 3: 核心模块（3天）
- [ ] 用户模块CRUD
- [ ] 角色权限模块
- [ ] 学生模块
- [ ] 教师模块

### Phase 4: 完善功能（2天）
- [ ] API文档
- [ ] 单元测试
- [ ] 项目文档

---

## 请您审阅

以上是后端项目框架的完整设计方案。主要特点：

1. **技术栈统一**：使用 Node.js + NestJS，与前端技术栈统一
2. **模块化架构**：清晰的模块划分，便于维护和扩展
3. **类型安全**：全链路TypeScript + Prisma类型支持
4. **规范完善**：统一的API规范、错误处理、日志系统
5. **可扩展**：支持集群部署、缓存、对象存储等

**请您审阅设计方案，确认是否需要调整或补充内容。**
