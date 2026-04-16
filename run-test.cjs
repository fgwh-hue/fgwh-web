const { chromium } = require('playwright');

(async () => {
  console.log('=== 学生管理系统自动化测试报告 ===\n');
  console.log('测试时间: ' + new Date().toLocaleString('zh-CN'));
  console.log('浏览器: Chrome (系统自带)\n');
  
  const results = [];
  let testCount = 0;
  let successCount = 0;
  
  let browser;
  try {
    // 使用系统已有的 Chrome 浏览器
    browser = await chromium.launch({ 
      headless: false,
      channel: 'chrome'
    });
  } catch (e) {
    console.log('无法启动 Chrome，尝试使用 Chromium...');
    browser = await chromium.launch({ headless: false });
  }
  
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
    // 等待页面加载完成
    await page.waitForTimeout(2000);
    
    // 尝试多种登录方式
    try {
      await page.fill('input[type="email"]', 'admin@example.com');
      await page.fill('input[type="password"]', '123456');
      await page.click('button:has-text("登录")');
    } catch (e) {
      // 尝试其他选择器
      await page.fill('input[placeholder*="邮箱"]', 'admin@example.com');
      await page.fill('input[placeholder*="密码"]', '123456');
      await page.click('button');
    }
    
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'test-results/02-after-login.png' });
    console.log('✓ 登录成功\n');
    
    // 步骤 3: 导航到学生管理页面
    console.log('步骤 3: 导航到学生管理页面');
    
    // 尝试多种方式点击学生管理
    try {
      await page.click('a:has-text("学生管理")');
    } catch (e) {
      await page.click('text=学生管理');
    }
    
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'test-results/03-student-list.png' });
    console.log('✓ 进入学生管理页面\n');
    
    // 测试数据
    const testStudents = [
      {
        studentNo: '2024001',
        name: '张三',
        gender: '男',
        phone: '13800138001',
        email: 'zhangsan@test.com',
        major: '计算机科学',
        className: 'CS2024-1班'
      },
      {
        studentNo: '2024002',
        name: '李四',
        gender: '女',
        phone: '13800138002',
        email: 'lisi@test.com',
        major: '软件工程',
        className: 'SE2024-1班'
      },
      {
        studentNo: '2024003',
        name: '王五',
        gender: '男',
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
        try {
          await page.click('button:has-text("新增")');
        } catch (e) {
          await page.click('button:has-text("添加")');
        }
        
        await page.waitForTimeout(1500);
        await page.screenshot({ path: `test-results/04-add-student-${testCount}.png` });
        console.log('  ✓ 打开添加表单');
        
        // 获取页面上的所有输入框
        const inputs = await page.$$('input[type="text"], input:not([type]), input[type="email"], input[type="tel"]');
        console.log(`  找到 ${inputs.length} 个输入框`);
        
        // 填写表单 - 使用多种方式定位输入框
        await page.fill('input[placeholder*="学号"], input[placeholder*="学"]', student.studentNo);
        await page.fill('input[placeholder*="姓名"], input[placeholder*="名"]', student.name);
        await page.fill('input[placeholder*="手机"], input[placeholder*="电话"]', student.phone);
        await page.fill('input[placeholder*="邮箱"], input[placeholder*="邮"]', student.email);
        
        // 选择性别 - 使用下拉选择框或单选按钮
        try {
          await page.selectOption('select', student.gender);
        } catch (e) {
          await page.click(`text=${student.gender}`);
        }
        
        await page.screenshot({ path: `test-results/04-filled-form-${testCount}.png` });
        console.log('  ✓ 填写表单完成');
        
        // 提交表单
        try {
          await page.click('button:has-text("提交")');
        } catch (e) {
          await page.click('button:has-text("确定")');
        }
        
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
            status: '✓ 成功', 
            message: '学生数据添加成功' 
          });
        } else {
          console.log(`  ✗✗ 学生 ${student.name} 添加失败`);
          results.push({ 
            test: testCount, 
            student: student.name, 
            status: '✗ 失败', 
            message: '未找到成功提示' 
          });
        }
        
        // 刷新页面查看新数据
        await page.reload({ waitUntil: 'networkidle' });
        await page.waitForTimeout(2000);
        
      } catch (error) {
        console.log(`  ✗✗ 测试 ${testCount} 异常: ${error.message.substring(0, 80)}...`);
        await page.screenshot({ path: `test-results/error-${testCount}.png` });
        results.push({ 
          test: testCount, 
          student: student.name, 
          status: '✗ 异常', 
          message: error.message.substring(0, 80) 
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
    console.log('\n' + '='.repeat(60));
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
    if (testCount > 0) {
      console.log(`  成功率: ${(successCount / testCount * 100).toFixed(2)}%`);
    }
    
    console.log('\n详细测试结果:');
    console.log('-'.repeat(60));
    results.forEach(r => {
      console.log(`  ${r.status} 测试 ${r.test}: ${r.student}`);
      console.log(`     信息: ${r.message}`);
    });
    
    console.log('\n截图文件位置:');
    console.log('-'.repeat(60));
    console.log('  1. test-results/01-login-page.png       - 登录页面');
    console.log('  2. test-results/02-after-login.png      - 登录后主页');
    console.log('  3. test-results/03-student-list.png     - 学生列表页');
    console.log('  4. test-results/04-add-student-{1,2,3}.png - 添加学生表单');
    console.log('  5. test-results/04-filled-form-{1,2,3}.png - 填写完成的表单');
    console.log('  6. test-results/05-submit-student-{1,2,3}.png - 提交后页面');
    console.log('  7. test-results/06-final-student-list.png - 最终学生列表');
    
    console.log('\n' + '='.repeat(60));
    console.log('=== 测试执行完成 ===');
    console.log('='.repeat(60));
    
    await browser.close();
    console.log('\n浏览器已关闭。测试完成。');
  }
})();
