import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testCreate() {
  console.log('测试 Prisma 创建学生记录...\n');

  // 尝试直接创建
  const student = await prisma.student.create({
    data: {
      studentNo: 'TEST001',
      name: '测试学生',
      gender: '1',
      phone: '13900000000',
      email: 'test@test.com',
      major: '测试专业',
      className: '测试班级'
    }
  });

  console.log('创建的学生记录:');
  console.log(JSON.stringify(student, null, 2));

  // 清理
  await prisma.student.delete({
    where: { id: student.id }
  });
  console.log('\n测试完成并清理');

  await prisma.$disconnect();
}

testCreate().catch(console.error);
