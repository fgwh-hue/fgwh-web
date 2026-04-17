const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('检查数据库数据...\n');

  const students = await prisma.student.findMany({
    include: { user: true }
  });

  const teachers = await prisma.teacher.findMany({
    include: { user: true }
  });

  console.log(`学生总数: ${students.length}`);
  students.forEach(s => {
    console.log(`  - ${s.studentNo}: ${s.name} (${s.major})`);
  });

  console.log(`\n教师总数: ${teachers.length}`);
  teachers.forEach(t => {
    console.log(`  - ${t.teacherNo}: ${t.name} (${t.department})`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
