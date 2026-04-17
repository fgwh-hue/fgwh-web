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

    // 获取教师列表
    console.log('2. 获取教师列表...');
    const teachersRes = await axios.get(`${API_BASE}/teachers?current=1&size=10`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ 教师列表:');
    console.log(`   总数: ${teachersRes.data.data.total}`);
    console.log(`   当前页: ${teachersRes.data.data.page}`);
    teachersRes.data.data.records.forEach(t => {
      console.log(`   - ${t.teacherNo}: ${t.teacherName} (${t.teacherDepartment})`);
    });

    console.log('\n✅ 所有测试通过!');
  } catch (error) {
    console.error('❌ 测试失败:', error.response?.data || error.message);
    process.exit(1);
  }
}

test();
