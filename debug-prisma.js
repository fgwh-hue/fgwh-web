const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error']
});

async function debugPrisma() {
  console.log('=== 调试 Prisma ===\n');

  // 测试不带 where 的查询
  console.log('1. 测试 findMany 不带 where:');
  const all = await prisma.student.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' }
  });
  console.log(`   结果: ${all.length} 条`);

  // 测试带空的 where 对象
  console.log('\n2. 测试 findMany 带空 where:');
  const withEmptyWhere = await prisma.student.findMany({
    where: {},
    take: 5,
    orderBy: { createdAt: 'desc' }
  });
  console.log(`   结果: ${withEmptyWhere.length} 条`);

  // 测试 count
  console.log('\n3. 测试 count:');
  const count = await prisma.student.count();
  console.log(`   总数: ${count}`);

  await prisma.$disconnect();
}

debugPrisma().catch(console.error);
