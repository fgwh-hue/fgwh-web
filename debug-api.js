import axios from 'axios';

const API_BASE = 'http://localhost:3001/api/v1';

async function debugAPI() {
  console.log('=== 直接调用后端 API ===\n');

  try {
    // 直接调用后端（绕过前端代理）
    const response = await axios.get(`${API_BASE}/students`, {
      params: { current: 1, size: 100 },
      headers: { 'Content-Type': 'application/json' }
    });

    console.log('状态码:', response.status);
    console.log('\n完整响应数据:');
    console.log(JSON.stringify(response.data, null, 2));
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

debugAPI();
