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

    // 新增教师
    console.log('2. 新增教师...');
    const addRes = await axios.post(
      `${API_BASE}/teachers`,
      {
        teacherNo: 'T999',
        teacherName: '测试教师',
        teacherGender: 1,
        teacherPhone: '13800138999',
        teacherEmail: 'test@example.com',
        teacherTitle: '教授',
        teacherDepartment: '计算机科学与技术',
        status: 1
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    console.log('✅ 新增教师成功:');
    console.log(`   工号: ${addRes.data.data.teacherNo}`);
    console.log(`   姓名: ${addRes.data.data.teacherName}`);
    console.log(`   院系: ${addRes.data.data.teacherDepartment}`);

    // 获取教师列表
    console.log('\n3. 获取教师列表...');
    const listRes = await axios.get(`${API_BASE}/teachers?current=1&size=10`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ 教师列表:');
    console.log(`   总数: ${listRes.data.data.total}`);

    console.log('\n✅ 所有测试通过!');
  } catch (error) {
    console.error('❌ 测试失败:', error.response?.data || error.message);
    process.exit(1);
  }
}

test();
