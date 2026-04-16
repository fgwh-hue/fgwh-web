import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAll() {
  console.log('检查数据库中所有学生...\n');
  const all = await prisma.student.findMany();
  console.log(`数据库中共有 ${all.length} 条学生记录:\n`);
  all.forEach((s, i) => {
    console.log(`${i+1}. ${s.studentNo} - ${s.name} - ${s.major}`);
  });
  await prisma.$disconnect();
}

checkAll().catch(console.error);
