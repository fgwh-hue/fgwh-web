import axios from 'axios';

const API_BASE = 'http://localhost:3001/api/v1';

async function checkData() {
  console.log('检查学生数据...\n');

  // 获取所有学生
  const response = await axios.get(`${API_BASE}/students?current=1&size=100`);
  const data = response.data.data;

  console.log('返回的 total:', data.total);
  console.log('返回的 records 数量:', data.records.length);
  console.log('\n学生列表:');
  data.records.forEach((s, i) => {
    console.log(`${i+1}. ID: ${s.id}`);
    console.log(`   学号: ${s.studentNo}, 姓名: ${s.studentName}`);
    console.log(`   性别: ${s.studentGender}, 专业: ${s.studentMajor}`);
    console.log(`   班级: ${s.studentClass}`);
    console.log();
  });

  console.log('\n检查教师数据...\n');

  const teacherResponse = await axios.get(`${API_BASE}/teachers?current=1&size=100`);
  const teacherData = teacherResponse.data.data;

  console.log('返回的 total:', teacherData.total);
  console.log('返回的 records 数量:', teacherData.records.length);
  console.log('\n教师列表:');
  teacherData.records.forEach((t, i) => {
    console.log(`${i+1}. ID: ${t.id}`);
    console.log(`   工号: ${t.teacherNo}, 姓名: ${t.name}`);
    console.log(`   职称: ${t.title}, 院系: ${t.department}`);
    console.log();
  });
}

checkData().catch(console.error);
