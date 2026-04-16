import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanupAndTest() {
  console.log('清理测试数据...\n');

  // 删除测试学生数据
  const deleteResult = await prisma.student.deleteMany({
    where: {
      studentNo: {
        in: ['STU2025001', 'STU2025002', 'STU2025003']
      }
    }
  });
  console.log(`删除了 ${deleteResult.count} 条学生记录`);

  // 删除测试教师数据
  const deleteTeacherResult = await prisma.teacher.deleteMany({
    where: {
      teacherNo: {
        in: ['TCH2025001', 'TCH2025002', 'TCH2025003']
      }
    }
  });
  console.log(`删除了 ${deleteTeacherResult.count} 条教师记录`);

  // 验证删除结果
  const remainingStudents = await prisma.student.count({
    where: {
      studentNo: {
        in: ['STU2025001', 'STU2025002', 'STU2025003']
      }
    }
  });
  console.log(`\n剩余测试学生记录: ${remainingStudents}`);

  await prisma.$disconnect();
  console.log('\n清理完成！');
}

cleanupAndTest().catch(console.error);
