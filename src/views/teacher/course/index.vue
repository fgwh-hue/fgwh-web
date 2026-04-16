<script setup lang="ts">
import { computed, h, ref } from 'vue';
import { NButton, NGi, NGrid, NInput, NModal, NPopconfirm, NProgress, NSpace, NSpin, NTag } from 'naive-ui';
import { useAppStore } from '@/store/modules/app';

defineOptions({
  name: 'TeacherCourse'
});

const appStore = useAppStore();
const gap = computed(() => (appStore.isMobile ? 0 : 16));

interface Course {
  id: string;
  name: string;
  code: string;
  students: number;
  status: 'active' | 'draft' | 'archived';
  createdAt: string;
  description?: string;
  schedule?: string;
  assignments?: number;
  avgScore?: number;
  category?: string;
}

const courses = ref<Course[]>([
  {
    id: '1',
    name: '高等数学',
    code: 'MATH101',
    students: 45,
    status: 'active',
    createdAt: '2024-01-15',
    description: '微积分与线性代数基础',
    schedule: '周一、周三 14:00-16:00',
    assignments: 12,
    avgScore: 82,
    category: '数学'
  },
  {
    id: '2',
    name: '英语写作',
    code: 'ENG201',
    students: 38,
    status: 'active',
    createdAt: '2024-01-20',
    description: '学术英语写作技巧',
    schedule: '周二、周四 10:00-12:00',
    assignments: 8,
    avgScore: 85,
    category: '语言'
  },
  {
    id: '3',
    name: '物理实验',
    code: 'PHY301',
    students: 42,
    status: 'active',
    createdAt: '2024-02-01',
    description: '基础物理实验操作',
    schedule: '周五 14:00-17:00',
    assignments: 10,
    avgScore: 79,
    category: '理科'
  },
  {
    id: '4',
    name: '化学基础',
    code: 'CHEM101',
    students: 31,
    status: 'draft',
    createdAt: '2024-02-10',
    description: '化学基本原理与应用',
    schedule: '待定',
    assignments: 0,
    avgScore: 0,
    category: '理科'
  },
  {
    id: '5',
    name: '计算机编程',
    code: 'CS101',
    students: 52,
    status: 'active',
    createdAt: '2024-02-15',
    description: 'Python编程基础与算法',
    schedule: '周一、周三 10:00-12:00',
    assignments: 15,
    avgScore: 88,
    category: '理科'
  },
  {
    id: '6',
    name: '中国文学',
    code: 'LIT201',
    students: 35,
    status: 'active',
    createdAt: '2024-02-20',
    description: '古代文学作品赏析',
    schedule: '周二、周四 14:00-16:00',
    assignments: 6,
    avgScore: 86,
    category: '文科'
  }
]);

// 获取课程名称的第一个字
function getCourseFirstChar(name: string): string {
  return name.charAt(0);
}

// 生成渐变背景类名
function getGradientClass(index: number): string {
  const gradients = [
    'gradient-primary',
    'gradient-success',
    'gradient-warning',
    'gradient-info',
    'gradient-purple',
    'gradient-orange'
  ];
  return gradients[index % gradients.length];
}

const showModal = ref(false);
const editingCourse = ref<Course | null>(null);
const showCategoryDetailModal = ref(false);
const selectedCategoryDetail = ref<any>(null);
const searchText = ref('');
const selectedStatus = ref<string | null>(null);
const selectedCategory = ref<string | null>(null);
const viewMode = ref<'table' | 'card'>('card');

const filteredCourses = computed(() => {
  return courses.value.filter(course => {
    const matchSearch =
      !searchText.value || course.name.includes(searchText.value) || course.code.includes(searchText.value);
    const matchStatus = !selectedStatus.value || course.status === selectedStatus.value;
    const matchCategory = !selectedCategory.value || course.category === selectedCategory.value;
    return matchSearch && matchStatus && matchCategory;
  });
});

const courseStats = computed(() => ({
  total: courses.value.length,
  active: courses.value.filter(c => c.status === 'active').length,
  draft: courses.value.filter(c => c.status === 'draft').length,
  totalStudents: courses.value.reduce((sum, c) => sum + c.students, 0),
  avgStudents: Math.round(courses.value.reduce((sum, c) => sum + c.students, 0) / courses.value.length),
  totalAssignments: courses.value.reduce((sum, c) => sum + (c.assignments || 0), 0)
}));

// 课程分类统计（丰富数据）
const categoryStats = computed(() => {
  const stats: Record<string, { count: number; students: number; avgScore: number; assignments: number }> = {};

  courses.value.forEach(course => {
    const cat = course.category || '其他';
    if (!stats[cat]) {
      stats[cat] = { count: 0, students: 0, avgScore: 0, assignments: 0 };
    }
    stats[cat].count += 1;
    stats[cat].students += course.students;
    stats[cat].avgScore += course.avgScore || 0;
    stats[cat].assignments += course.assignments || 0;
  });

  return Object.entries(stats).map(([name, data]) => ({
    name,
    value: data.count,
    students: data.students,
    avgScore: Math.round(data.avgScore / data.count) || 0,
    assignments: data.assignments
  }));
});

// 最近活跃课程
const recentActiveCourses = computed(() => {
  return courses.value
    .filter(c => c.status === 'active')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
});

// 课程统计
const totalStudents = computed(() => {
  return courses.value.reduce((sum, c) => sum + c.students, 0);
});

const totalAssignments = computed(() => {
  return courses.value.reduce((sum, c) => sum + (c.assignments || 0), 0);
});

const averageScore = computed(() => {
  const activeCourses = courses.value.filter(c => c.status === 'active' && c.avgScore);
  if (activeCourses.length === 0) return 0;
  return activeCourses.reduce((sum, c) => sum + (c.avgScore || 0), 0) / activeCourses.length;
});

// 快速创建面板
const showQuickCreate = ref(false);

// 课程完成度数据（模拟）
const courseProgress = computed(() => {
  return courses.value
    .filter(c => c.status === 'active')
    .map(course => ({
      name: course.name,
      progress: Math.round((course.assignments || 0) * 6.67), // 假设15个作业为100%
      assignments: course.assignments || 0
    }));
});

// 周统计数据（模拟）
const weeklyTrend = [
  { day: '周一', students: 120, assignments: 8 },
  { day: '周二', students: 135, assignments: 12 },
  { day: '周三', students: 142, assignments: 15 },
  { day: '周四', students: 138, assignments: 10 },
  { day: '周五', students: 145, assignments: 14 },
  { day: '周六', students: 98, assignments: 6 },
  { day: '周日', students: 85, assignments: 4 }
];

const statusOptions = [
  { label: '进行中', value: 'active' },
  { label: '草稿', value: 'draft' },
  { label: '已归档', value: 'archived' }
];

const categoryOptions = [
  { label: '数学', value: '数学' },
  { label: '语言', value: '语言' },
  { label: '理科', value: '理科' },
  { label: '文科', value: '文科' }
];

function handleAdd() {
  editingCourse.value = {
    id: '',
    name: '',
    code: '',
    students: 0,
    status: 'draft',
    createdAt: new Date().toISOString().split('T')[0],
    description: '',
    schedule: '',
    assignments: 0,
    avgScore: 0,
    category: '数学'
  };
  showModal.value = true;
}

// 新增快速操作函数
function handlePublishAssignment() {
  window.$message?.success('正在跳转到发布作业页面...');
}

function handleCreateExam() {
  window.$message?.info('正在创建考试...');
}

function handleUploadResource() {
  window.$message?.info('正在上传资源...');
}

function handleViewReport() {
  window.$message?.info('正在跳转到报告页面...');
}

function handleExportData() {
  window.$message?.success('正在导出数据...');
}

function handleStudentAnalysis() {
  window.$message?.info('正在打开学情分析...');
}

function handleQualityMonitor() {
  window.$message?.info('正在打开质量监控...');
}

function handleCourseSettings() {
  window.$message?.info('正在打开课程设置...');
}

function handleBatchImport() {
  window.$message?.info('正在打开批量导入...');
}

function handleNotification() {
  window.$message?.info('正在打开通知管理...');
}

function handleArchive() {
  window.$message?.info('正在打开课程归档...');
}

function handleEdit(course: Course) {
  editingCourse.value = { ...course };
  showModal.value = true;
}

function handleDelete(id: string) {
  const index = courses.value.findIndex(c => c.id === id);
  if (index > -1) {
    courses.value.splice(index, 1);
    window.$message?.success('删除成功');
  }
}

function handleSave() {
  if (editingCourse.value) {
    if (editingCourse.value.id) {
      const index = courses.value.findIndex(c => c.id === editingCourse.value!.id);
      if (index > -1) {
        courses.value[index] = editingCourse.value;
      }
    } else {
      editingCourse.value.id = Date.now().toString();
      courses.value.push(editingCourse.value);
    }
    window.$message?.success('保存成功');
  }
  showModal.value = false;
}

// AI课程内容生成相关状态
const showAIGenerateModal = ref(false);
const aiGenerateLoading = ref(false);
const aiGeneratedContent = ref('');
const aiGenerateType = ref<'syllabus' | 'material' | 'quiz'>('syllabus');
const aiCourseTopic = ref('');

// 课程质量指标
const courseQualityMetrics = ref([
  {
    course: '高等数学',
    satisfaction: 92,
    completion: 85,
    avgScore: 82,
    trend: 'up'
  },
  {
    course: '大学英语',
    satisfaction: 88,
    completion: 82,
    avgScore: 85,
    trend: 'stable'
  },
  {
    course: '物理实验',
    satisfaction: 75,
    completion: 68,
    avgScore: 79,
    trend: 'down'
  },
  {
    course: '计算机编程',
    satisfaction: 95,
    completion: 92,
    avgScore: 88,
    trend: 'up'
  }
]);

// 课程活动数据
const courseActivities = ref([
  {
    title: '期末考试安排',
    course: '高等数学',
    type: 'exam',
    icon: 'i-mdi-file-document',
    time: '明天 09:00'
  },
  {
    title: '作业截止提醒',
    course: '计算机编程',
    type: 'assignment',
    icon: 'i-mdi-clipboard-clock',
    time: '今天 23:59'
  },
  {
    title: '新课程资料上传',
    course: '大学英语',
    type: 'resource',
    icon: 'i-mdi-upload',
    time: '昨天'
  },
  {
    title: '测验成绩发布',
    course: '物理实验',
    type: 'grade',
    icon: 'i-mdi-scoreboard',
    time: '2天前'
  },
  {
    title: '小组讨论开始',
    course: '计算机编程',
    type: 'discussion',
    icon: 'i-mdi-account-group',
    time: '3天前'
  }
]);

// 刷新课程数据
const isRefreshingCourse = ref(false);
const courseLastUpdate = ref(
  new Date().toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
);

async function handleRefreshCourse() {
  if (isRefreshingCourse.value) return;
  isRefreshingCourse.value = true;
  await new Promise(resolve => {
    setTimeout(resolve, 800);
  });
  courseLastUpdate.value = new Date().toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  });
  isRefreshingCourse.value = false;
  window.$message?.success('课程数据已更新');
}

// AI 生成课程内容
async function handleAIGenerate(type: 'syllabus' | 'material' | 'quiz') {
  if (!aiCourseTopic.value.trim()) {
    window.$message?.warning('请输入课程主题');
    return;
  }

  aiGenerateType.value = type;
  aiGenerateLoading.value = true;
  aiGeneratedContent.value = '';

  // 模拟AI生成过程
  await new Promise(resolve => {
    setTimeout(resolve, 1500);
  });

  const contentMap = {
    syllabus: {
      title: '📚 课程大纲',
      content: `课程名称：${aiCourseTopic.value}

第一章：基础概念
- 课程目标与学习方法
- 核心概念解析
- 基础知识回顾

第二章：核心原理
- 主要理论框架
- 原理推导过程
- 案例分析

第三章：实践应用
- 实际操作技能
- 案例演练
- 项目实践

第四章：拓展提升
- 前沿发展趋势
- 综合应用
- 课程总结

考核方式：
- 平时成绩 30%
- 期中考试 30%
- 期末考试 40%`
    },
    material: {
      title: '📖 教学材料',
      content: `主题：${aiCourseTopic.value}

【教学目标】
1. 掌握基本概念和原理
2. 理解核心知识点之间的关系
3. 能够运用所学知识解决实际问题

【教学重点】
- 关键概念的定义和特点
- 核心原理的理解和应用

【教学难点】
- 抽象概念的具体化理解
- 复杂问题的分析方法

【教学方法】
- 讲授法：系统讲解理论知识
- 案例法：通过实例加深理解
- 讨论法：激发学生思考
- 实践法：动手操作巩固知识

【教学资源】
- 教材章节：第X章
- 参考书目：XXX
- 在线资源：XXX`
    },
    quiz: {
      title: '📝 测验题目',
      content: `测验主题：${aiCourseTopic.value}

一、选择题（每题5分，共20分）
1. 以下关于xxx的说法正确的是？
   A. 选项1  B. 选项2  C. 选项3  D. 选项4
2. xxx的核心要素包括？
   A. 要素1  B. 要素2  C. 要素3  D. 全部

二、简答题（每题15分，共30分）
1. 请简述xxx的主要特点及其应用场景。
2. 分析xxx与yyy之间的关系。

三、论述题（每题25分，共50分）
1. 结合实际案例，论述xxx在实际工作中的应用价值。
2. 针对xxx问题，提出你的解决方案并说明理由。

四、实践题（附加题20分）
请根据所学内容，设计一个xxx的解决方案。`
    }
  };

  const result = contentMap[type];
  aiGeneratedContent.value = `# ${result.title}\n\n${result.content}`;
  aiGenerateLoading.value = false;
}

function handleOpenAIGenerate() {
  aiCourseTopic.value = '';
  aiGeneratedContent.value = '';
  showAIGenerateModal.value = true;
}

function handleCopyContent() {
  navigator.clipboard.writeText(aiGeneratedContent.value);
  window.$message?.success('内容已复制到剪贴板');
}

function getStatusLabel(status: string) {
  const option = statusOptions.find(o => o.value === status);
  return option?.label || status;
}

function getStatusType(status: string) {
  const typeMap: Record<string, 'success' | 'warning' | 'default'> = {
    active: 'success',
    draft: 'warning',
    archived: 'default'
  };
  return typeMap[status] || 'default';
}

function getScoreColorClass(score: number) {
  if (score >= 80) return 'text-success';
  if (score >= 60) return 'text-warning';
  return 'text-error';
}

function getCategoryColorClass(idx: number) {
  const colors = ['bg-primary', 'bg-success', 'bg-warning', 'bg-info', 'bg-purple', 'bg-orange'];
  return colors[idx % colors.length];
}

const tableColumns = computed(() => [
  { title: '课程名称', key: 'name', width: 150 },
  { title: '课程代码', key: 'code', width: 120 },
  { title: '分类', key: 'category', width: 100 },
  { title: '学生数', key: 'students', width: 100 },
  { title: '作业数', key: 'assignments', width: 100 },
  { title: '平均分', key: 'avgScore', width: 100 },
  { title: '创建时间', key: 'createdAt', width: 120 },
  {
    title: '操作',
    key: 'actions',
    width: 150,
    fixed: 'right' as const,
    render: (row: Course) => {
      return h(
        NSpace,
        { size: 'small' },
        {
          default: () => [
            h(
              NButton,
              {
                size: 'small',
                onClick: () => handleEdit(row)
              },
              { default: () => '编辑' }
            ),
            h(
              NPopconfirm,
              {
                onPositiveClick: () => handleDelete(row.id)
              },
              {
                default: () => '确定要删除这个课程吗？',
                trigger: () =>
                  h(
                    NButton,
                    {
                      size: 'small',
                      type: 'error'
                    },
                    { default: () => '删除' }
                  )
              }
            )
          ]
        }
      );
    }
  }
]);
</script>

<template>
  <NSpace vertical :size="16">
    <!-- Header -->
    <div class="flex-y-center justify-between">
      <div class="flex-y-center gap-12px">
        <h2 class="text-20px font-semibold">课程管理</h2>
        <NTag v-if="courseLastUpdate" size="small" type="info">更新: {{ courseLastUpdate }}</NTag>
      </div>
      <NSpace>
        <NButton :loading="isRefreshingCourse" @click="handleRefreshCourse">
          <template #icon>
            <div :class="isRefreshingCourse ? 'i-mdi-loading animate-spin' : 'i-mdi-refresh'" />
          </template>
          刷新
        </NButton>
        <NButton type="info" @click="handleOpenAIGenerate">
          <template #icon>
            <div class="i-mdi-robot" />
          </template>
          AI生成内容
        </NButton>
        <NButton type="primary" @click="handleAdd">
          <template #icon>
            <div class="i-mdi-plus" />
          </template>
          新增课程
        </NButton>
      </NSpace>
    </div>

    <!-- Search and Filter -->
    <NCard :bordered="false" class="card-wrapper">
      <div class="flex-y-center justify-between">
        <NSpace>
          <NInput v-model:value="searchText" placeholder="搜索课程名称或代码" class="w-200px" clearable>
            <template #prefix>
              <div class="i-mdi-magnify" />
            </template>
          </NInput>
          <NSelect
            v-model:value="selectedCategory"
            placeholder="选择分类"
            class="w-120px"
            :options="categoryOptions"
            clearable
          />
          <NSelect
            v-model:value="selectedStatus"
            placeholder="选择状态"
            class="w-120px"
            :options="statusOptions"
            clearable
          />
          <NButton
            @click="
              () => {
                searchText = '';
                selectedStatus = null;
                selectedCategory = null;
              }
            "
          >
            重置
          </NButton>
        </NSpace>
        <NButtonGroup>
          <NButton :type="viewMode === 'table' ? 'primary' : 'default'" @click="viewMode = 'table'">
            <template #icon>
              <div class="i-mdi-table" />
            </template>
          </NButton>
          <NButton :type="viewMode === 'card' ? 'primary' : 'default'" @click="viewMode = 'card'">
            <template #icon>
              <div class="i-mdi-view-grid" />
            </template>
          </NButton>
        </NButtonGroup>
      </div>
    </NCard>

    <!-- Statistics Cards with Icons -->
    <NGrid :x-gap="gap" :y-gap="16" responsive="screen" item-responsive>
      <NGi span="24 s:12 m:8 l:4">
        <NCard :bordered="false" class="stat-card stat-card-primary card-wrapper">
          <div class="flex-y-center justify-between">
            <div>
              <div class="text-32px font-bold">{{ courseStats.total }}</div>
              <div class="mt-8px text-14px opacity-80">总课程数</div>
            </div>
            <div class="size-56px flex-center rd-12px bg-white bg-op-20">
              <div class="i-mdi-book-multiple text-32px" />
            </div>
          </div>
        </NCard>
      </NGi>
      <NGi span="24 s:12 m:8 l:4">
        <NCard :bordered="false" class="stat-card stat-card-success card-wrapper">
          <div class="flex-y-center justify-between">
            <div>
              <div class="text-32px font-bold">{{ courseStats.active }}</div>
              <div class="mt-8px text-14px opacity-80">进行中</div>
            </div>
            <div class="size-56px flex-center rd-12px bg-white bg-op-20">
              <div class="i-mdi-play-circle text-32px" />
            </div>
          </div>
        </NCard>
      </NGi>
      <NGi span="24 s:12 m:8 l:4">
        <NCard :bordered="false" class="stat-card stat-card-warning card-wrapper">
          <div class="flex-y-center justify-between">
            <div>
              <div class="text-32px font-bold">{{ courseStats.draft }}</div>
              <div class="mt-8px text-14px opacity-80">草稿</div>
            </div>
            <div class="size-56px flex-center rd-12px bg-white bg-op-20">
              <div class="i-mdi-file-document-edit text-32px" />
            </div>
          </div>
        </NCard>
      </NGi>
      <NGi span="24 s:12 m:8 l:4">
        <NCard :bordered="false" class="stat-card stat-card-info card-wrapper">
          <div class="flex-y-center justify-between">
            <div>
              <div class="text-32px font-bold">
                {{ courseStats.totalStudents }}
              </div>
              <div class="mt-8px text-14px opacity-80">总学生数</div>
            </div>
            <div class="size-56px flex-center rd-12px bg-white bg-op-20">
              <div class="i-mdi-account-group text-32px" />
            </div>
          </div>
        </NCard>
      </NGi>
      <NGi span="24 s:12 m:8 l:4">
        <NCard :bordered="false" class="stat-card stat-card-purple card-wrapper">
          <div class="flex-y-center justify-between">
            <div>
              <div class="text-32px font-bold">
                {{ courseStats.avgStudents }}
              </div>
              <div class="mt-8px text-14px opacity-80">平均学生数</div>
            </div>
            <div class="size-56px flex-center rd-12px bg-white bg-op-20">
              <div class="i-mdi-account-multiple text-32px" />
            </div>
          </div>
        </NCard>
      </NGi>
      <NGi span="24 s:12 m:8 l:4">
        <NCard :bordered="false" class="stat-card stat-card-orange card-wrapper">
          <div class="flex-y-center justify-between">
            <div>
              <div class="text-32px font-bold">
                {{ courseStats.totalAssignments }}
              </div>
              <div class="mt-8px text-14px opacity-80">总作业数</div>
            </div>
            <div class="size-56px flex-center rd-12px bg-white bg-op-20">
              <div class="i-mdi-clipboard-list text-32px" />
            </div>
          </div>
        </NCard>
      </NGi>
    </NGrid>

    <!-- Charts and Analytics -->
    <NGrid :x-gap="gap" :y-gap="16" responsive="screen" item-responsive>
      <!-- Weekly Trend Chart -->
      <NGi span="24 s:24 m:16">
        <NCard :bordered="false" class="card-wrapper">
          <template #header>
            <div class="flex-y-center justify-between">
              <span class="font-semibold">本周活动趋势</span>
              <NSpace>
                <div class="flex-y-center gap-8px">
                  <div class="size-12px rd-1/2 bg-primary" />
                  <span class="text-12px">学生活跃度</span>
                </div>
                <div class="flex-y-center gap-8px">
                  <div class="size-12px rd-1/2 bg-success" />
                  <span class="text-12px">作业提交</span>
                </div>
              </NSpace>
            </div>
          </template>
          <div class="h-320px overflow-y-auto">
            <NSpace vertical :size="12" class="h-full">
              <div v-for="item in weeklyTrend" :key="item.day" class="flex-y-center gap-12px">
                <span class="w-48px flex-shrink-0 text-12px">{{ item.day }}</span>
                <div class="min-w-0 flex-1">
                  <div class="mb-6px flex-y-center gap-8px">
                    <div
                      class="h-16px flex-shrink-0 rd-4px bg-primary transition-all"
                      :style="{
                        width: `${Math.min((item.students / 150) * 100, 100)}%`
                      }"
                    />
                    <span class="flex-shrink-0 text-12px text-#999">{{ item.students }}</span>
                  </div>
                  <div class="flex-y-center gap-8px">
                    <div
                      class="h-16px flex-shrink-0 rd-4px bg-success transition-all"
                      :style="{
                        width: `${Math.min((item.assignments / 15) * 100, 100)}%`
                      }"
                    />
                    <span class="flex-shrink-0 text-12px text-#999">{{ item.assignments }}</span>
                  </div>
                </div>
              </div>
            </NSpace>
          </div>
        </NCard>
      </NGi>

      <!-- Category Distribution -->
      <NGi span="24 s:24 m:8">
        <NCard :bordered="false" class="card-wrapper">
          <template #header>
            <div class="flex-y-center justify-between">
              <span class="font-semibold">课程分类分布</span>
              <NSpace>
                <div class="flex-y-center gap-8px">
                  <div class="size-12px rd-1/2 bg-primary" />
                  <span class="text-12px">课程数</span>
                </div>
                <div class="flex-y-center gap-8px">
                  <div class="size-12px rd-1/2 bg-success" />
                  <span class="text-12px">学生数</span>
                </div>
              </NSpace>
            </div>
          </template>
          <div class="h-320px overflow-y-auto">
            <NSpace vertical :size="12" class="h-full">
              <div v-for="(cat, idx) in categoryStats" :key="cat.name" class="flex-y-center gap-12px">
                <span class="w-48px flex-shrink-0 text-12px">{{ cat.name }}</span>
                <div class="min-w-0 flex-1">
                  <div class="mb-6px flex-y-center gap-8px">
                    <div
                      class="h-16px flex-shrink-0 rd-4px transition-all"
                      :class="getCategoryColorClass(idx)"
                      :style="{
                        width: `${Math.min((cat.value / 6) * 100, 100)}%`
                      }"
                    />
                    <span class="flex-shrink-0 text-12px text-#999">{{ cat.value }}门</span>
                  </div>
                  <div class="flex-y-center gap-8px">
                    <div
                      class="h-16px flex-shrink-0 rd-4px bg-success transition-all"
                      :style="{
                        width: `${Math.min((cat.students / 60) * 100, 100)}%`
                      }"
                    />
                    <span class="flex-shrink-0 text-12px text-#999">{{ cat.students }}人</span>
                  </div>
                </div>
              </div>
            </NSpace>
          </div>
        </NCard>
      </NGi>
    </NGrid>

    <!-- Course Progress & Recent Activity -->
    <NGrid :x-gap="gap" :y-gap="16" responsive="screen" item-responsive>
      <!-- Course Progress -->
      <NGi span="24 s:24 m:12">
        <NCard :bordered="false" class="h-full card-wrapper">
          <template #header>
            <div class="flex-y-center justify-between">
              <span class="font-semibold">课程进度</span>
              <NButton text type="primary" size="small">查看全部</NButton>
            </div>
          </template>
          <div class="min-h-320px">
            <NSpace vertical :size="16">
              <div v-for="item in courseProgress.slice(0, 5)" :key="item.name" class="flex-col gap-8px">
                <div class="flex-y-center justify-between">
                  <span class="text-14px">{{ item.name }}</span>
                  <span class="text-12px text-#999">{{ item.assignments }}/15 作业</span>
                </div>
                <NProgress
                  type="line"
                  :percentage="item.progress"
                  :color="item.progress >= 80 ? '#18a058' : item.progress >= 50 ? '#f0a020' : '#d03050'"
                  :show-indicator="false"
                />
              </div>
            </NSpace>
          </div>
        </NCard>
      </NGi>

      <!-- Recent Active Courses -->
      <NGi span="24 s:24 m:12">
        <NCard :bordered="false" class="h-full card-wrapper">
          <template #header>
            <div class="flex-y-center justify-between">
              <span class="font-semibold">最近活跃课程</span>
              <NButton text type="primary" size="small">查看全部</NButton>
            </div>
          </template>
          <div class="min-h-320px">
            <NSpace vertical :size="12">
              <div
                v-for="(course, index) in recentActiveCourses"
                :key="course.id"
                class="flex-y-center justify-between border-b pb-12px"
              >
                <div class="flex-y-center gap-12px">
                  <div class="size-40px flex-center rd-8px text-white font-bold" :class="getGradientClass(index)">
                    {{ getCourseFirstChar(course.name) }}
                  </div>
                  <div>
                    <div class="text-14px font-semibold">{{ course.name }}</div>
                    <div class="text-12px text-#999">{{ course.students }} 名学生</div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-14px font-bold" :class="getScoreColorClass(course.avgScore || 0)">
                    {{ course.avgScore || '-' }}
                  </div>
                  <div class="text-12px text-#999">平均分</div>
                </div>
              </div>
            </NSpace>
          </div>
        </NCard>
      </NGi>
    </NGrid>

    <!-- 课程管理快速操作中心 - 全新重构 -->
    <NCard :bordered="false" class="course-action-center card-wrapper">
      <template #header>
        <div class="action-center-header">
          <div class="header-content">
            <div class="header-icon">
              <div class="i-mdi-rocket-launch text-28px" />
            </div>
            <div class="header-text">
              <h3 class="action-center-title">课程管理快速操作</h3>
              <p class="action-center-subtitle">高效管理课程，提升教学效率</p>
            </div>
          </div>
          <NButton size="small" secondary type="primary" @click="showQuickCreate = true">
            <template #icon>
              <div class="i-mdi-plus" />
            </template>
            快速创建
          </NButton>
        </div>
      </template>

      <!-- 数据统计栏 -->
      <div class="stats-overview">
        <div class="stat-item">
          <div class="stat-icon primary">
            <div class="i-mdi-book-open-page-variant" />
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ courses.length }}</div>
            <div class="stat-label">总课程数</div>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-icon success">
            <div class="i-mdi-account-group" />
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ totalStudents }}</div>
            <div class="stat-label">学生总数</div>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-icon warning">
            <div class="i-mdi-clipboard-list" />
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ totalAssignments }}</div>
            <div class="stat-label">作业总数</div>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-icon info">
            <div class="i-mdi-chart-line" />
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ averageScore.toFixed(1) }}</div>
            <div class="stat-label">平均分数</div>
          </div>
        </div>
      </div>

      <!-- 主要操作区 -->
      <div class="main-actions">
        <div class="action-section">
          <h4 class="section-title">
            <div class="section-icon primary">
              <div class="i-mdi-plus-circle" />
            </div>
            <span>创建管理</span>
          </h4>
          <div class="action-grid">
            <div class="action-card primary" @click="handleAdd">
              <div class="action-card-icon">
                <div class="i-mdi-school" />
              </div>
              <div class="action-card-content">
                <div class="action-card-title">新增课程</div>
                <div class="action-card-desc">创建新的教学课程</div>
              </div>
              <div class="action-card-arrow">
                <div class="i-mdi-arrow-right" />
              </div>
            </div>
            <div class="action-card success" @click="handlePublishAssignment">
              <div class="action-card-icon">
                <div class="i-mdi-clipboard-list" />
              </div>
              <div class="action-card-content">
                <div class="action-card-title">发布作业</div>
                <div class="action-card-desc">布置课程作业任务</div>
              </div>
              <div class="action-card-arrow">
                <div class="i-mdi-arrow-right" />
              </div>
            </div>
            <div class="action-card warning" @click="handleCreateExam">
              <div class="action-card-icon">
                <div class="i-mdi-file-document" />
              </div>
              <div class="action-card-content">
                <div class="action-card-title">创建考试</div>
                <div class="action-card-desc">组织在线考试测验</div>
              </div>
              <div class="action-card-arrow">
                <div class="i-mdi-arrow-right" />
              </div>
            </div>
            <div class="action-card info" @click="handleUploadResource">
              <div class="action-card-icon">
                <div class="i-mdi-upload" />
              </div>
              <div class="action-card-content">
                <div class="action-card-title">上传资源</div>
                <div class="action-card-desc">分享学习资料</div>
              </div>
              <div class="action-card-arrow">
                <div class="i-mdi-arrow-right" />
              </div>
            </div>
          </div>
        </div>

        <!-- 数据分析区 -->
        <div class="action-section">
          <h4 class="section-title">
            <div class="section-icon info">
              <div class="i-mdi-chart-analytics" />
            </div>
            <span>数据分析</span>
          </h4>
          <div class="action-grid">
            <div class="action-card info" @click="handleViewReport">
              <div class="action-card-icon">
                <div class="i-mdi-chart-bar" />
              </div>
              <div class="action-card-content">
                <div class="action-card-title">查看报告</div>
                <div class="action-card-desc">教学数据分析</div>
              </div>
              <div class="action-card-arrow">
                <div class="i-mdi-arrow-right" />
              </div>
            </div>
            <div class="action-card purple" @click="handleExportData">
              <div class="action-card-icon">
                <div class="i-mdi-download" />
              </div>
              <div class="action-card-content">
                <div class="action-card-title">导出数据</div>
                <div class="action-card-desc">导出课程数据</div>
              </div>
              <div class="action-card-arrow">
                <div class="i-mdi-arrow-right" />
              </div>
            </div>
            <div class="action-card pink" @click="handleStudentAnalysis">
              <div class="action-card-icon">
                <div class="i-mdi-account-search" />
              </div>
              <div class="action-card-content">
                <div class="action-card-title">学情分析</div>
                <div class="action-card-desc">学生学习情况</div>
              </div>
              <div class="action-card-arrow">
                <div class="i-mdi-arrow-right" />
              </div>
            </div>
            <div class="action-card teal" @click="handleQualityMonitor">
              <div class="action-card-icon">
                <div class="i-mdi-eye" />
              </div>
              <div class="action-card-content">
                <div class="action-card-title">质量监控</div>
                <div class="action-card-desc">课程质量跟踪</div>
              </div>
              <div class="action-card-arrow">
                <div class="i-mdi-arrow-right" />
              </div>
            </div>
          </div>
        </div>

        <!-- 设置管理区 -->
        <div class="action-section">
          <h4 class="section-title">
            <div class="section-icon warning">
              <div class="i-mdi-cog" />
            </div>
            <span>设置管理</span>
          </h4>
          <div class="action-grid">
            <div class="action-card warning" @click="handleCourseSettings">
              <div class="action-card-icon">
                <div class="i-mdi-cog-outline" />
              </div>
              <div class="action-card-content">
                <div class="action-card-title">课程设置</div>
                <div class="action-card-desc">课程参数配置</div>
              </div>
              <div class="action-card-arrow">
                <div class="i-mdi-arrow-right" />
              </div>
            </div>
            <div class="action-card teal" @click="handleBatchImport">
              <div class="action-card-icon">
                <div class="i-mdi-file-import" />
              </div>
              <div class="action-card-content">
                <div class="action-card-title">批量导入</div>
                <div class="action-card-desc">导入学生名单</div>
              </div>
              <div class="action-card-arrow">
                <div class="i-mdi-arrow-right" />
              </div>
            </div>
            <div class="action-card pink" @click="handleNotification">
              <div class="action-card-icon">
                <div class="i-mdi-bell" />
              </div>
              <div class="action-card-content">
                <div class="action-card-title">通知管理</div>
                <div class="action-card-desc">发送课程通知</div>
              </div>
              <div class="action-card-arrow">
                <div class="i-mdi-arrow-right" />
              </div>
            </div>
            <div class="action-card primary" @click="handleArchive">
              <div class="action-card-icon">
                <div class="i-mdi-archive" />
              </div>
              <div class="action-card-content">
                <div class="action-card-title">课程归档</div>
                <div class="action-card-desc">历史课程管理</div>
              </div>
              <div class="action-card-arrow">
                <div class="i-mdi-arrow-right" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </NCard>

    <!-- 新增：课程质量指标 -->
    <NCard :bordered="false" class="mt-16px card-wrapper">
      <template #header>
        <div class="flex-y-center justify-between">
          <div class="flex-y-center gap-8px">
            <div class="i-mdi-chart-bar text-20px text-primary" />
            <span class="font-semibold">课程质量指标</span>
          </div>
          <NTag type="info" size="small">实时更新</NTag>
        </div>
      </template>
      <NGrid :x-gap="16" :y-gap="16" responsive="screen" item-responsive>
        <NGi v-for="metric in courseQualityMetrics" :key="metric.course" span="24 s:24 m:12 l:6">
          <div class="quality-metric-card">
            <div class="metric-header">
              <span class="metric-course">{{ metric.course }}</span>
              <NTag
                :type="metric.trend === 'up' ? 'success' : metric.trend === 'down' ? 'error' : 'default'"
                size="small"
              >
                <template #icon>
                  <div
                    :class="
                      metric.trend === 'up'
                        ? 'i-mdi-trending-up'
                        : metric.trend === 'down'
                          ? 'i-mdi-trending-down'
                          : 'i-mdi-minus'
                    "
                  />
                </template>
                {{ metric.trend === 'up' ? '上升' : metric.trend === 'down' ? '下降' : '稳定' }}
              </NTag>
            </div>
            <div class="metric-scores">
              <div class="metric-item">
                <span class="metric-label">满意度</span>
                <span class="metric-value text-blue-500">{{ metric.satisfaction }}%</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">完成率</span>
                <span class="metric-value text-green-500">{{ metric.completion }}%</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">平均分</span>
                <span class="metric-value text-orange-500">{{ metric.avgScore }}</span>
              </div>
            </div>
          </div>
        </NGi>
      </NGrid>
    </NCard>

    <!-- 新增：课程活动 -->
    <NCard :bordered="false" class="mt-16px card-wrapper">
      <template #header>
        <div class="flex-y-center justify-between">
          <div class="flex-y-center gap-8px">
            <div class="i-mdi-calendar-star text-20px text-purple-500" />
            <span class="font-semibold">近期课程活动</span>
          </div>
          <NButton text type="primary" size="small">查看全部</NButton>
        </div>
      </template>
      <div class="activity-timeline">
        <div v-for="(activity, idx) in courseActivities" :key="idx" class="activity-item">
          <div class="activity-icon" :class="`icon-${activity.type}`">
            <div :class="activity.icon" />
          </div>
          <div class="activity-content">
            <div class="activity-title">{{ activity.title }}</div>
            <div class="activity-meta">
              <NTag
                size="small"
                :type="activity.type === 'exam' ? 'error' : activity.type === 'assignment' ? 'warning' : 'info'"
              >
                {{ activity.course }}
              </NTag>
              <span class="activity-time">{{ activity.time }}</span>
            </div>
          </div>
        </div>
      </div>
    </NCard>

    <!-- Card View -->
    <NGrid v-if="viewMode === 'card'" :x-gap="gap" :y-gap="16" responsive="screen" item-responsive>
      <NGi v-for="(course, index) in filteredCourses" :key="course.id" span="24 s:24 m:12 l:8">
        <NCard :bordered="false" class="cursor-pointer card-wrapper hover-shadow" @click="handleEdit(course)">
          <div class="flex-col gap-16px">
            <!-- Header -->
            <div class="flex-y-center justify-between">
              <div class="flex-y-center gap-12px">
                <div class="size-48px flex-center rd-12px text-white font-bold" :class="getGradientClass(index)">
                  {{ getCourseFirstChar(course.name) }}
                </div>
                <div>
                  <div class="text-16px font-bold">{{ course.name }}</div>
                  <div class="text-12px text-#999">{{ course.code }}</div>
                </div>
              </div>
              <div class="flex-y-center gap-8px">
                <NBadge :value="getStatusLabel(course.status)" :type="getStatusType(course.status)" />
                <NPopconfirm @positive-click="handleDelete(course.id)">
                  <template #trigger>
                    <NButton size="small" type="error" text @click.stop>删除</NButton>
                  </template>
                  确定要删除这个课程吗？
                </NPopconfirm>
              </div>
            </div>

            <!-- Description -->
            <div class="line-clamp-2 text-14px text-#666">
              {{ course.description || '暂无描述' }}
            </div>

            <!-- Stats -->
            <div class="flex gap-16px">
              <div class="flex-1 rd-8px bg-#f5f5f5 p-8px text-center">
                <div class="text-18px text-primary font-bold">
                  {{ course.students }}
                </div>
                <div class="text-12px text-#999">学生</div>
              </div>
              <div class="flex-1 rd-8px bg-#f5f5f5 p-8px text-center">
                <div class="text-18px text-warning font-bold">
                  {{ course.assignments || 0 }}
                </div>
                <div class="text-12px text-#999">作业</div>
              </div>
              <div class="flex-1 rd-8px bg-#f5f5f5 p-8px text-center">
                <div class="text-18px font-bold" :class="getScoreColorClass(course.avgScore || 0)">
                  {{ course.avgScore || '-' }}
                </div>
                <div class="text-12px text-#999">平均分</div>
              </div>
            </div>

            <!-- Schedule -->
            <div class="flex-y-center gap-8px text-12px text-#666">
              <div class="i-mdi-clock-outline" />
              <span>{{ course.schedule || '暂无安排' }}</span>
            </div>
          </div>
        </NCard>
      </NGi>
    </NGrid>

    <!-- Table View -->
    <NCard v-else :bordered="false" class="card-wrapper">
      <NDataTable :columns="tableColumns" :data="filteredCourses" :pagination="{ pageSize: 10 }" :scroll-x="1000" />
    </NCard>

    <!-- Modal -->
    <NModal v-model:show="showModal" preset="card" title="课程信息" class="w-600px">
      <NForm v-if="editingCourse" label-placement="left" :label-width="80">
        <NFormItem label="课程名称" required>
          <NInput v-model:value="editingCourse.name" placeholder="请输入课程名称" />
        </NFormItem>
        <NFormItem label="课程代码" required>
          <NInput v-model:value="editingCourse.code" placeholder="请输入课程代码" />
        </NFormItem>
        <NFormItem label="分类">
          <NSelect v-model:value="editingCourse.category" :options="categoryOptions" />
        </NFormItem>
        <NFormItem label="状态">
          <NSelect v-model:value="editingCourse.status" :options="statusOptions" />
        </NFormItem>
        <NFormItem label="课程描述">
          <NInput v-model:value="editingCourse.description" type="textarea" placeholder="请输入课程描述" :rows="3" />
        </NFormItem>
        <NFormItem label="上课时间">
          <NInput v-model:value="editingCourse.schedule" placeholder="例如：周一、周三 14:00-16:00" />
        </NFormItem>
      </NForm>
      <template #footer>
        <div class="flex justify-end gap-8px">
          <NButton @click="showModal = false">取消</NButton>
          <NButton type="primary" @click="handleSave">保存</NButton>
        </div>
      </template>
    </NModal>

    <!-- Category Detail Modal -->
    <NModal v-model:show="showCategoryDetailModal" preset="card" title="分类详情" class="w-600px">
      <div v-if="selectedCategoryDetail" class="space-y-12px">
        <div class="flex items-center gap-12px">
          <div
            class="size-16px rd-1/2"
            :class="{
              'bg-primary': selectedCategoryDetail.name === (categoryStats[0]?.name || ''),
              'bg-success': selectedCategoryDetail.name === (categoryStats[1]?.name || ''),
              'bg-warning': selectedCategoryDetail.name === (categoryStats[2]?.name || ''),
              'bg-info': selectedCategoryDetail.name === (categoryStats[3]?.name || ''),
              'bg-purple': selectedCategoryDetail.name === (categoryStats[4]?.name || ''),
              'bg-orange': selectedCategoryDetail.name === (categoryStats[5]?.name || '')
            }"
          ></div>
          <h2 class="text-20px font-bold">{{ selectedCategoryDetail.name }}</h2>
        </div>
        <div class="grid grid-cols-2 gap-20px">
          <div class="rd-8px bg-gray-50 p-16px">
            <div class="mb-4px text-14px text-gray-500">课程数量</div>
            <div class="text-32px font-bold">{{ selectedCategoryDetail.value }}门</div>
          </div>
          <div class="rd-8px bg-gray-50 p-16px">
            <div class="mb-4px text-14px text-gray-500">学生总数</div>
            <div class="text-32px font-bold">{{ selectedCategoryDetail.students }}人</div>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-20px">
          <div class="rd-8px bg-gray-50 p-16px">
            <div class="mb-4px text-14px text-gray-500">平均分数</div>
            <div class="text-32px font-bold">
              {{ selectedCategoryDetail.avgScore }}
            </div>
          </div>
          <div class="rd-8px bg-gray-50 p-16px">
            <div class="mb-4px text-14px text-gray-500">作业总数</div>
            <div class="text-32px font-bold">
              {{ selectedCategoryDetail.assignments }}
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-8px">
          <NButton @click="showCategoryDetailModal = false">关闭</NButton>
        </div>
      </template>
    </NModal>

    <!-- AI课程内容生成弹窗 -->
    <NModal
      v-model:show="showAIGenerateModal"
      preset="card"
      title="AI课程内容生成"
      class="ai-generate-modal max-w-90vw w-700px"
    >
      <div class="ai-generate-content">
        <div class="ai-topic-input">
          <div class="input-label">请输入课程主题或关键词：</div>
          <NInput v-model:value="aiCourseTopic" placeholder="例如：Python编程基础、线性代数、微积分等" />
        </div>

        <div class="ai-generate-types">
          <div class="types-label">选择生成内容类型：</div>
          <NSpace>
            <NButton
              :type="aiGenerateType === 'syllabus' ? 'primary' : 'default'"
              @click="handleAIGenerate('syllabus')"
            >
              <template #icon>
                <div class="i-mdi-book-open-variant" />
              </template>
              课程大纲
            </NButton>
            <NButton
              :type="aiGenerateType === 'material' ? 'primary' : 'default'"
              @click="handleAIGenerate('material')"
            >
              <template #icon>
                <div class="i-mdi-file-document" />
              </template>
              教学材料
            </NButton>
            <NButton :type="aiGenerateType === 'quiz' ? 'primary' : 'default'" @click="handleAIGenerate('quiz')">
              <template #icon>
                <div class="i-mdi-file-question" />
              </template>
              测验题目
            </NButton>
          </NSpace>
        </div>

        <div v-if="aiGenerateLoading" class="ai-loading">
          <NSpin size="large" />
          <p>AI正在生成内容，请稍候...</p>
        </div>

        <div v-else-if="aiGeneratedContent" class="ai-result">
          <div class="result-header">
            <span>生成结果：</span>
            <NButton size="small" type="primary" @click="handleCopyContent">
              <template #icon>
                <div class="i-mdi-content-copy" />
              </template>
              复制内容
            </NButton>
          </div>
          <pre class="result-content">{{ aiGeneratedContent }}</pre>
        </div>
      </div>
    </NModal>
  </NSpace>
</template>

<style scoped>
.hover-shadow {
  transition: box-shadow 0.3s;
}

.hover-shadow:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 课程管理快速操作中心样式 */
.course-action-center {
  background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.action-center-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 14px;
}

.header-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.action-center-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.action-center-subtitle {
  font-size: 13px;
  color: #6b7280;
  margin: 4px 0 0 0;
}

/* 数据统计栏 */
.stats-overview {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin: 20px 0;
  padding: 20px;
  background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  color: white;
  font-size: 22px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-icon.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon.success {
  background: linear-gradient(135deg, #18a058 0%, #0e7e3e 100%);
}

.stat-icon.warning {
  background: linear-gradient(135deg, #f0a020 0%, #d48806 100%);
}

.stat-icon.info {
  background: linear-gradient(135deg, #2080f0 0%, #1060c9 100%);
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 22px;
  font-weight: bold;
  color: #1f2937;
  line-height: 1;
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
}

/* 主要操作区 */
.main-actions {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.action-section {
  display: flex;
  flex-direction: column;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 12px 0;
}

.section-icon {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: white;
  font-size: 16px;
}

.section-icon.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.section-icon.info {
  background: linear-gradient(135deg, #2080f0 0%, #1060c9 100%);
}

.section-icon.warning {
  background: linear-gradient(135deg, #f0a020 0%, #d48806 100%);
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.action-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
  background: white;
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.action-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
  border-color: transparent;
}

.action-card.primary:hover {
  border-color: #667eea;
}

.action-card.success:hover {
  border-color: #18a058;
}

.action-card.warning:hover {
  border-color: #f0a020;
}

.action-card.info:hover {
  border-color: #2080f0;
}

.action-card.purple:hover {
  border-color: #8b5cf6;
}

.action-card.pink:hover {
  border-color: #ec4899;
}

.action-card.teal:hover {
  border-color: #14b8a6;
}

.action-card-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  font-size: 24px;
  flex-shrink: 0;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.action-card.primary .action-card-icon {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(102, 126, 234, 0.05) 100%);
  color: #667eea;
}

.action-card.success .action-card-icon {
  background: linear-gradient(135deg, rgba(24, 160, 88, 0.15) 0%, rgba(24, 160, 88, 0.05) 100%);
  color: #18a058;
}

.action-card.warning .action-card-icon {
  background: linear-gradient(135deg, rgba(240, 160, 32, 0.15) 0%, rgba(240, 160, 32, 0.05) 100%);
  color: #f0a020;
}

.action-card.info .action-card-icon {
  background: linear-gradient(135deg, rgba(32, 128, 240, 0.15) 0%, rgba(32, 128, 240, 0.05) 100%);
  color: #2080f0;
}

.action-card.purple .action-card-icon {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0.05) 100%);
  color: #8b5cf6;
}

.action-card.pink .action-card-icon {
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(236, 72, 153, 0.05) 100%);
  color: #ec4899;
}

.action-card.teal .action-card-icon {
  background: linear-gradient(135deg, rgba(20, 184, 166, 0.15) 0%, rgba(20, 184, 166, 0.05) 100%);
  color: #14b8a6;
}

.action-card:hover .action-card-icon {
  transform: scale(1.15) rotate(5deg);
}

.action-card-content {
  flex: 1;
  min-width: 0;
}

.action-card-title {
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.action-card-desc {
  font-size: 12px;
  color: #6b7280;
  line-height: 1.4;
}

.action-card-arrow {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: #9ca3af;
  font-size: 18px;
  transition: all 0.3s;
  opacity: 0;
  transform: translateX(-10px);
}

.action-card:hover .action-card-arrow {
  opacity: 1;
  transform: translateX(0);
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .stats-overview {
    grid-template-columns: repeat(2, 1fr);
  }

  .action-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .action-center-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .header-content {
    width: 100%;
  }

  .stats-overview {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    padding: 14px;
  }

  .stat-icon {
    width: 38px;
    height: 38px;
    font-size: 18px;
  }

  .stat-value {
    font-size: 18px;
  }

  .action-grid {
    grid-template-columns: 1fr;
  }

  .action-card {
    padding: 14px;
  }

  .action-card-icon {
    width: 42px;
    height: 42px;
    font-size: 20px;
  }
}

/* 快速操作按钮样式 */
.quick-actions-buttons {
  width: 100%;
}

.quick-action-btn {
  flex: 1;
  text-align: center;
  justify-content: center;
}

.stat-card {
  color: white;
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-card-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-card-success {
  background: linear-gradient(135deg, #18a058 0%, #0e7e3e 100%);
}

.stat-card-warning {
  background: linear-gradient(135deg, #f0a020 0%, #d48806 100%);
}

.stat-card-info {
  background: linear-gradient(135deg, #2080f0 0%, #1060c9 100%);
}

.stat-card-purple {
  background: linear-gradient(135deg, #9333ea 0%, #7e22ce 100%);
}

.stat-card-orange {
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
}

/* Gradient classes for avatars */
.gradient-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.gradient-success {
  background: linear-gradient(135deg, #18a058 0%, #0e7e3e 100%);
}

.gradient-warning {
  background: linear-gradient(135deg, #f0a020 0%, #d48806 100%);
}

.gradient-info {
  background: linear-gradient(135deg, #2080f0 0%, #1060c9 100%);
}

.gradient-purple {
  background: linear-gradient(135deg, #9333ea 0%, #7e22ce 100%);
}

.gradient-orange {
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
}

/* AI课程内容生成弹窗样式 */
.ai-generate-content {
  padding: 8px 0;
}

.ai-topic-input {
  margin-bottom: 20px;
}

.input-label {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 8px;
}

.ai-generate-types {
  margin-bottom: 20px;
}

.types-label {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 12px;
}

.ai-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 60px 0;
  color: #6b7280;
}

.ai-result {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  font-weight: 500;
}

.result-content {
  padding: 16px;
  background: #fff;
  max-height: 400px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.8;
  color: #1f2937;
  margin: 0;
}

.result-content::-webkit-scrollbar {
  width: 6px;
}

.result-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.result-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.result-content::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* 课程质量指标卡片 */
.quality-metric-card {
  padding: 16px;
  background: #f9fafb;
  border-radius: 12px;
  transition: all 0.3s;
}

.quality-metric-card:hover {
  background: #f3f4f6;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* 本周活动趋势滚动条样式 */
.h-320px.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.h-320px.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.h-320px.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.h-320px.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.metric-course {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.metric-scores {
  display: flex;
  justify-content: space-between;
}

.metric-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.metric-label {
  font-size: 11px;
  color: #6b7280;
}

.metric-value {
  font-size: 18px;
  font-weight: bold;
  margin-top: 4px;
}

/* 课程活动时间线 */
.activity-timeline {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 10px;
  transition: all 0.3s;
}

.activity-item:hover {
  background: #f3f4f6;
  transform: translateX(4px);
}

.activity-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-icon.icon-exam {
  background: #fee2e2;
  color: #ef4444;
}
.activity-icon.icon-assignment {
  background: #fef3c7;
  color: #f59e0b;
}

/* 课程分类颜色 */
.bg-purple {
  background: linear-gradient(135deg, #9333ea 0%, #7e22ce 100%);
}

.bg-orange {
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
}

.bg-info {
  background: linear-gradient(135deg, #2080f0 0%, #1060c9 100%);
}
.activity-icon.icon-resource {
  background: #dbeafe;
  color: #3b82f6;
}
.activity-icon.icon-grade {
  background: #d1fae5;
  color: #10b981;
}
.activity-icon.icon-discussion {
  background: #ede9fe;
  color: #8b5cf6;
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-size: 13px;
  font-weight: 500;
  color: #1f2937;
}

.activity-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
}

.activity-time {
  font-size: 12px;
  color: #9ca3af;
}
</style>
