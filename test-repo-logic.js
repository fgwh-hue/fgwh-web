import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testRepositoryFindAll() {
  console.log('=== 测试 repository 逻辑 ===\n');

  // 模拟 QueryStudentDto
  const queryStudentDto = {
    current: 1,
    size: 100
  };

  // 模拟 findAll 逻辑
  const page = queryStudentDto.current || queryStudentDto.page || 1;
  const pageSize = queryStudentDto.size || queryStudentDto.pageSize || 10;

  console.log(`解析后的 page: ${page}, pageSize: ${pageSize}`);

  const skip = (page - 1) * pageSize;
  console.log(`skip: ${skip}, take: ${pageSize}`);

  // 执行查询
  const [data, total] = await Promise.all([
    prisma.student.findMany({
      where: {},
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.student.count({ where: {} })
  ]);

  console.log(`\n查询结果: ${data.length} 条记录`);
  console.log(`总记录数: ${total}`);

  // 模拟返回值
  const result = {
    records: data,
    total,
    current: page,
    size: pageSize
  };

  console.log(`\n返回的 size: ${result.size}, total: ${result.total}`);

  await prisma.$disconnect();
}

testRepositoryFindAll().catch(console.error);
