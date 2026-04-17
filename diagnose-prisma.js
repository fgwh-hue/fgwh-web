import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error']
});

async function diagnosePrisma() {
  console.log('=== Prisma 诊断 ===\n');

  // 检查 Prisma 连接信息
  console.log('1. 检查 Prisma 配置...');
  console.log('   Prisma 版本: 5.22.0');

  // 执行一个简单查询
  console.log('\n2. 执行 findMany 查询...');
  const students = await prisma.student.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' }
  });
  console.log(`   查询到 ${students.length} 条记录`);
  students.forEach((s, i) => {
    console.log(`   ${i + 1}. ${s.studentNo} - ${s.name}`);
  });

  // 执行 count 查询
  console.log('\n3. 执行 count 查询...');
  const count = await prisma.student.count();
  console.log(`   总数: ${count}`);

  // 执行带 where 的查询
  console.log('\n4. 执行带 where 的查询 (studentNo contains "STU")...');
  const filtered = await prisma.student.findMany({
    where: { studentNo: { contains: 'STU' } },
    take: 10
  });
  console.log(`   查询到 ${filtered.length} 条记录`);
  filtered.forEach((s, i) => {
    console.log(`   ${i + 1}. ${s.studentNo} - ${s.name}`);
  });

  await prisma.$disconnect();
  console.log('\n诊断完成');
}

diagnosePrisma().catch(console.error);
