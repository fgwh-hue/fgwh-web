import axios from 'axios';

const API_BASE = 'http://localhost:3001/api/v1';

async function testAPI() {
  console.log('=== 测试 API 返回数据 ===\n');

  const response = await axios.get(`${API_BASE}/students`, {
    params: { current: 1, size: 100 }
  });

  const data = response.data.data;
  console.log(`total: ${data.total}`);
  console.log(`records 数量: ${data.records.length}`);

  console.log('\n学生列表:');
  data.records.forEach((s, i) => {
    console.log(`${i+1}. ${s.studentNo} - ${s.studentName} - ${s.studentMajor}`);
  });
}

testAPI().catch(console.error);
