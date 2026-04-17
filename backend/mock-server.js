/* eslint-disable no-console */
const process = require('node:process');
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:9527'],
    credentials: true
  })
);

app.use(express.json());

function transformStudent(student) {
  return {
    id: student.id,
    studentName: student.name,
    studentNo: student.studentNo,
    studentMajor: student.major,
    studentClass: student.className,
    studentGender: student.gender,
    studentPhone: student.phone,
    studentEmail: student.email,
    status: student.status,
    enrollYear: student.enrollYear,
    avatar: student.avatar || null,
    userId: student.userId || null
  };
}

function transformTeacher(teacher) {
  return {
    id: teacher.id,
    teacherName: teacher.name,
    teacherNo: teacher.teacherNo,
    teacherTitle: teacher.title,
    teacherDepartment: teacher.department,
    teacherGender: teacher.gender,
    teacherPhone: teacher.phone,
    teacherEmail: teacher.email,
    status: teacher.status,
    avatar: teacher.avatar || null,
    userId: teacher.userId || null
  };
}

function generateStudents() {
  const students = [];
  const majors = ['计算机科学与技术', '数学', '英语', '物理', '化学', '生物', '历史', '地理', '政治', '经济学'];
  const classes = ['1班', '2班', '3班', '4班', '5班'];
  const names = ['李', '王', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴'];
  const nameChars = ['明', '红', '军', '芳', '娜', '强', '艳', '杰', '涛', '静'];

  for (let i = 1; i <= 20; i += 1) {
    const studentNo = `S${String(i).padStart(3, '0')}`;
    const name =
      names[Math.floor(Math.random() * names.length)] + nameChars[Math.floor(Math.random() * nameChars.length)];
    const gender = Math.random() > 0.5 ? 1 : 2;
    const major = majors[Math.floor(Math.random() * majors.length)];
    const className = major.substring(0, 2) + classes[Math.floor(Math.random() * classes.length)];
    const phone = `13900139${String(i).padStart(3, '0')}`;
    const email = `student${i}@example.com`;
    const enrollYear = 2022 + Math.floor(Math.random() * 3);

    students.push({
      id: `student-${i}`,
      studentNo,
      name,
      gender,
      phone,
      email,
      major,
      className,
      enrollYear,
      status: 1
    });
  }
  return students;
}

function generateTeachers() {
  const teachers = [];
  const departments = ['计算机科学与技术', '数学', '英语', '物理', '化学', '生物', '历史', '地理', '政治', '经济学'];
  const titles = ['教授', '副教授', '讲师', '助教'];
  const names = ['张', '李', '王', '刘', '陈', '杨', '赵', '黄', '周', '吴'];
  const nameChars = ['教授', '老师', '博士', '先生', '女士'];

  for (let i = 1; i <= 10; i += 1) {
    const teacherNo = `T${String(i).padStart(3, '0')}`;
    const name =
      names[Math.floor(Math.random() * names.length)] + nameChars[Math.floor(Math.random() * nameChars.length)];
    const gender = Math.random() > 0.5 ? 1 : 2;
    const department = departments[Math.floor(Math.random() * departments.length)];
    const title = titles[Math.floor(Math.random() * titles.length)];
    const phone = `13800138${String(i).padStart(3, '0')}`;
    const email = `teacher${i}@example.com`;

    teachers.push({
      id: `teacher-${i}`,
      teacherNo,
      name,
      gender,
      phone,
      email,
      title,
      department,
      status: 1
    });
  }
  return teachers;
}

const testData = {
  students: generateStudents(),
  teachers: generateTeachers()
};

function responseSuccess(data, message = 'success') {
  return {
    code: '0000',
    message,
    result: data
  };
}

app.get(['/students', '/api/students', '/api/v1/students', '/v1/students'], (req, res) => {
  console.log('学生列表请求:', req.originalUrl);
  const current = Number.parseInt(req.query.current, 10) || 1;
  const size = Number.parseInt(req.query.size, 10) || 10;

  const start = (current - 1) * size;
  const end = start + size;
  const paginatedStudents = testData.students.slice(start, end).map(transformStudent);

  res.json(
    responseSuccess({
      records: paginatedStudents,
      total: testData.students.length,
      current,
      size,
      totalPages: Math.ceil(testData.students.length / size)
    })
  );
});

app.get(['/teachers', '/api/teachers', '/api/v1/teachers', '/v1/teachers'], (req, res) => {
  console.log('教师列表请求:', req.originalUrl);
  const current = Number.parseInt(req.query.current, 10) || 1;
  const size = Number.parseInt(req.query.size, 10) || 10;

  const start = (current - 1) * size;
  const end = start + size;
  const paginatedTeachers = testData.teachers.slice(start, end).map(transformTeacher);

  res.json(
    responseSuccess({
      records: paginatedTeachers,
      total: testData.teachers.length,
      current,
      size,
      totalPages: Math.ceil(testData.teachers.length / size)
    })
  );
});

app.get(['/students/:id', '/api/students/:id', '/api/v1/students/:id', '/v1/students/:id'], (req, res) => {
  const { id } = req.params;
  const student = testData.students.find(s => s.id === id);
  if (student) {
    res.json(responseSuccess(transformStudent(student)));
  } else {
    res.status(404).json({
      code: '404',
      message: '学生不存在',
      result: null
    });
  }
});

app.get(['/teachers/:id', '/api/teachers/:id', '/api/v1/teachers/:id', '/v1/teachers/:id'], (req, res) => {
  const { id } = req.params;
  const teacher = testData.teachers.find(t => t.id === id);
  if (teacher) {
    res.json(responseSuccess(transformTeacher(teacher)));
  } else {
    res.status(404).json({
      code: '404',
      message: '教师不存在',
      result: null
    });
  }
});

app.patch(['/students/:id', '/api/students/:id', '/api/v1/students/:id', '/v1/students/:id'], (req, res) => {
  console.log('编辑学生请求:', req.params.id, req.body);
  const { id } = req.params;
  const studentIndex = testData.students.findIndex(s => s.id === id);

  if (studentIndex !== -1) {
    const {
      studentName: name = req.body.name,
      studentNo,
      studentMajor: major = req.body.major,
      studentClass: className = req.body.className,
      studentGender: gender = req.body.gender,
      studentPhone: phone = req.body.phone,
      studentEmail: email = req.body.email,
      enrollYear
    } = req.body;

    testData.students[studentIndex] = {
      ...testData.students[studentIndex],
      ...(studentNo && { studentNo }),
      ...(name && { name }),
      ...(gender && { gender }),
      ...(phone && { phone }),
      ...(email && { email }),
      ...(major && { major }),
      ...(className && { className }),
      ...(enrollYear && { enrollYear })
    };

    res.json(responseSuccess(transformStudent(testData.students[studentIndex]), '编辑学生成功'));
  } else {
    res.status(404).json({
      code: '404',
      message: '学生不存在',
      result: null
    });
  }
});

app.patch(['/teachers/:id', '/api/teachers/:id', '/api/v1/teachers/:id', '/v1/teachers/:id'], (req, res) => {
  console.log('编辑教师请求:', req.params.id, req.body);
  const { id } = req.params;
  const teacherIndex = testData.teachers.findIndex(t => t.id === id);

  if (teacherIndex !== -1) {
    const {
      teacherName: name = req.body.name,
      teacherNo,
      teacherTitle: title = req.body.title,
      teacherDepartment: department = req.body.department,
      teacherGender: gender = req.body.gender,
      teacherPhone: phone = req.body.phone,
      teacherEmail: email = req.body.email
    } = req.body;

    testData.teachers[teacherIndex] = {
      ...testData.teachers[teacherIndex],
      ...(teacherNo && { teacherNo }),
      ...(name && { name }),
      ...(gender && { gender }),
      ...(phone && { phone }),
      ...(email && { email }),
      ...(title && { title }),
      ...(department && { department })
    };

    res.json(responseSuccess(transformTeacher(testData.teachers[teacherIndex]), '编辑教师成功'));
  } else {
    res.status(404).json({
      code: '404',
      message: '教师不存在',
      result: null
    });
  }
});

app.delete(['/students/:id', '/api/students/:id', '/api/v1/students/:id', '/v1/students/:id'], (req, res) => {
  console.log('删除学生请求:', req.params.id);
  const { id } = req.params;
  const studentIndex = testData.students.findIndex(s => s.id === id);

  if (studentIndex !== -1) {
    testData.students.splice(studentIndex, 1);
    res.json(responseSuccess(null, '删除学生成功'));
  } else {
    res.status(404).json({
      code: '404',
      message: '学生不存在',
      result: null
    });
  }
});

app.delete(['/teachers/:id', '/api/teachers/:id', '/api/v1/teachers/:id', '/v1/teachers/:id'], (req, res) => {
  console.log('删除教师请求:', req.params.id);
  const { id } = req.params;
  const teacherIndex = testData.teachers.findIndex(t => t.id === id);

  if (teacherIndex !== -1) {
    testData.teachers.splice(teacherIndex, 1);
    res.json(responseSuccess(null, '删除教师成功'));
  } else {
    res.status(404).json({
      code: '404',
      message: '教师不存在',
      result: null
    });
  }
});

app.get(['/api/health', '/api/v1/health', '/v1/health'], (_req, res) => {
  res.json(responseSuccess({ status: 'ok' }));
});

app.post(['/students', '/api/students', '/api/v1/students', '/v1/students'], (req, res) => {
  console.log('新增学生请求:', req.body);
  const {
    studentName: name = req.body.name,
    studentNo,
    studentMajor: major = req.body.major,
    studentClass: className = req.body.className,
    studentGender: gender = req.body.gender,
    studentPhone: phone = req.body.phone,
    studentEmail: email = req.body.email,
    enrollYear
  } = req.body;

  const newStudent = {
    id: `student-${testData.students.length + 1}`,
    studentNo,
    name,
    gender,
    phone,
    email,
    major,
    className,
    enrollYear,
    status: 1
  };

  testData.students.push(newStudent);

  res.json(responseSuccess(transformStudent(newStudent), '新增学生成功'));
});

app.post(['/teachers', '/api/teachers', '/api/v1/teachers', '/v1/teachers'], (req, res) => {
  console.log('新增教师请求:', req.body);
  const {
    teacherName: name = req.body.name,
    teacherNo,
    teacherTitle: title = req.body.title,
    teacherDepartment: department = req.body.department,
    teacherGender: gender = req.body.gender,
    teacherPhone: phone = req.body.phone,
    teacherEmail: email = req.body.email
  } = req.body;

  const newTeacher = {
    id: `teacher-${testData.teachers.length + 1}`,
    teacherNo,
    name,
    gender,
    phone,
    email,
    title,
    department,
    status: 1
  };

  testData.teachers.push(newTeacher);

  res.json(responseSuccess(transformTeacher(newTeacher), '新增教师成功'));
});

app.get('/', (_req, res) => {
  res.json({
    message: 'Mock API server',
    students: testData.students.length,
    teachers: testData.teachers.length,
    endpoints: {
      students: '/api/v1/students',
      teachers: '/api/v1/teachers',
      health: '/api/v1/health'
    }
  });
});

app.listen(PORT, () => {
  console.log(`Mock API server running on http://localhost:${PORT}`);
  console.log('学生数据已加载:', testData.students.length, '条');
  console.log('教师数据已加载:', testData.teachers.length, '条');
  console.log('支持路径: /api/students, /api/v1/students, /v1/students');
  console.log('支持路径: /api/teachers, /api/v1/teachers, /v1/teachers');
});
