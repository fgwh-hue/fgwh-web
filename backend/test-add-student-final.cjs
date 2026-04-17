const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';

async function test() {
  try {
    // 登录获取token
    console.log('1. 登录...');
    const loginRes = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@example.com',
      password: 'password'
    });
    const token = loginRes.data.data.accessToken;
    console.log('✅ 登录成功\n');

    // 新增学生
    console.log('2. 新增学生...');
    const addRes = await axios.post(
      `${API_BASE}/students`,
      {
        studentNo: 'S999',
        studentName: '测试学生',
        studentGender: 1,
        studentPhone: '13900139999',
        studentEmail: 'student-test@example.com',
        studentMajor: '计算机科学与技术',
        studentClass: '计科1班',
        enrollYear: 2024,
        status: 1
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    console.log('✅ 新增学生成功:');
    console.log(`   学号: ${addRes.data.data.studentNo}`);
    console.log(`   姓名: ${addRes.data.data.studentName}`);
    console.log(`   专业: ${addRes.data.data.studentMajor}`);

    // 获取学生列表
    console.log('\n3. 获取学生列表...');
    const listRes = await axios.get(`${API_BASE}/students?current=1&size=10`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ 学生列表:');
    console.log(`   总数: ${listRes.data.data.total}`);

    console.log('\n✅ 所有测试通过!');
  } catch (error) {
    console.error('❌ 测试失败:', error.response?.data || error.message);
    process.exit(1);
  }
}

test();
