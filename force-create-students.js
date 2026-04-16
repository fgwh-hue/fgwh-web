import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function forceCreate() {
  console.log('强制创建正确的学生数据...\n');

  // 先清理
  await prisma.student.deleteMany({
    where: {
      studentNo: { in: ['STU2025001', 'STU2025002', 'STU2025003'] }
    }
  });

  // 直接用 Prisma 创建正确的数据
  const students = [
    { studentNo: 'STU2025001', name: '张三', gender: '1', major: '计算机科学' },
    { studentNo: 'STU2025002', name: '李四', gender: '2', major: '软件工程' },
    { studentNo: 'STU2025003', name: '王五', gender: '1', major: '数据科学' }
  ];

  for (const s of students) {
    const created = await prisma.student.create({
      data: s
    });
    console.log(`创建: ${created.name} (${created.studentNo})`);
  }

  // 验证
  const all = await prisma.student.findMany({
    where: { studentNo: { in: ['STU2025001', 'STU2025002', 'STU2025003'] } }
  });

  console.log('\n验证数据库:');
  all.forEach(s => {
    console.log(`  ${s.studentNo}: ${s.name} - ${s.major}`);
  });

  await prisma.$disconnect();
}

forceCreate().catch(console.error);
