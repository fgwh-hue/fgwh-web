<script setup lang="ts">
import { computed, h, ref } from 'vue';
import type { DataTableColumns } from 'naive-ui';
import { NButton, NProgress, NTag } from 'naive-ui';
import type { ECOption } from '@/hooks/common/echarts';
import { useEcharts } from '@/hooks/common/echarts';

defineOptions({
  name: 'TeacherAssignment'
});

interface Assignment {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  submitted: number;
  total: number;
  status: 'pending' | 'grading' | 'completed';
  avgScore?: number;
  priority?: 'high' | 'medium' | 'low';
}

const assignments = ref<Assignment[]>([
  {
    id: '1',
    title: '第5章练习题',
    course: '高等数学',
    dueDate: '2024-03-15',
    submitted: 38,
    total: 45,
    status: 'grading',
    avgScore: 82,
    priority: 'high'
  },
  {
    id: '2',
    title: '英文作文',
    course: '英语写作',
    dueDate: '2024-03-20',
    submitted: 28,
    total: 38,
    status: 'pending',
    avgScore: 0,
    priority: 'medium'
  },
  {
    id: '3',
    title: '实验报告',
    course: '物理实验',
    dueDate: '2024-03-10',
    submitted: 42,
    total: 42,
    status: 'completed',
    avgScore: 88,
    priority: 'low'
  },
  {
    id: '4',
    title: '化学方程式',
    course: '化学基础',
    dueDate: '2024-03-25',
    submitted: 0,
    total: 31,
    status: 'pending',
    avgScore: 0,
    priority: 'low'
  },
  {
    id: '5',
    title: '编程作业1',
    course: '程序设计',
    dueDate: '2024-03-18',
    submitted: 45,
    total: 52,
    status: 'grading',
    avgScore: 85,
    priority: 'high'
  },
  {
    id: '6',
    title: '数据结构实验',
    course: '数据结构',
    dueDate: '2024-03-22',
    submitted: 48,
    total: 48,
    status: 'completed',
    avgScore: 90,
    priority: 'medium'
  },
  {
    id: '7',
    title: '古代文学赏析',
    course: '中国文学',
    dueDate: '2024-03-28',
    submitted: 32,
    total: 35,
    status: 'grading',
    avgScore: 87,
    priority: 'medium'
  },
  {
    id: '8',
    title: '电路分析实验',
    course: '电子技术',
    dueDate: '2024-03-30',
    submitted: 25,
    total: 30,
    status: 'pending',
    avgScore: 0,
    priority: 'high'
  },
  {
    id: '9',
    title: '市场营销案例分析',
    course: '市场营销',
    dueDate: '2024-04-05',
    submitted: 18,
    total: 22,
    status: 'grading',
    avgScore: 83,
    priority: 'medium'
  },
  {
    id: '10',
    title: '数据库设计',
    course: '数据库原理',
    dueDate: '2024-04-10',
    submitted: 42,
    total: 45,
    status: 'completed',
    avgScore: 89,
    priority: 'high'
  }
]);

const searchText = ref('');
const selectedCourse = ref<string | null>(null);
const selectedStatus = ref<string | null>(null);

const filteredAssignments = computed(() => {
  return assignments.value.filter(assignment => {
    const matchSearch = !searchText.value || assignment.title.includes(searchText.value);
    const matchCourse = !selectedCourse.value || assignment.course === selectedCourse.value;
    const matchStatus = !selectedStatus.value || assignment.status === selectedStatus.value;
    return matchSearch && matchCourse && matchStatus;
  });
});

// 统计数据
const totalAssignments = computed(() => assignments.value.length);
const gradingCount = computed(() => assignments.value.filter(a => a.status === 'grading').length);
const completedCount = computed(() => assignments.value.filter(a => a.status === 'completed').length);
const avgCompletionRate = computed(() => {
  if (assignments.value.length === 0) return 0;
  const total = assignments.value.reduce((sum, a) => sum + (a.submitted / a.total) * 100, 0);
  return Math.round(total / assignments.value.length);
});

// 提交趋势数据
const submissionTrend = [
  { date: '03-10', count: 42, target: 45 },
  { date: '03-11', count: 38, target: 45 },
  { date: '03-12', count: 45, target: 45 },
  { date: '03-13', count: 28, target: 38 },
  { date: '03-14', count: 35, target: 42 },
  { date: '03-15', count: 48, target: 52 },
  { date: '03-16', count: 52, target: 52 }
];

// 课程分布数据
const courseDistribution = [
  { name: '高等数学', value: 45, color: '#3b82f6' },
  { name: '英语写作', value: 38, color: '#10b981' },
  { name: '物理实验', value: 42, color: '#f59e0b' },
  { name: '化学基础', value: 31, color: '#8b5cf6' },
  { name: '程序设计', value: 52, color: '#06b6d4' },
  { name: '数据结构', value: 48, color: '#ec4899' }
];

// 成绩分布数据
const scoreDistribution = [
  { range: '90-100', count: 45, color: '#10b981' },
  { range: '80-89', count: 78, color: '#3b82f6' },
  { range: '70-79', count: 52, color: '#f59e0b' },
  { range: '60-69', count: 28, color: '#f97316' },
  { range: '0-59', count: 12, color: '#6b7280' }
];

// 提交趋势图表
const { domRef: trendDomRef } = useEcharts(() => {
  const option: ECOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e5e7eb',
      textStyle: { color: '#1f2937' }
    },
    legend: { data: ['实际提交', '目标人数'], textStyle: { color: '#6b7280' }, top: 0 },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '15%', containLabel: true },
    xAxis: {
      type: 'category',
      data: submissionTrend.map(item => item.date),
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
        name: '实际提交',
        type: 'line',
        data: submissionTrend.map(item => item.count),
        smooth: true,
        itemStyle: { color: '#18a058' },
        lineStyle: { width: 3 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(24, 160, 88, 0.2)' },
              { offset: 1, color: 'rgba(24, 160, 88, 0.02)' }
            ]
          }
        }
      },
      {
        name: '目标人数',
        type: 'line',
        data: submissionTrend.map(item => item.target),
        smooth: true,
        itemStyle: { color: '#9ca3af' },
        lineStyle: { type: 'dashed', width: 2 }
      }
    ]
  };
  return option;
});

// 课程分布图表
const { domRef: courseDomRef } = useEcharts(() => {
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
        name: '课程分布',
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
        data: courseDistribution.map(item => ({
          value: item.value,
          name: item.name,
          itemStyle: { color: item.color }
        }))
      }
    ]
  };
  return option;
});

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

const columns: DataTableColumns<Assignment> = [
  {
    title: '作业标题',
    key: 'title',
    width: 180,
    render: row =>
      h('div', { class: 'flex-y-center gap-8px' }, [
        h('div', { class: 'size-8px rd-1/2 bg-#18a058' }),
        h('span', { class: 'text-#1f2937 font-medium' }, row.title)
      ])
  },
  {
    title: '课程',
    key: 'course',
    width: 120,
    render: row => h('span', { class: 'text-#6b7280' }, row.course)
  },
  {
    title: '截止日期',
    key: 'dueDate',
    width: 120,
    render: row => h('span', { class: 'text-#6b7280' }, row.dueDate)
  },
  {
    title: '提交情况',
    key: 'submitted',
    width: 200,
    render: row => {
      const percentage = Math.round((row.submitted / row.total) * 100);
      return h('div', { class: 'flex-y-center gap-8px' }, [
        h(NProgress, {
          type: 'line',
          percentage,
          showIndicator: false,
          color: '#18a058',
          railColor: 'rgba(24, 160, 88, 0.1)'
        }),
        h('span', { class: 'text-12px text-#18a058' }, `${row.submitted}/${row.total}`)
      ]);
    }
  },
  {
    title: '平均分',
    key: 'avgScore',
    width: 100,
    render: row => h('span', { class: 'text-#18a058 font-bold' }, row.avgScore ? `${row.avgScore}分` : '-')
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
    render: row => {
      const typeMap = { pending: 'warning', grading: 'info', completed: 'success' };
      const textMap = { pending: '待发布', grading: '批改中', completed: '已完成' };
      return h(NTag, { type: typeMap[row.status] as any, bordered: false }, { default: () => textMap[row.status] });
    }
  },
  {
    title: '操作',
    key: 'actions',
    width: 250,
    fixed: 'right',
    render: row =>
      h('div', { class: 'flex gap-8px' }, [
        h(
          NButton,
          { text: true, type: 'primary', size: 'small', onClick: () => handleViewSubmissions(row) },
          { default: () => '查看' }
        ),
        h(
          NButton,
          { text: true, type: 'info', size: 'small', onClick: () => handleGrade(row) },
          { default: () => '批改' }
        ),
        h(
          NButton,
          { text: true, type: 'warning', size: 'small', onClick: () => handleEdit(row) },
          { default: () => '编辑' }
        ),

        h(
          NButton,
          { text: true, type: 'error', size: 'small', onClick: () => handleDelete(row.id) },
          { default: () => '删除' }
        )
      ])
  }
];

function handleViewSubmissions(assignment: Assignment) {
  const completionRate = assignment.total > 0 ? Math.round((assignment.submitted / assignment.total) * 100) : 0;
  window.$dialog?.info({
    title: `${assignment.title} - 提交情况`,
    content: `已提交: ${assignment.submitted}/${assignment.total}\n完成率: ${completionRate}%`,
    positiveText: '关闭'
  });
}

// 编辑相关状态
const showEditModal = ref(false);
const editingAssignment = ref<Assignment | null>(null);

// 添加作业相关状态
const showAddModal = ref(false);
const newAssignment = ref<Assignment>({
  id: '',
  title: '',
  course: '',
  dueDate: '',
  submitted: 0,
  total: 0,
  status: 'pending',
  avgScore: 0,
  priority: 'medium'
});

// 批改作业相关状态
const showGradeModal = ref(false);
const gradingAssignment = ref<Assignment | null>(null);

// 模拟学生提交数据
interface StudentSubmission {
  id: string;
  studentName: string;
  studentId: string;
  submittedAt: string;
  score: number;
  status: 'submitted' | 'graded';
  content?: string;
  feedback?: string;
}

const studentSubmissions = ref<StudentSubmission[]>([]);

function handleGrade(assignment: Assignment) {
  gradingAssignment.value = assignment;
  // 生成模拟学生提交数据
  studentSubmissions.value = generateMockSubmissions(assignment.total, assignment.submitted);
  showGradeModal.value = true;
}

// 生成模拟学生提交数据
function generateMockSubmissions(total: number, submitted: number): StudentSubmission[] {
  const submissions: StudentSubmission[] = [];
  const names = ['李明', '王芳', '张三', '刘四', '陈五', '赵六', '孙七', '周八', '吴九', '郑十'];

  // 参数验证
  const safeTotal = Math.max(0, total);
  const safeSubmitted = Math.max(0, Math.min(submitted, safeTotal));

  for (let i = 0; i < safeSubmitted; i += 1) {
    submissions.push({
      id: (i + 1).toString(),
      studentName: names[i % names.length],
      studentId: `STU${String(i + 1).padStart(3, '0')}`,
      submittedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      score: Math.floor(Math.random() * 20) + 70, // 70-90分
      status: Math.random() > 0.5 ? 'graded' : 'submitted',
      content: `这是${names[i % names.length]}提交的作业内容...`,
      feedback: Math.random() > 0.5 ? '作业完成良好，继续保持！' : undefined
    });
  }

  // 添加未提交的学生
  for (let i = safeSubmitted; i < safeTotal; i += 1) {
    submissions.push({
      id: (i + 1).toString(),
      studentName: names[i % names.length],
      studentId: `STU${String(i + 1).padStart(3, '0')}`,
      submittedAt: '',
      score: 0,
      status: 'submitted'
    });
  }

  return submissions;
}

function handleEditGrade(submission: StudentSubmission) {
  // 这里可以实现单个学生作业的详细批改界面
  window.$message?.info(`正在批改 ${submission.studentName} 的作业`);
}

function handleSaveGrades() {
  // 计算平均分并更新作业状态
  if (gradingAssignment.value) {
    const gradedSubmissions = studentSubmissions.value.filter(s => s.status === 'graded');
    if (gradedSubmissions.length > 0) {
      const avgScore = Math.round(gradedSubmissions.reduce((sum, s) => sum + s.score, 0) / gradedSubmissions.length);
      gradingAssignment.value.avgScore = avgScore;
      gradingAssignment.value.submitted = studentSubmissions.value.filter(s => s.submittedAt).length;

      // 更新作业列表中的数据
      const index = assignments.value.findIndex(a => a.id === gradingAssignment.value!.id);
      if (index > -1) {
        assignments.value[index] = gradingAssignment.value;
      }

      window.$message?.success('成绩已保存');
    }
  }
  showGradeModal.value = false;
}

function handleEdit(assignment: Assignment) {
  editingAssignment.value = JSON.parse(JSON.stringify(assignment));
  showEditModal.value = true;
}

function handleSaveEdit() {
  if (editingAssignment.value) {
    const index = assignments.value.findIndex(a => a.id === editingAssignment.value!.id);
    if (index > -1) {
      assignments.value[index] = editingAssignment.value;
      window.$message?.success('作业已更新');
    }
  }
  showEditModal.value = false;
}

// 添加作业相关函数
function handleAdd() {
  showAddModal.value = true;
}

function handleSaveAdd() {
  // 生成唯一ID
  newAssignment.value.id = Date.now().toString();
  // 添加到作业列表
  assignments.value.unshift(newAssignment.value); // 添加到列表顶部，方便查看
  // 重置表单
  newAssignment.value = {
    id: '',
    title: '',
    course: '',
    dueDate: '',
    submitted: 0,
    total: 0,
    status: 'pending',
    avgScore: 0,
    priority: 'medium'
  };
  // 关闭模态框
  showAddModal.value = false;
  window.$message?.success('作业已添加');
  // 重置筛选条件，确保新作业能显示
  searchText.value = '';
  selectedCourse.value = null;
  selectedStatus.value = null;
  // 滚动到作业列表
  setTimeout(() => {
    const tableElement = document.querySelector('.table-card');
    if (tableElement) {
      tableElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 100);
}

function handleCancelAdd() {
  // 重置表单
  newAssignment.value = {
    id: '',
    title: '',
    course: '',
    dueDate: '',
    submitted: 0,
    total: 0,
    status: 'pending',
    avgScore: 0,
    priority: 'medium'
  };
  // 关闭模态框
  showAddModal.value = false;
}

function handleDelete(id: string) {
  window.$dialog?.warning({
    title: '确认删除',
    content: '确认删除此作业吗？',
    positiveText: '确认',
    negativeText: '取消',
    onPositiveClick: () => {
      const index = assignments.value.findIndex(a => a.id === id);
      if (index > -1) {
        assignments.value.splice(index, 1);
        window.$message?.success('作业已删除');
      }
    }
  });
}
</script>

<template>
  <div class="assignment-dashboard">
    <!-- 顶部标题栏 -->
    <div class="dashboard-header">
      <div class="header-left">
        <div class="header-decoration" />
        <h2 class="header-title">作业管理</h2>
        <div class="header-decoration" />
      </div>
      <div class="header-right">
        <NButton type="primary" class="golden-button" @click="handleAdd">发布新作业</NButton>
      </div>
    </div>

    <!-- 核心数据统计卡片 -->
    <NGrid :x-gap="16" :y-gap="16" responsive="screen" item-responsive class="mt-16px">
      <NGi span="24 s:12 m:6">
        <div class="stat-card stat-card-1">
          <div class="stat-icon-wrapper">
            <div class="i-mdi-file-document-multiple text-40px" />
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ totalAssignments }}</div>
            <div class="stat-label">总作业数</div>
            <div class="stat-trend">
              <span class="i-mdi-trending-up" />
              <span>较上周 +2</span>
            </div>
          </div>
          <div class="stat-decoration" />
        </div>
      </NGi>
      <NGi span="24 s:12 m:6">
        <div class="stat-card stat-card-2">
          <div class="stat-icon-wrapper">
            <div class="i-mdi-pencil text-40px" />
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ gradingCount }}</div>
            <div class="stat-label">批改中</div>
            <div class="stat-trend">
              <span class="i-mdi-clock-outline" />
              <span>待处理</span>
            </div>
          </div>
          <div class="stat-decoration" />
        </div>
      </NGi>
      <NGi span="24 s:12 m:6">
        <div class="stat-card stat-card-3">
          <div class="stat-icon-wrapper">
            <div class="i-mdi-check-circle text-40px" />
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ completedCount }}</div>
            <div class="stat-label">已完成</div>
            <div class="stat-trend">
              <span class="i-mdi-check" />
              <span>本周完成</span>
            </div>
          </div>
          <div class="stat-decoration" />
        </div>
      </NGi>
      <NGi span="24 s:12 m:6">
        <div class="stat-card stat-card-4">
          <div class="stat-icon-wrapper">
            <div class="i-mdi-chart-line text-40px" />
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ avgCompletionRate }}%</div>
            <div class="stat-label">平均完成率</div>
            <div class="stat-trend">
              <span class="i-mdi-trending-up" />
              <span>较上周 +5%</span>
            </div>
          </div>
          <div class="stat-decoration" />
        </div>
      </NGi>
    </NGrid>

    <!-- 数据可视化区域 -->
    <NGrid :x-gap="16" :y-gap="16" responsive="screen" item-responsive class="mt-16px">
      <!-- 提交趋势分析 -->
      <NGi span="24 s:24 m:12">
        <div class="chart-card">
          <div class="chart-header">
            <div class="chart-title">
              <div class="title-icon i-mdi-chart-timeline-variant" />
              <span>提交趋势分析</span>
            </div>
            <div class="chart-subtitle">近7日作业提交情况</div>
          </div>
          <div ref="trendDomRef" class="chart-content" />
          <div class="chart-footer">
            <div class="footer-item">
              <span class="footer-label">峰值</span>
              <span class="footer-value">52人</span>
            </div>
            <div class="footer-item">
              <span class="footer-label">平均</span>
              <span class="footer-value">41人</span>
            </div>
            <div class="footer-item">
              <span class="footer-label">达标率</span>
              <span class="footer-value">85.7%</span>
            </div>
          </div>
        </div>
      </NGi>

      <!-- 课程分布 -->
      <NGi span="24 s:24 m:12">
        <div class="chart-card">
          <div class="chart-header">
            <div class="chart-title">
              <div class="title-icon i-mdi-chart-donut" />
              <span>课程作业分布</span>
            </div>
            <div class="chart-subtitle">各课程作业数量占比</div>
          </div>
          <div ref="courseDomRef" class="chart-content" />
          <div class="chart-footer">
            <div class="footer-item">
              <span class="footer-label">最多</span>
              <span class="footer-value">程序设计 52人</span>
            </div>
            <div class="footer-item">
              <span class="footer-label">最少</span>
              <span class="footer-value">化学基础 31人</span>
            </div>
          </div>
        </div>
      </NGi>

      <!-- 成绩分布 -->
      <NGi span="24 s:24 m:12">
        <div class="chart-card">
          <div class="chart-header">
            <div class="chart-title">
              <div class="title-icon i-mdi-chart-bar" />
              <span>成绩分布统计</span>
            </div>
            <div class="chart-subtitle">已批改作业成绩分布</div>
          </div>
          <div ref="scoreDomRef" class="chart-content" />
          <div class="chart-footer">
            <div class="footer-item">
              <span class="footer-label">优秀率</span>
              <span class="footer-value">20.9%</span>
            </div>
            <div class="footer-item">
              <span class="footer-label">及格率</span>
              <span class="footer-value">94.4%</span>
            </div>
            <div class="footer-item">
              <span class="footer-label">平均分</span>
              <span class="footer-value">82.5分</span>
            </div>
          </div>
        </div>
      </NGi>

      <!-- 待办事项 -->
      <NGi span="24 s:24 m:12">
        <div class="chart-card">
          <div class="chart-header">
            <div class="chart-title">
              <div class="title-icon i-mdi-clipboard-list" />
              <span>待办事项</span>
            </div>
            <div class="chart-subtitle">需要处理的紧急任务</div>
          </div>
          <div class="todo-list">
            <div class="todo-item todo-high">
              <div class="todo-priority" />
              <div class="todo-content">
                <div class="todo-title">批改《第5章练习》作业</div>
                <div class="todo-meta">
                  <span>高等数学</span>
                  <span>·</span>
                  <span>38份待批改</span>
                  <span>·</span>
                  <span class="todo-deadline">今天 18:00</span>
                </div>
              </div>
              <NButton text type="primary" size="small">立即处理</NButton>
            </div>
            <div class="todo-item todo-high">
              <div class="todo-priority" />
              <div class="todo-content">
                <div class="todo-title">批改《编程作业1》</div>
                <div class="todo-meta">
                  <span>程序设计</span>
                  <span>·</span>
                  <span>45份待批改</span>
                  <span>·</span>
                  <span class="todo-deadline">明天 12:00</span>
                </div>
              </div>
              <NButton text type="primary" size="small">立即处理</NButton>
            </div>
            <div class="todo-item todo-medium">
              <div class="todo-priority" />
              <div class="todo-content">
                <div class="todo-title">发布《英文作文》作业</div>
                <div class="todo-meta">
                  <span>英语写作</span>
                  <span>·</span>
                  <span>待发布</span>
                  <span>·</span>
                  <span class="todo-deadline">明天 08:00</span>
                </div>
              </div>
              <NButton text type="info" size="small">查看详情</NButton>
            </div>
            <div class="todo-item todo-low">
              <div class="todo-priority" />
              <div class="todo-content">
                <div class="todo-title">准备下周课程资料</div>
                <div class="todo-meta">
                  <span>多门课程</span>
                  <span>·</span>
                  <span>准备中</span>
                  <span>·</span>
                  <span class="todo-deadline">本周五</span>
                </div>
              </div>
              <NButton text type="default" size="small">查看详情</NButton>
            </div>
          </div>
        </div>
      </NGi>
    </NGrid>

    <!-- 筛选器 -->
    <div class="filter-card mt-16px">
      <div class="filter-header">
        <div class="filter-title">
          <div class="title-icon i-mdi-filter-variant" />
          <span>筛选条件</span>
        </div>
      </div>
      <NSpace class="filter-content">
        <NInput v-model:value="searchText" placeholder="搜索作业标题" class="filter-input" clearable>
          <template #prefix>
            <div class="i-mdi-magnify" />
          </template>
        </NInput>
        <NSelect
          v-model:value="selectedCourse"
          placeholder="选择课程"
          class="filter-select"
          :options="[
            { label: '高等数学', value: '高等数学' },
            { label: '英语写作', value: '英语写作' },
            { label: '物理实验', value: '物理实验' },
            { label: '化学基础', value: '化学基础' },
            { label: '程序设计', value: '程序设计' },
            { label: '数据结构', value: '数据结构' }
          ]"
          clearable
        />
        <NSelect
          v-model:value="selectedStatus"
          placeholder="选择状态"
          class="filter-select"
          :options="[
            { label: '待发布', value: 'pending' },
            { label: '批改中', value: 'grading' },
            { label: '已完成', value: 'completed' }
          ]"
          clearable
        />
        <NButton
          class="filter-reset"
          @click="
            searchText = '';
            selectedCourse = null;
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

    <!-- 作业列表 -->
    <div class="table-card mt-16px">
      <div class="table-header">
        <div class="table-title">
          <div class="title-icon i-mdi-table" />
          <span>作业列表</span>
        </div>
        <div class="table-count">共 {{ filteredAssignments.length }} 条记录</div>
      </div>
      <NDataTable
        :columns="columns"
        :data="filteredAssignments"
        :pagination="{ pageSize: 10 }"
        :scroll-x="1100"
        class="golden-table"
      />
    </div>

    <!-- 编辑模态框 -->
    <NModal v-model:show="showEditModal" preset="card" title="编辑作业" class="w-600px">
      <div v-if="editingAssignment" class="edit-form">
        <NForm label-placement="left" :label-width="100">
          <NFormItem label="作业标题" required>
            <NInput v-model:value="editingAssignment.title" placeholder="请输入作业标题" />
          </NFormItem>
          <NFormItem label="所属课程" required>
            <NSelect
              v-model:value="editingAssignment.course"
              :options="[
                { label: '高等数学', value: '高等数学' },
                { label: '英语写作', value: '英语写作' },
                { label: '物理实验', value: '物理实验' },
                { label: '化学基础', value: '化学基础' },
                { label: '程序设计', value: '程序设计' },
                { label: '数据结构', value: '数据结构' },
                { label: '中国文学', value: '中国文学' },
                { label: '电子技术', value: '电子技术' },
                { label: '市场营销', value: '市场营销' },
                { label: '数据库原理', value: '数据库原理' }
              ]"
              placeholder="选择课程"
            />
          </NFormItem>
          <NFormItem label="截止日期" required>
            <NInput v-model:value="editingAssignment.dueDate" placeholder="请输入截止日期，格式：YYYY-MM-DD" />
          </NFormItem>
          <NFormItem label="提交人数">
            <NInputNumber v-model:value="editingAssignment.submitted" :min="0" />
          </NFormItem>
          <NFormItem label="总人数">
            <NInputNumber v-model:value="editingAssignment.total" :min="0" />
          </NFormItem>
          <NFormItem label="平均分">
            <NInputNumber v-model:value="editingAssignment.avgScore" :min="0" :max="100" />
          </NFormItem>
          <NFormItem label="作业状态" required>
            <NSelect
              v-model:value="editingAssignment.status"
              :options="[
                { label: '待发布', value: 'pending' },
                { label: '批改中', value: 'grading' },
                { label: '已完成', value: 'completed' }
              ]"
              placeholder="选择状态"
            />
          </NFormItem>
          <NFormItem label="优先级">
            <NSelect
              v-model:value="editingAssignment.priority"
              :options="[
                { label: '高', value: 'high' },
                { label: '中', value: 'medium' },
                { label: '低', value: 'low' }
              ]"
              placeholder="选择优先级"
            />
          </NFormItem>
        </NForm>
      </div>
      <template #footer>
        <NSpace justify="end">
          <NButton @click="showEditModal = false">取消</NButton>
          <NButton type="primary" @click="handleSaveEdit">保存</NButton>
        </NSpace>
      </template>
    </NModal>

    <!-- 添加作业模态框 -->
    <NModal v-model:show="showAddModal" preset="card" title="添加作业" class="w-600px">
      <div class="add-form">
        <NForm label-placement="left" :label-width="100">
          <NFormItem label="作业标题" required>
            <NInput v-model:value="newAssignment.title" placeholder="请输入作业标题" />
          </NFormItem>
          <NFormItem label="所属课程" required>
            <NSelect
              v-model:value="newAssignment.course"
              :options="[
                { label: '高等数学', value: '高等数学' },
                { label: '英语写作', value: '英语写作' },
                { label: '物理实验', value: '物理实验' },
                { label: '化学基础', value: '化学基础' },
                { label: '程序设计', value: '程序设计' },
                { label: '数据结构', value: '数据结构' },
                { label: '中国文学', value: '中国文学' },
                { label: '电子技术', value: '电子技术' },
                { label: '市场营销', value: '市场营销' },
                { label: '数据库原理', value: '数据库原理' }
              ]"
              placeholder="选择课程"
            />
          </NFormItem>
          <NFormItem label="截止日期" required>
            <NInput v-model:value="newAssignment.dueDate" placeholder="请输入截止日期，格式：YYYY-MM-DD" />
          </NFormItem>
          <NFormItem label="总人数" required>
            <NInputNumber v-model:value="newAssignment.total" :min="1" placeholder="请输入班级总人数" />
          </NFormItem>
          <NFormItem label="作业状态" required>
            <NSelect
              v-model:value="newAssignment.status"
              :options="[
                { label: '待发布', value: 'pending' },
                { label: '批改中', value: 'grading' },
                { label: '已完成', value: 'completed' }
              ]"
              placeholder="选择状态"
            />
          </NFormItem>
          <NFormItem label="优先级">
            <NSelect
              v-model:value="newAssignment.priority"
              :options="[
                { label: '高', value: 'high' },
                { label: '中', value: 'medium' },
                { label: '低', value: 'low' }
              ]"
              placeholder="选择优先级"
            />
          </NFormItem>
        </NForm>
      </div>
      <template #footer>
        <NSpace justify="end">
          <NButton @click="handleCancelAdd">取消</NButton>
          <NButton type="primary" @click="handleSaveAdd">保存</NButton>
        </NSpace>
      </template>
    </NModal>

    <!-- 批改作业模态框 -->
    <NModal v-model:show="showGradeModal" preset="dialog" title="批改作业" class="w-800px" :show-icon="false">
      <div v-if="gradingAssignment" class="grade-modal">
        <div class="grade-header">
          <h3>{{ gradingAssignment.title }}</h3>
          <p class="grade-subtitle">
            课程：{{ gradingAssignment.course }} | 截止日期：{{ gradingAssignment.dueDate }} | 提交率：{{
              Math.round((gradingAssignment.submitted / gradingAssignment.total) * 100)
            }}%
          </p>
        </div>

        <div class="grade-stats">
          <div class="stat-item">
            <span class="stat-label">已提交</span>
            <span class="stat-value">{{ gradingAssignment.submitted }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">已批改</span>
            <span class="stat-value">
              {{ studentSubmissions.filter((s: StudentSubmission) => s.status === 'graded').length }}
            </span>
          </div>
          <div class="stat-item">
            <span class="stat-label">待批改</span>
            <span class="stat-value">
              {{
                studentSubmissions.filter((s: StudentSubmission) => s.status === 'submitted' && s.submittedAt).length
              }}
            </span>
          </div>
          <div class="stat-item">
            <span class="stat-label">未提交</span>
            <span class="stat-value">
              {{ studentSubmissions.filter((s: StudentSubmission) => !s.submittedAt).length }}
            </span>
          </div>
        </div>

        <div class="grade-list">
          <div class="grade-list-header">
            <div class="list-col list-col-1">学生信息</div>
            <div class="list-col list-col-2">提交时间</div>
            <div class="list-col list-col-3">状态</div>
            <div class="list-col list-col-4">成绩</div>
            <div class="list-col list-col-5">操作</div>
          </div>

          <div class="grade-list-body">
            <div
              v-for="submission in studentSubmissions"
              :key="submission.id"
              class="grade-list-item"
              :class="{
                submitted: submission.submittedAt,
                graded: submission.status === 'graded'
              }"
            >
              <div class="list-col list-col-1">
                <div class="student-info">
                  <div class="student-name">{{ submission.studentName }}</div>
                  <div class="student-id">{{ submission.studentId }}</div>
                </div>
              </div>
              <div class="list-col list-col-2">
                {{ submission.submittedAt || '-' }}
              </div>
              <div class="list-col list-col-3">
                <NTag
                  :type="submission.status === 'graded' ? 'success' : submission.submittedAt ? 'warning' : 'default'"
                  :bordered="false"
                >
                  {{ submission.status === 'graded' ? '已批改' : submission.submittedAt ? '已提交' : '未提交' }}
                </NTag>
              </div>
              <div class="list-col list-col-4">
                {{ submission.status === 'graded' ? submission.score : '-' }}
              </div>
              <div class="list-col list-col-5">
                <NButton
                  v-if="submission.submittedAt"
                  size="small"
                  type="primary"
                  text
                  @click="handleEditGrade(submission)"
                >
                  {{ submission.status === 'graded' ? '查看详情' : '批改' }}
                </NButton>
                <span v-else>-</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <NSpace justify="end">
          <NButton @click="showGradeModal = false">关闭</NButton>
          <NButton type="primary" @click="handleSaveGrades">保存成绩</NButton>
        </NSpace>
      </template>
    </NModal>
  </div>
</template>

<style scoped>
.assignment-dashboard {
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
  transition: all 0.3s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.stat-card-1::before {
  background: #3b82f6;
}
.stat-card-2::before {
  background: #f59e0b;
}
.stat-card-3::before {
  background: #10b981;
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
  background: #fef3c7;
  color: #f59e0b;
}

.stat-card-3 .stat-icon-wrapper {
  background: #d1fae5;
  color: #10b981;
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

.chart-content {
  flex: 1;
  min-height: 280px;
}

.chart-footer {
  display: flex;
  justify-content: space-around;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
  margin-top: 16px;
}

.footer-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.footer-label {
  font-size: 12px;
  color: #6b7280;
}

.footer-value {
  font-size: 16px;
  font-weight: bold;
  color: #18a058;
}

/* 待办事项 */
.todo-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 0;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f9fafb;
  border-left: 3px solid #d1d5db;
  border-radius: 8px;
  transition: all 0.3s;
}

.todo-item:hover {
  background: #f3f4f6;
  transform: translateX(4px);
}

.todo-high {
  border-left-color: #ef4444;
  background: #fef2f2;
}

.todo-high:hover {
  background: #fee2e2;
}

.todo-medium {
  border-left-color: #f59e0b;
  background: #fffbeb;
}

.todo-medium:hover {
  background: #fef3c7;
}

.todo-low {
  border-left-color: #6b7280;
}

.todo-priority {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #6b7280;
  flex-shrink: 0;
}

.todo-high .todo-priority {
  background: #ef4444;
}

.todo-medium .todo-priority {
  background: #f59e0b;
}

.todo-low .todo-priority {
  background: #6b7280;
}

.todo-content {
  flex: 1;
}

.todo-title {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 4px;
}

.todo-meta {
  font-size: 12px;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 6px;
}

.todo-deadline {
  color: #18a058;
  font-weight: 500;
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

.filter-content {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.filter-input {
  width: 240px;
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

  .filter-content {
    flex-direction: column;
  }

  .filter-input,
  .filter-select {
    width: 100%;
  }
}

/* 批改模态框样式 */
.grade-modal {
  padding: 20px 0;
}

.grade-header {
  margin-bottom: 20px;
}

.grade-header h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  color: #1f2937;
}

.grade-subtitle {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.grade-stats {
  display: flex;
  gap: 20px;
  margin-bottom: 24px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
}

.stat-item {
  flex: 1;
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 4px;
}

.stat-value {
  display: block;
  font-size: 24px;
  font-weight: bold;
  color: #18a058;
}

.grade-list {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.grade-list-header {
  display: flex;
  background: #f3f4f6;
  padding: 12px 16px;
  font-weight: bold;
  border-bottom: 1px solid #e5e7eb;
}

.grade-list-item {
  display: flex;
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 0.2s;
}

.grade-list-item:hover {
  background: #f9fafb;
}

.grade-list-item.submitted {
  background: #f0fdf4;
}

.grade-list-item.graded {
  background: #dbeafe;
}

.list-col {
  display: flex;
  align-items: center;
}

.list-col-1 {
  width: 25%;
}

.list-col-2 {
  width: 20%;
}

.list-col-3 {
  width: 15%;
}

.list-col-4 {
  width: 15%;
}

.list-col-5 {
  width: 25%;
  justify-content: flex-end;
}

.student-info {
  display: flex;
  flex-direction: column;
}

.student-name {
  font-weight: 500;
  color: #1f2937;
}

.student-id {
  font-size: 12px;
  color: #6b7280;
}

.grade-list-body {
  max-height: 400px;
  overflow-y: auto;
}

/* 编辑和添加表单样式 */
.edit-form,
.add-form {
  max-height: 500px;
  overflow-y: auto;
}

/* 发布新作业按钮样式 */
.golden-button {
  background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%);
  border: none;
  border-radius: 8px;
  padding: 12px 40px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  transition: all 0.3s ease;
  box-shadow: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: auto;
  min-width: 200px;
  height: 48px;
  text-align: center;
  letter-spacing: 0.5px;
}

.golden-button:hover {
  background: linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.golden-button:active {
  background: linear-gradient(90deg, #4338ca 0%, #6d28d9 100%);
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(99, 102, 241, 0.2);
}
</style>
