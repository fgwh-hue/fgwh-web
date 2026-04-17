import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkData() {
  console.log('检查数据库中学生数据...\n');

  const students = await prisma.student.findMany({
    where: {
      studentNo: {
        in: ['STU2025001', 'STU2025002', 'STU2025003']
      }
    }
  });

  console.log('找到的学生数据:');
  students.forEach((s, i) => {
    console.log(`\n${i + 1}. ID: ${s.id}`);
    console.log(`   studentNo: ${s.studentNo}`);
    console.log(`   name: ${s.name}`);
    console.log(`   gender: ${s.gender}`);
    console.log(`   major: ${s.major}`);
    console.log(`   className: ${s.className}`);
  });

  await prisma.$disconnect();
}

checkData().catch(console.error);
