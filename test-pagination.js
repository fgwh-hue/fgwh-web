import axios from 'axios';

const API_BASE = 'http://localhost:3001/api/v1';

async function testPagination() {
  console.log('测试分页参数...\n');

  // 测试1: 不带分页参数
  console.log('1. 不带分页参数:');
  const r1 = await axios.get(`${API_BASE}/students`);
  console.log(`   total: ${r1.data.data.total}, records: ${r1.data.data.records.length}`);

  // 测试2: 带 current=1&size=10
  console.log('\n2. current=1&size=10:');
  const r2 = await axios.get(`${API_BASE}/students?current=1&size=10`);
  console.log(`   total: ${r2.data.data.total}, records: ${r2.data.data.records.length}`);

  // 测试3: 带 current=1&size=100
  console.log('\n3. current=1&size=100:');
  const r3 = await axios.get(`${API_BASE}/students?current=1&size=100`);
  console.log(`   total: ${r3.data.data.total}, records: ${r3.data.data.records.length}`);

  // 测试4: 检查数据库实际数量
  console.log('\n4. 数据库记录:');
  r3.data.data.records.forEach((s, i) => {
    console.log(`   ${i+1}. ${s.studentNo} - ${s.studentName}`);
  });
}

testPagination().catch(console.error);
