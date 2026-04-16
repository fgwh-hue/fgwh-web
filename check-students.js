import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDB() {
  console.log('检查数据库所有学生...\n');
  const students = await prisma.student.findMany({
    orderBy: { createdAt: 'desc' }
  });

  console.log(`总记录数: ${students.length}\n`);
  students.forEach((s, i) => {
    console.log(`${i+1}. ${s.studentNo} - ${s.name} - ${s.major}`);
  });

  await prisma.$disconnect();
}

checkDB();
