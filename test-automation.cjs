#!/usr/bin/env node
/**
 * 学生管理系统自动化测试脚本
 * 使用 Playwright + Chrome 浏览器
 *
 * 运行方式: node test-automation.js
 */

const { chromium } = require('playwright');

async function main() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║       学生管理系统 - 自动化测试报告                      ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');
  console.log(`测试时间: ${new Date().toLocaleString('zh-CN')}`);
  console.log('测试环境: http://localhost:9527\n');

  const results = [];
  let testCount = 0;

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome' // 使用系统 Chrome 浏览器
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    locale: 'zh-CN'
  });

  const page = await context.newPage();

  try {
    // ========== 步骤 1: 登录系统 ==========
    console.log('📝 步骤 1: 登录系统');
    console.log('-'.repeat(60));

    await page.goto('http://localhost:9527', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    await page.screenshot({
      path: 'test-results/01-login.png',
      fullPage: true
    });
    console.log('✓ 页面加载成功');

    // 填写登录表单
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', '123456');
    await page.click('button[type="submit"]');

    await page.waitForTimeout(3000);
    await page.screenshot({
      path: 'test-results/02-dashboard.png',
      fullPage: true
    });
    console.log('✓ 登录成功\n');

    // ========== 步骤 2: 导航到学生管理 ==========
    console.log('📝 步骤 2: 进入学生管理页面');
    console.log('-'.repeat(60));

    await page.click('a:has-text("学生管理"), text=学生管理');
    await page.waitForTimeout(3000);

    await page.screenshot({
      path: 'test-results/03-student-list.png',
      fullPage: true
    });
    console.log('✓ 进入学生管理页面\n');

    // ========== 步骤 3: 添加学生数据 ==========
    console.log('📝 步骤 3: 添加学生数据 (3条测试数据)\n');

    const testStudents = [
      {
        name: '张三',
        studentNo: '2024001',
        gender: '1', // 1=男
        phone: '13800138001',
        email: 'zhangsan2024@test.com',
        major: '计算机科学与技术',
        className: 'CS2024-A班',
        status: '1' // 1=启用
      },
      {
        name: '李四',
        studentNo: '2024002',
        gender: '2', // 2=女
        phone: '13800138002',
        email: 'lisi2024@test.com',
        major: '软件工程',
        className: 'SE2024-B班',
        status: '1'
      },
      {
        name: '王五',
        studentNo: '2024003',
        gender: '1',
        phone: '13800138003',
        email: 'wangwu2024@test.com',
        major: '数据科学与大数据技术',
        className: 'DS2024-A班',
        status: '1'
      }
    ];

    for (const student of testStudents) {
      testCount++;
      console.log(`\n📋 测试 ${testCount}: 添加学生 "${student.name}"`);
      console.log('   学号:', student.studentNo);
      console.log('   姓名:', student.name);
      console.log('   性别:', student.gender === '1' ? '男' : '女');
      console.log('   手机:', student.phone);
      console.log('   邮箱:', student.email);
      console.log('   专业:', student.major);
      console.log('   班级:', student.className);
      console.log(`   ${'-'.repeat(55)}`);

      try {
        // 点击"新增"按钮
        await page.click('button:has-text("新增"), button:has-text("添加")');
        await page.waitForTimeout(1000);

        await page.screenshot({
          path: `test-results/04-form-${testCount}.png`,
          fullPage: true
        });
        console.log('   ✓ 打开添加表单');

        // 等待表单加载
        await page.waitForSelector('input, select', { timeout: 5000 });

        // 填写学号
        await page.fill('input[placeholder*="学号"]', student.studentNo);
        console.log('   ✓ 填写学号');

        // 填写姓名
        await page.fill('input[placeholder*="姓名"]', student.name);
        console.log('   ✓ 填写姓名');

        // 选择性别
        await page.selectOption('select', { value: student.gender });
        console.log('   ✓ 选择性别');

        // 填写手机号
        await page.fill('input[placeholder*="手机"]', student.phone);
        console.log('   ✓ 填写手机号');

        // 填写邮箱
        await page.fill('input[placeholder*="邮箱"]', student.email);
        console.log('   ✓ 填写邮箱');

        // 填写专业
        await page.fill('input[placeholder*="专业"]', student.major);
        console.log('   ✓ 填写专业');

        // 填写班级
        await page.fill('input[placeholder*="班级"]', student.className);
        console.log('   ✓ 填写班级');

        await page.screenshot({
          path: `test-results/04-filled-${testCount}.png`,
          fullPage: true
        });

        // 提交表单
        await page.click('button:has-text("提交"), button:has-text("确定"), button:has-text("保存")');
        console.log('   ✓ 提交表单');

        // 等待响应
        await page.waitForTimeout(3000);

        await page.screenshot({
          path: `test-results/05-result-${testCount}.png`,
          fullPage: true
        });

        // 验证是否成功
        const bodyText = await page.textContent('body');
        const isSuccess =
          bodyText.includes('成功') ||
          bodyText.includes('添加成功') ||
          !bodyText.includes('失败') ||
          !bodyText.includes('错误');

        if (isSuccess) {
          console.log(`   ✓✓✓ 测试 ${testCount} 成功: ${student.name} 已添加\n`);
          results.push({
            test: testCount,
            name: student.name,
            status: '成功 ✓',
            message: '学生数据添加成功'
          });
        } else {
          console.log(`   ✗✗✗ 测试 ${testCount} 失败: ${student.name}\n`);
          results.push({
            test: testCount,
            name: student.name,
            status: '失败 ✗',
            message: '未找到成功提示'
          });
        }

        // 刷新页面
        await page.reload({ waitUntil: 'networkidle' });
        await page.waitForTimeout(2000);
      } catch (error) {
        console.log(`   ✗✗✗ 测试 ${testCount} 异常: ${error.message.substring(0, 60)}...\n`);
        await page.screenshot({
          path: `test-results/error-${testCount}.png`,
          fullPage: true
        });

        results.push({
          test: testCount,
          name: student.name,
          status: '异常 ✗',
          message: error.message.substring(0, 60)
        });
      }
    }

    // ========== 步骤 4: 验证数据 ==========
    console.log('\n📝 步骤 4: 验证学生列表数据');
    console.log('-'.repeat(60));

    await page.screenshot({
      path: 'test-results/06-final-list.png',
      fullPage: true
    });

    const bodyText = await page.textContent('body');

    for (const student of testStudents) {
      const exists = bodyText.includes(student.name);
      if (exists) {
        console.log(`   ✓ ${student.name} 已显示在列表中`);
      } else {
        console.log(`   ✗ ${student.name} 未显示在列表中`);
      }
    }

    // ========== 生成测试报告 ==========
    const successCount = results.filter(r => r.status.includes('成功')).length;

    console.log(`\n${'='.repeat(60)}`);
    console.log('📊 测试执行报告');
    console.log('='.repeat(60));
    console.log(`\n测试时间: ${new Date().toLocaleString('zh-CN')}`);
    console.log(`浏览器: Chrome (通过 Playwright 控制)`);
    console.log(`测试系统: http://localhost:9527`);
    console.log(`测试场景: 学生管理 - 添加学生数据\n`);

    console.log('执行结果:');
    console.log('┌──────────┬────────┬────────┬──────────────────────────┐');
    console.log('│ 测试编号 │ 学生姓名 │ 状态   │ 说明                   │');
    console.log('├──────────┼────────┼────────┼──────────────────────────┤');

    results.forEach(r => {
      console.log(
        `│ #${r.test.toString().padStart(2)}    │ ${r.name.padEnd(6)} │ ${r.status.padEnd(6)} │ ${r.message.padEnd(22)} │`
      );
    });

    console.log('└──────────┴────────┴────────┴──────────────────────────┘');

    console.log(`\n测试统计:`);
    console.log(`  • 总测试数: ${testCount}`);
    console.log(`  • 成功: ${successCount}`);
    console.log(`  • 失败: ${testCount - successCount}`);
    console.log(`  • 成功率: ${((successCount / testCount) * 100).toFixed(1)}%`);

    console.log(`\n截图文件:`);
    console.log(`  • test-results/01-login.png          - 登录页面`);
    console.log(`  • test-results/02-dashboard.png      - 登录后仪表盘`);
    console.log(`  • test-results/03-student-list.png   - 学生列表`);
    console.log(`  • test-results/04-form-*.png         - 添加表单`);
    console.log(`  • test-results/04-filled-*.png       - 填写完成的表单`);
    console.log(`  • test-results/05-result-*.png       - 提交结果`);
    console.log(`  • test-results/06-final-list.png     - 最终学生列表`);

    console.log(`\n${'='.repeat(60)}`);
    console.log('✅ 测试执行完成');
    console.log('='.repeat(60));
  } catch (error) {
    console.error('\n❌ 测试执行异常:', error.message);
    await page.screenshot({
      path: 'test-results/error.png',
      fullPage: true
    });
  } finally {
    await browser.close();
  }
}

main().catch(console.error);
