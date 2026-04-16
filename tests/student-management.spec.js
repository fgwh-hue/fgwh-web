const { test, expect } = require('@playwright/test');

test.describe('学生管理系统自动化测试', () => {
  test('添加学生数据测试', async ({ page }) => {
    console.log('=== 学生管理系统自动化测试报告 ===\n');
    
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
        gender: 1,
        phone: '13800138001',
        email: 'zhangsan@test.com',
        major: '计算机科学',
        className: 'CS2024-1班'
      },
      {
        studentNo: '2024002',
        name: '李四',
        gender: 2,
        phone: '13800138002',
        email: 'lisi@test.com',
        major: '软件工程',
        className: 'SE2024-1班'
      },
      {
        studentNo: '2024003',
        name: '王五',
        gender: 1,
        phone: '13800138003',
        email: 'wangwu@test.com',
        major: '数据科学',
        className: 'DS2024-1班'
      }
    ];
    
    // 步骤 4: 添加学生数据
    console.log('步骤 4: 添加学生数据\n');
    
    for (const student of testStudents) {
      console.log(`测试: 添加学生 ${student.name}`);
      console.log('-'.repeat(40));
      
      // 点击新增按钮
      await page.click('button:has-text("新增"), button:has-text("添加")');
      await page.waitForTimeout(1000);
      await page.screenshot({ path: `test-results/04-add-student-${student.name}.png` });
      
      // 填写表单
      await page.fill('input[placeholder*="学号"]', student.studentNo);
      await page.fill('input[placeholder*="姓名"]', student.name);
      
      // 选择性别
      if (student.gender === 1) {
        await page.click('text=男');
      } else {
        await page.click('text=女');
      }
      
      await page.fill('input[placeholder*="手机"]', student.phone);
      await page.fill('input[placeholder*="邮箱"]', student.email);
      await page.fill('input[placeholder*="专业"]', student.major);
      await page.fill('input[placeholder*="班级"]', student.className);
      
      // 提交表单
      await page.click('button:has-text("提交"), button:has-text("确定")');
      await page.waitForTimeout(2000);
      await page.screenshot({ path: `test-results/05-submit-student-${student.name}.png` });
      
      // 验证添加成功
      const successMessage = await page.textContent('text=添加成功, text=成功');
      expect(successMessage).toBeTruthy();
      console.log(`✓ 学生 ${student.name} 添加成功`);
    }
    
    // 步骤 5: 验证数据列表
    console.log('\n步骤 5: 验证学生列表数据');
    console.log('-'.repeat(40));
    
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/06-final-student-list.png' });
    
    // 检查列表中是否包含新增的学生
    for (const student of testStudents) {
      const hasStudent = await page.isVisible(`text=${student.name}`);
      expect(hasStudent).toBeTruthy();
      console.log(`✓ 学生 ${student.name} 已显示在列表中`);
    }
    
    console.log('\n=== 测试执行完成 ===');
  });
});
