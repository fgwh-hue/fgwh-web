<script setup lang="ts">
import { computed, h, onMounted, ref, watch } from 'vue';
import type { DataTableColumns } from 'naive-ui';
import { NAvatar, NButton, NDivider, NModal, NProgress, NTag } from 'naive-ui';
import type { ECOption } from '@/hooks/common/echarts';
import { useEcharts } from '@/hooks/common/echarts';

defineOptions({
  name: 'TeacherStudent'
});

interface Student {
  id: string;
  name: string;
  studentId: string;
  email: string;
  phone: string;
  courses: number;
  avgScore: number;
  status: 'active' | 'inactive';
  attendance: number;
  assignments: number;
  completedAssignments: number;
  class: string;
  major: string;
  avatar?: string;
}

const students = ref<Student[]>([
  {
    id: '1',
    name: '李明',
    studentId: 'STU001',
    email: 'liming@example.com',
    phone: '138****1234',
    courses: 4,
    avgScore: 85,
    status: 'active',
    attendance: 95,
    assignments: 12,
    completedAssignments: 11,
    class: '计算机2021-1班',
    major: '计算机科学与技术'
  },
  {
    id: '2',
    name: '王芳',
    studentId: 'STU002',
    email: 'wangfang@example.com',
    phone: '139****5678',
    courses: 3,
    avgScore: 92,
    status: 'active',
    attendance: 98,
    assignments: 10,
    completedAssignments: 10,
    class: '软件工程2021-2班',
    major: '软件工程'
  },
  {
    id: '3',
    name: '张三',
    studentId: 'STU003',
    email: 'zhangsan@example.com',
    phone: '137****9012',
    courses: 4,
    avgScore: 78,
    status: 'active',
    attendance: 88,
    assignments: 12,
    completedAssignments: 9,
    class: '计算机2021-1班',
    major: '计算机科学与技术'
  },
  {
    id: '4',
    name: '刘四',
    studentId: 'STU004',
    email: 'liusi@example.com',
    phone: '136****3456',
    courses: 2,
    avgScore: 88,
    status: 'inactive',
    attendance: 75,
    assignments: 8,
    completedAssignments: 6,
    class: '数据科学2021-1班',
    major: '数据科学与大数据技术'
  },
  {
    id: '5',
    name: '陈五',
    studentId: 'STU005',
    email: 'chenwu@example.com',
    phone: '135****7890',
    courses: 5,
    avgScore: 90,
    status: 'active',
    attendance: 96,
    assignments: 15,
    completedAssignments: 14,
    class: '软件工程2021-1班',
    major: '软件工程'
  },
  {
    id: '6',
    name: '赵六',
    studentId: 'STU006',
    email: 'zhaoliu@example.com',
    phone: '134****2345',
    courses: 3,
    avgScore: 82,
    status: 'active',
    attendance: 92,
    assignments: 10,
    completedAssignments: 9,
    class: '计算机2021-2班',
    major: '计算机科学与技术'
  }
]);

const searchText = ref('');
const selectedStatus = ref<string | null>(null);
const selectedClass = ref<string | null>(null);
const viewMode = ref<'table' | 'card'>('table');
const loading = ref(false);
const showDetailModal = ref(false);
const selectedStudent = ref<Student | null>(null);
const sortBy = ref<'name' | 'avgScore' | 'attendance'>('name');
const sortOrder = ref<'asc' | 'desc'>('asc');
const currentTime = ref(new Date());
const showFloatingMenu = ref(false);
const isRefreshing = ref(false);

// 学生标签
const studentTags = [
  { name: '优秀学生', count: 2, color: '#10b981' },
  { name: '进步显著', count: 3, color: '#3b82f6' },
  { name: '需要关注', count: 1, color: '#f59e0b' },
  { name: '全勤', count: 4, color: '#8b5cf6' },
  { name: '作业优秀', count: 5, color: '#ec4899' }
];

// 更新时间
setInterval(() => {
  currentTime.value = new Date();
}, 1000);

// 获取问候语
const greeting = computed(() => {
  const hour = currentTime.value.getHours();
  if (hour < 6) return '夜深了';
  if (hour < 9) return '早上好';
  if (hour < 12) return '上午好';
  if (hour < 14) return '中午好';
  if (hour < 18) return '下午好';
  if (hour < 22) return '晚上好';
  return '夜深了';
});

// 最近活动
const recentActivities = [
  { id: 1, type: 'grade', student: '李明', action: '提交了作业', time: '5分钟前', icon: 'i-mdi-file-document' },
  { id: 2, type: 'attendance', student: '王芳', action: '签到成功', time: '15分钟前', icon: 'i-mdi-check-circle' },
  { id: 3, type: 'message', student: '张三', action: '发送了消息', time: '30分钟前', icon: 'i-mdi-message' },
  { id: 4, type: 'grade', student: '陈五', action: '成绩更新', time: '1小时前', icon: 'i-mdi-chart-line' }
];

const filteredStudents = computed(() => {
  const result = students.value.filter(student => {
    const matchSearch =
      !searchText.value ||
      student.name.includes(searchText.value) ||
      student.studentId.includes(searchText.value) ||
      student.email.includes(searchText.value);
    const matchStatus = !selectedStatus.value || student.status === selectedStatus.value;
    const matchClass = !selectedClass.value || student.class === selectedClass.value;
    return matchSearch && matchStatus && matchClass;
  });

  // 排序
  result.sort((a, b) => {
    let compareValue = 0;
    if (sortBy.value === 'name') {
      compareValue = a.name.localeCompare(b.name);
    } else if (sortBy.value === 'avgScore') {
      compareValue = a.avgScore - b.avgScore;
    } else if (sortBy.value === 'attendance') {
      compareValue = a.attendance - b.attendance;
    }
    return sortOrder.value === 'asc' ? compareValue : -compareValue;
  });

  return result;
});

// 统计数据
const totalStudents = computed(() => students.value.length);
const activeStudents = computed(() => students.value.filter(s => s.status === 'active').length);
const avgScore = computed(() => {
  if (students.value.length === 0) return 0;
  return Math.round(students.value.reduce((sum, s) => sum + s.avgScore, 0) / students.value.length);
});
const totalCourses = computed(() => students.value.reduce((sum, s) => sum + s.courses, 0));

// 数字动画
const animatedTotalStudents = ref(0);
const animatedActiveStudents = ref(0);
const animatedAvgScore = ref(0);
const animatedTotalCourses = ref(0);

// 数字滚动动画
function animateNumber(target: number, current: { value: number }, duration = 1000) {
  const start = current.value;
  const diff = target - start;
  const startTime = Date.now();

  const animate = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOutQuart = 1 - (1 - progress) ** 4;
    current.value = Math.round(start + diff * easeOutQuart);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  animate();
}

// 监听统计数据变化并触发动画
watch(totalStudents, val => animateNumber(val, animatedTotalStudents));
watch(activeStudents, val => animateNumber(val, animatedActiveStudents));
watch(avgScore, val => animateNumber(val, animatedAvgScore));
watch(totalCourses, val => animateNumber(val, animatedTotalCourses));

// 初始化动画
onMounted(() => {
  animateNumber(totalStudents.value, animatedTotalStudents);
  animateNumber(activeStudents.value, animatedActiveStudents);
  animateNumber(avgScore.value, animatedAvgScore);
  animateNumber(totalCourses.value, animatedTotalCourses);
});

// 成绩分布数据
const scoreDistribution = [
  { range: '90-100', count: 2, color: '#10b981' },
  { range: '80-89', count: 3, color: '#3b82f6' },
  { range: '70-79', count: 1, color: '#f59e0b' },
  { range: '60-69', count: 0, color: '#f97316' },
  { range: '0-59', count: 0, color: '#6b7280' }
];

// 出勤率趋势
const attendanceTrend = [
  { week: '第1周', rate: 92 },
  { week: '第2周', rate: 94 },
  { week: '第3周', rate: 91 },
  { week: '第4周', rate: 95 },
  { week: '第5周', rate: 93 },
  { week: '第6周', rate: 96 },
  { week: '第7周', rate: 94 }
];

// 专业分布
const majorDistribution = [
  { name: '计算机科学与技术', value: 3, color: '#3b82f6' },
  { name: '软件工程', value: 2, color: '#10b981' },
  { name: '数据科学与大数据技术', value: 1, color: '#f59e0b' }
];

// 成绩分布图表
const { domRef: scoreDomRef } = useEcharts(() => {
  const option: ECOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e5e7eb',
      textStyle: { color: '#1f2937' }
    },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: scoreDistribution.map(item => item.range),
      axisLine: { lineStyle: { color: '#e5e7eb' } },
      axisLabel: { color: '#6b7280' }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#e5e7eb' } },
      axisLabel: { color: '#6b7280' },
      splitLine: { lineStyle: { color: '#f3f4f6' } }
    },
    series: [
      {
        name: '人数',
        type: 'bar',
        data: scoreDistribution.map(item => ({
          value: item.count,
          itemStyle: { color: item.color }
        })),
        barWidth: '50%',
        itemStyle: {
          borderRadius: [5, 5, 0, 0]
        }
      }
    ]
  };
  return option;
});

// 出勤率趋势图表
const { domRef: attendanceDomRef } = useEcharts(() => {
  const option: ECOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e5e7eb',
      textStyle: { color: '#1f2937' }
    },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: attendanceTrend.map(item => item.week),
      axisLine: { lineStyle: { color: '#e5e7eb' } },
      axisLabel: { color: '#6b7280' }
    },
    yAxis: {
      type: 'value',
      min: 85,
      max: 100,
      axisLine: { lineStyle: { color: '#e5e7eb' } },
      axisLabel: { color: '#6b7280', formatter: '{value}%' },
      splitLine: { lineStyle: { color: '#f3f4f6' } }
    },
    series: [
      {
        name: '出勤率',
        type: 'line',
        data: attendanceTrend.map(item => item.rate),
        smooth: true,
        itemStyle: { color: '#3b82f6' },
        lineStyle: { width: 3 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(59, 130, 246, 0.2)' },
              { offset: 1, color: 'rgba(59, 130, 246, 0.02)' }
            ]
          }
        }
      }
    ]
  };
  return option;
});

// 专业分布图表
const { domRef: majorDomRef } = useEcharts(() => {
  const option: ECOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}人 ({d}%)',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e5e7eb',
      textStyle: { color: '#1f2937' }
    },
    legend: { orient: 'vertical', right: '5%', top: 'center', textStyle: { color: '#6b7280' } },
    series: [
      {
        name: '专业分布',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: { show: false },
        emphasis: {
          label: { show: true, fontSize: 14, fontWeight: 'bold', color: '#1f2937' }
        },
        data: majorDistribution.map(item => ({
          value: item.value,
          name: item.name,
          itemStyle: { color: item.color }
        }))
      }
    ]
  };
  return option;
});

const columns: DataTableColumns<Student> = [
  {
    title: '学生信息',
    key: 'name',
    width: 200,
    render: row =>
      h('div', { class: 'flex-y-center gap-12px' }, [
        h(NAvatar, { size: 40, round: true, color: '#18a058' }, { default: () => row.name.charAt(0) }),
        h('div', [
          h('div', { class: 'text-#1f2937 font-medium' }, row.name),
          h('div', { class: 'text-12px text-#6b7280' }, row.studentId)
        ])
      ])
  },
  {
    title: '班级',
    key: 'class',
    width: 150,
    render: row => h('span', { class: 'text-#6b7280' }, row.class)
  },
  {
    title: '联系方式',
    key: 'contact',
    width: 180,
    render: row =>
      h('div', [
        h('div', { class: 'text-12px text-#6b7280' }, row.email),
        h('div', { class: 'text-12px text-#6b7280 mt-4px' }, row.phone)
      ])
  },
  {
    title: '课程数',
    key: 'courses',
    width: 80,
    render: row => h('span', { class: 'text-#1f2937 font-medium' }, row.courses)
  },
  {
    title: '平均分',
    key: 'avgScore',
    width: 80,
    render: row => {
      let color = '#f59e0b';
      if (row.avgScore >= 90) {
        color = '#10b981';
      } else if (row.avgScore >= 80) {
        color = '#3b82f6';
      }
      return h('span', { class: 'font-bold', style: { color } }, row.avgScore);
    }
  },
  {
    title: '出勤率',
    key: 'attendance',
    width: 120,
    render: row => {
      let color = '#f59e0b';
      if (row.attendance >= 90) {
        color = '#10b981';
      } else if (row.attendance >= 80) {
        color = '#3b82f6';
      }
      return h('div', { class: 'flex-y-center gap-8px' }, [
        h(NProgress, {
          type: 'line',
          percentage: row.attendance,
          showIndicator: false,
          color,
          railColor: 'rgba(0, 0, 0, 0.06)'
        }),
        h('span', { class: 'text-12px text-#6b7280' }, `${row.attendance}%`)
      ]);
    }
  },
  {
    title: '作业完成',
    key: 'assignments',
    width: 100,
    render: row => h('span', { class: 'text-#6b7280' }, `${row.completedAssignments}/${row.assignments}`)
  },
  {
    title: '状态',
    key: 'status',
    width: 80,
    render: row => {
      const typeMap = { active: 'success', inactive: 'default' };
      const textMap = { active: '活跃', inactive: '非活跃' };
      return h(NTag, { type: typeMap[row.status] as any, size: 'small' }, { default: () => textMap[row.status] });
    }
  },
  {
    title: '操作',
    key: 'actions',
    width: 200,
    fixed: 'right',
    render: row =>
      h('div', { class: 'flex gap-8px' }, [
        h(
          NButton,
          { text: true, type: 'primary', size: 'small', onClick: () => handleViewDetails(row) },
          { default: () => '详情' }
        ),
        h(
          NButton,
          { text: true, type: 'info', size: 'small', onClick: () => handleMessage(row) },
          { default: () => '消息' }
        ),
        h(NButton, { text: true, type: 'warning', size: 'small' }, { default: () => '成绩' })
      ])
  }
];

function handleViewDetails(student: Student) {
  selectedStudent.value = student;
  showDetailModal.value = true;
}

function handleMessage(student: Student) {
  window.$message?.success(`已向 ${student.name} 发送消息`);
}

function handleImport() {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    window.$message?.success('导入成功！');
  }, 1500);
}

function handleExport() {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    window.$message?.success('导出成功！');
  }, 1000);
}

function handleSort(field: 'name' | 'avgScore' | 'attendance') {
  if (sortBy.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = field;
    sortOrder.value = 'desc';
  }
}

function handleBatchNotify() {
  window.$message?.info('正在向所有学生发送通知...');
}

function handleBatchGrade() {
  window.$message?.info('打开批量录入成绩界面...');
}

function handleAttendanceReport() {
  window.$message?.info('生成考勤统计报告...');
}

function handleGenerateReport() {
  window.$message?.info('正在生成学生分析报告...');
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleActivityClick(activity: any) {
  window.$message?.info(`查看 ${activity.student} 的${getActivityTypeLabel(activity.type)}详情`);
}

function getActivityTypeLabel(type: string) {
  const labels: Record<string, string> = {
    grade: '作业',
    attendance: '考勤',
    message: '消息'
  };
  return labels[type] || '活动';
}

function handleRefresh() {
  window.$message?.success('数据已刷新！');
}
</script>

<template>
  <div class="student-dashboard">
    <!-- 面包屑导航 -->
    <div class="breadcrumb-bar">
      <div class="breadcrumb-items">
        <span class="breadcrumb-item">
          <div class="i-mdi-home text-16px" />
          首页
        </span>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-item">教师中心</span>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-item breadcrumb-active">学生管理</span>
      </div>
      <div class="time-display">
        <div class="i-mdi-clock-outline text-16px" />
        <span>
          {{ currentTime.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) }}
        </span>
      </div>
    </div>

    <!-- 欢迎横幅 -->
    <div class="welcome-banner">
      <div class="welcome-content">
        <div class="welcome-icon i-mdi-hand-wave" />
        <div class="welcome-text">
          <h3 class="welcome-title">{{ greeting }}，老师！</h3>
          <p class="welcome-subtitle">今天有 {{ activeStudents }} 名学生活跃，继续保持！</p>
        </div>
      </div>
      <div class="welcome-decoration">
        <div class="decoration-circle decoration-circle-1" />
        <div class="decoration-circle decoration-circle-2" />
        <div class="decoration-circle decoration-circle-3" />
      </div>
    </div>

    <!-- 顶部标题栏 -->
    <div class="dashboard-header">
      <div class="header-left">
        <div class="header-decoration" />
        <h2 class="header-title">学生管理</h2>
        <div class="header-decoration" />
      </div>
      <div class="header-right">
        <NSpace>
          <NButton @click="handleExport">
            <template #icon>
              <div class="i-mdi-download" />
            </template>
            导出数据
          </NButton>
          <NButton type="primary" @click="handleImport">
            <template #icon>
              <div class="i-mdi-upload" />
            </template>
            导入学生
          </NButton>
        </NSpace>
      </div>
    </div>

    <!-- 核心数据统计卡片 -->
    <NGrid :x-gap="16" :y-gap="16" responsive="screen" item-responsive class="mt-16px">
      <NGi span="24 s:12 m:6">
        <div class="stat-card stat-card-1">
          <div class="stat-icon-wrapper">
            <div class="i-mdi-account-group text-40px" />
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ animatedTotalStudents }}</div>
            <div class="stat-label">总学生数</div>
            <div class="stat-trend">
              <span class="i-mdi-trending-up" />
              <span>较上学期 +8</span>
            </div>
          </div>
          <div class="stat-decoration" />
        </div>
      </NGi>
      <NGi span="24 s:12 m:6">
        <div class="stat-card stat-card-2">
          <div class="stat-icon-wrapper">
            <div class="i-mdi-account-check text-40px" />
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ animatedActiveStudents }}</div>
            <div class="stat-label">活跃学生</div>
            <div class="stat-trend">
              <span class="i-mdi-check-circle" />
              <span>活跃率 {{ Math.round((activeStudents / totalStudents) * 100) }}%</span>
            </div>
          </div>
          <div class="stat-decoration" />
        </div>
      </NGi>
      <NGi span="24 s:12 m:6">
        <div class="stat-card stat-card-3">
          <div class="stat-icon-wrapper">
            <div class="i-mdi-chart-line text-40px" />
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ animatedAvgScore }}</div>
            <div class="stat-label">平均分</div>
            <div class="stat-trend">
              <span class="i-mdi-trending-up" />
              <span>较上月 +3.5</span>
            </div>
          </div>
          <div class="stat-decoration" />
        </div>
      </NGi>
      <NGi span="24 s:12 m:6">
        <div class="stat-card stat-card-4">
          <div class="stat-icon-wrapper">
            <div class="i-mdi-book-open-page-variant text-40px" />
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ animatedTotalCourses }}</div>
            <div class="stat-label">总课程数</div>
            <div class="stat-trend">
              <span class="i-mdi-information" />
              <span>平均 {{ (totalCourses / totalStudents).toFixed(1) }} 门/人</span>
            </div>
          </div>
          <div class="stat-decoration" />
        </div>
      </NGi>
    </NGrid>

    <!-- 学生标签云和进度环 -->
    <NGrid :x-gap="16" :y-gap="16" responsive="screen" item-responsive class="mt-16px">
      <!-- 学生标签云 -->
      <NGi span="24 s:24 m:12">
        <div class="tags-cloud-card">
          <div class="tags-header">
            <div class="tags-title">
              <div class="title-icon i-mdi-tag-multiple" />
              <span>学生标签</span>
            </div>
            <NButton text type="primary" size="small" :loading="isRefreshing" @click="handleRefresh">
              <template #icon>
                <div class="i-mdi-refresh" :class="{ rotating: isRefreshing }" />
              </template>
              刷新
            </NButton>
          </div>
          <div class="tags-cloud">
            <div
              v-for="(tag, index) in studentTags"
              :key="tag.name"
              class="tag-item"
              :style="{ animationDelay: `${index * 0.1}s` }"
            >
              <div class="tag-dot" :style="{ background: tag.color }" />
              <span class="tag-name">{{ tag.name }}</span>
              <span class="tag-count">{{ tag.count }}</span>
            </div>
          </div>
        </div>
      </NGi>

      <!-- 综合进度环 -->
      <NGi span="24 s:24 m:12">
        <div class="progress-rings-card">
          <div class="rings-header">
            <div class="rings-title">
              <div class="title-icon i-mdi-chart-donut-variant" />
              <span>综合数据</span>
            </div>
          </div>
          <div class="progress-rings">
            <div class="ring-item">
              <div class="ring-wrapper">
                <svg class="ring-svg" viewBox="0 0 100 100">
                  <circle class="ring-bg" cx="50" cy="50" r="40" />
                  <circle class="ring-progress ring-progress-1 ring-offset-83" cx="50" cy="50" r="40" />
                </svg>
                <div class="ring-content">
                  <div class="ring-value">83%</div>
                  <div class="ring-label">活跃率</div>
                </div>
              </div>
            </div>
            <div class="ring-item">
              <div class="ring-wrapper">
                <svg class="ring-svg" viewBox="0 0 100 100">
                  <circle class="ring-bg" cx="50" cy="50" r="40" />
                  <circle class="ring-progress ring-progress-2 ring-offset-92" cx="50" cy="50" r="40" />
                </svg>
                <div class="ring-content">
                  <div class="ring-value">92%</div>
                  <div class="ring-label">作业率</div>
                </div>
              </div>
            </div>
            <div class="ring-item">
              <div class="ring-wrapper">
                <svg class="ring-svg" viewBox="0 0 100 100">
                  <circle class="ring-bg" cx="50" cy="50" r="40" />
                  <circle class="ring-progress ring-progress-3 ring-offset-94" cx="50" cy="50" r="40" />
                </svg>
                <div class="ring-content">
                  <div class="ring-value">94%</div>
                  <div class="ring-label">出勤率</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </NGi>
    </NGrid>

    <!-- 数据可视化区域 -->
    <NGrid :x-gap="16" :y-gap="16" responsive="screen" item-responsive class="mt-16px">
      <!-- 成绩分布 -->
      <NGi span="24 s:24 m:8">
        <div class="chart-card">
          <div class="chart-header">
            <div class="chart-title">
              <div class="title-icon i-mdi-chart-bar" />
              <span>成绩分布</span>
            </div>
            <div class="chart-subtitle">学生成绩区间统计</div>
          </div>
          <div ref="scoreDomRef" class="chart-content-small" />
        </div>
      </NGi>

      <!-- 出勤率趋势 -->
      <NGi span="24 s:24 m:8">
        <div class="chart-card">
          <div class="chart-header">
            <div class="chart-title">
              <div class="title-icon i-mdi-chart-timeline-variant" />
              <span>出勤率趋势</span>
            </div>
            <div class="chart-subtitle">近7周出勤情况</div>
          </div>
          <div ref="attendanceDomRef" class="chart-content-small" />
        </div>
      </NGi>

      <!-- 专业分布 -->
      <NGi span="24 s:24 m:8">
        <div class="chart-card">
          <div class="chart-header">
            <div class="chart-title">
              <div class="title-icon i-mdi-chart-donut" />
              <span>专业分布</span>
            </div>
            <div class="chart-subtitle">各专业学生占比</div>
          </div>
          <div ref="majorDomRef" class="chart-content-small" />
        </div>
      </NGi>
    </NGrid>

    <!-- 最近活动和快捷操作 -->
    <NGrid :x-gap="16" :y-gap="16" responsive="screen" item-responsive class="mt-16px">
      <!-- 最近活动时间线 -->
      <NGi span="24 s:24 m:16">
        <div class="activity-card">
          <div class="activity-header">
            <div class="activity-title">
              <div class="title-icon i-mdi-timeline-clock" />
              <span>最近活动</span>
            </div>
            <NButton text type="primary" size="small">
              查看全部
              <template #icon>
                <div class="i-mdi-arrow-right" />
              </template>
            </NButton>
          </div>
          <div class="activity-timeline">
            <div
              v-for="activity in recentActivities"
              :key="activity.id"
              class="timeline-item"
              @click="handleActivityClick(activity)"
            >
              <div class="timeline-avatar" :class="`avatar-${activity.type}`">
                <span class="avatar-text">{{ activity.student.charAt(0) }}</span>
              </div>
              <div class="timeline-content">
                <div class="timeline-header">
                  <div class="timeline-text">
                    <span class="timeline-student">{{ activity.student }}</span>
                    <span class="timeline-action">{{ activity.action }}</span>
                  </div>
                  <div class="timeline-badge" :class="`badge-${activity.type}`">
                    {{ getActivityTypeLabel(activity.type) }}
                  </div>
                </div>
                <div class="timeline-footer">
                  <div class="timeline-time">{{ activity.time }}</div>
                  <div class="timeline-arrow i-mdi-chevron-right" />
                </div>
              </div>
            </div>
          </div>
          <!-- 活动统计摘要 -->
          <div class="activity-summary">
            <div class="summary-item summary-item-blue">
              <div class="summary-icon-wrapper">
                <span class="i-mdi-file-document summary-icon" />
              </div>
              <div class="summary-content">
                <div class="summary-value">12</div>
                <div class="summary-label">今日作业</div>
              </div>
            </div>
            <div class="summary-divider" />
            <div class="summary-item summary-item-green">
              <div class="summary-icon-wrapper">
                <span class="i-mdi-account-check summary-icon" />
              </div>
              <div class="summary-content">
                <div class="summary-value">5</div>
                <div class="summary-label">今日签到</div>
              </div>
            </div>
            <div class="summary-divider" />
            <div class="summary-item summary-item-orange">
              <div class="summary-icon-wrapper">
                <span class="i-mdi-message summary-icon" />
              </div>
              <div class="summary-content">
                <div class="summary-value">8</div>
                <div class="summary-label">未读消息</div>
              </div>
            </div>
          </div>
          <!-- 查看更多按钮 -->
          <div class="activity-footer">
            <NButton text type="primary" block>
              查看所有活动记录
              <template #icon>
                <div class="i-mdi-arrow-down" />
              </template>
            </NButton>
          </div>
        </div>
      </NGi>

      <!-- 成绩等级分布 -->
      <NGi span="24 s:24 m:8">
        <div class="grade-distribution-card">
          <div class="grade-header">
            <div class="grade-title">
              <div class="title-icon i-mdi-medal" />
              <span>成绩等级</span>
            </div>
          </div>
          <div class="grade-levels-compact">
            <div class="grade-level-compact grade-level-excellent">
              <div class="grade-compact-top">
                <div class="grade-level-icon i-mdi-star" />
                <div class="grade-compact-info">
                  <div class="grade-level-label">优秀</div>
                  <div class="grade-level-range">90-100</div>
                </div>
              </div>
              <div class="grade-compact-middle">
                <div class="grade-progress-bar">
                  <div class="grade-progress-fill grade-fill-excellent" />
                </div>
              </div>
              <div class="grade-compact-bottom">
                <div class="grade-level-value">2人</div>
                <div class="grade-level-percent">33.3%</div>
              </div>
            </div>
            <div class="grade-level-compact grade-level-good">
              <div class="grade-compact-top">
                <div class="grade-level-icon i-mdi-thumb-up" />
                <div class="grade-compact-info">
                  <div class="grade-level-label">良好</div>
                  <div class="grade-level-range">80-89</div>
                </div>
              </div>
              <div class="grade-compact-middle">
                <div class="grade-progress-bar">
                  <div class="grade-progress-fill grade-fill-good" />
                </div>
              </div>
              <div class="grade-compact-bottom">
                <div class="grade-level-value">3人</div>
                <div class="grade-level-percent">50%</div>
              </div>
            </div>
            <div class="grade-level-compact grade-level-pass">
              <div class="grade-compact-top">
                <div class="grade-level-icon i-mdi-check" />
                <div class="grade-compact-info">
                  <div class="grade-level-label">及格</div>
                  <div class="grade-level-range">60-79</div>
                </div>
              </div>
              <div class="grade-compact-middle">
                <div class="grade-progress-bar">
                  <div class="grade-progress-fill grade-fill-pass" />
                </div>
              </div>
              <div class="grade-compact-bottom">
                <div class="grade-level-value">1人</div>
                <div class="grade-level-percent">16.7%</div>
              </div>
            </div>
            <div class="grade-level-compact grade-level-fail">
              <div class="grade-compact-top">
                <div class="grade-level-icon i-mdi-alert" />
                <div class="grade-compact-info">
                  <div class="grade-level-label">不及格</div>
                  <div class="grade-level-range">0-59</div>
                </div>
              </div>
              <div class="grade-compact-middle">
                <div class="grade-progress-bar">
                  <div class="grade-progress-fill grade-fill-fail" />
                </div>
              </div>
              <div class="grade-compact-bottom">
                <div class="grade-level-value">0人</div>
                <div class="grade-level-percent">0%</div>
              </div>
            </div>
          </div>
          <!-- 成绩总结 -->
          <div class="grade-summary">
            <div class="summary-row">
              <span class="summary-label">班级平均分</span>
              <span class="summary-value-highlight">85.5</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">及格率</span>
              <span class="summary-value-success">100%</span>
            </div>
          </div>
        </div>
      </NGi>
    </NGrid>

    <!-- 快捷操作面板 -->
    <div class="quick-actions mt-16px">
      <div class="actions-header">
        <div class="actions-title">
          <div class="title-icon i-mdi-lightning-bolt" />
          <span>快捷操作</span>
        </div>
      </div>
      <NGrid :x-gap="12" :y-gap="12" responsive="screen" item-responsive class="mt-12px">
        <NGi span="24 s:12 m:6">
          <div class="action-item action-item-blue" @click="handleBatchNotify">
            <div class="action-icon">
              <div class="i-mdi-email-send text-24px" />
            </div>
            <div class="action-content">
              <div class="action-title">群发通知</div>
              <div class="action-desc">向所有学生发送消息</div>
            </div>
          </div>
        </NGi>
        <NGi span="24 s:12 m:6">
          <div class="action-item action-item-green" @click="handleBatchGrade">
            <div class="action-icon">
              <div class="i-mdi-file-document-edit text-24px" />
            </div>
            <div class="action-content">
              <div class="action-title">批量录入成绩</div>
              <div class="action-desc">快速录入学生成绩</div>
            </div>
          </div>
        </NGi>
        <NGi span="24 s:12 m:6">
          <div class="action-item action-item-orange" @click="handleAttendanceReport">
            <div class="action-icon">
              <div class="i-mdi-calendar-check text-24px" />
            </div>
            <div class="action-content">
              <div class="action-title">考勤统计</div>
              <div class="action-desc">查看学生考勤报表</div>
            </div>
          </div>
        </NGi>
        <NGi span="24 s:12 m:6">
          <div class="action-item action-item-purple" @click="handleGenerateReport">
            <div class="action-icon">
              <div class="i-mdi-chart-box text-24px" />
            </div>
            <div class="action-content">
              <div class="action-title">生成报告</div>
              <div class="action-desc">导出学生分析报告</div>
            </div>
          </div>
        </NGi>
      </NGrid>
    </div>

    <!-- 筛选器 -->
    <div class="filter-card mt-16px">
      <div class="filter-header">
        <div class="filter-title">
          <div class="title-icon i-mdi-filter-variant" />
          <span>筛选条件</span>
        </div>
        <div class="view-mode-switch">
          <NButton :type="viewMode === 'table' ? 'primary' : 'default'" size="small" @click="viewMode = 'table'">
            <template #icon>
              <div class="i-mdi-table" />
            </template>
            表格视图
          </NButton>
          <NButton :type="viewMode === 'card' ? 'primary' : 'default'" size="small" @click="viewMode = 'card'">
            <template #icon>
              <div class="i-mdi-view-grid" />
            </template>
            卡片视图
          </NButton>
        </div>
      </div>
      <NSpace class="filter-content">
        <NInput v-model:value="searchText" placeholder="搜索学生姓名、学号或邮箱" class="filter-input" clearable>
          <template #prefix>
            <div class="i-mdi-magnify" />
          </template>
        </NInput>
        <NSelect
          v-model:value="selectedClass"
          placeholder="选择班级"
          class="filter-select"
          :options="[
            { label: '计算机2021-1班', value: '计算机2021-1班' },
            { label: '计算机2021-2班', value: '计算机2021-2班' },
            { label: '软件工程2021-1班', value: '软件工程2021-1班' },
            { label: '软件工程2021-2班', value: '软件工程2021-2班' },
            { label: '数据科学2021-1班', value: '数据科学2021-1班' }
          ]"
          clearable
        />
        <NSelect
          v-model:value="selectedStatus"
          placeholder="选择状态"
          class="filter-select"
          :options="[
            { label: '活跃', value: 'active' },
            { label: '非活跃', value: 'inactive' }
          ]"
          clearable
        />
        <NButton
          class="filter-reset"
          @click="
            searchText = '';
            selectedClass = null;
            selectedStatus = null;
          "
        >
          <template #icon>
            <div class="i-mdi-refresh" />
          </template>
          重置
        </NButton>
      </NSpace>
    </div>

    <!-- 排序工具栏 -->
    <div class="sort-toolbar mt-16px">
      <div class="sort-label">
        <div class="i-mdi-sort text-18px" />
        <span>排序方式：</span>
      </div>
      <NSpace>
        <NButton :type="sortBy === 'name' ? 'primary' : 'default'" size="small" @click="handleSort('name')">
          <template #icon>
            <div
              :class="
                sortBy === 'name' && sortOrder === 'desc'
                  ? 'i-mdi-sort-alphabetical-descending'
                  : 'i-mdi-sort-alphabetical-ascending'
              "
            />
          </template>
          姓名
        </NButton>
        <NButton :type="sortBy === 'avgScore' ? 'primary' : 'default'" size="small" @click="handleSort('avgScore')">
          <template #icon>
            <div
              :class="
                sortBy === 'avgScore' && sortOrder === 'desc'
                  ? 'i-mdi-sort-numeric-descending'
                  : 'i-mdi-sort-numeric-ascending'
              "
            />
          </template>
          平均分
        </NButton>
        <NButton :type="sortBy === 'attendance' ? 'primary' : 'default'" size="small" @click="handleSort('attendance')">
          <template #icon>
            <div
              :class="
                sortBy === 'attendance' && sortOrder === 'desc'
                  ? 'i-mdi-sort-numeric-descending'
                  : 'i-mdi-sort-numeric-ascending'
              "
            />
          </template>
          出勤率
        </NButton>
      </NSpace>
    </div>

    <!-- 学生列表 - 表格视图 -->
    <div v-if="viewMode === 'table'" class="table-card mt-16px">
      <div class="table-header">
        <div class="table-title">
          <div class="title-icon i-mdi-table" />
          <span>学生列表</span>
        </div>
        <div class="table-count">共 {{ filteredStudents.length }} 条记录</div>
      </div>
      <NDataTable
        :columns="columns"
        :data="filteredStudents"
        :pagination="{ pageSize: 10 }"
        :scroll-x="1200"
        :loading="loading"
      />
    </div>

    <!-- 学生列表 - 卡片视图 -->
    <div v-else class="mt-16px">
      <!-- 空状态 -->
      <div v-if="filteredStudents.length === 0" class="empty-state">
        <div class="empty-icon i-mdi-account-search" />
        <div class="empty-title">没有找到学生</div>
        <div class="empty-desc">尝试调整筛选条件或搜索关键词</div>
        <NButton
          type="primary"
          @click="
            searchText = '';
            selectedClass = null;
            selectedStatus = null;
          "
        >
          重置筛选
        </NButton>
      </div>

      <NGrid v-else :x-gap="16" :y-gap="16" responsive="screen" item-responsive>
        <NGi v-for="student in filteredStudents" :key="student.id" span="24 s:12 m:8 l:6">
          <div class="student-card">
            <div class="student-card-header">
              <NAvatar :size="60" round color="#18a058">
                {{ student.name.charAt(0) }}
              </NAvatar>
              <NTag :type="student.status === 'active' ? 'success' : 'default'" size="small" class="status-tag">
                {{ student.status === 'active' ? '活跃' : '非活跃' }}
              </NTag>
            </div>
            <div class="student-card-body">
              <div class="student-name">{{ student.name }}</div>
              <div class="student-id">{{ student.studentId }}</div>
              <div class="student-class">{{ student.class }}</div>
              <div class="student-stats">
                <div class="stat-item">
                  <div class="stat-label">平均分</div>
                  <div
                    class="stat-value"
                    :class="{
                      'text-success': student.avgScore >= 90,
                      'text-primary': student.avgScore >= 80 && student.avgScore < 90,
                      'text-warning': student.avgScore < 80
                    }"
                  >
                    {{ student.avgScore }}
                  </div>
                </div>
                <div class="stat-item">
                  <div class="stat-label">出勤率</div>
                  <div class="stat-value">{{ student.attendance }}%</div>
                </div>
                <div class="stat-item">
                  <div class="stat-label">课程数</div>
                  <div class="stat-value">{{ student.courses }}</div>
                </div>
              </div>
            </div>
            <div class="student-card-footer">
              <NButton text type="primary" size="small" @click="handleViewDetails(student)">
                <template #icon>
                  <div class="i-mdi-eye" />
                </template>
                查看详情
              </NButton>
              <NButton text type="info" size="small" @click="handleMessage(student)">
                <template #icon>
                  <div class="i-mdi-message" />
                </template>
                发消息
              </NButton>
            </div>
          </div>
        </NGi>
      </NGrid>
    </div>

    <!-- 学生详情模态框 -->
    <NModal v-model:show="showDetailModal" preset="card" title="学生详细信息" class="student-detail-modal">
      <div v-if="selectedStudent" class="detail-content">
        <div class="detail-header">
          <NAvatar :size="80" round color="#18a058">
            {{ selectedStudent.name.charAt(0) }}
          </NAvatar>
          <div class="detail-header-info">
            <h3 class="detail-name">{{ selectedStudent.name }}</h3>
            <div class="detail-id">学号：{{ selectedStudent.studentId }}</div>
            <NTag :type="selectedStudent.status === 'active' ? 'success' : 'default'" size="small">
              {{ selectedStudent.status === 'active' ? '活跃' : '非活跃' }}
            </NTag>
          </div>
        </div>

        <NDivider />

        <div class="detail-section">
          <div class="section-title">
            <div class="i-mdi-school text-18px" />
            <span>基本信息</span>
          </div>
          <NGrid :x-gap="16" :y-gap="12" :cols="2">
            <NGi>
              <div class="info-item">
                <div class="info-label">班级</div>
                <div class="info-value">{{ selectedStudent.class }}</div>
              </div>
            </NGi>
            <NGi>
              <div class="info-item">
                <div class="info-label">专业</div>
                <div class="info-value">{{ selectedStudent.major }}</div>
              </div>
            </NGi>
            <NGi>
              <div class="info-item">
                <div class="info-label">邮箱</div>
                <div class="info-value">{{ selectedStudent.email }}</div>
              </div>
            </NGi>
            <NGi>
              <div class="info-item">
                <div class="info-label">电话</div>
                <div class="info-value">{{ selectedStudent.phone }}</div>
              </div>
            </NGi>
          </NGrid>
        </div>

        <NDivider />

        <div class="detail-section">
          <div class="section-title">
            <div class="i-mdi-chart-line text-18px" />
            <span>学习数据</span>
          </div>
          <NGrid :x-gap="16" :y-gap="16" :cols="3">
            <NGi>
              <div class="data-card data-card-blue">
                <div class="data-icon i-mdi-book-open-variant" />
                <div class="data-value">{{ selectedStudent.courses }}</div>
                <div class="data-label">课程数</div>
              </div>
            </NGi>
            <NGi>
              <div class="data-card data-card-green">
                <div class="data-icon i-mdi-chart-box" />
                <div class="data-value">{{ selectedStudent.avgScore }}</div>
                <div class="data-label">平均分</div>
              </div>
            </NGi>
            <NGi>
              <div class="data-card data-card-orange">
                <div class="data-icon i-mdi-calendar-check" />
                <div class="data-value">{{ selectedStudent.attendance }}%</div>
                <div class="data-label">出勤率</div>
              </div>
            </NGi>
          </NGrid>
        </div>

        <NDivider />

        <div class="detail-section">
          <div class="section-title">
            <div class="i-mdi-clipboard-check text-18px" />
            <span>作业情况</span>
          </div>
          <div class="assignment-progress">
            <div class="progress-info">
              <span>已完成 {{ selectedStudent.completedAssignments }} / {{ selectedStudent.assignments }} 项作业</span>
              <span class="progress-percent">
                {{ Math.round((selectedStudent.completedAssignments / selectedStudent.assignments) * 100) }}%
              </span>
            </div>
            <NProgress
              type="line"
              :percentage="Math.round((selectedStudent.completedAssignments / selectedStudent.assignments) * 100)"
              :color="
                Math.round((selectedStudent.completedAssignments / selectedStudent.assignments) * 100) >= 90
                  ? '#10b981'
                  : '#3b82f6'
              "
              :height="12"
            />
          </div>
        </div>
      </div>
      <template #footer>
        <NSpace justify="end">
          <NButton @click="showDetailModal = false">关闭</NButton>
          <NButton type="info" @click="handleMessage(selectedStudent!)">
            <template #icon>
              <div class="i-mdi-message" />
            </template>
            发送消息
          </NButton>
          <NButton type="primary">
            <template #icon>
              <div class="i-mdi-pencil" />
            </template>
            编辑信息
          </NButton>
        </NSpace>
      </template>
    </NModal>

    <!-- 浮动操作按钮 -->
    <div class="floating-action-button" @click="showFloatingMenu = !showFloatingMenu">
      <div class="fab-icon" :class="{ 'fab-icon-active': showFloatingMenu }">
        <div class="i-mdi-plus text-24px" />
      </div>
      <Transition name="fab-menu">
        <div v-if="showFloatingMenu" class="fab-menu">
          <div class="fab-menu-item fab-menu-item-1" @click.stop="handleImport">
            <div class="fab-menu-icon i-mdi-account-plus" />
            <span class="fab-menu-label">添加学生</span>
          </div>
          <div class="fab-menu-item fab-menu-item-2" @click.stop="handleBatchNotify">
            <div class="fab-menu-icon i-mdi-email-send" />
            <span class="fab-menu-label">群发通知</span>
          </div>
          <div class="fab-menu-item fab-menu-item-3" @click.stop="handleExport">
            <div class="fab-menu-icon i-mdi-download" />
            <span class="fab-menu-label">导出数据</span>
          </div>
          <div class="fab-menu-item fab-menu-item-4" @click.stop="handleGenerateReport">
            <div class="fab-menu-icon i-mdi-chart-box" />
            <span class="fab-menu-label">生成报告</span>
          </div>
        </div>
      </Transition>
    </div>

    <!-- 返回顶部按钮 -->
    <Transition name="fade">
      <div v-if="showFloatingMenu" class="back-to-top" @click="scrollToTop">
        <div class="i-mdi-arrow-up text-24px" />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.student-dashboard {
  padding: 16px;
  min-height: 100vh;
}

/* 顶部标题栏 */
.dashboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-decoration {
  width: 4px;
  height: 24px;
  background: linear-gradient(180deg, #18a058 0%, transparent 100%);
  border-radius: 2px;
}

.header-title {
  font-size: 24px;
  font-weight: bold;
  color: #1f2937;
  letter-spacing: 0.5px;
  margin: 0;
}

/* 统计卡片 */
.stat-card {
  position: relative;
  padding: 24px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  cursor: pointer;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  transition: height 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
}

.stat-card:hover::before {
  height: 5px;
}

.stat-card:active {
  transform: translateY(-2px);
}

.stat-card-1::before {
  background: #3b82f6;
}
.stat-card-2::before {
  background: #10b981;
}
.stat-card-3::before {
  background: #f59e0b;
}
.stat-card-4::before {
  background: #8b5cf6;
}

.stat-icon-wrapper {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  border-radius: 12px;
  color: #6b7280;
}

.stat-card-1 .stat-icon-wrapper {
  background: #dbeafe;
  color: #3b82f6;
}

.stat-card-2 .stat-icon-wrapper {
  background: #d1fae5;
  color: #10b981;
}

.stat-card-3 .stat-icon-wrapper {
  background: #fef3c7;
  color: #f59e0b;
}

.stat-card-4 .stat-icon-wrapper {
  background: #ede9fe;
  color: #8b5cf6;
}

.stat-content {
  position: relative;
  z-index: 1;
}

.stat-value {
  font-size: 36px;
  font-weight: bold;
  color: #1f2937;
  line-height: 1.2;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #10b981;
}

.stat-decoration {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, rgba(0, 0, 0, 0.02) 0%, transparent 70%);
  border-radius: 50%;
}

/* 图表卡片 */
.chart-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.chart-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: #18a058;
}

.chart-header {
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.chart-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 4px;
}

.title-icon {
  font-size: 20px;
  color: #18a058;
}

.chart-subtitle {
  font-size: 12px;
  color: #6b7280;
  margin-left: 28px;
}

.chart-content-small {
  flex: 1;
  min-height: 200px;
}

/* 快捷操作 */
.quick-actions {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.actions-header {
  margin-bottom: 12px;
}

.actions-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: bold;
  color: #1f2937;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.action-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s;
}

.action-item:hover {
  background: #f3f4f6;
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.action-item:hover::before {
  left: 100%;
}

.action-item:active {
  transform: translateY(-1px) scale(1);
}

.action-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  flex-shrink: 0;
}

.action-item-blue .action-icon {
  background: #dbeafe;
  color: #3b82f6;
}

.action-item-green .action-icon {
  background: #d1fae5;
  color: #10b981;
}

.action-item-orange .action-icon {
  background: #fef3c7;
  color: #f59e0b;
}

.action-item-purple .action-icon {
  background: #ede9fe;
  color: #8b5cf6;
}

.action-content {
  flex: 1;
}

.action-title {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.action-desc {
  font-size: 12px;
  color: #6b7280;
}

/* 筛选器 */
.filter-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.filter-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.filter-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: bold;
  color: #1f2937;
}

.filter-title .title-icon {
  color: #18a058;
}

.view-mode-switch {
  display: flex;
  gap: 8px;
}

.filter-content {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.filter-input {
  width: 280px;
}

.filter-select {
  width: 180px;
}

/* 表格卡片 */
.table-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.table-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: bold;
  color: #1f2937;
}

.table-title .title-icon {
  color: #18a058;
}

.table-count {
  font-size: 12px;
  color: #6b7280;
}

/* 学生卡片 */
.student-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  cursor: pointer;
}

.student-card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  border-color: #18a058;
}

.student-card:hover .student-card-header {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
}

.student-card-header {
  position: relative;
  padding: 20px;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  display: flex;
  justify-content: center;
  align-items: center;
}

.status-tag {
  position: absolute;
  top: 12px;
  right: 12px;
}

.student-card-body {
  padding: 16px 20px;
}

.student-name {
  font-size: 18px;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 4px;
  text-align: center;
}

.student-id {
  font-size: 12px;
  color: #6b7280;
  text-align: center;
  margin-bottom: 4px;
}

.student-class {
  font-size: 12px;
  color: #18a058;
  text-align: center;
  margin-bottom: 16px;
}

.student-stats {
  display: flex;
  justify-content: space-around;
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;
}

.stat-item {
  text-align: center;
}

.stat-item .stat-label {
  font-size: 11px;
  color: #9ca3af;
  margin-bottom: 4px;
}

.stat-item .stat-value {
  font-size: 16px;
  font-weight: bold;
  color: #1f2937;
}

.student-card-footer {
  display: flex;
  justify-content: space-around;
  padding: 12px 20px;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
}

/* 排序工具栏 */
.sort-toolbar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.sort-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.empty-icon {
  font-size: 80px;
  color: #d1d5db;
  margin-bottom: 16px;
}

.empty-title {
  font-size: 18px;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 8px;
}

.empty-desc {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 24px;
}

/* 面包屑导航 */
.breadcrumb-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.breadcrumb-items {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #6b7280;
  cursor: pointer;
  transition: color 0.3s;
}

.breadcrumb-item:hover {
  color: #18a058;
}

.breadcrumb-active {
  color: #18a058;
  font-weight: 600;
}

.breadcrumb-separator {
  color: #d1d5db;
}

.time-display {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

/* 欢迎横幅 */
.welcome-banner {
  position: relative;
  padding: 24px 32px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 16px;
  margin-bottom: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.welcome-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 16px;
}

.welcome-icon {
  font-size: 48px;
  color: #fbbf24;
  animation: wave 2s ease-in-out infinite;
}

@keyframes wave {
  0%,
  100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(20deg);
  }
  75% {
    transform: rotate(-20deg);
  }
}

.welcome-text {
  flex: 1;
}

.welcome-title {
  font-size: 24px;
  font-weight: bold;
  color: #fff;
  margin: 0 0 4px 0;
}

.welcome-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}

.welcome-decoration {
  position: absolute;
  top: 0;
  right: 0;
  width: 200px;
  height: 100%;
  pointer-events: none;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.decoration-circle-1 {
  width: 120px;
  height: 120px;
  top: -40px;
  right: -20px;
  animation: float 6s ease-in-out infinite;
}

.decoration-circle-2 {
  width: 80px;
  height: 80px;
  top: 40px;
  right: 60px;
  animation: float 8s ease-in-out infinite;
}

.decoration-circle-3 {
  width: 60px;
  height: 60px;
  bottom: -20px;
  right: 100px;
  animation: float 7s ease-in-out infinite;
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

/* 学生标签云 */
.tags-cloud-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  height: 100%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}

.tags-cloud-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.tags-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.tags-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: bold;
  color: #1f2937;
}

.tags-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.tag-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #f9fafb;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  animation: tagFadeIn 0.5s ease-out both;
}

@keyframes tagFadeIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.tag-item:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.tag-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.2);
  }
}

.tag-name {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
}

.tag-count {
  font-size: 12px;
  font-weight: bold;
  color: #6b7280;
  background: #e5e7eb;
  padding: 2px 8px;
  border-radius: 10px;
}

.rotating {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 进度环卡片 */
.progress-rings-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  height: 100%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}

.progress-rings-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.rings-header {
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.rings-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: bold;
  color: #1f2937;
}

.progress-rings {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 20px;
}

.ring-item {
  flex: 1;
  display: flex;
  justify-content: center;
}

.ring-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
}

.ring-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.ring-bg {
  fill: none;
  stroke: #f3f4f6;
  stroke-width: 8;
}

.ring-progress {
  fill: none;
  stroke-width: 8;
  stroke-linecap: round;
  stroke-dasharray: 251.2;
  transition: stroke-dashoffset 1.5s ease-out;
}

.ring-progress-1 {
  stroke: #3b82f6;
  animation: ringGlow1 2s ease-in-out infinite;
}

.ring-progress-2 {
  stroke: #10b981;
  animation: ringGlow2 2s ease-in-out infinite;
}

.ring-progress-3 {
  stroke: #f59e0b;
  animation: ringGlow3 2s ease-in-out infinite;
}

.ring-offset-83 {
  stroke-dashoffset: 42.704;
}

.ring-offset-92 {
  stroke-dashoffset: 20.096;
}

.ring-offset-94 {
  stroke-dashoffset: 15.072;
}

@keyframes ringGlow1 {
  0%,
  100% {
    filter: drop-shadow(0 0 4px #3b82f6);
  }
  50% {
    filter: drop-shadow(0 0 8px #3b82f6);
  }
}

@keyframes ringGlow2 {
  0%,
  100% {
    filter: drop-shadow(0 0 4px #10b981);
  }
  50% {
    filter: drop-shadow(0 0 8px #10b981);
  }
}

@keyframes ringGlow3 {
  0%,
  100% {
    filter: drop-shadow(0 0 4px #f59e0b);
  }
  50% {
    filter: drop-shadow(0 0 8px #f59e0b);
  }
}

.ring-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.ring-value {
  font-size: 24px;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 4px;
}

.ring-label {
  font-size: 12px;
  color: #6b7280;
}

/* 最近活动卡片 */
.activity-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  height: 100%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}

.activity-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.activity-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.activity-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: bold;
  color: #1f2937;
}

.activity-timeline {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.timeline-item {
  display: flex;
  gap: 16px;
  position: relative;
  padding: 16px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid #e5e7eb;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.timeline-item:hover {
  border-color: #18a058;
  box-shadow: 0 4px 12px rgba(24, 160, 88, 0.1);
  transform: translateY(-2px);
}

.timeline-item:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 39px;
  top: 64px;
  bottom: -12px;
  width: 2px;
  background: linear-gradient(180deg, #e5e7eb 0%, transparent 100%);
  z-index: 0;
}

.timeline-avatar {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.timeline-avatar::before {
  content: '';
  position: absolute;
  inset: 0;
  background: inherit;
  opacity: 0.3;
  filter: blur(20px);
  z-index: -1;
}

.timeline-item:hover .timeline-avatar {
  transform: scale(1.15) rotate(-5deg);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.avatar-text {
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 1;
}

.avatar-grade {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.avatar-grade::after {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
  animation: shimmer 3s ease-in-out infinite;
}

.avatar-attendance {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.avatar-attendance::after {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
  animation: shimmer 3s ease-in-out infinite 1s;
}

.avatar-message {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.avatar-message::after {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
  animation: shimmer 3s ease-in-out infinite 2s;
}

@keyframes shimmer {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
    opacity: 0;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 1;
  }
}

.timeline-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.timeline-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.timeline-text {
  font-size: 15px;
  color: #1f2937;
  line-height: 1.5;
  flex: 1;
}

.timeline-student {
  font-weight: 700;
  color: #18a058;
}

.timeline-action {
  margin-left: 4px;
  color: #4b5563;
}

.timeline-badge {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  flex-shrink: 0;
}

.badge-grade {
  background: #eff6ff;
  color: #3b82f6;
}

.badge-attendance {
  background: #f0fdf4;
  color: #10b981;
}

.badge-message {
  background: #fffbeb;
  color: #f59e0b;
}

.timeline-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.timeline-time {
  font-size: 12px;
  color: #9ca3af;
  display: flex;
  align-items: center;
  gap: 6px;
}

.timeline-time::before {
  content: '';
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #d1d5db;
}

.timeline-arrow {
  font-size: 18px;
  color: #d1d5db;
  transition: all 0.3s;
}

.timeline-item:hover .timeline-arrow {
  color: #18a058;
  transform: translateX(4px);
}

/* 活动统计摘要 */
.activity-summary {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 24px;
  margin-top: 20px;
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 1;
  justify-content: center;
  transition: all 0.3s;
  padding: 8px;
  border-radius: 12px;
  cursor: pointer;
}

.summary-item:hover {
  background: #f9fafb;
  transform: translateY(-2px);
}

.summary-icon-wrapper {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.summary-icon-wrapper::before {
  content: '';
  position: absolute;
  inset: 0;
  background: inherit;
  opacity: 0.2;
  filter: blur(12px);
  z-index: 0;
}

.summary-icon {
  font-size: 26px;
  position: relative;
  z-index: 1;
  width: 26px;
  height: 26px;
  display: inline-block;
}

.summary-item:hover .summary-icon-wrapper {
  transform: scale(1.1) rotate(-5deg);
}

.summary-item-blue .summary-icon-wrapper {
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
}

.summary-item-blue .summary-icon {
  color: #fff;
}

.summary-item-green .summary-icon-wrapper {
  background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
}

.summary-item-green .summary-icon {
  color: #fff;
}

.summary-item-orange .summary-icon-wrapper {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
}

.summary-item-orange .summary-icon {
  color: #fff;
}

.summary-content {
  text-align: left;
}

.summary-value {
  font-size: 24px;
  font-weight: 800;
  color: #1f2937;
  line-height: 1.2;
  margin-bottom: 4px;
}

.summary-label {
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
}

.summary-divider {
  width: 1px;
  height: 48px;
  background: linear-gradient(180deg, transparent 0%, #e5e7eb 50%, transparent 100%);
}

/* 活动底部 */
.activity-footer {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

/* 成绩等级分布卡片 */
.grade-distribution-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  height: 100%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}

.grade-distribution-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.grade-header {
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.grade-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: bold;
  color: #1f2937;
}

.grade-levels-compact {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.grade-level-compact {
  padding: 12px;
  border-radius: 10px;
  transition: all 0.3s;
  cursor: pointer;
}

.grade-level-compact:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.grade-level-excellent {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
}

.grade-level-good {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
}

.grade-level-pass {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
}

.grade-level-fail {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
}

.grade-compact-top {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.grade-level-icon {
  font-size: 24px;
  color: #1f2937;
  flex-shrink: 0;
}

.grade-compact-info {
  flex: 1;
}

.grade-level-label {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.2;
}

.grade-level-range {
  font-size: 11px;
  color: #6b7280;
  margin-top: 2px;
}

.grade-compact-middle {
  padding: 8px 12px 8px 34px;
}

.grade-progress-bar {
  width: 100%;
  height: 6px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
  overflow: hidden;
  position: relative;
}

.grade-progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 1.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.grade-progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shimmerBar 2s ease-in-out infinite;
}

@keyframes shimmerBar {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.grade-fill-excellent {
  width: 33.3%;
  background: linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%);
}

.grade-fill-good {
  width: 50%;
  background: linear-gradient(90deg, #60a5fa 0%, #3b82f6 100%);
}

.grade-fill-pass {
  width: 16.7%;
  background: linear-gradient(90deg, #34d399 0%, #10b981 100%);
}

.grade-fill-fail {
  width: 0%;
  background: linear-gradient(90deg, #f87171 0%, #ef4444 100%);
}

.grade-compact-bottom {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 0 12px 0 34px;
}

.grade-level-value {
  font-size: 18px;
  font-weight: bold;
  color: #1f2937;
}

.grade-level-percent {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
}

/* 成绩总结 */
.grade-summary {
  margin-top: 16px;
  padding: 16px;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  border-radius: 10px;
  border: 1px solid #e5e7eb;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.summary-row:not(:last-child) {
  border-bottom: 1px dashed #e5e7eb;
}

.summary-label {
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
}

.summary-value-highlight {
  font-size: 20px;
  font-weight: 800;
  color: #f59e0b;
  text-shadow: 0 2px 4px rgba(245, 158, 11, 0.2);
}

.summary-value-success {
  font-size: 20px;
  font-weight: 800;
  color: #10b981;
  text-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);
}

/* 浮动操作按钮 */
.floating-action-button {
  position: fixed;
  bottom: 32px;
  right: 32px;
  z-index: 1000;
}

.fab-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #18a058 0%, #059669 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(24, 160, 88, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fab-icon:hover {
  transform: scale(1.1) rotate(90deg);
  box-shadow: 0 6px 20px rgba(24, 160, 88, 0.5);
}

.fab-icon-active {
  transform: rotate(45deg);
}

.fab-menu {
  position: absolute;
  bottom: 70px;
  right: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.fab-menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #fff;
  border-radius: 28px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.fab-menu-item:hover {
  transform: translateX(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.fab-menu-item-1 {
  animation: fabSlideIn 0.3s ease-out 0.1s both;
}

.fab-menu-item-2 {
  animation: fabSlideIn 0.3s ease-out 0.2s both;
}

.fab-menu-item-3 {
  animation: fabSlideIn 0.3s ease-out 0.3s both;
}

.fab-menu-item-4 {
  animation: fabSlideIn 0.3s ease-out 0.4s both;
}

@keyframes fabSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fab-menu-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #18a058;
}

.fab-menu-label {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
}

/* 返回顶部按钮 */
.back-to-top {
  position: fixed;
  bottom: 32px;
  right: 104px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #18a058;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.3s;
  z-index: 999;
}

.back-to-top:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  background: #18a058;
  color: #fff;
}

/* 过渡动画 */
.fab-menu-enter-active,
.fab-menu-leave-active {
  transition: all 0.3s ease;
}

.fab-menu-enter-from,
.fab-menu-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 学生详情模态框 */
.student-detail-modal {
  max-width: 600px;
  width: 90%;
}

.detail-content {
  padding: 8px 0;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border-radius: 12px;
}

.detail-header-info {
  flex: 1;
}

.detail-name {
  font-size: 24px;
  font-weight: bold;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.detail-id {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
}

.detail-section {
  margin: 16px 0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 16px;
}

.info-item {
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
}

.info-label {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 4px;
}

.info-value {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.data-card {
  padding: 16px;
  border-radius: 12px;
  text-align: center;
  transition: all 0.3s;
}

.data-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.data-card-blue {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
}

.data-card-green {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
}

.data-card-orange {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
}

.data-icon {
  font-size: 32px;
  color: #1f2937;
  margin-bottom: 8px;
}

.data-value {
  font-size: 28px;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 4px;
}

.data-label {
  font-size: 12px;
  color: #6b7280;
}

.assignment-progress {
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
  color: #1f2937;
}

.progress-percent {
  font-weight: bold;
  color: #18a058;
}

/* 响应式 */
@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    gap: 16px;
  }

  .header-title {
    font-size: 18px;
  }

  .stat-value {
    font-size: 28px;
  }

  .filter-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .filter-content {
    flex-direction: column;
  }

  .filter-input,
  .filter-select {
    width: 100%;
  }

  .sort-toolbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .detail-header {
    flex-direction: column;
    text-align: center;
  }
}
</style>
