const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';

async function login() {
  try {
    const response = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@example.com',
      password: 'password'
    });
    return response.data.data.accessToken;
  } catch (error) {
    console.error('登录失败:', error.response?.data || error.message);
    throw error;
  }
}

async function addStudent(token) {
  try {
    const response = await axios.post(
      `${API_BASE}/students`,
      {
        studentNo: 'TEST001',
        studentName: '测试学生',
        studentGender: 1,
        studentPhone: '13800138000',
        studentEmail: 'test@example.com',
        studentMajor: '计算机科学与技术',
        studentClass: '计科1班',
        status: 1
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    console.log('✅ 添加学生成功:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ 添加学生失败:', error.response?.data || error.message);
    throw error;
  }
}

async function getStudents(token) {
  try {
    const response = await axios.get(`${API_BASE}/students?current=1&size=10`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('✅ 获取学生列表成功:');
    console.log('总数:', response.data.data.total);
    console.log('学生列表:', response.data.data.records);
    return response.data;
  } catch (error) {
    console.error('❌ 获取学生列表失败:', error.response?.data || error.message);
    throw error;
  }
}

async function main() {
  try {
    console.log('1. 登录...');
    const token = await login();
    console.log('登录成功,token:', `${token.substring(0, 20)}...`);

    console.log('\n2. 添加测试学生...');
    await addStudent(token);

    console.log('\n3. 获取学生列表...');
    await getStudents(token);

    console.log('\n✅ 所有测试通过!');
  } catch (error) {
    console.error('\n❌ 测试失败');
    process.exit(1);
  }
}

main();
