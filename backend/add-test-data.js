const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('开始添加测试数据...');

  try {
    // 先删除现有数据
    await prisma.student.deleteMany();
    await prisma.teacher.deleteMany();
    await prisma.user.deleteMany();
    console.log('已清空现有数据');

    // 生成密码哈希
    const passwordHash = await bcrypt.hash('password', 10);
    console.log('密码哈希生成完成');

    // 创建用户
    const admin = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        password: passwordHash,
        nickname: '管理员',
        roleCode: 'SUPER_ADMIN',
        status: true
      }
    });
    console.log('创建管理员用户:', admin.email);

    const teacher1User = await prisma.user.create({
      data: {
        email: 'teacher1@example.com',
        password: passwordHash,
        nickname: '张老师',
        roleCode: 'TEACHER',
        status: true
      }
    });
    console.log('创建教师用户:', teacher1User.email);

    const student1User = await prisma.user.create({
      data: {
        email: 'student1@example.com',
        password: passwordHash,
        nickname: '李同学',
        roleCode: 'STUDENT',
        status: true
      }
    });
    console.log('创建学生用户:', student1User.email);

    // 创建教师数据
    const teachers = [];
    for (let i = 1; i <= 15; i++) {
      const teacherNo = `T${String(i).padStart(3, '0')}`;
      const departments = ['计算机科学与技术', '数学', '英语', '物理', '化学'];
      const titles = ['教授', '副教授', '讲师', '助教'];
      const genders = ['男', '女'];

      const teacher = await prisma.teacher.create({
        data: {
          teacherNo,
          name: `教师${i}`,
          gender: genders[i % 2],
          phone: `138001380${String(i).padStart(2, '0')}`,
          email: `teacher${i}@example.com`,
          title: titles[i % titles.length],
          department: departments[i % departments.length],
          userId: i === 1 ? teacher1User.id : null
        }
      });
      teachers.push(teacher);
    }
    console.log(`创建了 ${teachers.length} 个教师`);

    // 创建学生数据
    const students = [];
    for (let i = 1; i <= 25; i++) {
      const studentNo = `S${String(i).padStart(3, '0')}`;
      const majors = ['计算机科学与技术', '数学', '英语', '物理', '化学'];
      const genders = ['男', '女'];
      const enrollYears = [2022, 2023, 2024, 2025];

      const student = await prisma.student.create({
        data: {
          studentNo,
          name: `学生${i}`,
          gender: genders[i % 2],
          phone: `139001390${String(i).padStart(2, '0')}`,
          email: `student${i}@example.com`,
          major: majors[i % majors.length],
          className: `${majors[i % majors.length]}${Math.floor(i / 5) + 1}班`,
          enrollYear: enrollYears[Math.floor(i / 7) % enrollYears.length],
          userId: i === 1 ? student1User.id : null
        }
      });
      students.push(student);
    }
    console.log(`创建了 ${students.length} 个学生`);

    console.log('\n✅ 测试数据添加完成！');
    console.log(`- 用户: 3个`);
    console.log(`- 教师: ${teachers.length}个`);
    console.log(`- 学生: ${students.length}个`);
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
