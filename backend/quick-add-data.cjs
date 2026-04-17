const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('开始添加测试数据...');

  try {
    // 检查是否已有数据
    const existingStudents = await prisma.student.count();
    const existingTeachers = await prisma.teacher.count();

    if (existingStudents > 0 || existingTeachers > 0) {
      console.log(`数据库已有数据: ${existingStudents}个学生, ${existingTeachers}个教师`);
      console.log('如需重新添加,请先清空数据库');
      return;
    }

    // 生成密码哈希
    const passwordHash = await bcrypt.hash('password', 10);

    // 创建管理员用户
    const admin = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        password: passwordHash,
        nickname: '管理员',
        roleCode: 'SUPER_ADMIN',
        status: true
      }
    });
    console.log('✅ 创建管理员:', admin.email);

    // 创建教师用户
    const teacherUser = await prisma.user.create({
      data: {
        email: 'teacher1@example.com',
        password: passwordHash,
        nickname: '张老师',
        roleCode: 'TEACHER',
        status: true
      }
    });
    console.log('✅ 创建教师用户:', teacherUser.email);

    // 创建学生用户
    const studentUser = await prisma.user.create({
      data: {
        email: 'student1@example.com',
        password: passwordHash,
        nickname: '李同学',
        roleCode: 'STUDENT',
        status: true
      }
    });
    console.log('✅ 创建学生用户:', studentUser.email);

    // 创建教师数据
    console.log('\n创建教师数据...');
    for (let i = 1; i <= 10; i++) {
      const teacher = await prisma.teacher.create({
        data: {
          teacherNo: `T${String(i).padStart(3, '0')}`,
          name: `教师${i}`,
          gender: i % 2 === 0 ? '女' : '男',
          phone: `138001380${String(i).padStart(2, '0')}`,
          email: `teacher${i}@example.com`,
          title: ['教授', '副教授', '讲师', '助教'][i % 4],
          department: ['计算机科学与技术', '数学', '英语', '物理', '化学'][i % 5],
          userId: i === 1 ? teacherUser.id : null
        }
      });
      console.log(`  创建教师: ${teacher.name} (${teacher.teacherNo})`);
    }

    // 创建学生数据
    console.log('\n创建学生数据...');
    for (let i = 1; i <= 20; i++) {
      const student = await prisma.student.create({
        data: {
          studentNo: `S${String(i).padStart(3, '0')}`,
          name: `学生${i}`,
          gender: i % 2 === 0 ? '女' : '男',
          phone: `139001390${String(i).padStart(2, '0')}`,
          email: `student${i}@example.com`,
          major: ['计算机科学与技术', '数学', '英语', '物理', '化学'][i % 5],
          className: `${['计算机科学与技术', '数学', '英语', '物理', '化学'][i % 5]}${Math.ceil(i / 5)}班`,
          enrollYear: [2022, 2023, 2024, 2025][i % 4],
          userId: i === 1 ? studentUser.id : null
        }
      });
      console.log(`  创建学生: ${student.name} (${student.studentNo})`);
    }

    console.log('\n✅ 测试数据添加完成!');
    console.log('用户账号:');
    console.log('  - admin@example.com (管理员)');
    console.log('  - teacher1@example.com (教师)');
    console.log('  - student1@example.com (学生)');
    console.log('密码都是: password');
  } catch (error) {
    console.error('❌ 添加数据失败:', error);
    throw error;
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
