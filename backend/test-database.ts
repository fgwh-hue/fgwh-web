import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDatabase() {
  console.log('测试数据库连接...');
  
  try {
    // 测试连接
    await prisma.$connect();
    console.log('✓ 数据库连接成功');
    
    // 测试学生数据
    const students = await prisma.student.findMany({
      include: { user: true },
      take: 5
    });
    console.log('\n学生数据:');
    console.log(students);
    
    // 测试教师数据
    const teachers = await prisma.teacher.findMany({
      include: { user: true },
      take: 5
    });
    console.log('\n教师数据:');
    console.log(teachers);
    
    // 测试用户数据
    const users = await prisma.user.findMany({
      take: 5
    });
    console.log('\n用户数据:');
    console.log(users);
    
  } catch (error) {
    console.error('数据库测试失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
