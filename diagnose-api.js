import axios from 'axios';

const API_BASE = 'http://localhost:3001/api/v1';

async function diagnose() {
  console.log('=== API 诊断测试 ===\n');

  console.log('1. 测试学生列表 API...');
  try {
    const response = await axios.get(`${API_BASE}/students?current=1&size=10`);
    console.log('状态:', response.status);
    console.log('数据:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('错误:', error.message);
    if (error.response) {
      console.log('响应状态:', error.response.status);
      console.log('响应数据:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.log('没有收到响应');
    }
  }

  console.log('\n2. 测试教师列表 API...');
  try {
    const response = await axios.get(`${API_BASE}/teachers?current=1&size=10`);
    console.log('状态:', response.status);
    console.log('数据:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('错误:', error.message);
    if (error.response) {
      console.log('响应状态:', error.response.status);
      console.log('响应数据:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.log('没有收到响应');
    }
  }
}

diagnose();
