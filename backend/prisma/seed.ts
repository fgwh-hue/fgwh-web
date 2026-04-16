import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('开始添加测试数据...');

  // 先删除现有数据
  await prisma.student.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.user.deleteMany();

  // 创建用户
  const users = await Promise.all([
    // 管理员用户
    prisma.user.create({
      data: {
        email: 'admin@example.com',
        password: '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', // password
        nickname: '管理员',
        roleCode: 'SUPER_ADMIN',
        status: true
      }
    }),
    // 教师用户
    prisma.user.create({
      data: {
        email: 'teacher1@example.com',
        password: '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', // password
        nickname: '张老师',
        roleCode: 'TEACHER',
        status: true
      }
    }),
    // 学生用户
    prisma.user.create({
      data: {
        email: 'student1@example.com',
        password: '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', // password
        nickname: '李同学',
        roleCode: 'STUDENT',
        status: true
      }
    })
  ]);

  // 创建教师数据
  const teachers = await Promise.all([
    prisma.teacher.create({
      data: {
        teacherNo: 'T001',
        name: '张老师',
        gender: '男',
        phone: '13800138001',
        email: 'teacher1@example.com',
        title: '教授',
        department: '计算机科学与技术',
        userId: users[1].id
      }
    }),
    prisma.teacher.create({
      data: {
        teacherNo: 'T002',
        name: '李老师',
        gender: '女',
        phone: '13800138002',
        email: 'teacher2@example.com',
        title: '副教授',
        department: '数学',
        userId: null
      }
    }),
    prisma.teacher.create({
      data: {
        teacherNo: 'T003',
        name: '王老师',
        gender: '男',
        phone: '13800138003',
        email: 'teacher3@example.com',
        title: '讲师',
        department: '英语',
        userId: null
      }
    }),
    prisma.teacher.create({
      data: {
        teacherNo: 'T004',
        name: '赵老师',
        gender: '女',
        phone: '13800138004',
        email: 'teacher4@example.com',
        title: '助教',
        department: '物理',
        userId: null
      }
    }),
    prisma.teacher.create({
      data: {
        teacherNo: 'T005',
        name: '钱老师',
        gender: '男',
        phone: '13800138005',
        email: 'teacher5@example.com',
        title: '教授',
        department: '化学',
        userId: null
      }
    })
  ]);

  // 创建学生数据
  const students = await Promise.all([
    prisma.student.create({
      data: {
        studentNo: 'S001',
        name: '李同学',
        gender: '男',
        phone: '13900139001',
        email: 'student1@example.com',
        major: '计算机科学与技术',
        className: '计科1班',
        enrollYear: 2022,
        userId: users[2].id
      }
    }),
    prisma.student.create({
      data: {
        studentNo: 'S002',
        name: '王同学',
        gender: '女',
        phone: '13900139002',
        email: 'student2@example.com',
        major: '数学',
        className: '数学1班',
        enrollYear: 2022,
        userId: null
      }
    }),
    prisma.student.create({
      data: {
        studentNo: 'S003',
        name: '张同学',
        gender: '男',
        phone: '13900139003',
        email: 'student3@example.com',
        major: '英语',
        className: '英语1班',
        enrollYear: 2022,
        userId: null
      }
    }),
    prisma.student.create({
      data: {
        studentNo: 'S004',
        name: '刘同学',
        gender: '女',
        phone: '13900139004',
        email: 'student4@example.com',
        major: '物理',
        className: '物理1班',
        enrollYear: 2022,
        userId: null
      }
    }),
    prisma.student.create({
      data: {
        studentNo: 'S005',
        name: '陈同学',
        gender: '男',
        phone: '13900139005',
        email: 'student5@example.com',
        major: '化学',
        className: '化学1班',
        enrollYear: 2022,
        userId: null
      }
    }),
    prisma.student.create({
      data: {
        studentNo: 'S006',
        name: '杨同学',
        gender: '女',
        phone: '13900139006',
        email: 'student6@example.com',
        major: '计算机科学与技术',
        className: '计科2班',
        enrollYear: 2023,
        userId: null
      }
    }),
    prisma.student.create({
      data: {
        studentNo: 'S007',
        name: '赵同学',
        gender: '男',
        phone: '13900139007',
        email: 'student7@example.com',
        major: '数学',
        className: '数学2班',
        enrollYear: 2023,
        userId: null
      }
    }),
    prisma.student.create({
      data: {
        studentNo: 'S008',
        name: '孙同学',
        gender: '女',
        phone: '13900139008',
        email: 'student8@example.com',
        major: '英语',
        className: '英语2班',
        enrollYear: 2023,
        userId: null
      }
    }),
    prisma.student.create({
      data: {
        studentNo: 'S009',
        name: '周同学',
        gender: '男',
        phone: '13900139009',
        email: 'student9@example.com',
        major: '物理',
        className: '物理2班',
        enrollYear: 2023,
        userId: null
      }
    }),
    prisma.student.create({
      data: {
        studentNo: 'S010',
        name: '吴同学',
        gender: '女',
        phone: '13900139010',
        email: 'student10@example.com',
        major: '化学',
        className: '化学2班',
        enrollYear: 2023,
        userId: null
      }
    })
  ]);

  console.log('测试数据添加完成！');
  console.log(`添加了 ${teachers.length} 个教师`);
  console.log(`添加了 ${students.length} 个学生`);
  console.log(`添加了 ${users.length} 个用户`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
