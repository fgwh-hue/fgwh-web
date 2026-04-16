const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function test() {
  console.log('=== Test from backend ===\n');
  const students = await prisma.student.findMany({
    where: {},
    take: 5,
    orderBy: { createdAt: 'desc' }
  });
  console.log('findMany result:', students.length);
  students.forEach(s => console.log(s.studentNo, s.name));

  const count = await prisma.student.count({ where: {} });
  console.log('count:', count);

  await prisma.$disconnect();
}

test();
