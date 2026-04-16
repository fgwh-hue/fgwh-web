import axios from 'axios';

const API_BASE = 'http://localhost:3001/api/v1';

async function testQueryParams() {
  console.log('测试查询参数...\n');

  // 测试1: 只传 size=100
  console.log('1. 只传 size=100:');
  const r1 = await axios.get(`${API_BASE}/students`, {
    params: { size: 100 }
  });
  console.log(`   size: ${r1.data.data.size}, total: ${r1.data.data.total}`);

  // 测试2: 只传 current=1 和 size=100
  console.log('\n2. 传 current=1 和 size=100:');
  const r2 = await axios.get(`${API_BASE}/students`, {
    params: { current: 1, size: 100 }
  });
  console.log(`   size: ${r2.data.data.size}, total: ${r2.data.data.total}`);

  // 测试3: 传 page=1 和 pageSize=100
  console.log('\n3. 传 page=1 和 pageSize=100:');
  const r3 = await axios.get(`${API_BASE}/students`, {
    params: { page: 1, pageSize: 100 }
  });
  console.log(`   size: ${r3.data.data.size}, total: ${r3.data.data.total}`);
}

testQueryParams().catch(console.error);
