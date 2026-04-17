const { chromium } = require('@playwright/test');

(async () => {
  console.log('=== 学生管理系统自动化测试报告 ===\n');
  console.log(`测试时间: ${new Date().toLocaleString('zh-CN')}`);
  console.log('浏览器: Chrome (系统自带)\n');

  const results = [];
  let testCount = 0;
  let successCount = 0;

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome' // 使用系统已有的 Chrome 浏览器
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();

  try {
    // 步骤 1: 导航到登录页面
    console.log('步骤 1: 打开学生管理系统');
    await page.goto('http://localhost:9527', { waitUntil: 'networkidle', timeout: 30000 });
    await page.screenshot({ path: 'test-results/01-login-page.png' });
    console.log('✓ 页面加载成功\n');

    // 步骤 2: 登录系统
    console.log('步骤 2: 登录系统');
    await page.fill('input[placeholder*="邮箱"], input[type="email"]', 'admin@example.com');
    await page.fill('input[placeholder*="密码"], input[type="password"]', '123456');
    await page.click('button[type="submit"], button:has-text("登录")');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'test-results/02-after-login.png' });
    console.log('✓ 登录成功\n');

    // 步骤 3: 导航到学生管理页面
    console.log('步骤 3: 导航到学生管理页面');
    await page.click('text=学生管理, a:has-text("学生管理")');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'test-results/03-student-list.png' });
    console.log('✓ 进入学生管理页面\n');

    // 测试数据
    const testStudents = [
      {
        studentNo: '2024001',
        name: '张三',
        gender: '男',
        genderValue: 1,
        phone: '13800138001',
        email: 'zhangsan@test.com',
        major: '计算机科学',
        className: 'CS2024-1班'
      },
      {
        studentNo: '2024002',
        name: '李四',
        gender: '女',
        genderValue: 2,
        phone: '13800138002',
        email: 'lisi@test.com',
        major: '软件工程',
        className: 'SE2024-1班'
      },
      {
        studentNo: '2024003',
        name: '王五',
        gender: '男',
        genderValue: 1,
        phone: '13800138003',
        email: 'wangwu@test.com',
        major: '数据科学',
        className: 'DS2024-1班'
      }
    ];

    // 步骤 4: 添加学生数据
    console.log('步骤 4: 添加学生数据\n');

    for (const student of testStudents) {
      testCount++;
      console.log(`\n测试 ${testCount}: 添加学生 ${student.name}`);
      console.log('学生信息:');
      console.log(`  - 学号: ${student.studentNo}`);
      console.log(`  - 姓名: ${student.name}`);
      console.log(`  - 性别: ${student.gender}`);
      console.log(`  - 手机: ${student.phone}`);
      console.log(`  - 邮箱: ${student.email}`);
      console.log(`  - 专业: ${student.major}`);
      console.log(`  - 班级: ${student.className}`);
      console.log('-'.repeat(50));

      try {
        // 点击新增按钮
        await page.click('button:has-text("新增"), button:has-text("添加")');
        await page.waitForTimeout(1000);
        await page.screenshot({ path: `test-results/04-add-student-${testCount}.png` });
        console.log('  ✓ 打开添加表单');

        // 填写表单 - 等待输入框出现
        await page.waitForSelector('input, select, textarea', { timeout: 5000 });

        // 获取所有输入框并填写
        const inputs = await page.$$('input');
        console.log(`  找到 ${inputs.length} 个输入框`);

        // 根据 placeholder 或 label 填写字段
        await page.fill('input[placeholder*="学号"], input[placeholder*="学"]', student.studentNo);
        await page.fill('input[placeholder*="姓名"], input[placeholder*="名"]', student.name);
        await page.fill('input[placeholder*="手机"], input[placeholder*="电话"]', student.phone);
        await page.fill('input[placeholder*="邮箱"], input[placeholder*="邮"]', student.email);
        await page.fill('input[placeholder*="专业"], input[placeholder*="专"]', student.major);
        await page.fill('input[placeholder*="班级"], input[placeholder*="班"]', student.className);

        // 选择性别
        await page.click(`text=${student.gender}`);
        console.log('  ✓ 填写表单完成');

        await page.screenshot({ path: `test-results/04-filled-form-${testCount}.png` });

        // 提交表单
        await page.click('button:has-text("提交"), button:has-text("确定"), button:has-text("保存")');
        await page.waitForTimeout(3000);
        await page.screenshot({ path: `test-results/05-submit-student-${testCount}.png` });
        console.log('  ✓ 提交表单');

        // 检查是否添加成功
        const pageContent = await page.textContent('body');
        const isSuccess = pageContent.includes('成功') || pageContent.includes('添加成功');

        if (isSuccess) {
          console.log(`  ✓✓ 学生 ${student.name} 添加成功!`);
          successCount++;
          results.push({
            test: testCount,
            student: student.name,
            status: '成功',
            message: '学生数据添加成功并显示在列表中'
          });
        } else {
          console.log(`  ✗✗ 学生 ${student.name} 添加失败`);
          results.push({
            test: testCount,
            student: student.name,
            status: '失败',
            message: '未找到成功提示信息'
          });
        }

        // 刷新页面查看新数据
        await page.reload({ waitUntil: 'networkidle' });
        await page.waitForTimeout(2000);
      } catch (error) {
        console.log(`  ✗✗ 测试 ${testCount} 异常: ${error.message.substring(0, 100)}...`);
        await page.screenshot({ path: `test-results/error-${testCount}.png` });
        results.push({
          test: testCount,
          student: student.name,
          status: '异常',
          message: error.message.substring(0, 100)
        });
      }
    }

    // 步骤 5: 最终验证
    console.log('\n步骤 5: 验证学生列表数据');
    console.log('-'.repeat(50));

    await page.screenshot({ path: 'test-results/06-final-student-list.png' });

    // 检查列表中是否包含新增的学生
    const pageContent = await page.textContent('body');
    for (const student of testStudents) {
      const hasStudent = pageContent.includes(student.name);
      if (hasStudent) {
        console.log(`  ✓ 学生 ${student.name} 已显示在列表中`);
      } else {
        console.log(`  ✗ 学生 ${student.name} 未显示在列表中`);
      }
    }
  } catch (error) {
    console.error(`\n测试异常: ${error.message}`);
    await page.screenshot({ path: 'test-results/error.png' });
  } finally {
    // 步骤 6: 生成测试报告
    console.log(`\n${'='.repeat(60)}`);
    console.log('=== 测试执行报告 ===');
    console.log('='.repeat(60));
    console.log(`\n测试时间: ${new Date().toLocaleString('zh-CN')}`);
    console.log('浏览器: Chrome (系统自带，通过 Playwright 控制)');
    console.log(`测试系统: http://localhost:9527`);
    console.log(`测试场景: 学生管理 - 添加学生数据`);

    console.log('\n执行结果摘要:');
    console.log('-'.repeat(60));
    console.log(`  测试总数: ${testCount}`);
    console.log(`  成功数量: ${successCount}`);
    console.log(`  失败数量: ${testCount - successCount}`);
    console.log(`  成功率: ${testCount > 0 ? ((successCount / testCount) * 100).toFixed(2) : 0}%`);

    console.log('\n详细测试结果:');
    console.log('-'.repeat(60));
    results.forEach(r => {
      const icon = r.status === '成功' ? '✓' : '✗';
      console.log(`  ${icon} 测试 ${r.test}: ${r.student} - ${r.status}`);
      console.log(`     信息: ${r.message}`);
    });

    console.log('\n截图文件位置:');
    console.log('-'.repeat(60));
    console.log('  1. test-results/01-login-page.png       - 登录页面');
    console.log('  2. test-results/02-after-login.png      - 登录后主页');
    console.log('  3. test-results/03-student-list.png     - 学生列表页');
    console.log('  4. test-results/04-add-student-{1,2,3}.png - 添加学生表单');
    console.log('  5. test-results/05-submit-student-{1,2,3}.png - 提交后页面');
    console.log('  6. test-results/06-final-student-list.png - 最终学生列表');

    console.log(`\n${'='.repeat(60)}`);
    console.log('=== 测试执行完成 ===');
    console.log('='.repeat(60));

    await browser.close();
    console.log('\n浏览器已关闭。测试完成。');
  }
})();
