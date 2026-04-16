import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres:fgwh@localhost:5432/ai_web?schema=public'
    }
  }
});

async function testFindMany() {
  console.log('=== 直接测试 Prisma findMany ===\n');

  // 模拟 repository 逻辑
  const page = 1;
  const pageSize = 100;
  const skip = (page - 1) * pageSize;

  console.log(`skip: ${skip}, take: ${pageSize}`);

  const [data, total] = await Promise.all([
    prisma.student.findMany({
      where: {},
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.student.count({ where: {} })
  ]);

  console.log(`查询结果: ${data.length} 条记录`);
  console.log(`总记录数: ${total}`);

  console.log('\n前5条记录:');
  data.slice(0, 5).forEach((s, i) => {
    console.log(`${i+1}. ${s.studentNo} - ${s.name}`);
  });

  await prisma.$disconnect();
}

testFindMany().catch(console.error);
