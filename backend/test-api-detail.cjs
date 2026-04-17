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

    // 获取学生列表
    console.log('2. 获取学生列表...');
    console.log('请求URL:', `${API_BASE}/students?current=1&size=10`);
    const studentsRes = await axios.get(`${API_BASE}/students?current=1&size=10`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('响应状态:', studentsRes.status);
    console.log('完整响应:', JSON.stringify(studentsRes.data, null, 2));
  } catch (error) {
    console.error('❌ 测试失败:', error.response?.data || error.message);
    if (error.response) {
      console.error('响应状态:', error.response.status);
      console.error('响应数据:', error.response.data);
    }
  }
}

test();
