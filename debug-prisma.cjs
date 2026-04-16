const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function debugPrisma() {
  console.log('=== Debug Prisma ===\n');

  const all = await prisma.student.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' }
  });
  console.log('findMany result:', all.length);

  const count = await prisma.student.count();
  console.log('count result:', count);

  await prisma.$disconnect();
}

debugPrisma().catch(console.error);
