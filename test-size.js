import axios from 'axios';

const API_BASE = 'http://localhost:3001/api/v1';

async function test() {
  console.log('测试不同 size 值...\n');

  // 测试 size=1
  console.log('1. size=1:');
  const r1 = await axios.get(`${API_BASE}/students?current=1&size=1`);
  console.log(`   total: ${r1.data.data.total}, records: ${r1.data.data.records.length}`);
  if (r1.data.data.records.length > 0) {
    console.log(`   第一条: ${r1.data.data.records[0].studentNo} - ${r1.data.data.records[0].studentName}`);
  }

  // 测试 size=2
  console.log('\n2. size=2:');
  const r2 = await axios.get(`${API_BASE}/students?current=1&size=2`);
  console.log(`   total: ${r2.data.data.total}, records: ${r2.data.data.records.length}`);
  if (r2.data.data.records.length > 0) {
    console.log(`   第一条: ${r2.data.data.records[0].studentNo} - ${r2.data.data.records[0].studentName}`);
  }

  // 测试 size=5
  console.log('\n3. size=5:');
  const r3 = await axios.get(`${API_BASE}/students?current=1&size=5`);
  console.log(`   total: ${r3.data.data.total}, records: ${r3.data.data.records.length}`);
  if (r3.data.data.records.length > 0) {
    console.log(`   第一条: ${r3.data.data.records[0].studentNo} - ${r3.data.data.records[0].studentName}`);
  }
}

test().catch(console.error);
