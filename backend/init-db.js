const { execSync } = require('node:child_process');

console.log('开始初始化数据库...');

try {
  console.log('\n1. 推送数据库Schema...');
  execSync('npx prisma db push', { stdio: 'inherit', cwd: __dirname });

  console.log('\n2. 生成Prisma客户端...');
  execSync('npx prisma generate', { stdio: 'inherit', cwd: __dirname });

  console.log('\n3. 运行种子数据...');
  execSync('npx ts-node prisma/seed.ts', { stdio: 'inherit', cwd: __dirname });

  console.log('\n✅ 数据库初始化完成！');
} catch (error) {
  console.error('\n❌ 初始化失败:', error.message);
  process.exit(1);
}
