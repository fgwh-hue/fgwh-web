<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { NButton, NGi, NGrid, NInput, NPopconfirm, NProgress, NSpace, NTag, useMessage } from 'naive-ui';
import { useAuthStore } from '@/store/modules/auth';

const router = useRouter();

// 使用Naive UI的useMessage组合式API
const $message = useMessage();

defineOptions({
  name: 'TeacherDashboard'
});

const authStore = useAuthStore();

function navigateToCourse(course?: any) {
  if (course) {
    router.push({ path: '/teacher/course', query: { name: course.name } });
  } else {
    router.push('/teacher/course');
  }
}

function navigateToAssignment() {
  router.push('/teacher/assignment');
}

// 弹窗状态
const showCourseModal = ref(false);
const showNotificationModal = ref(false);
const showAssignmentModal = ref(false);
const selectedCourse = ref<any>(null);

const courseStats = [
  {
    name: '数学',
    students: 45,
    assignments: 8,
    avgScore: 82,
    description: '高等数学基础课程'
  },
  {
    name: '英语',
    students: 38,
    assignments: 6,
    avgScore: 85,
    description: '大学英语综合课程'
  },
  {
    name: '物理',
    students: 42,
    assignments: 7,
    avgScore: 79,
    description: '大学物理实验课'
  },
  {
    name: '化学',
    students: 31,
    assignments: 5,
    avgScore: 81,
    description: '无机化学基础'
  },
  {
    name: '计算机',
    students: 52,
    assignments: 9,
    avgScore: 88,
    description: '程序设计基础'
  },
  {
    name: '历史',
    students: 35,
    assignments: 4,
    avgScore: 83,
    description: '中国近代史'
  }
];

// 课程完成度显示数据（只显示部分课程以保持视觉平衡）
const courseCompletionStats = [
  { name: '数学', students: 45, assignments: 8, avgScore: 82 },
  { name: '英语', students: 38, assignments: 6, avgScore: 85 },
  { name: '物理', students: 42, assignments: 7, avgScore: 79 },
  { name: '化学', students: 31, assignments: 5, avgScore: 81 }
];

// 实时动态数据
const recentActivities = [
  {
    student: '李明',
    course: '数学',
    action: '提交了作业',
    content: '第5章练习',
    time: '2小时前',
    type: 'submission',
    icon: 'i-mdi-file-document-check text-20px'
  },
  {
    student: '王芳',
    course: '英语',
    action: '提出了问题',
    content: '关于虚拟语气的用法',
    time: '4小时前',
    type: 'question',
    icon: 'i-mdi-help-circle text-20px'
  },
  {
    student: '张三',
    course: '物理',
    action: '完成了实验',
    content: '牛顿定律验证实验',
    time: '1天前',
    type: 'experiment',
    icon: 'i-mdi-flask text-20px'
  },
  {
    student: '张伟',
    course: '化学',
    action: '查看了成绩',
    content: '期中考试成绩',
    time: '2天前',
    type: 'score',
    icon: 'i-mdi-chart-line text-20px'
  },
  {
    student: '刘洋',
    course: '计算机',
    action: '提交了代码',
    content: '算法作业',
    time: '6小时前',
    type: 'code',
    icon: 'i-mdi-code text-20px'
  },
  {
    student: '陈静',
    course: '历史',
    action: '上传了资料',
    content: '近代史论文参考',
    time: '3小时前',
    type: 'upload',
    icon: 'i-mdi-upload text-20px'
  }
];

// 快捷操作数据
const quickActions = [
  {
    name: '批改作业',
    icon: 'i-mdi-clipboard-edit text-24px',
    color: 'blue',
    handler: () => window.$message?.info('正在打开批改作业功能...')
  },
  {
    name: '发布公告',
    icon: 'i-mdi-bullhorn text-24px',
    color: 'green',
    handler: () => window.$message?.info('正在打开发布公告功能...')
  },
  {
    name: '查看统计',
    icon: 'i-mdi-chart-box text-24px',
    color: 'purple',
    handler: () => window.$message?.info('正在打开统计功能...')
  },
  {
    name: '添加学生',
    icon: 'i-mdi-account-plus text-24px',
    color: 'orange',
    handler: () => window.$message?.info('正在打开添加学生功能...')
  }
];

// 增强快捷操作 - 添加AI和高级功能
const advancedActions = [
  {
    name: 'AI智能分析',
    icon: 'i-mdi-robot text-20px',
    color: 'gradient-purple',
    description: '智能分析学生学习数据',
    handler: () => window.$message?.info('正在打开AI智能分析功能...')
  },
  {
    name: '一键排课',
    icon: 'i-mdi-calendar-clock text-20px',
    color: 'gradient-blue',
    description: '智能排课解决方案',
    handler: () => window.$message?.info('正在打开排课功能...')
  },
  {
    name: '批量处理',
    icon: 'i-mdi-file-multiple text-20px',
    color: 'gradient-green',
    description: '批量管理学生作业',
    handler: () => window.$message?.info('正在打开批量处理功能...')
  },
  {
    name: '学情报告',
    icon: 'i-mdi-file-chart text-20px',
    color: 'gradient-orange',
    description: '生成学生学习报告',
    handler: () => window.$message?.info('正在生学习情报告...')
  }
];

// 根据时间获取问候语
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 6) return '夜深了';
  if (hour < 9) return '早上好';
  if (hour < 12) return '上午好';
  if (hour < 14) return '中午好';
  if (hour < 18) return '下午好';
  if (hour < 22) return '晚上好';
  return '夜深了';
}

// 新增：课程动态数据
const courseDynamics = ref([
  {
    id: 1,
    course: '高等数学',
    action: '新学生加入',
    count: 3,
    time: '10分钟前',
    icon: 'i-mdi-account-plus',
    color: 'blue'
  },
  {
    id: 2,
    course: '计算机编程',
    action: '作业完成率上升',
    count: 5,
    time: '30分钟前',
    icon: 'i-mdi-trending-up',
    color: 'green'
  },
  {
    id: 3,
    course: '物理实验',
    action: '新资料上传',
    count: 2,
    time: '1小时前',
    icon: 'i-mdi-file-upload',
    color: 'purple'
  },
  {
    id: 4,
    course: '大学英语',
    action: '讨论区活跃',
    count: 12,
    time: '2小时前',
    icon: 'i-mdi-comment-multiple',
    color: 'orange'
  }
]);

// 新增：教学目标进度
const teachingGoals = ref([
  {
    id: 1,
    title: '作业批改完成率',
    current: 85,
    target: 90,
    deadline: '本周',
    color: '#3b82f6'
  },
  {
    id: 2,
    title: '课程内容更新',
    current: 60,
    target: 100,
    deadline: '月底',
    color: '#10b981'
  },
  {
    id: 3,
    title: '学生互动率',
    current: 72,
    target: 80,
    deadline: '本周',
    color: '#f59e0b'
  },
  {
    id: 4,
    title: '在线答疑次数',
    current: 45,
    target: 50,
    deadline: '本周',
    color: '#8b5cf6'
  }
]);

// 新增：教学资源使用情况
const resourceUsage = ref([
  { name: '课件', used: 128, total: 150, trend: 'up' },
  { name: '视频', used: 85, total: 100, trend: 'stable' },
  { name: '习题集', used: 92, total: 120, trend: 'up' },
  { name: '参考资料', used: 45, total: 80, trend: 'down' }
]);

const weeklyStats = [
  { day: '周一', submitted: 32, graded: 28 },
  { day: '周二', submitted: 38, graded: 35 },
  { day: '周三', submitted: 42, graded: 40 },
  { day: '周四', submitted: 35, graded: 32 },
  { day: '周五', submitted: 28, graded: 25 },
  { day: '周六', submitted: 15, graded: 12 },
  { day: '周日', submitted: 10, graded: 8 }
];

// 通知数据
const notifications = [
  {
    id: 1,
    title: '系统维护通知',
    content: '系统将于本周六进行维护升级',
    time: '1小时前',
    type: 'info'
  },
  {
    id: 2,
    title: '新作业提醒',
    content: '您有28份作业待批改',
    time: '3小时前',
    type: 'warning'
  },
  {
    id: 3,
    title: '课程评价',
    content: '学生对您的课程评价已更新',
    time: '1天前',
    type: 'success'
  },
  {
    id: 4,
    title: '学生提问',
    content: '李明在数学课程中提出了新问题',
    time: '2小时前',
    type: 'info'
  },
  {
    id: 5,
    title: '成绩公布',
    content: '第5章测验成绩已公布',
    time: '5小时前',
    type: 'success'
  }
];

// 教学日程数据
const scheduleData = [
  {
    time: '08:00-10:00',
    day: '周一',
    course: '数学 - 第五章测验',
    location: '教学楼A301',
    students: 45,
    type: 'exam'
  },
  {
    time: '14:00-16:00',
    day: '周二',
    course: '英语 - 口语练习',
    location: '语音室B201',
    students: 38,
    type: 'class'
  },
  {
    time: '10:00-12:00',
    day: '周四',
    course: '物理 - 实验课',
    location: '实验室C102',
    students: 42,
    type: 'lab'
  },
  {
    time: '09:00-11:00',
    day: '周三',
    course: '化学 - 理论课',
    location: '教学楼A205',
    students: 31,
    type: 'class'
  },
  {
    time: '15:00-17:00',
    day: '周五',
    course: '计算机 - 编程实践',
    location: '机房D301',
    students: 52,
    type: 'lab'
  }
];

// 待办事项数据
const todoItems = ref([
  {
    id: 1,
    text: '批改数学作业',
    meta: '今天截止',
    priority: 'high',
    completed: false
  },
  {
    id: 2,
    text: '准备周三课件',
    meta: '明天',
    priority: 'medium',
    completed: false
  },
  {
    id: 3,
    text: '更新成绩单',
    meta: '已完成',
    priority: 'low',
    completed: true
  },
  {
    id: 4,
    text: '家长会准备',
    meta: '本周五',
    priority: 'medium',
    completed: false
  },
  {
    id: 5,
    text: '批改英语作文',
    meta: '今天截止',
    priority: 'high',
    completed: false
  },
  {
    id: 6,
    text: '实验报告审核',
    meta: '明天',
    priority: 'medium',
    completed: false
  }
]);

// 待办输入相关
const todoInput = ref('');
let todoIdCounter = 7;

// 待办事项处理函数
function addTodo() {
  const text = todoInput.value.trim();

  if (!text) {
    $message.warning('请输入待办内容');
    return;
  }

  if (todoItems.value.some(item => item.text === text && !item.completed)) {
    $message.warning('该待办事项已存在');
    return;
  }

  todoItems.value.unshift({
    id: (todoIdCounter += 1),
    text,
    meta: '刚刚添加',
    priority: 'medium',
    completed: false
  });

  todoInput.value = '';
  $message.success('添加成功');
}

function toggleTodo(todo: any) {
  todo.completed = !todo.completed;
  todo.meta = todo.completed ? '已完成' : '刚刚';
  $message.success(todo.completed ? '标记为已完成' : '标记为未完成');
}

function clearTodoInput() {
  todoInput.value = '';
}

function deleteTodo(todo: any) {
  const index = todoItems.value.indexOf(todo);
  if (index > -1) {
    todoItems.value.splice(index, 1);
    $message.success('已删除待办事项');
  }
}

// 处理函数
function handleCourseClick(course: any) {
  selectedCourse.value = course;
  showCourseModal.value = true;
}

function handlePublishCourse() {
  window.$message?.success('发布课程功能开发中...');
}

function handlePublishAssignment() {
  showAssignmentModal.value = true;
}

function handleSendNotification() {
  showNotificationModal.value = true;
}

function handleViewReport() {
  window.$message?.info('正在跳转到报告页面...');
}

function submitAssignment() {
  window.$message?.success('作业发布成功！');
  showAssignmentModal.value = false;
}

function sendNotification() {
  window.$message?.success('通知发送成功！');
  showNotificationModal.value = false;
}
</script>

<template>
  <div class="teacher-dashboard">
    <!-- 欢迎横幅 - 升级版 -->
    <div class="welcome-banner">
      <div class="banner-bg-decoration">
        <div class="bg-shape bg-shape-1"></div>
        <div class="bg-shape bg-shape-2"></div>
        <div class="bg-shape bg-shape-3"></div>
        <div class="bg-line bg-line-1"></div>
        <div class="bg-line bg-line-2"></div>
      </div>
      <div class="banner-content">
        <div class="banner-left">
          <div class="banner-avatar-wrapper">
            <div class="banner-avatar">
              <img src="@/assets/imgs/soybean.jpg" alt="avatar" />
              <div class="avatar-status-dot"></div>
            </div>
            <div class="avatar-glow"></div>
          </div>
          <div class="banner-info">
            <div class="banner-greeting">
              <span class="greeting-icon">👋</span>
              <span class="greeting-text">{{ getGreeting() }}，{{ authStore.userInfo.userName }}老师</span>
            </div>
            <h2 class="banner-title">欢迎回到教学中心</h2>
            <p class="banner-subtitle">
              <span class="subtitle-item">
                <div class="i-mdi-calendar-today text-18px" />
                今日有
                <strong>3</strong>
                节课程待授课
              </span>
              <span class="subtitle-divider">|</span>
              <span class="subtitle-item">
                <div class="i-mdi-clipboard-list text-18px" />
                <strong>28</strong>
                份作业待批改
              </span>
            </p>
            <div class="banner-badges">
              <div class="badge-item">
                <div class="i-mdi-trending-up text-16px" />
                <span>教学评分 4.9</span>
              </div>
              <div class="badge-item">
                <div class="i-mdi-account-multiple text-16px" />
                <span>累计学生 1,256</span>
              </div>
            </div>
          </div>
        </div>
        <div class="banner-right">
          <div class="quick-stats">
            <div class="quick-stat-item">
              <div class="quick-stat-value">98%</div>
              <div class="quick-stat-label">本周出勤率</div>
            </div>
            <div class="quick-stat-divider"></div>
            <div class="quick-stat-item">
              <div class="quick-stat-value">85%</div>
              <div class="quick-stat-label">作业批改率</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 核心统计卡片 - 升级版 -->
    <NGrid :x-gap="16" :y-gap="16" responsive="screen" item-responsive class="mt-20px">
      <NGi span="24 s:12 m:6 l:6">
        <div class="stat-card stat-card-pink">
          <div class="stat-card-bg">
            <div class="stat-card-icon">
              <div class="i-mdi-account-group text-36px"></div>
            </div>
          </div>
          <div class="stat-content">
            <div class="stat-label">学生总数</div>
            <div class="stat-value">156</div>
            <div class="stat-trend">
              <div class="i-mdi-trending-up text-14px"></div>
              <span>较上周 +12</span>
            </div>
          </div>
          <div class="stat-glow"></div>
        </div>
      </NGi>
      <NGi span="24 s:12 m:6 l:6">
        <div class="stat-card stat-card-purple">
          <div class="stat-card-bg">
            <div class="stat-card-icon">
              <div class="i-mdi-book-open-page-variant text-36px"></div>
            </div>
          </div>
          <div class="stat-content">
            <div class="stat-label">我的课程</div>
            <div class="stat-value">12</div>
            <div class="stat-trend">
              <div class="i-mdi-school text-14px"></div>
              <span>进行中 8 门</span>
            </div>
          </div>
          <div class="stat-glow"></div>
        </div>
      </NGi>
      <NGi span="24 s:12 m:6 l:6">
        <div class="stat-card stat-card-blue">
          <div class="stat-card-bg">
            <div class="stat-card-icon">
              <div class="i-mdi-clipboard-list text-36px"></div>
            </div>
          </div>
          <div class="stat-content">
            <div class="stat-label">布置作业</div>
            <div class="stat-value">28</div>
            <div class="stat-trend">
              <div class="i-mdi-clock-outline text-14px"></div>
              <span>待批改 15 份</span>
            </div>
          </div>
          <div class="stat-glow"></div>
        </div>
      </NGi>
      <NGi span="24 s:12 m:6 l:6">
        <div class="stat-card stat-card-orange">
          <div class="stat-card-bg">
            <div class="stat-card-icon">
              <div class="i-mdi-trending-up text-36px"></div>
            </div>
          </div>
          <div class="stat-content">
            <div class="stat-label">平均及格率</div>
            <div class="stat-value">85%</div>
            <div class="stat-trend success">
              <div class="i-mdi-arrow-up-bold text-14px"></div>
              <span>较上月 +5%</span>
            </div>
          </div>
          <div class="stat-glow"></div>
        </div>
      </NGi>
    </NGrid>

    <!-- 课程概览与实时动态 -->
    <NGrid :x-gap="20" :y-gap="20" responsive="screen" item-responsive class="mt-24px">
      <NGi span="24 s:24 m:12">
        <div class="content-card card-equal-height">
          <div class="card-header">
            <div class="card-title">
              <div class="title-icon i-mdi-book-open-variant" />
              <span>课程概览</span>
            </div>
            <NButton text type="primary" size="small" @click="navigateToCourse()">
              <template #icon>
                <div class="i-mdi-arrow-right" />
              </template>
              查看全部
            </NButton>
          </div>

          <!-- 课程概览 - 简化版 -->
          <div class="course-overview-upgraded">
            <!-- 顶部统计条 -->
            <div class="overview-stats-bar">
              <div class="stat-pill">
                <span class="stat-value">12</span>
                <span class="stat-label">在教课程</span>
              </div>
              <div class="stat-pill">
                <span class="stat-value">156</span>
                <span class="stat-label">学生总数</span>
              </div>
              <div class="stat-pill highlight">
                <span class="stat-value">4.9</span>
                <span class="stat-label">教学评分</span>
              </div>
            </div>

            <!-- 课程卡片网格 -->
            <div class="course-cards-grid">
              <div
                v-for="course in courseStats.slice(0, 4)"
                :key="course.name"
                class="course-card-upgraded"
                @click="handleCourseClick(course)"
              >
                <div class="course-card-content">
                  <div class="course-card-header">
                    <h4 class="course-card-title">{{ course.name }}</h4>
                    <NTag
                      :type="course.avgScore >= 85 ? 'success' : course.avgScore >= 70 ? 'info' : 'warning'"
                      size="small"
                    >
                      {{ course.avgScore }}分
                    </NTag>
                  </div>
                  <div class="course-card-footer">
                    <span>{{ course.students }}人</span>
                    <span>{{ course.assignments }}作业</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 课程趋势 -->
            <div class="course-trend-section">
              <div class="trend-header">
                <span class="trend-title">本周学习趋势</span>
                <NTag type="success" size="small">↑ 12%</NTag>
              </div>
              <div class="trend-bars">
                <div v-for="item in courseStats.slice(0, 4)" :key="item.name" class="trend-bar-item">
                  <span class="trend-bar-label">{{ item.name }}</span>
                  <div class="trend-bar-bg">
                    <div class="trend-bar-fill" :style="{ width: `${(item.avgScore / 100) * 100}%` }" />
                  </div>
                </div>
              </div>
            </div>

            <!-- 快捷操作 -->
            <div class="quick-actions">
              <NButton block size="small" type="primary" @click="navigateToCourse()">
                <template #icon>
                  <div class="i-mdi-plus text-14px" />
                </template>
                创建新课程
              </NButton>
              <NButton block size="small" secondary @click="$message.info('批量导入功能开发中')">
                <template #icon>
                  <div class="i-mdi-upload text-14px" />
                </template>
                批量导入
              </NButton>
            </div>

            <!-- 最近通知 -->
            <div class="recent-notifications">
              <div class="notif-header">
                <span class="notif-title">最近通知</span>
                <NText depth="3" class="text-xs">3 条未读</NText>
              </div>
              <div class="notif-list">
                <div class="notif-item unread">
                  <div class="notif-dot" />
                  <div class="notif-content">
                    <span class="notif-text">数学课程新作业已发布</span>
                    <span class="notif-time">10 分钟前</span>
                  </div>
                </div>
                <div class="notif-item unread">
                  <div class="notif-dot" />
                  <div class="notif-content">
                    <span class="notif-text">物理实验报告提交提醒</span>
                    <span class="notif-time">1 小时前</span>
                  </div>
                </div>
                <div class="notif-item">
                  <div class="notif-content">
                    <span class="notif-text">英语课程资料已更新</span>
                    <span class="notif-time">昨天</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </NGi>

      <NGi span="24 s:24 m:12">
        <div class="content-card card-equal-height">
          <div class="card-header">
            <div class="card-title">
              <span>实时动态</span>
            </div>
          </div>

          <!-- 动态信息流 - 优化样式 -->
          <div class="activity-feed">
            <div
              v-for="(item, idx) in recentActivities.slice(0, 4)"
              :key="idx"
              class="activity-item-compact"
              :class="`activity-${item.type}`"
            >
              <div class="activity-icon-small" :class="`icon-${item.type}`">
                <div :class="item.icon" />
              </div>
              <div class="activity-content-small">
                <div class="activity-main">
                  <span class="activity-student">{{ item.student }}</span>
                  <span class="activity-action">{{ item.action }}</span>
                  <span class="activity-course">{{ item.course }}</span>
                </div>
                <div class="activity-meta">
                  <span class="activity-detail">{{ item.content }}</span>
                  <span class="activity-time">{{ item.time }}</span>
                </div>
              </div>
              <NButton
                v-if="item.action === '提交了作业'"
                text
                size="tiny"
                type="primary"
                @click="() => $message?.info('批改作业功能开发中...')"
              >
                批改
              </NButton>
              <NButton
                v-else-if="item.action === '提出了问题'"
                text
                size="tiny"
                type="info"
                @click="() => $message?.info('查看问题功能开发中...')"
              >
                查看
              </NButton>
            </div>
          </div>

          <!-- 快速操作与学习提醒 -->
          <div class="quick-actions-panel">
            <div class="quick-actions-grid">
              <div v-for="action in quickActions" :key="action.name" class="quick-action-small" @click="action.handler">
                <div class="quick-action-icon-small" :class="`icon-${action.color}`">
                  <div :class="action.icon" />
                </div>
                <span class="quick-action-name">{{ action.name }}</span>
              </div>
            </div>

            <!-- 高级功能区域 -->
            <div class="advanced-actions-section">
              <div class="section-header">
                <span class="section-title">高级功能</span>
                <NTag type="info" size="small">AI赋能</NTag>
              </div>
              <div class="advanced-actions-grid">
                <div
                  v-for="action in advancedActions"
                  :key="action.name"
                  class="advanced-action-card"
                  @click="action.handler"
                >
                  <div class="advanced-action-icon" :class="action.color">
                    <div :class="action.icon" />
                  </div>
                  <div class="advanced-action-info">
                    <span class="advanced-action-name">{{ action.name }}</span>
                    <span class="advanced-action-desc">{{ action.description }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 学习提醒 -->
            <div class="learning-reminder">
              <div class="reminder-header">
                <div class="reminder-icon">
                  <div class="i-mdi-alarm-light text-18px" />
                </div>
                <span>学习提醒</span>
              </div>
              <div class="reminder-content">
                <div class="reminder-item">
                  <div class="reminder-icon-small">
                    <div class="i-mdi-clock-outline text-14px" />
                  </div>
                  <span>明天有3个班级的早课</span>
                </div>
                <div class="reminder-item">
                  <div class="reminder-icon-small">
                    <div class="i-mdi-clipboard-alert text-14px" />
                  </div>
                  <span>数学作业批改截止时间：今天18:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </NGi>
    </NGrid>

    <!-- 新增：课程动态 -->
    <div class="content-card mt-24px">
      <div class="card-header">
        <div class="card-title">
          <div class="title-icon i-mdi-update" />
          <span>课程动态</span>
        </div>
        <NButton text type="primary" size="small" @click="navigateToAssignment()">查看全部</NButton>
      </div>
      <div class="dynamics-grid">
        <div v-for="dyn in courseDynamics" :key="dyn.id" class="dynamics-item">
          <div class="dynamics-icon" :class="`icon-${dyn.color}`">
            <div :class="dyn.icon" />
          </div>
          <div class="dynamics-content">
            <div class="dynamics-course">{{ dyn.course }}</div>
            <div class="dynamics-action">{{ dyn.action }}</div>
            <div class="dynamics-meta">
              <span class="dynamics-count">+{{ dyn.count }}</span>
              <span class="dynamics-time">{{ dyn.time }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 新增：教学目标进度 -->
    <div class="content-card mt-24px">
      <div class="card-header">
        <div class="card-title">
          <div class="title-icon i-mdi-target" />
          <span>教学目标进度</span>
        </div>
        <NTag type="info" size="small">本学期</NTag>
      </div>
      <div class="goals-list">
        <div v-for="goal in teachingGoals" :key="goal.id" class="goal-item">
          <div class="goal-header">
            <span class="goal-title">{{ goal.title }}</span>
            <span class="goal-deadline">截止: {{ goal.deadline }}</span>
          </div>
          <div class="goal-progress">
            <NProgress type="line" :percentage="goal.current" :color="goal.color" :height="8" />
            <span class="goal-percent">{{ goal.current }}% / {{ goal.target }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 新增：教学资源使用 -->
    <div class="content-card mt-24px">
      <div class="card-header">
        <div class="card-title">
          <div class="title-icon i-mdi-folder-multiple" />
          <span>教学资源使用情况</span>
        </div>
        <NButton text type="primary" size="small" @click="navigateToCourse()">管理资源</NButton>
      </div>
      <div class="resource-grid">
        <div v-for="res in resourceUsage" :key="res.name" class="resource-item">
          <div class="resource-info">
            <span class="resource-name">{{ res.name }}</span>
            <span class="resource-trend" :class="`trend-${res.trend}`">
              <div
                :class="
                  res.trend === 'up'
                    ? 'i-mdi-trending-up'
                    : res.trend === 'down'
                      ? 'i-mdi-trending-down'
                      : 'i-mdi-minus'
                "
              />
            </span>
          </div>
          <NProgress type="line" :percentage="Math.round((res.used / res.total) * 100)" :height="6" />
          <span class="resource-count">{{ res.used }} / {{ res.total }}</span>
        </div>
      </div>
    </div>

    <!-- 本周统计 -->
    <div class="content-card mt-24px">
      <div class="card-header">
        <div class="card-title">
          <div class="title-icon i-mdi-chart-bar" />
          <span>本周作业统计</span>
        </div>
      </div>
      <div class="weekly-stats">
        <div v-for="stat in weeklyStats" :key="stat.day" class="stat-row">
          <div class="stat-day">{{ stat.day }}</div>
          <div class="stat-bars">
            <div class="stat-bar-item">
              <div class="bar-label">
                <span class="bar-dot bar-dot-blue" />
                <span>提交</span>
              </div>
              <div class="bar-wrapper">
                <div class="bar-fill bar-fill-blue" :class="`bar-width-${Math.round((stat.submitted / 50) * 100)}`">
                  <span class="bar-value">{{ stat.submitted }}</span>
                </div>
              </div>
            </div>
            <div class="stat-bar-item">
              <div class="bar-label">
                <span class="bar-dot bar-dot-green" />
                <span>已批改</span>
              </div>
              <div class="bar-wrapper">
                <div class="bar-fill bar-fill-green" :class="`bar-width-${Math.round((stat.graded / 50) * 100)}`">
                  <span class="bar-value">{{ stat.graded }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="stat-progress">
            <NProgress
              type="circle"
              :percentage="stat.submitted > 0 ? Math.round((stat.graded / stat.submitted) * 100) : 0"
              :stroke-width="8"
              :show-indicator="true"
              class="progress-circle"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 快速操作 -->
    <div class="quick-actions-panel mt-24px">
      <div class="actions-header">
        <div class="actions-title">
          <div class="title-icon i-mdi-lightning-bolt" />
          <span>快速操作</span>
        </div>
      </div>
      <NGrid :x-gap="16" :y-gap="16" responsive="screen" item-responsive class="mt-16px">
        <NGi span="24 s:12 m:6">
          <div class="action-card action-card-blue" @click="handlePublishCourse">
            <div class="action-icon">
              <div class="i-mdi-plus-circle text-28px" />
            </div>
            <div class="action-content">
              <div class="action-title">发布新课程</div>
              <div class="action-desc">创建并发布新的课程</div>
            </div>
          </div>
        </NGi>
        <NGi span="24 s:12 m:6">
          <div class="action-card action-card-green" @click="handlePublishAssignment">
            <div class="action-icon">
              <div class="i-mdi-clipboard-list text-28px" />
            </div>
            <div class="action-content">
              <div class="action-title">发布作业</div>
              <div class="action-desc">为学生布置新作业</div>
            </div>
          </div>
        </NGi>
        <NGi span="24 s:12 m:6">
          <div class="action-card action-card-orange" @click="handleSendNotification">
            <div class="action-icon">
              <div class="i-mdi-message-text text-28px" />
            </div>
            <div class="action-content">
              <div class="action-title">发送通知</div>
              <div class="action-desc">向学生发送消息通知</div>
            </div>
          </div>
        </NGi>
        <NGi span="24 s:12 m:6">
          <div class="action-card action-card-purple" @click="handleViewReport">
            <div class="action-icon">
              <div class="i-mdi-chart-line text-28px" />
            </div>
            <div class="action-content">
              <div class="action-title">查看报告</div>
              <div class="action-desc">查看教学数据报告</div>
            </div>
          </div>
        </NGi>
      </NGrid>
    </div>

    <!-- 教学日历和待办事项 -->
    <NGrid :x-gap="20" :y-gap="20" responsive="screen" item-responsive class="mt-24px">
      <NGi span="24 s:24 m:16">
        <div class="content-card card-equal-height">
          <div class="card-header">
            <div class="card-title">
              <div class="title-icon i-mdi-calendar-month" />
              <span>本周教学安排</span>
            </div>
            <NButton text type="primary" size="small">
              <template #icon>
                <div class="i-mdi-arrow-right" />
              </template>
              查看日历
            </NButton>
          </div>
          <div class="schedule-list">
            <div v-for="schedule in scheduleData" :key="schedule.course" class="schedule-item">
              <div class="schedule-time">
                <div class="time-day">{{ schedule.day }}</div>
                <div class="time-period">{{ schedule.time }}</div>
              </div>
              <div class="schedule-content">
                <div class="schedule-title">{{ schedule.course }}</div>
                <div class="schedule-location">
                  <span class="i-mdi-map-marker" />
                  {{ schedule.location }}
                </div>
                <div class="schedule-students">
                  <span class="i-mdi-account-group" />
                  {{ schedule.students }}人
                </div>
              </div>
              <div
                class="schedule-badge"
                :class="{
                  'badge-blue': schedule.type === 'exam',
                  'badge-green': schedule.type === 'class',
                  'badge-purple': schedule.type === 'lab'
                }"
              >
                {{ schedule.type === 'exam' ? '测验' : schedule.type === 'class' ? '课程' : '实验' }}
              </div>
            </div>
          </div>
        </div>
      </NGi>

      <NGi span="24 s:24 m:8">
        <div class="content-card card-equal-height">
          <div class="card-header">
            <div class="card-title">
              <div class="title-icon i-mdi-checkbox-marked-circle" />
              <span>待办事项</span>
            </div>
          </div>
          <div class="todo-input-section">
            <NInput
              v-model:value="todoInput"
              placeholder="输入待办事项内容..."
              clearable
              class="todo-input"
              @keyup.enter="addTodo"
            />
            <NSpace class="mt-12px" justify="space-between">
              <NButton type="primary" @click="addTodo">
                <template #icon>
                  <div class="i-mdi-plus" />
                </template>
                添加
              </NButton>
              <NButton secondary @click="clearTodoInput">
                <template #icon>
                  <div class="i-mdi-refresh" />
                </template>
                清空
              </NButton>
            </NSpace>
          </div>
          <div class="todo-list">
            <div
              v-for="todo in todoItems"
              :key="todo.id"
              class="todo-item"
              :class="{ 'todo-completed': todo.completed }"
              @click="toggleTodo(todo)"
            >
              <div class="todo-checkbox">
                <div :class="todo.completed ? 'i-mdi-check-circle' : 'i-mdi-checkbox-blank-circle-outline'" />
              </div>
              <div class="todo-content">
                <div class="todo-text">{{ todo.text }}</div>
                <div class="todo-meta">
                  <span :class="todo.completed ? 'i-mdi-check' : 'i-mdi-clock-outline'" />
                  {{ todo.meta }}
                </div>
              </div>
              <div class="todo-actions">
                <div
                  v-if="!todo.completed"
                  class="todo-priority"
                  :class="{
                    'priority-high': todo.priority === 'high',
                    'priority-medium': todo.priority === 'medium',
                    'priority-low': todo.priority === 'low'
                  }"
                />
                <NPopconfirm @positive-click="deleteTodo(todo)">
                  <template #trigger>
                    <button class="todo-delete-btn" type="button" @click.stop>
                      <div class="i-mdi-delete" />
                    </button>
                  </template>
                  确定删除此待办事项？
                </NPopconfirm>
              </div>
            </div>
          </div>
        </div>
      </NGi>
    </NGrid>

    <!-- 学生表现排行 -->
    <div class="content-card mt-16px">
      <div class="card-header">
        <div class="card-title">
          <div class="title-icon i-mdi-trophy" />
          <span>学生表现排行榜</span>
        </div>
        <NSpace>
          <NButton text type="primary" size="small" @click="$message.info('切换到本周数据')">本周</NButton>
          <NButton text size="small" @click="$message.info('切换到本月数据')">本月</NButton>
        </NSpace>
      </div>
      <div class="ranking-list">
        <div class="ranking-item ranking-top-1">
          <div class="ranking-medal">
            <div class="i-mdi-medal text-24px" />
          </div>
          <div class="ranking-avatar">李</div>
          <div class="ranking-info">
            <div class="ranking-name">李明</div>
            <div class="ranking-class">计算机2021-1班</div>
          </div>
          <div class="ranking-stats">
            <div class="stat-item-small">
              <div class="stat-label-small">平均分</div>
              <div class="stat-value-small">95</div>
            </div>
            <div class="stat-item-small">
              <div class="stat-label-small">出勤率</div>
              <div class="stat-value-small">100%</div>
            </div>
          </div>
        </div>
        <div class="ranking-item ranking-top-2">
          <div class="ranking-medal">
            <div class="i-mdi-medal text-24px" />
          </div>
          <div class="ranking-avatar">王</div>
          <div class="ranking-info">
            <div class="ranking-name">王芳</div>
            <div class="ranking-class">软件工程2021-2班</div>
          </div>
          <div class="ranking-stats">
            <div class="stat-item-small">
              <div class="stat-label-small">平均分</div>
              <div class="stat-value-small">92</div>
            </div>
            <div class="stat-item-small">
              <div class="stat-label-small">出勤率</div>
              <div class="stat-value-small">98%</div>
            </div>
          </div>
        </div>
        <div class="ranking-item ranking-top-3">
          <div class="ranking-medal">
            <div class="i-mdi-medal text-24px" />
          </div>
          <div class="ranking-avatar">陈</div>
          <div class="ranking-info">
            <div class="ranking-name">陈五</div>
            <div class="ranking-class">软件工程2021-1班</div>
          </div>
          <div class="ranking-stats">
            <div class="stat-item-small">
              <div class="stat-label-small">平均分</div>
              <div class="stat-value-small">90</div>
            </div>
            <div class="stat-item-small">
              <div class="stat-label-small">出勤率</div>
              <div class="stat-value-small">96%</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 教学数据概览 -->
    <NGrid :x-gap="20" :y-gap="20" responsive="screen" item-responsive class="mt-24px">
      <NGi span="24 s:24 m:16">
        <div class="content-card card-equal-height">
          <div class="card-header">
            <div class="card-title">
              <div class="title-icon i-mdi-chart-box" />
              <span>教学数据概览</span>
            </div>
            <NButton text type="primary" size="small">
              <template #icon>
                <div class="i-mdi-arrow-right" />
              </template>
              查看详情
            </NButton>
          </div>
          <div class="data-overview-grid">
            <div class="overview-item overview-item-blue">
              <div class="overview-icon-wrapper">
                <div class="i-mdi-book-open-variant text-24px" />
              </div>
              <div class="overview-content">
                <div class="overview-value">12</div>
                <div class="overview-label">授课课程</div>
                <div class="overview-progress">
                  <NProgress type="line" :percentage="75" :show-indicator="false" color="#3b82f6" />
                </div>
              </div>
            </div>
            <div class="overview-item overview-item-green">
              <div class="overview-icon-wrapper">
                <div class="i-mdi-clipboard-text text-24px" />
              </div>
              <div class="overview-content">
                <div class="overview-value">45</div>
                <div class="overview-label">已发布作业</div>
                <div class="overview-progress">
                  <NProgress type="line" :percentage="88" :show-indicator="false" color="#10b981" />
                </div>
              </div>
            </div>
            <div class="overview-item overview-item-orange">
              <div class="overview-icon-wrapper">
                <div class="i-mdi-account-multiple text-24px" />
              </div>
              <div class="overview-content">
                <div class="overview-value">156</div>
                <div class="overview-label">教授学生</div>
                <div class="overview-progress">
                  <NProgress type="line" :percentage="92" :show-indicator="false" color="#f59e0b" />
                </div>
              </div>
            </div>
            <div class="overview-item overview-item-purple">
              <div class="overview-icon-wrapper">
                <div class="i-mdi-clock-check text-24px" />
              </div>
              <div class="overview-content">
                <div class="overview-value">128</div>
                <div class="overview-label">教学时长(小时)</div>
                <div class="overview-progress">
                  <NProgress type="line" :percentage="64" :show-indicator="false" color="#8b5cf6" />
                </div>
              </div>
            </div>
          </div>

          <!-- 趋势对比 -->
          <div class="overview-trends">
            <div class="trend-item">
              <div class="trend-label">
                <span class="i-mdi-trending-up text-14px" />
                <span>较上周</span>
              </div>
              <div class="trend-values">
                <span class="trend-value trend-up">+8 课程</span>
                <span class="trend-value trend-up">+12 作业</span>
                <span class="trend-value trend-up">+15 学生</span>
              </div>
            </div>
          </div>
        </div>
      </NGi>

      <NGi span="24 s:24 m:8">
        <div class="content-card card-equal-height">
          <div class="card-header">
            <div class="card-title">
              <div class="title-icon i-mdi-bell-ring" />
              <span>系统通知</span>
            </div>
          </div>
          <div class="notification-list">
            <div v-for="notification in notifications" :key="notification.id" class="notification-item">
              <div class="notification-icon" :class="`notification-${notification.type}`">
                <div
                  :class="{
                    'i-mdi-information': notification.type === 'info',
                    'i-mdi-alert': notification.type === 'warning',
                    'i-mdi-check-circle': notification.type === 'success'
                  }"
                />
              </div>
              <div class="notification-content">
                <div class="notification-title">{{ notification.title }}</div>
                <div class="notification-text">{{ notification.content }}</div>
                <div class="notification-time">{{ notification.time }}</div>
              </div>
            </div>
          </div>
        </div>
      </NGi>
    </NGrid>

    <!-- 课程完成度和学生活跃度 -->
    <NGrid :x-gap="20" :y-gap="20" responsive="screen" item-responsive class="mt-24px">
      <NGi span="24 s:24 m:10">
        <div class="content-card card-equal-height">
          <div class="card-header">
            <div class="card-title">
              <div class="title-icon i-mdi-progress-check" />
              <span>课程完成度</span>
            </div>
          </div>
          <div class="course-completion-list">
            <div v-for="course in courseCompletionStats" :key="course.name" class="completion-item">
              <div class="completion-header">
                <div class="completion-name">{{ course.name }}</div>
                <div class="completion-percentage">{{ Math.round((course.assignments / 10) * 100) }}%</div>
              </div>
              <div class="completion-bar-wrapper">
                <div class="completion-bar" :style="{ width: `${(course.assignments / 10) * 100}%` }" />
              </div>
              <div class="completion-meta">
                <span>{{ course.assignments }}/10 章节</span>
                <span>{{ course.students }} 名学生</span>
              </div>
            </div>
          </div>

          <!-- 课程统计摘要 -->
          <div class="completion-summary">
            <div class="completion-stat">
              <div class="stat-icon-small">
                <div class="i-mdi-book-check text-16px" />
              </div>
              <div class="stat-info-small">
                <div class="stat-value-small">65%</div>
                <div class="stat-label-small">平均进度</div>
              </div>
            </div>
            <div class="completion-stat">
              <div class="stat-icon-small">
                <div class="i-mdi-account-group text-16px" />
              </div>
              <div class="stat-info-small">
                <div class="stat-value-small">156</div>
                <div class="stat-label-small">总学生</div>
              </div>
            </div>
            <div class="completion-stat">
              <div class="stat-icon-small">
                <div class="i-mdi-clock-fast text-16px" />
              </div>
              <div class="stat-info-small">
                <div class="stat-value-small">26</div>
                <div class="stat-label-small">待完成</div>
              </div>
            </div>
          </div>
        </div>
      </NGi>

      <NGi span="24 s:24 m:14">
        <div class="content-card card-equal-height">
          <div class="card-header">
            <div class="card-title">
              <div class="title-icon i-mdi-chart-timeline-variant" />
              <span>学生活跃度</span>
            </div>
          </div>
          <div class="activity-heatmap">
            <!-- 活跃度热力图 -->
            <div class="heatmap-grid">
              <div v-for="day in 7" :key="day" class="heatmap-day">
                <div class="heatmap-label">
                  {{ ['周一', '周二', '周三', '周四', '周五', '周六', '周日'][day - 1] }}
                </div>
                <div class="heatmap-cells">
                  <div
                    v-for="hour in 4"
                    :key="hour"
                    class="heatmap-cell"
                    :class="`heatmap-level-${Math.floor(Math.random() * 5)}`"
                    :title="`${['周一', '周二', '周三', '周四', '周五', '周六', '周日'][day - 1]} ${hour * 6}:00 - ${(hour + 1) * 6}:00`"
                  />
                </div>
              </div>
            </div>

            <!-- 活跃度图例 -->
            <div class="heatmap-legend">
              <span class="legend-label">活跃度：</span>
              <div class="legend-items">
                <div class="legend-item">
                  <div class="legend-cell heatmap-level-0" />
                  <span>低</span>
                </div>
                <div class="legend-item">
                  <div class="legend-cell heatmap-level-2" />
                  <span>中</span>
                </div>
                <div class="legend-item">
                  <div class="legend-cell heatmap-level-4" />
                  <span>高</span>
                </div>
              </div>
            </div>

            <!-- 活跃度统计摘要 -->
            <div class="activity-summary">
              <div class="summary-card summary-card-primary">
                <div class="summary-icon">
                  <div class="i-mdi-account-multiple-check text-20px" />
                </div>
                <div class="summary-info">
                  <div class="summary-value">142</div>
                  <div class="summary-label">活跃学生</div>
                </div>
              </div>
              <div class="summary-card summary-card-success">
                <div class="summary-icon">
                  <div class="i-mdi-clock-check text-20px" />
                </div>
                <div class="summary-info">
                  <div class="summary-value">3.2h</div>
                  <div class="summary-label">平均在线</div>
                </div>
              </div>
              <div class="summary-card summary-card-warning">
                <div class="summary-icon">
                  <div class="i-mdi-trending-up text-20px" />
                </div>
                <div class="summary-info">
                  <div class="summary-value">+15%</div>
                  <div class="summary-label">较上周</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </NGi>
    </NGrid>

    <!-- 课程弹窗 -->
    <NModal v-model:show="showCourseModal" preset="card" :title="`${selectedCourse?.name} - 课程详情`" class="w-600px">
      <div v-if="selectedCourse">
        <div class="course-detail-header">
          <div class="course-detail-icon">
            <div class="i-mdi-book text-32px" />
          </div>
          <div class="course-detail-info">
            <h3 class="course-detail-title">{{ selectedCourse.name }}</h3>
            <p class="course-detail-desc">{{ selectedCourse.description }}</p>
          </div>
        </div>
        <div class="course-detail-stats">
          <div class="detail-stat-item">
            <div class="detail-stat-label">学生人数</div>
            <div class="detail-stat-value">{{ selectedCourse.students }}</div>
          </div>
          <div class="detail-stat-item">
            <div class="detail-stat-label">作业数量</div>
            <div class="detail-stat-value">
              {{ selectedCourse.assignments }}
            </div>
          </div>
          <div class="detail-stat-item">
            <div class="detail-stat-label">平均分</div>
            <div class="detail-stat-value">{{ selectedCourse.avgScore }}</div>
          </div>
        </div>
        <div class="course-detail-actions">
          <NButton type="primary" block @click="showCourseModal = false">关闭</NButton>
        </div>
      </div>
    </NModal>

    <!-- 发布作业弹窗 -->
    <NModal v-model:show="showAssignmentModal" preset="card" title="发布新作业" class="w-500px">
      <NForm>
        <NFormItem label="作业标题">
          <NInput placeholder="请输入作业标题" />
        </NFormItem>
        <NFormItem label="选择课程">
          <NSelect placeholder="请选择课程" :options="courseStats.map(c => ({ label: c.name, value: c.name }))" />
        </NFormItem>
        <NFormItem label="截止日期">
          <NDatePicker type="datetime" placeholder="请选择截止日期" class="w-full" />
        </NFormItem>
        <NFormItem label="作业描述">
          <NInput type="textarea" placeholder="请输入作业描述" :rows="4" />
        </NFormItem>
      </NForm>
      <div class="modal-actions">
        <NButton @click="showAssignmentModal = false">取消</NButton>
        <NButton type="primary" @click="submitAssignment">发布</NButton>
      </div>
    </NModal>

    <!-- 发送通知弹窗 -->
    <NModal v-model:show="showNotificationModal" preset="card" title="发送通知" class="w-500px">
      <NForm>
        <NFormItem label="通知标题">
          <NInput placeholder="请输入通知标题" />
        </NFormItem>
        <NFormItem label="接收对象">
          <NSelect
            placeholder="请选择接收对象"
            :options="[
              { label: '全体学生', value: 'all' },
              { label: '指定班级', value: 'class' },
              { label: '指定学生', value: 'student' }
            ]"
          />
        </NFormItem>
        <NFormItem label="通知内容">
          <NInput type="textarea" placeholder="请输入通知内容" :rows="6" />
        </NFormItem>
      </NForm>
      <div class="modal-actions">
        <NButton @click="showNotificationModal = false">取消</NButton>
        <NButton type="primary" @click="sendNotification">发送</NButton>
      </div>
    </NModal>
  </div>
</template>

<style scoped>
/* 学习提醒 */
.learning-reminder {
  margin-top: 16px;
  padding: 16px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 12px;
  border: 1px solid #fcd34d;
}

.reminder-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-weight: 700;
  color: #92400e;
}

.reminder-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 6px;
}

.reminder-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.reminder-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #92400e;
}

.reminder-icon-small {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
}

/* 时间线样式增强 */
.timeline-item {
  margin-bottom: 16px;
  transition: all 0.3s;
  padding: 8px;
  border-radius: 10px;
}

.timeline-item:hover {
  background: #f9fafb;
}

.timeline-avatar {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: white;
  font-weight: 700;
  font-size: 14px;
  background: #667eea;
}

.timeline-avatar.avatar-1 {
  background: #667eea;
}

.timeline-avatar.avatar-2 {
  background: #10b981;
}

.timeline-avatar.avatar-3 {
  background: #f59e0b;
}

.timeline-avatar.avatar-4 {
  background: #8b5cf6;
}

.timeline-avatar.avatar-5 {
  background: #ef4444;
}

.timeline-action {
  margin-left: 8px;
  font-size: 11px;
}

.timeline-footer {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 动态统计 */
.dynamic-summary {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 2px solid #f3f4f6;
}

.dynamic-stat {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: white;
  border: 1px solid #f3f4f6;
  border-radius: 8px;
}

.dynamic-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  color: white;
}

.dynamic-icon-blue {
  background: #3b82f6;
}

.dynamic-icon-green {
  background: #10b981;
}

.dynamic-icon-orange {
  background: #f59e0b;
}

.dynamic-icon-purple {
  background: #8b5cf6;
}

.dynamic-value {
  font-size: 16px;
  font-weight: 800;
  color: #1f2937;
}

.dynamic-label {
  font-size: 11px;
  color: #6b7280;
  font-weight: 500;
}

/* 课程统计摘要 */
.course-summary {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 2px solid #f3f4f6;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px;
  background: rgb(50, 170, 146);
  border: 1px solid #f3f4f6;
  border-radius: 10px;
  transition: all 0.3s;
}

.summary-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-color: #667eea;
}

.summary-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
  border-radius: 8px;
  color: #667eea;
  flex-shrink: 0;
}

.summary-content {
  flex: 1;
  min-width: 0;
}

.summary-value {
  font-size: 16px;
  font-weight: 700;
  color: #374151;
  line-height: 1;
}

.summary-label {
  font-size: 11px;
  color: #6b7280;
  font-weight: 500;
  margin-top: 2px;
}

/* 优化的活动项 */
.activity-item-compact {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  transition: all 0.3s;
}

.activity-item-compact:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-color: #667eea;
}

.activity-icon-small {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  flex-shrink: 0;
}

.activity-content-small {
  flex: 1;
  min-width: 0;
}

.activity-main {
  display: flex;
  gap: 6px;
  align-items: center;
  flex-wrap: wrap;
}

.activity-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
  font-size: 11px;
  color: #9ca3af;
}

.activity-detail {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 快速操作面板 */
.quick-actions-panel {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 2px solid #f3f4f6;
}

.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.quick-action-small {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
}

.quick-action-small:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #667eea;
}

.quick-action-icon-small {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  color: white;
  flex-shrink: 0;
}

/* 优秀学生 */
.top-students-more {
  font-size: 11px;
  color: #667eea;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.3s;
}

.top-students-more:hover {
  color: #764ba2;
}

.student-course {
  font-size: 10px;
  color: #6b7280;
  margin-top: 2px;
}

/* 近期考试 */
.exam-location {
  font-size: 10px;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 2px;
  margin-top: 2px;
}

.exam-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.exam-item {
  background: #f9fafb;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #f3f4f6;
  transition: all 0.3s;
}

.exam-item:hover {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* 课程概览样式 - 重新设计 */
.course-overview {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 课程列表 */
.course-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.course-item {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.course-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: #667eea;
}

.course-item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.course-item-info {
  flex: 1;
  min-width: 0;
}

.course-item-name {
  font-size: 15px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 4px 0;
  line-height: 1.2;
}

.course-item-desc {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
}

.course-item-stats {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.course-stat {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-icon {
  font-size: 16px;
  color: #667eea;
  flex-shrink: 0;
}

.stat-text {
  font-size: 12px;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 8px;
}

.inline-progress {
  width: 80px;
  margin: 0;
}

/* 课程概览升级版样式 */
.course-overview-upgraded {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
}

.overview-stats-bar {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 14px 16px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  flex-shrink: 0;
}

.stat-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
}

.stat-pill.highlight {
  color: #f59e0b;
}

.stat-pill .stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
}

.stat-pill.highlight .stat-value {
  color: #f59e0b;
}

.stat-pill .stat-label {
  font-size: 12px;
  color: #94a3b8;
}

.stat-divider {
  width: 1px;
  height: 24px;
  background: #e2e8f0;
}

.course-cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  flex-shrink: 0;
}

.course-card-upgraded {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  transition: all 0.3s;
  cursor: pointer;
  position: relative;
  min-height: 80px;
}

.course-card-upgraded:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  border-color: #3b82f6;
}

.course-card-upgraded:active {
  transform: translateY(0);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* 移动端优化 */
@media (max-width: 640px) {
  .course-card-upgraded {
    min-height: 100px;
    padding: 4px;
  }

  .card-header {
    min-height: 52px;
    padding: 8px 0;
  }

  .card-header .n-button {
    min-height: 40px;
    min-width: 80px;
    font-size: 13px;
  }

  .quick-actions .n-button {
    min-height: 48px;
  }
}

.course-color-bar {
  height: 4px;
  width: 100%;
}

.course-card-content {
  padding: 14px;
}

.course-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.course-card-title {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  line-height: 1.3;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.score-badge {
  display: flex;
  align-items: baseline;
  padding: 4px 8px;
  border-radius: 8px;
  background: #f0f9ff;
}

.score-badge.excellent {
  background: #dcfce7;
}

.score-badge.good {
  background: #dbeafe;
}

.score-badge.warning {
  background: #fef3c7;
}

.score-value {
  font-size: 16px;
  font-weight: 700;
  color: #0ea5e9;
}

.score-badge.excellent .score-value {
  color: #16a34a;
}

.score-badge.good .score-value {
  color: #3b82f6;
}

.score-badge.warning .score-value {
  color: #d97706;
}

.score-unit {
  font-size: 10px;
  color: #94a3b8;
  margin-left: 2px;
}

.course-progress-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.mini-progress-ring {
  position: relative;
  width: 44px;
  height: 44px;
}

.mini-progress-ring svg {
  transform: rotate(-90deg);
  width: 100%;
  height: 100%;
}

.ring-bg {
  fill: none;
  stroke: #e2e8f0;
  stroke-width: 3;
}

.ring-fill {
  fill: none;
  stroke-width: 3;
  stroke-linecap: round;
  transition: stroke-dasharray 0.5s;
}

/* 课程趋势区域 */
.course-trend-section {
  margin-top: 0;
  padding: 12px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 12px;
  border: 1px solid #bae6fd;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.trend-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  flex-shrink: 0;
}

.trend-title {
  font-size: 13px;
  font-weight: 600;
  color: #0369a1;
}

.trend-bars {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-height: 0;
  justify-content: space-around;
}

.trend-bar-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.trend-bar-label {
  font-size: 11px;
  color: #64748b;
  min-width: 35px;
  font-weight: 500;
}

.trend-bar-bg {
  flex: 1;
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}

.trend-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%);
  border-radius: 3px;
  transition: width 0.5s ease;
}

/* 快捷操作 */
.quick-actions {
  margin-top: 0;
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.quick-actions .n-button {
  flex: 1;
  transition: all 0.3s ease;
  min-height: 44px;
}

.quick-actions .n-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.quick-actions .n-button:active {
  transform: translateY(0);
}

/* 最近通知 */
.recent-notifications {
  margin-top: 0;
  padding: 12px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  flex-shrink: 0;
}

.notif-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.notif-title {
  font-size: 12px;
  font-weight: 600;
  color: #334155;
}

.notif-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.notif-item {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  padding: 6px;
  border-radius: 6px;
  transition: background 0.2s;
}

.notif-item:hover {
  background: #f1f5f9;
}

.notif-item.unread {
  background: #eff6ff;
}

.notif-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #3b82f6;
  margin-top: 3px;
  flex-shrink: 0;
}

.notif-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.notif-text {
  font-size: 11px;
  color: #1e293b;
  line-height: 1.3;
}

.notif-time {
  font-size: 10px;
  color: #94a3b8;
}

.ring-percentage {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 10px;
  font-weight: 600;
  color: #64748b;
}

.progress-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.progress-label {
  font-size: 11px;
  color: #94a3b8;
}

.progress-trend {
  font-size: 12px;
  font-weight: 500;
}

.progress-trend.up {
  color: #10b981;
}

.progress-trend.stable {
  color: #3b82f6;
}

.progress-trend.down {
  color: #ef4444;
}

.course-card-footer {
  display: flex;
  justify-content: space-between;
  padding-top: 10px;
  border-top: 1px solid #f1f5f9;
}

.footer-stat {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #64748b;
}

.view-more-bar {
  display: flex;
  justify-content: center;
  padding-top: 8px;
}

@media (max-width: 640px) {
  .course-cards-grid {
    grid-template-columns: 1fr;
  }

  .overview-stats-bar {
    flex-wrap: wrap;
    gap: 12px;
  }

  .stat-divider {
    display: none;
  }
}

/* 课程概览图表 */
.course-overview-chart {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.chart-header h4 {
  font-size: 15px;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

.chart-placeholder {
  background: #f9fafb;
  border-radius: 8px;
  padding: 20px;
  min-height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-content {
  width: 100%;
  height: 100%;
}

/* 简化图表样式 */
.simplified-chart {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.course-comparison {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 300px;
}

.course-comparison-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.course-comparison-item:last-child {
  border-bottom: none;
}

.course-name {
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  min-width: 40px;
}

.course-score-tag {
  font-size: 14px;
  font-weight: 700;
  padding: 8px 16px;
  min-width: 60px;
  text-align: center;
}

/* 调整标签样式，使其更圆润突出 */
.course-score-tag:deep(.n-tag__content) {
  padding: 0;
}

.course-score-tag:deep(.n-tag__icon) {
  margin: 0;
}

.course-score-tag:deep(.n-tag) {
  transition: all 0.3s ease;
}

.course-score-tag:deep(.n-tag:hover) {
  transform: scale(1.05);
}

/* 紧凑模式样式 */
.course-list.compact {
  gap: 8px;
}

.course-item.compact {
  padding: 12px;
}

.course-item-header {
  margin-bottom: 8px;
}

.course-item-desc {
  display: none;
}

.course-item-stats.compact {
  gap: 16px;
}

.course-overview-chart.compact {
  padding: 12px;
}

.chart-header.compact {
  margin-bottom: 12px;
}

.chart-header.compact h4 {
  font-size: 14px;
}

.chart-placeholder.compact {
  padding: 16px;
  min-height: 140px;
}

.course-comparison.compact {
  gap: 10px;
}

.course-comparison-item.compact {
  padding: 6px 0;
}

.course-comparison-item.compact .course-name {
  font-size: 13px;
}

.course-score-tag.compact {
  font-size: 12px;
  padding: 6px 12px;
  min-width: 50px;
}

/* 填充空间样式 */
.course-comparison.fill-space {
  justify-content: space-between;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 调整6个课程项的间距，使其紧凑排列 */
.course-comparison.fill-space .course-comparison-item {
  padding: 8px 0;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* 调整图表占位符，确保高度固定 */
.chart-placeholder.compact {
  height: 180px;
  display: flex;
  align-items: stretch;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .course-item-stats {
    gap: 12px;
  }

  .course-stat {
    flex: 1;
    min-width: calc(50% - 6px);
  }

  .chart-placeholder {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .course-item-stats {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .course-stat {
    min-width: auto;
    width: 100%;
  }
}

/* 课程趋势样式 */
.course-trend {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 2px solid #f3f4f6;
}

.trend-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.trend-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.trend-chart {
  height: 120px;
  background: #f9fafb;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.trend-placeholder {
  opacity: 0.5;
}

/* 实时动态样式 */
.activity-feed {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 8px;
}

.activity-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  transition: all 0.3s;
}

.activity-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-color: #667eea;
}

.activity-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  flex-shrink: 0;
}

.icon-submission {
  background: #dbeafe;
  color: #3b82f6;
}

.icon-question {
  background: #e0f2fe;
  color: #0ea5e9;
}

.icon-experiment {
  background: #d1fae5;
  color: #10b981;
}

.icon-score {
  background: #fef3c7;
  color: #f59e0b;
}

.icon-code {
  background: #f3e8ff;
  color: #8b5cf6;
}

.icon-upload {
  background: #fee2e2;
  color: #ef4444;
}

.activity-content {
  flex: 1;
  min-width: 0;
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.activity-student {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}

.activity-time {
  font-size: 11px;
  color: #9ca3af;
}

.activity-body {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 8px;
}

.activity-action {
  font-weight: 500;
  color: #374151;
  margin-right: 4px;
}

.activity-course {
  color: #667eea;
  margin-right: 4px;
}

.activity-detail {
  color: #6b7280;
  font-size: 11px;
}

.activity-footer {
  display: flex;
  gap: 8px;
  align-items: center;
}

/* 快捷操作样式 */
.quick-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 2px solid #f3f4f6;
}

.quick-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
}

.quick-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #667eea;
}

.quick-action-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: white;
}

.quick-action-name {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
}

.icon-blue {
  background: #3b82f6;
}

.icon-green {
  background: #10b981;
}

.icon-purple {
  background: #8b5cf6;
}

.icon-orange {
  background: #f59e0b;
}
.teacher-dashboard {
  padding: 24px;
  min-height: 100vh;
  background: linear-gradient(180deg, #f9fafb 0%, #ffffff 100%);
}

/* 欢迎横幅 - 升级版 */
.welcome-banner {
  position: relative;
  padding: 32px 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #6b30d8 100%);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.4);
  margin-bottom: 8px;
}

.banner-bg-decoration {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.bg-shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.15;
}

.bg-shape-1 {
  width: 300px;
  height: 300px;
  background: #fff;
  top: -100px;
  right: -50px;
  animation: float 15s ease-in-out infinite;
}

.bg-shape-2 {
  width: 200px;
  height: 200px;
  background: #fbbf24;
  bottom: -80px;
  left: 20%;
  animation: float 12s ease-in-out infinite reverse;
}

.bg-shape-3 {
  width: 150px;
  height: 150px;
  background: #10b981;
  top: 20%;
  left: -30px;
  animation: float 10s ease-in-out infinite;
}

.bg-line {
  position: absolute;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
}

.bg-line-1 {
  width: 200px;
  top: 30%;
  right: 20%;
  animation: lineMove 8s ease-in-out infinite;
}

.bg-line-2 {
  width: 150px;
  bottom: 40%;
  right: 30%;
  animation: lineMove 10s ease-in-out infinite reverse;
}

@keyframes lineMove {
  0%,
  100% {
    transform: translateX(-30px);
    opacity: 0;
  }
  50% {
    transform: translateX(30px);
    opacity: 0.5;
  }
}

.banner-content {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.banner-left {
  display: flex;
  align-items: center;
  gap: 28px;
}

.banner-avatar-wrapper {
  position: relative;
}

.banner-avatar {
  position: relative;
  width: 90px;
  height: 90px;
  border-radius: 24px;
  overflow: hidden;
  border: 4px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
}

.banner-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-status-dot {
  position: absolute;
  bottom: 6px;
  right: 6px;
  width: 16px;
  height: 16px;
  background: #10b981;
  border-radius: 50%;
  border: 3px solid #667eea;
}

.avatar-glow {
  position: absolute;
  inset: -10px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
  animation: glow 3s ease-in-out infinite;
}

@keyframes glow {
  0%,
  100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
}

.banner-info {
  flex: 1;
}

.banner-greeting {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.greeting-icon {
  font-size: 20px;
}

.greeting-text {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

.banner-title {
  font-size: 28px;
  font-weight: 800;
  color: #fff;
  margin: 0 0 12px 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  letter-spacing: 0.5px;
}

.banner-subtitle {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 0 0 16px 0;
  flex-wrap: wrap;
}

.subtitle-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.95);
}

.subtitle-item strong {
  font-weight: 700;
  color: #fef3c7;
}

.subtitle-divider {
  color: rgba(255, 255, 255, 0.4);
}

.banner-badges {
  display: flex;
  gap: 16px;
}

.badge-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.banner-right {
  flex-shrink: 0;
}

.quick-stats {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 20px 28px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.quick-stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.quick-stat-value {
  font-size: 28px;
  font-weight: 800;
  color: #fff;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.quick-stat-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
}

.quick-stat-divider {
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.3);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .welcome-banner {
    padding: 24px;
  }

  .banner-content {
    flex-direction: column;
    gap: 24px;
  }

  .banner-left {
    flex-direction: column;
    text-align: center;
  }

  .banner-subtitle {
    justify-content: center;
  }

  .banner-badges {
    justify-content: center;
  }

  .banner-right {
    width: 100%;
  }

  .quick-stats {
    justify-content: center;
  }
}

/* 旧的欢迎横幅样式（保留兼容性） */
.welcome-banner-old {
  position: relative;
  padding: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.35);
  margin-bottom: 8px;
}

.banner-content-old {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 24px;
}

.banner-avatar-old {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 20px;
  overflow: hidden;
  border: 4px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.banner-avatar-old img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-badge {
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 28px;
  height: 28px;
  background: #10b981;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  border: 3px solid #667eea;
}

.banner-info-old {
  flex: 1;
}

.banner-title-old {
  font-size: 32px;
  font-weight: 900;
  color: #fff;
  margin: 0 0 12px 0;
  text-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
  letter-spacing: 0.5px;
}

.banner-subtitle-old {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  font-weight: 500;
}

.banner-decoration-old {
  position: absolute;
  top: 0;
  right: 0;
  width: 300px;
  height: 100%;
  pointer-events: none;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.decoration-circle-1 {
  width: 150px;
  height: 150px;
  top: -50px;
  right: -30px;
  animation: float 8s ease-in-out infinite;
}

.decoration-circle-2 {
  width: 100px;
  height: 100px;
  top: 60px;
  right: 80px;
  animation: float 10s ease-in-out infinite;
}

.decoration-circle-3 {
  width: 80px;
  height: 80px;
  bottom: -20px;
  right: 150px;
  animation: float 12s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

/* 统计卡片 - 升级版 */
.stat-card {
  display: flex;
  align-items: stretch;
  padding: 0;
  background: #fff;
  border-radius: 16px;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  height: 120px;
  overflow: hidden;
  position: relative;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
}

.stat-card:hover .stat-glow {
  opacity: 1;
}

.stat-card-bg {
  width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.stat-card-pink .stat-card-bg {
  background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
}

.stat-card-purple .stat-card-bg {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.stat-card-blue .stat-card-bg {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.stat-card-orange .stat-card-bg {
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
}

.stat-card-icon {
  color: white;
  opacity: 0.9;
}

.stat-content {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 2;
}

.stat-card .stat-label {
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 8px;
}

.stat-card .stat-value {
  font-size: 32px;
  font-weight: 800;
  color: #1f2937;
  line-height: 1;
  margin-bottom: 8px;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #6b7280;
}

.stat-trend.success {
  color: #10b981;
}

.stat-glow {
  position: absolute;
  right: -30px;
  top: -30px;
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s;
}

/* 旧版统计卡片样式保留 */
.stat-card-old {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 28px;
  background: #fff;
  border-radius: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  height: 100%;
}

/* 纯色背景卡片 */
.stat-card-pink {
  background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
  color: white;
}

.stat-card-purple {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
}

.stat-card-blue {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.stat-card-orange {
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  color: white;
}

/* 卡片图标 */
.stat-icon {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  flex-shrink: 0;
  overflow: visible;
}

.stat-icon div {
  color: white !important;
  font-size: 32px !important;
  line-height: 1 !important;
  width: auto !important;
  height: auto !important;
}

/* 卡片信息 */
.stat-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

/* 卡片标签 */
.stat-label {
  font-size: 16px;
  font-weight: 500;
  opacity: 0.9;
  margin-bottom: 8px;
  color: inherit;
}

/* 卡片数值 */
.stat-value {
  font-size: 36px;
  font-weight: 800;
  line-height: 1;
  color: inherit;
  background: none;
  -webkit-background-clip: none;
  background-clip: none;
  -webkit-text-fill-color: inherit;
  margin-bottom: 0;
  letter-spacing: -0.5px;
}

/* 卡片悬停效果 */
.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

/* 内容卡片 */
.content-card {
  background: #fff;
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.4s;
  border: 1px solid rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
}

.content-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

/* 等高卡片 */
.card-equal-height {
  height: 100%;
}

.card-equal-height .course-list,
.card-equal-height .submission-list,
.card-equal-height .schedule-list,
.card-equal-height .todo-list,
.card-equal-height .notification-list,
.card-equal-height .course-completion-list,
.card-equal-height .activity-heatmap,
.card-equal-height .data-overview-grid,
.card-equal-height .course-overview-upgraded {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f3f4f6;
  position: relative;
  min-height: 44px;
}

.card-header .n-button {
  transition: all 0.3s ease;
  min-height: 32px;
  min-width: 60px;
}

.card-header .n-button:hover {
  transform: translateX(4px);
  color: #3b82f6;
}

.card-header .n-button:active {
  transform: translateX(2px);
}

.card-header::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
}

.card-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 19px;
  font-weight: 800;
  color: #1f2937;
  letter-spacing: 0.3px;
}

.title-icon {
  font-size: 24px;
  color: #667eea;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 课程网格 */
.course-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
}

.course-card {
  background: #fff;
  border: 2px solid #f3f4f6;
  border-radius: 10px;
  padding: 10px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.course-card:hover {
  border-color: #667eea;
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.15);
}

.course-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.course-card-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  color: #fff;
}

.course-card-badge {
  font-size: 14px;
  font-weight: 800;
  color: #667eea;
  background: #ede9fe;
  padding: 3px 6px;
  border-radius: 5px;
  min-width: 24px;
  text-align: center;
}

.course-card-body {
  flex: 1;
}

.course-card-title {
  font-size: 13px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
}

.course-card-stats {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-mini {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 10px;
  color: #6b7280;
}

.course-card-footer {
  padding-top: 4px;
  border-top: 1px solid #f3f4f6;
}

/* 课程统计摘要 */
.course-summary {
  display: flex;
  justify-content: space-around;
  margin-top: 1px;
  padding-top: 10px;
  border-top: 2px solid #f3f4f6;
}

.summary-item-compact {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
}

.summary-label-compact {
  font-size: 10px;
  color: #6b7280;
  font-weight: 500;
}

.summary-value-compact {
  font-size: 18px;
  font-weight: 800;
  color: #667eea;
}

/* 近期考试 */
.upcoming-exams {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 2px solid #f3f4f6;
}

.exams-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.exams-title {
  font-size: 13px;
  font-weight: 700;
  color: #1f2937;
}

.exams-count {
  font-size: 11px;
  font-weight: 600;
  color: #667eea;
  background: #ede9fe;
  padding: 2px 8px;
  border-radius: 5px;
}

.exam-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.exam-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: #f9fafb;
  border-radius: 8px;
  transition: all 0.3s;
  cursor: pointer;
  border: 2px solid transparent;
}

.exam-item:hover {
  background: #fff;
  border-color: #e5e7eb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.exam-date {
  width: 40px;
  height: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  color: #fff;
  flex-shrink: 0;
}

.date-day {
  font-size: 16px;
  font-weight: 800;
  line-height: 1;
}

.date-month {
  font-size: 9px;
  font-weight: 600;
  margin-top: 2px;
}

.exam-info {
  flex: 1;
  min-width: 0;
}

.exam-name {
  font-size: 12px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.exam-meta {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 10px;
  color: #6b7280;
}

.exam-status {
  font-size: 9px;
  font-weight: 600;
  padding: 3px 6px;
  border-radius: 5px;
  flex-shrink: 0;
}

.status-upcoming {
  background: #fef3c7;
  color: #d97706;
}

.status-scheduled {
  background: #dbeafe;
  color: #2563eb;
}

/* 优秀学生 */
.top-students {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 2px solid #f3f4f6;
}

.top-students-header {
  margin-bottom: 10px;
}

.top-students-title {
  font-size: 13px;
  font-weight: 700;
  color: #1f2937;
}

.top-students-list {
  display: flex;
  gap: 8px;
}

.top-student-item {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 8px;
  background: #f9fafb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.top-student-item:hover {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.student-rank {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 10px;
  font-weight: 800;
  color: #fff;
  flex-shrink: 0;
}

.rank-1 {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
}

.rank-2 {
  background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
}

.rank-3 {
  background: linear-gradient(135deg, #fb923c 0%, #ea580c 100%);
}

.student-avatar {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}

.student-info {
  flex: 1;
  min-width: 0;
}

.student-name {
  font-size: 11px;
  font-weight: 600;
  color: #1f2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.student-score {
  font-size: 10px;
  color: #10b981;
  font-weight: 700;
}

/* 时间线列表 */
.timeline-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  flex: 1;
  position: relative;
  justify-content: space-between;
}

.timeline-list::before {
  content: '';
  position: absolute;
  left: 3px;
  top: 12px;
  bottom: 12px;
  width: 2px;
  background: linear-gradient(180deg, #e5e7eb 0%, transparent 100%);
}

.timeline-item {
  display: flex;
  gap: 10px;
  padding: 8px 0;
  position: relative;
}

.timeline-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 3px;
  position: relative;
  z-index: 1;
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dot-submitted {
  background: #3b82f6;
}

.dot-graded {
  background: #10b981;
}

.dot-pending {
  background: #f59e0b;
}

.timeline-content {
  flex: 1;
  background: #f9fafb;
  border-radius: 8px;
  padding: 8px;
  transition: all 0.3s;
  cursor: pointer;
  border: 2px solid transparent;
}

.timeline-content:hover {
  background: #fff;
  border-color: #e5e7eb;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.timeline-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}

.timeline-avatar {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 6px;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}

.timeline-info {
  flex: 1;
}

.timeline-student {
  font-size: 12px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1px;
}

.timeline-time {
  font-size: 9px;
  color: #9ca3af;
}

.timeline-body {
  margin-bottom: 6px;
}

.timeline-course {
  font-size: 10px;
  font-weight: 600;
  color: #667eea;
  margin-bottom: 2px;
}

.timeline-assignment {
  font-size: 11px;
  color: #6b7280;
}

.timeline-footer {
  display: flex;
  justify-content: flex-end;
}

/* 动态统计 */
.dynamic-summary {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 2px solid #f3f4f6;
}

.dynamic-stat {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  background: #f9fafb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.dynamic-stat:hover {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.dynamic-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  flex-shrink: 0;
}

.dynamic-icon-blue {
  background: #dbeafe;
  color: #3b82f6;
}

.dynamic-icon-green {
  background: #d1fae5;
  color: #10b981;
}

.dynamic-icon-orange {
  background: #fef3c7;
  color: #f59e0b;
}

.dynamic-info {
  flex: 1;
  min-width: 0;
}

.dynamic-value {
  font-size: 16px;
  font-weight: 800;
  color: #1f2937;
  line-height: 1.2;
}

.dynamic-label {
  font-size: 10px;
  color: #6b7280;
  font-weight: 500;
}

/* 快捷入口 */
.quick-entry {
  display: flex;
  gap: 10px;
  margin-top: 14px;
  padding-top: 14px;
  border-top: 2px solid #f3f4f6;
}

.entry-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 8px;
  background: #f9fafb;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 11px;
  color: #4b5563;
  font-weight: 500;
}

.entry-item:hover {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.entry-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.entry-icon-blue {
  background: #dbeafe;
  color: #3b82f6;
}

.entry-icon-green {
  background: #d1fae5;
  color: #10b981;
}

.entry-icon-purple {
  background: #ede9fe;
  color: #8b5cf6;
}

/* 课程动态行等高 */
.course-dynamic-row :deep(.n-grid-item) {
  display: flex;
}

.course-dynamic-row .content-card {
  width: 100%;
}

/* 本周提交趋势 */
.weekly-trend-section {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 2px solid #f3f4f6;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.section-title {
  font-size: 13px;
  font-weight: 700;
  color: #1f2937;
}

.mini-chart {
  background: #f9fafb;
  border-radius: 10px;
  padding: 16px;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 80px;
  gap: 8px;
}

.chart-bar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  height: 100%;
}

.chart-bar {
  width: 100%;
  max-width: 24px;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px 4px 0 0;
  transition: all 0.3s;
  margin-top: auto;
}

.chart-bar-item:hover .chart-bar {
  transform: scaleY(1.05);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.chart-label {
  font-size: 10px;
  color: #6b7280;
  font-weight: 500;
}

/* 快速提醒 */
.quick-reminders {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 2px solid #f3f4f6;
}

.reminder-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.reminder-title {
  font-size: 13px;
  font-weight: 700;
  color: #1f2937;
}

.reminder-count {
  font-size: 11px;
  font-weight: 600;
  color: #f59e0b;
  background: #fef3c7;
  padding: 2px 8px;
  border-radius: 5px;
}

.reminder-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.reminder-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: #f9fafb;
  border-radius: 8px;
  font-size: 12px;
  color: #4b5563;
  transition: all 0.3s;
  cursor: pointer;
}

.reminder-item:hover {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.reminder-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.reminder-urgent .reminder-dot {
  background: #ef4444;
  box-shadow: 0 0 6px rgba(239, 68, 68, 0.4);
}

.reminder-normal .reminder-dot {
  background: #3b82f6;
}

/* 本周统计 */
.weekly-stats {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 8px 0;
}

.stat-row {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 12px;
  border-radius: 12px;
  transition: all 0.3s;
}

.stat-row:hover {
  background: #f9fafb;
}

.stat-day {
  width: 70px;
  font-size: 15px;
  font-weight: 700;
  color: #1f2937;
  flex-shrink: 0;
  letter-spacing: 0.3px;
}

.stat-bars {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-bar-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.bar-label {
  width: 80px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #6b7280;
  flex-shrink: 0;
}

.bar-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.bar-dot-blue {
  background: #3b82f6;
}

.bar-dot-green {
  background: #10b981;
}

.bar-wrapper {
  flex: 1;
  height: 28px;
  background: #f3f4f6;
  border-radius: 14px;
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.06);
}

.bar-fill {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 10px;
  border-radius: 14px;
  transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.bar-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, transparent 100%);
  border-radius: 14px 14px 0 0;
}

.bar-fill-blue {
  background: linear-gradient(90deg, #60a5fa 0%, #3b82f6 100%);
}

.bar-fill-green {
  background: linear-gradient(90deg, #34d399 0%, #10b981 100%);
}

.bar-value {
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  position: relative;
  z-index: 1;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* 动态宽度类 */
.bar-width-64 {
  width: 64%;
}

.bar-width-76 {
  width: 76%;
}

.bar-width-84 {
  width: 84%;
}

.bar-width-70 {
  width: 70%;
}

.bar-width-56 {
  width: 56%;
}

.bar-width-56 {
  width: 56%;
}

.bar-width-70 {
  width: 70%;
}

.bar-width-80 {
  width: 80%;
}

.bar-width-64 {
  width: 64%;
}

.bar-width-50 {
  width: 50%;
}

.stat-progress {
  flex-shrink: 0;
}

.progress-circle {
  width: 60px;
}

/* 教学数据概览 */
.data-overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.overview-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border-radius: 12px;
  transition: all 0.3s;
  cursor: pointer;
}

.overview-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.overview-item-blue {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
}

.overview-item-green {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
}

.overview-item-orange {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
}

.overview-item-purple {
  background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
}

.overview-icon-wrapper {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  flex-shrink: 0;
}

.overview-item-blue .overview-icon-wrapper {
  color: #3b82f6;
}

.overview-item-green .overview-icon-wrapper {
  color: #10b981;
}

.overview-item-orange .overview-icon-wrapper {
  color: #f59e0b;
}

.overview-item-purple .overview-icon-wrapper {
  color: #8b5cf6;
}

.overview-content {
  flex: 1;
}

.overview-value {
  font-size: 28px;
  font-weight: 800;
  color: #1f2937;
  line-height: 1.2;
  margin-bottom: 4px;
}

.overview-label {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 8px;
}

.overview-progress {
  margin-top: 8px;
}

/* 趋势对比 */
.overview-trends {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 2px solid #f3f4f6;
}

.trend-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border-radius: 12px;
  border-left: 4px solid #10b981;
}

.trend-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #065f46;
}

.trend-label .i-mdi-trending-up {
  color: #10b981;
}

.trend-values {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.trend-value {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.7);
}

.trend-up {
  color: #059669;
}

/* 系统通知 */
.notification-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notification-item {
  display: flex;
  gap: 12px;
  padding: 14px;
  background: #f9fafb;
  border-radius: 10px;
  transition: all 0.3s;
  cursor: pointer;
}

.notification-item:hover {
  background: #f3f4f6;
  transform: translateX(4px);
}

.notification-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  flex-shrink: 0;
  font-size: 20px;
  color: #fff;
}

.notification-info {
  background: #3b82f6;
}

.notification-warning {
  background: #f59e0b;
}

.notification-success {
  background: #10b981;
}

.notification-content {
  flex: 1;
}

.notification-title {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.notification-text {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 6px;
}

.notification-time {
  font-size: 11px;
  color: #9ca3af;
}

/* 课程完成度 */
.course-completion-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.completion-item {
  padding: 10px 12px;
  background: #f9fafb;
  border-radius: 10px;
  transition: all 0.3s;
}

.completion-item:hover {
  background: #f3f4f6;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.completion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.completion-name {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.completion-percentage {
  font-size: 16px;
  font-weight: 800;
  color: #667eea;
}

.completion-bar-wrapper {
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 6px;
}

.completion-bar {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 3px;
  transition: width 1s ease-out;
}

.completion-meta {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #6b7280;
}

/* 课程统计摘要 */
.completion-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: auto;
  padding-top: 16px;
  border-top: 2px solid #f3f4f6;
}

.completion-stat {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 10px;
  transition: all 0.3s;
  cursor: pointer;
}

.completion-stat:hover {
  background: #f3f4f6;
  transform: translateY(-2px);
}

.stat-icon-small {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 8px;
  color: #667eea;
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.stat-info-small {
  flex: 1;
}

.stat-value-small {
  font-size: 16px;
  font-weight: 800;
  color: #1f2937;
  line-height: 1.2;
  margin-bottom: 2px;
}

.stat-label-small {
  font-size: 11px;
  color: #6b7280;
  font-weight: 500;
}

/* 学生活跃度热力图 */
.activity-heatmap {
  padding: 16px;
}

.heatmap-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.heatmap-day {
  display: flex;
  align-items: center;
  gap: 12px;
}

.heatmap-label {
  width: 50px;
  font-size: 12px;
  color: #6b7280;
  flex-shrink: 0;
}

.heatmap-cells {
  display: flex;
  gap: 4px;
  flex: 1;
}

.heatmap-cell {
  flex: 1;
  height: 24px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.heatmap-cell:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.heatmap-level-0 {
  background: #f3f4f6;
}

.heatmap-level-1 {
  background: #c7d2fe;
}

.heatmap-level-2 {
  background: #a5b4fc;
}

.heatmap-level-3 {
  background: #818cf8;
}

.heatmap-level-4 {
  background: #6366f1;
}

.heatmap-legend {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.legend-label {
  font-size: 12px;
  color: #6b7280;
}

.legend-items {
  display: flex;
  gap: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #6b7280;
}

.legend-cell {
  width: 16px;
  height: 16px;
  border-radius: 3px;
}

/* 活跃度统计摘要 */
.activity-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: auto;
  padding-top: 16px;
  border-top: 2px solid #f3f4f6;
}

.summary-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 10px;
  transition: all 0.3s;
  cursor: pointer;
}

.summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.summary-card-primary {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
}

.summary-card-success {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
}

.summary-card-warning {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
}

.summary-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  flex-shrink: 0;
}

.summary-card-primary .summary-icon {
  color: #3b82f6;
}

.summary-card-success .summary-icon {
  color: #10b981;
}

.summary-card-warning .summary-icon {
  color: #f59e0b;
}

.summary-info {
  flex: 1;
}

.summary-value {
  font-size: 18px;
  font-weight: 800;
  color: #1f2937;
  line-height: 1.2;
  margin-bottom: 2px;
}

.summary-label {
  font-size: 11px;
  color: #6b7280;
  font-weight: 500;
}

/* 课程详情弹窗 */
.course-detail-header {
  display: flex;
  gap: 20px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f3f4f6;
}

.course-detail-icon {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  color: #fff;
  flex-shrink: 0;
}

.course-detail-info {
  flex: 1;
}

.course-detail-title {
  font-size: 22px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.course-detail-desc {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.course-detail-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.detail-stat-item {
  text-align: center;
  padding: 16px;
  background: #f9fafb;
  border-radius: 12px;
}

.detail-stat-label {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 8px;
}

.detail-stat-value {
  font-size: 24px;
  font-weight: 800;
  color: #667eea;
}

.course-detail-actions {
  display: flex;
  gap: 12px;
}

/* 弹窗操作按钮 */
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

/* 排行榜样式 */
.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ranking-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #f9fafb;
  border-radius: 14px;
  transition: all 0.3s;
  cursor: pointer;
  overflow: hidden;
}

.ranking-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: #d1d5db;
}

.ranking-item:hover {
  background: #f3f4f6;
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.ranking-top-1::before {
  background: linear-gradient(180deg, #fbbf24 0%, #f59e0b 100%);
}

.ranking-top-2::before {
  background: linear-gradient(180deg, #9ca3af 0%, #6b7280 100%);
}

.ranking-top-3::before {
  background: linear-gradient(180deg, #fb923c 0%, #ea580c 100%);
}

.ranking-medal {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  flex-shrink: 0;
}

.ranking-top-1 .ranking-medal {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #f59e0b;
}

.ranking-top-2 .ranking-medal {
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  color: #6b7280;
}

.ranking-top-3 .ranking-medal {
  background: linear-gradient(135deg, #fed7aa 0%, #fdba74 100%);
  color: #ea580c;
}

.ranking-avatar {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 14px;
  color: #fff;
  font-size: 22px;
  font-weight: 700;
  flex-shrink: 0;
}

.ranking-info {
  flex: 1;
}

.ranking-name {
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
}

.ranking-class {
  font-size: 13px;
  color: #6b7280;
}

.ranking-stats {
  display: flex;
  gap: 20px;
}

.stat-item-small {
  text-align: center;
  padding: 8px 16px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.stat-label-small {
  font-size: 11px;
  color: #6b7280;
  margin-bottom: 4px;
}

.stat-value-small {
  font-size: 18px;
  font-weight: 800;
  color: #667eea;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .teacher-dashboard {
    padding: 16px;
  }

  .welcome-banner {
    padding: 24px;
  }

  .banner-title {
    font-size: 24px;
  }

  .banner-subtitle {
    font-size: 14px;
  }

  .stat-card {
    padding: 20px;
  }

  .stat-value {
    font-size: 32px;
  }

  .content-card {
    padding: 20px;
  }

  .card-equal-height {
    min-height: auto;
  }

  .data-overview-grid {
    grid-template-columns: 1fr;
  }

  .overview-item {
    padding: 16px;
  }

  .overview-value {
    font-size: 24px;
  }

  .ranking-stats {
    flex-direction: column;
    gap: 8px;
  }

  .stat-item-small {
    padding: 6px 12px;
  }

  .heatmap-label {
    width: 40px;
    font-size: 11px;
  }

  .heatmap-cell {
    height: 20px;
  }

  .action-card {
    padding: 18px;
  }

  .weekly-stats {
    gap: 16px;
  }

  .stat-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .stat-day {
    width: 100%;
  }

  .stat-bars {
    width: 100%;
  }

  .stat-progress {
    align-self: center;
  }
}

/* 快速操作面板 */
.quick-actions-panel {
  background: #fff;
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.actions-header {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f3f4f6;
  position: relative;
}

.actions-header::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%);
}

.actions-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 19px;
  font-weight: 800;
  color: #1f2937;
  letter-spacing: 0.3px;
}

.actions-title .title-icon {
  color: #f59e0b;
  font-size: 24px;
}

.action-card {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 24px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  border: 2px solid transparent;
}

.action-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.6s;
}

.action-card:hover::before {
  left: 100%;
}

.action-card:hover {
  transform: translateY(-6px) scale(1.03);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
  border-color: rgba(255, 255, 255, 0.5);
}

.action-card-blue {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
}

.action-card-green {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
}

.action-card-orange {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
}

.action-card-purple {
  background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
}

.action-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 14px;
  flex-shrink: 0;
  transition: all 0.3s;
}

.action-card-blue .action-icon {
  color: #3b82f6;
}

.action-card-green .action-icon {
  color: #10b981;
}

.action-card-orange .action-icon {
  color: #f59e0b;
}

.action-card-purple .action-icon {
  color: #8b5cf6;
}

.action-card:hover .action-icon {
  transform: scale(1.1) rotate(5deg);
}

.action-content {
  flex: 1;
  text-align: center;
}

.action-title {
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
}

.action-desc {
  font-size: 13px;
  color: #6b7280;
}

/* 教学日历 */
.schedule-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.schedule-item {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 18px;
  background: #f9fafb;
  border-radius: 14px;
  border-left: 5px solid #667eea;
  transition: all 0.4s;
  cursor: pointer;
  border: 2px solid transparent;
  border-left: 5px solid #667eea;
}

.schedule-item:hover {
  background: #fff;
  transform: translateX(6px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: #e5e7eb;
  border-left-color: #667eea;
}

.schedule-time {
  text-align: center;
  flex-shrink: 0;
}

.time-day {
  font-size: 14px;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 4px;
}

.time-period {
  font-size: 12px;
  color: #6b7280;
}

.schedule-content {
  flex: 1;
}

.schedule-title {
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 6px;
}

.schedule-location {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 6px;
}

.schedule-students {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #9ca3af;
}

.schedule-badge {
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.badge-blue {
  background: #dbeafe;
  color: #3b82f6;
}

.badge-green {
  background: #d1fae5;
  color: #10b981;
}

.badge-purple {
  background: #ede9fe;
  color: #8b5cf6;
}

/* 待办事项 */
.todo-input-section {
  margin-bottom: 16px;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.todo-input .n-input {
  background: white;
  border: none;
  font-size: 14px;
}

.todo-input .n-input__input-el {
  padding: 12px 16px;
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 480px;
  overflow-y: auto;
  padding: 4px;
}

.todo-list::-webkit-scrollbar {
  width: 6px;
}

.todo-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.todo-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.todo-list::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

.todo-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 12px;
  transition: all 0.4s;
  cursor: pointer;
  border: 2px solid transparent;
}

.todo-item:hover {
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: #e5e7eb;
}

.todo-completed {
  opacity: 0.6;
}

.todo-completed .todo-text {
  text-decoration: line-through;
}

.todo-priority {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-left: 8px;
}

.priority-high {
  background: #ef4444;
  box-shadow: 0 0 8px rgba(239, 68, 68, 0.5);
}

.priority-medium {
  background: #f59e0b;
  box-shadow: 0 0 8px rgba(245, 158, 11, 0.5);
}

.priority-low {
  background: #6b7280;
}

.todo-checkbox {
  font-size: 20px;
  color: #667eea;
  flex-shrink: 0;
  margin-top: 2px;
}

.todo-completed .todo-checkbox {
  color: #10b981;
}

.todo-content {
  flex: 1;
}

.todo-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.todo-text {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 4px;
}

.todo-meta {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #6b7280;
}

.todo-delete-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  transition: all 0.3s ease;
  font-size: 18px;
}

.todo-item:hover .todo-delete-btn {
  opacity: 1;
}

.todo-delete-btn:hover {
  background: #fee2e2;
  color: #ef4444;
}

.todo-delete-btn:active {
  transform: scale(0.95);
}

.todo-item.todo-deleting {
  opacity: 0;
  transform: translateX(100%);
}

/* 学生排行榜 */
.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px;
  border-radius: 14px;
  transition: all 0.3s;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.ranking-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
}

.ranking-item:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.ranking-top-1 {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
}

.ranking-top-1::before {
  background: #f59e0b;
}

.ranking-top-2 {
  background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
}

.ranking-top-2::before {
  background: #6366f1;
}

.ranking-top-3 {
  background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%);
}

.ranking-top-3::before {
  background: #ec4899;
}

.ranking-medal {
  flex-shrink: 0;
}

.ranking-top-1 .ranking-medal {
  color: #f59e0b;
}

.ranking-top-2 .ranking-medal {
  color: #6366f1;
}

.ranking-top-3 .ranking-medal {
  color: #ec4899;
}

.ranking-avatar {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  flex-shrink: 0;
}

.ranking-info {
  flex: 1;
}

.ranking-name {
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
}

.ranking-class {
  font-size: 13px;
  color: #6b7280;
}

.ranking-stats {
  display: flex;
  gap: 16px;
}

.stat-item-small {
  text-align: center;
}

.stat-label-small {
  font-size: 11px;
  color: #6b7280;
  margin-bottom: 4px;
}

.stat-value-small {
  font-size: 18px;
  font-weight: 800;
  color: #1f2937;
}

/* 通知列表 */
.notification-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px;
  border-radius: 12px;
  transition: all 0.3s;
  cursor: pointer;
  border: 1px solid transparent;
}

.notification-item:hover {
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.notif-info {
  background: #eff6ff;
  border-color: #dbeafe;
}

.notif-warning {
  background: #fffbeb;
  border-color: #fef3c7;
}

.notif-success {
  background: #f0fdf4;
  border-color: #d1fae5;
}

.notif-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  font-size: 20px;
  flex-shrink: 0;
}

.notif-info .notif-icon {
  background: #3b82f6;
  color: #fff;
}

.notif-warning .notif-icon {
  background: #f59e0b;
  color: #fff;
}

.notif-success .notif-icon {
  background: #10b981;
  color: #fff;
}

.notif-content {
  flex: 1;
}

.notif-title {
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 6px;
}

.notif-text {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 6px;
}

.notif-time {
  font-size: 12px;
  color: #9ca3af;
}

.notif-action {
  font-size: 20px;
  color: #d1d5db;
  transition: all 0.3s;
}

.notification-item:hover .notif-action {
  color: #667eea;
  transform: translateX(4px);
}

/* 弹窗样式 */
.course-modal,
.assignment-modal,
.notification-modal {
  max-width: 600px;
}

.modal-content {
  padding: 8px 0;
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 12px;
  margin-bottom: 16px;
}

.modal-icon {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  color: #fff;
  flex-shrink: 0;
}

.modal-info {
  flex: 1;
}

.modal-title {
  font-size: 22px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.modal-desc {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.info-card {
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  transition: all 0.3s;
}

.info-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.info-card-blue {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
}

.info-card-green {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
}

.info-card-orange {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
}

.info-icon {
  font-size: 28px;
  color: #1f2937;
  margin-bottom: 8px;
}

.info-value {
  font-size: 32px;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 4px;
}

.info-label {
  font-size: 13px;
  color: #6b7280;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

@media (max-width: 768px) {
  .banner-content {
    flex-direction: column;
    text-align: center;
  }

  .banner-title {
    font-size: 22px;
  }

  .banner-subtitle {
    justify-content: center;
  }

  .stat-row {
    flex-direction: column;
    align-items: stretch;
  }

  .stat-day {
    width: 100%;
  }

  .stat-progress {
    align-self: center;
  }

  .ranking-stats {
    flex-direction: column;
    gap: 8px;
  }

  .schedule-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .modal-header {
    flex-direction: column;
    text-align: center;
  }
}

/* 高级功能区域样式 */
.advanced-actions-section {
  margin-top: 20px;
  padding: 16px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
  border-radius: 12px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.advanced-actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.advanced-action-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #fff;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.advanced-action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #18a058;
}

.advanced-action-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.advanced-action-icon.gradient-purple {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: #fff;
}

.advanced-action-icon.gradient-blue {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: #fff;
}

.advanced-action-icon.gradient-green {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #fff;
}

.advanced-action-icon.gradient-orange {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: #fff;
}

.advanced-action-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.advanced-action-info .advanced-action-name {
  font-size: 13px;
  font-weight: 600;
  color: #1f2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.advanced-action-desc {
  font-size: 11px;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .advanced-actions-grid {
    grid-template-columns: 1fr;
  }
}

/* 新增内容模块样式 */

/* 课程动态样式 */
.dynamics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.dynamics-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 10px;
  transition: all 0.3s;
}

.dynamics-item:hover {
  background: #f3f4f6;
  transform: translateX(4px);
}

.dynamics-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.dynamics-icon.icon-blue {
  background: #dbeafe;
  color: #3b82f6;
}
.dynamics-icon.icon-green {
  background: #d1fae5;
  color: #10b981;
}
.dynamics-icon.icon-purple {
  background: #ede9fe;
  color: #8b5cf6;
}
.dynamics-icon.icon-orange {
  background: #fef3c7;
  color: #f59e0b;
}

.dynamics-content {
  flex: 1;
  min-width: 0;
}

.dynamics-course {
  font-size: 13px;
  font-weight: 600;
  color: #1f2937;
}

.dynamics-action {
  font-size: 12px;
  color: #6b7280;
  margin-top: 2px;
}

.dynamics-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}

.dynamics-count {
  font-size: 11px;
  font-weight: 600;
  color: #10b981;
}

.dynamics-time {
  font-size: 11px;
  color: #9ca3af;
}

/* 教学目标进度样式 */
.goals-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.goal-item {
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
}

.goal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.goal-title {
  font-size: 13px;
  font-weight: 500;
  color: #1f2937;
}

.goal-deadline {
  font-size: 11px;
  color: #6b7280;
}

.goal-progress {
  display: flex;
  align-items: center;
  gap: 12px;
}

.goal-percent {
  font-size: 12px;
  color: #6b7280;
  white-space: nowrap;
}

/* 教学资源使用样式 */
.resource-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.resource-item {
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
}

.resource-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.resource-name {
  font-size: 13px;
  font-weight: 500;
  color: #1f2937;
}

.resource-trend {
  font-size: 14px;
}

.resource-trend.trend-up {
  color: #10b981;
}
.resource-trend.trend-down {
  color: #ef4444;
}
.resource-trend.trend-stable {
  color: #9ca3af;
}

.resource-count {
  display: block;
  font-size: 11px;
  color: #6b7280;
  margin-top: 4px;
}

@media (max-width: 768px) {
  .dynamics-grid,
  .resource-grid {
    grid-template-columns: 1fr;
  }
}
</style>
