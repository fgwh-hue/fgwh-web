const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres:fgwh@localhost:5432/ai_web?schema=public'
    }
  }
});

async function test() {
  console.log('Testing Prisma queries...\n');

  const students = await prisma.student.findMany({
    where: {},
    take: 100,
    orderBy: { createdAt: 'desc' }
  });

  console.log('findMany result:', students.length);

  const count = await prisma.student.count();
  console.log('count result:', count);

  await prisma.$disconnect();
}

test().catch(console.error);
