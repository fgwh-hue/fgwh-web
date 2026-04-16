#!/usr/bin/env node
/**
 * 后端 API 自动化测试脚本
 * 测试学生列表和教师列表的新增、编辑功能
 * 
 * 运行方式: node test-backend-api.js
 */

import axios from 'axios';

const API_BASE = 'http://localhost:3001/api/v1';

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(color, msg) {
  console.log(`${color}${msg}${colors.reset}`);
}

async function test() {
  log(colors.cyan, '\n╔══════════════════════════════════════════════════════════╗');
  log(colors.cyan, '║       后端 API 自动化测试报告                              ║');
  log(colors.cyan, '╚══════════════════════════════════════════════════════════╝\n');
  log(colors.blue, `测试时间: ${new Date().toLocaleString('zh-CN')}`);
  log(colors.blue, `API 地址: ${API_BASE}\n`);

  const results = [];
  let testCount = 0;

  try {
    // ========== 测试1: 新增学生数据（3条） ==========
    log(colors.green, '\n📝 测试模块1: 学生列表 - 新增操作\n');

    const studentsToAdd = [
      {
        studentNo: 'STU2025001',
        name: '张三',
        gender: '1',
        phone: '13800138001',
        email: 'zhangsan2025@test.com',
        major: '计算机科学',
        class: 'CS2025-A班'
      },
      {
        studentNo: 'STU2025002',
        name: '李四',
        gender: '2',
        phone: '13800138002',
        email: 'lisi2025@test.com',
        major: '软件工程',
        class: 'SE2025-B班'
      },
      {
        studentNo: 'STU2025003',
        name: '王五',
        gender: '1',
        phone: '13800138003',
        email: 'wangwu2025@test.com',
        major: '数据科学',
        class: 'DS2025-A班'
      }
    ];

    const studentIds = [];

    for (const student of studentsToAdd) {
      testCount++;
      try {
        log(colors.blue, `  测试 ${testCount}: 新增学生 "${student.name}"`);
        log(colors.blue, `  学号: ${student.studentNo}, 姓名: ${student.name}, 性别: ${student.gender === '1' ? '男' : '女'}`);

        const response = await axios.post(`${API_BASE}/students`, student);
        
        if (response.data && response.data.code === '0000' && response.data.data) {
          log(colors.green, `  ✓✓ 成功: 学生 ${student.name} 已添加 (ID: ${response.data.data.id})`);
          studentIds.push(response.data.data.id);
          results.push({ test: testCount, module: '学生新增', name: student.name, status: '成功', id: response.data.data.id });
        } else {
          log(colors.red, `  ✗✗ 失败: ${response.data?.message || '未知错误'}`);
          results.push({ test: testCount, module: '学生新增', name: student.name, status: '失败', message: response.data?.message });
        }
      } catch (error) {
        log(colors.red, `  ✗✗ 异常: ${error.response?.data?.message || error.message}`);
        results.push({ test: testCount, module: '学生新增', name: student.name, status: '异常', message: error.response?.data?.message || error.message });
      }
    }

    // ========== 测试2: 编辑学生数据（2条） ==========
    log(colors.green, '\n📝 测试模块2: 学生列表 - 编辑操作\n');

    if (studentIds.length >= 2) {
      const studentUpdates = [
        {
          id: studentIds[0],
          data: { name: '张三(已编辑)', phone: '13900139001' },
          expectedName: '张三(已编辑)'
        },
        {
          id: studentIds[1],
          data: { major: '人工智能', email: 'lisi_updated@test.com' },
          expectedName: '李四'
        }
      ];

      for (const update of studentUpdates) {
        testCount++;
        try {
          log(colors.blue, `  测试 ${testCount}: 编辑学生 "${update.expectedName}"`);
          log(colors.blue, `  更新数据: ${JSON.stringify(update.data)}`);

          const response = await axios.patch(`${API_BASE}/students/${update.id}`, update.data);
          
          if (response.data && response.data.code === '0000') {
            log(colors.green, `  ✓✓ 成功: 学生已更新`);
            results.push({ test: testCount, module: '学生编辑', name: update.expectedName, status: '成功' });
          } else {
            log(colors.red, `  ✗✗ 失败: ${response.data?.message}`);
            results.push({ test: testCount, module: '学生编辑', name: update.expectedName, status: '失败', message: response.data?.message });
          }
        } catch (error) {
          log(colors.red, `  ✗✗ 异常: ${error.response?.data?.message || error.message}`);
          results.push({ test: testCount, module: '学生编辑', name: update.expectedName, status: '异常', message: error.response?.data?.message || error.message });
        }
      }
    }

    // ========== 测试3: 新增教师数据（3条） ==========
    log(colors.green, '\n📝 测试模块3: 教师列表 - 新增操作\n');

    const teachersToAdd = [
      {
        teacherNo: 'TCH2025001',
        name: '赵教授',
        gender: '1',
        phone: '13700137001',
        email: 'zhao2025@test.com',
        title: '教授',
        department: '计算机科学系'
      },
      {
        teacherNo: 'TCH2025002',
        name: '钱教授',
        gender: '2',
        phone: '13700137002',
        email: 'qian2025@test.com',
        title: '副教授',
        department: '软件工程系'
      },
      {
        teacherNo: 'TCH2025003',
        name: '孙教授',
        gender: '1',
        phone: '13700137003',
        email: 'sun2025@test.com',
        title: '讲师',
        department: '数据科学系'
      }
    ];

    const teacherIds = [];

    for (const teacher of teachersToAdd) {
      testCount++;
      try {
        log(colors.blue, `  测试 ${testCount}: 新增教师 "${teacher.name}"`);
        log(colors.blue, `  工号: ${teacher.teacherNo}, 姓名: ${teacher.name}, 职称: ${teacher.title}`);

        const response = await axios.post(`${API_BASE}/teachers`, teacher);
        
        if (response.data && response.data.code === '0000' && response.data.data) {
          log(colors.green, `  ✓✓ 成功: 教师 ${teacher.name} 已添加 (ID: ${response.data.data.id})`);
          teacherIds.push(response.data.data.id);
          results.push({ test: testCount, module: '教师新增', name: teacher.name, status: '成功', id: response.data.data.id });
        } else {
          log(colors.red, `  ✗✗ 失败: ${response.data?.message || '未知错误'}`);
          results.push({ test: testCount, module: '教师新增', name: teacher.name, status: '失败', message: response.data?.message });
        }
      } catch (error) {
        log(colors.red, `  ✗✗ 异常: ${error.response?.data?.message || error.message}`);
        results.push({ test: testCount, module: '教师新增', name: teacher.name, status: '异常', message: error.response?.data?.message || error.message });
        log(colors.red, `  详细错误: ${JSON.stringify(error.response?.data)}`);
      }
    }

    // ========== 测试4: 编辑教师数据（2条） ==========
    log(colors.green, '\n📝 测试模块4: 教师列表 - 编辑操作\n');

    if (teacherIds.length >= 2) {
      const teacherUpdates = [
        {
          id: teacherIds[0],
          data: { title: '特聘教授', department: '人工智能系' },
          expectedName: '赵教授'
        },
        {
          id: teacherIds[1],
          data: { phone: '13900139002', title: '教授' },
          expectedName: '钱教授'
        }
      ];

      for (const update of teacherUpdates) {
        testCount++;
        try {
          log(colors.blue, `  测试 ${testCount}: 编辑教师 "${update.expectedName}"`);
          log(colors.blue, `  更新数据: ${JSON.stringify(update.data)}`);

          const response = await axios.patch(`${API_BASE}/teachers/${update.id}`, update.data);
          
          if (response.data && response.data.code === '0000') {
            log(colors.green, `  ✓✓ 成功: 教师已更新`);
            results.push({ test: testCount, module: '教师编辑', name: update.expectedName, status: '成功' });
          } else {
            log(colors.red, `  ✗✗ 失败: ${response.data?.message}`);
            results.push({ test: testCount, module: '教师编辑', name: update.expectedName, status: '失败', message: response.data?.message });
          }
        } catch (error) {
          log(colors.red, `  ✗✗ 异常: ${error.response?.data?.message || error.message}`);
          results.push({ test: testCount, module: '教师编辑', name: update.expectedName, status: '异常', message: error.response?.data?.message || error.message });
          log(colors.red, `  详细错误: ${JSON.stringify(error.response?.data)}`);
        }
      }
    }

    // ========== 测试5: 验证学生列表数据 ==========
    log(colors.green, '\n📝 测试模块5: 验证学生列表数据\n');
    testCount++;
    try {
      const response = await axios.get(`${API_BASE}/students?current=1&size=20`);
      if (response.data && response.data.code === '0000') {
        const { records, total, current, size } = response.data.data;
        log(colors.green, `  ✓✓ 成功: 获取学生列表 (总数: ${total}, 当前页: ${current}, 每页: ${size})`);
        log(colors.blue, `  返回字段: records(${records.length}条), total, current, size`);
        results.push({ test: testCount, module: '学生列表查询', name: '列表', status: '成功', message: `总数:${total}, 格式正确` });
      } else {
        log(colors.red, `  ✗✗ 失败: ${response.data?.message}`);
        results.push({ test: testCount, module: '学生列表查询', name: '列表', status: '失败', message: response.data?.message });
      }
    } catch (error) {
      log(colors.red, `  ✗✗ 异常: ${error.message}`);
      results.push({ test: testCount, module: '学生列表查询', name: '列表', status: '异常', message: error.message });
    }

    // ========== 测试6: 验证教师列表数据 ==========
    log(colors.green, '\n📝 测试模块6: 验证教师列表数据\n');
    testCount++;
    try {
      const response = await axios.get(`${API_BASE}/teachers?current=1&size=20`);
      if (response.data && response.data.code === '0000') {
        const { records, total, current, size } = response.data.data;
        log(colors.green, `  ✓✓ 成功: 获取教师列表 (总数: ${total}, 当前页: ${current}, 每页: ${size})`);
        log(colors.blue, `  返回字段: records(${records.length}条), total, current, size`);
        results.push({ test: testCount, module: '教师列表查询', name: '列表', status: '成功', message: `总数:${total}, 格式正确` });
      } else {
        log(colors.red, `  ✗✗ 失败: ${response.data?.message}`);
        results.push({ test: testCount, module: '教师列表查询', name: '列表', status: '失败', message: response.data?.message });
      }
    } catch (error) {
      log(colors.red, `  ✗✗ 异常: ${error.message}`);
      results.push({ test: testCount, module: '教师列表查询', name: '列表', status: '异常', message: error.message });
    }

  } catch (error) {
    log(colors.red, `\n测试执行异常: ${error.message}`);
  }

  // ========== 生成测试报告 ==========
  log(colors.cyan, '\n' + '='.repeat(70));
  log(colors.cyan, '📊 测试执行报告');
  log(colors.cyan, '='.repeat(70));

  const successCount = results.filter(r => r.status === '成功').length;
  const failCount = results.filter(r => r.status !== '成功').length;

  log(colors.blue, `\n测试时间: ${new Date().toLocaleString('zh-CN')}`);
  log(colors.blue, `测试总数: ${testCount}`);
  log(colors.blue, `成功: ${successCount}`);
  log(colors.blue, `失败: ${failCount}`);
  log(colors.blue, `成功率: ${testCount > 0 ? (successCount / testCount * 100).toFixed(1) : 0}%\n`);

  log(colors.blue, '详细测试结果:');
  log(colors.blue, '┌──────┬──────────┬────────┬──────┬────────────────────┐');
  log(colors.blue, '│ 编号 │ 测试模块 │ 数据   │ 状态 │ 说明               │');
  log(colors.blue, '├──────┼──────────┼────────┼──────┼────────────────────┤');

  results.forEach(r => {
    const statusIcon = r.status === '成功' ? '✓' : '✗';
    const numStr = `#${r.test}`.padEnd(4);
    const moduleStr = r.module.padEnd(8);
    const nameStr = (r.name || '').padEnd(6);
    const statusStr = `${statusIcon} ${r.status}`.padEnd(4);
    const msgStr = (r.message || '').substring(0, 18).padEnd(18);
    log(colors.blue, `│ ${numStr} │ ${moduleStr} │ ${nameStr} │ ${statusStr} │ ${msgStr} │`);
  });

  log(colors.blue, '└──────┴──────────┴────────┴──────┴────────────────────┘');

  log(colors.cyan, '\n' + '='.repeat(70));
  log(colors.cyan, '✅ 测试执行完成');
  log(colors.cyan, '='.repeat(70) + '\n');
}

test().catch(console.error);
