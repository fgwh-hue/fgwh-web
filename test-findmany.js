import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres:fgwh@localhost:5432/ai_web?schema=public'
    }
  }
});

async function testFindMany() {
  console.log('=== 测试 findMany ===\n');

  const students = await prisma.student.findMany({
    skip: 0,
    take: 100,
    orderBy: { createdAt: 'desc' }
  });

  console.log(`返回 ${students.length} 条记录`);
  students.slice(0, 5).forEach((s, i) => {
    console.log(`${i+1}. ${s.studentNo} - ${s.name}`);
  });

  const count = await prisma.student.count();
  console.log(`\n总记录数: ${count}`);

  await prisma.$disconnect();
}

testFindMany().catch(console.error);
