import axios from 'axios';

const API_BASE = 'http://localhost:3001/api/v1';

async function test() {
  console.log('=== 测试 API ===\n');

  const response = await axios.get(`${API_BASE}/students?current=1&size=100`);
  const data = response.data;

  console.log('响应状态:', response.status);
  console.log('code:', data.code);
  console.log('message:', data.message);
  console.log('\ndata:');
  console.log(JSON.stringify(data.data, null, 2));
}

test().catch(console.error);
