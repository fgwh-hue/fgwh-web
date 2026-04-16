<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import type { TimelineItemProps } from 'naive-ui';
import { useEcharts } from '@/hooks/common/echarts';
import { useRouterPush } from '@/hooks/common/router';
import SvgIcon from '@/components/custom/svg-icon.vue';

// --- 类型定义 ---

interface TimelineItem {
  id: number;
  time: string;
  title: string;
  type: TimelineItemProps['type'];
}

interface LearningPrediction {
  course: string;
  currentScore: number;
  predictedScore: number;
  confidence: number;
  riskLevel: 'low' | 'medium' | 'high';
  suggestion: string;
}

interface LearningRisk {
  id: string;
  title: string;
  description: string;
  level: 'low' | 'medium' | 'high';
  course?: string;
  action: string;
}

interface StudyPattern {
  id: string;
  name: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  description: string;
}

// --- 模拟数据 ---

const kpiData = ref([
  { label: '总学习时长 (小时)', value: 128, icon: 'ph:timer-duotone' },
  { label: '已完成课程', value: '3 / 10', icon: 'ph:check-circle-duotone' },
  { label: '平均成绩', value: 89.5, icon: 'ph:exam-duotone' },
  { label: '本周排名', value: '12', icon: 'ph:trophy-duotone' },
  { label: '获得徽章', value: '4', icon: 'ph:medal-duotone' }
]);

// --- 学习效果预测模型 ---

const learningPredictions = ref<LearningPrediction[]>([
  {
    course: '高等数学',
    currentScore: 85,
    predictedScore: 92,
    confidence: 0.85,
    riskLevel: 'low',
    suggestion: '保持当前的学习节奏，建议加强难点章节的练习'
  },
  {
    course: '大学英语',
    currentScore: 78,
    predictedScore: 82,
    confidence: 0.78,
    riskLevel: 'low',
    suggestion: '增加听力和口语练习时间'
  },
  {
    course: '计算机网络',
    currentScore: 65,
    predictedScore: 70,
    confidence: 0.65,
    riskLevel: 'medium',
    suggestion: '需要重点关注网络协议部分，建议多做实验'
  },
  {
    course: '数据结构',
    currentScore: 72,
    predictedScore: 68,
    confidence: 0.72,
    riskLevel: 'high',
    suggestion: '学习状态有所下降，建议调整学习方法，多做算法题'
  }
]);

// --- 学习风险预警 ---

const learningRisks = ref<LearningRisk[]>([
  {
    id: 'r1',
    title: '学习时间不足',
    description: '本周学习时间低于预期目标',
    level: 'medium',
    action: '增加每日学习时间至2小时'
  },
  {
    id: 'r2',
    title: '成绩下滑风险',
    description: '数据结构课程成绩有下滑趋势',
    level: 'high',
    course: '数据结构',
    action: '重点复习链表和树的相关内容'
  },
  {
    id: 'r3',
    title: '知识点掌握不牢固',
    description: '计算机网络协议部分存在知识盲区',
    level: 'medium',
    course: '计算机网络',
    action: '使用AI助教深入理解TCP/IP协议'
  }
]);

// --- 学习模式分析 ---

const studyPatterns = ref<StudyPattern[]>([
  {
    id: 'p1',
    name: '学习专注度',
    value: 85,
    trend: 'up',
    description: '学习专注度呈上升趋势，保持良好'
  },
  {
    id: 'p2',
    name: '知识点掌握',
    value: 78,
    trend: 'stable',
    description: '知识点掌握程度稳定，需加强练习'
  },
  {
    id: 'p3',
    name: '学习效率',
    value: 92,
    trend: 'up',
    description: '学习效率较高，继续保持'
  },
  {
    id: 'p4',
    name: '复习频率',
    value: 65,
    trend: 'down',
    description: '复习频率不足，建议增加复习时间'
  }
]);

const timelineData = ref<TimelineItem[]>([
  {
    id: 1,
    time: '2025-10-28 10:30',
    title: '完成了《高等数学》的“第一章：极限与连续”',
    type: 'success'
  },
  {
    id: 2,
    time: '2025-10-27 15:00',
    title: '完成了“线性代数”的单元测验，得分 95',
    type: 'info'
  },
  {
    id: 3,
    time: '2025-10-26 20:00',
    title: '观看了课程《JavaScript 入门到精通》',
    type: 'default'
  },
  {
    id: 4,
    time: '2025-10-25 18:45',
    title: '向 AI 助教提问了关于“JavaScript 闭包”的问题',
    type: 'default'
  },
  {
    id: 5,
    time: '2025-10-24 14:20',
    title: '完成了《数据结构》的“二叉树遍历”编程练习',
    type: 'success'
  },
  {
    id: 6,
    time: '2025-10-23 09:15',
    title: '参加了《计算机网络》的在线讨论课',
    type: 'info'
  },
  {
    id: 7,
    time: '2025-10-22 16:30',
    title: '阅读了《算法导论》的第三章内容',
    type: 'default'
  }
  // { id: 8, time: '2025-10-21 11:00', title: '完成了《操作系统》的实验报告', type: 'success' },
  // { id: 9, time: '2025-10-20 19:45', title: '观看了《Python数据分析》的实战案例', type: 'default' },
  // { id: 10, time: '2025-10-19 13:20', title: '完成了《数据库原理》的SQL练习', type: 'success' },
  // { id: 11, time: '2025-10-18 10:00', title: '参加了学习小组的线上讨论', type: 'info' },
  // { id: 12, time: '2025-10-17 15:30', title: '完成了《软件工程》的需求分析文档', type: 'success' }
]);

const learningGoals = ref([
  {
    id: 1,
    title: '完成《Vue 3 深入剖析》课程',
    current: 75,
    target: 100,
    unit: '%'
  },
  {
    id: 2,
    title: '本周学习时长达到 10 小时',
    current: 8,
    target: 10,
    unit: '小时'
  },
  { id: 3, title: '完成 5 次编程练习', current: 2, target: 5, unit: '次' }
]);

const achievementBadges = ref([
  {
    id: 1,
    name: '初学者',
    icon: 'ph:student-duotone',
    earned: true,
    description: '完成第一个课程'
  },
  {
    id: 2,
    name: '持续学习者',
    icon: 'ph:calendar-check-duotone',
    earned: true,
    description: '连续学习7天'
  },
  {
    id: 3,
    name: '数学高手',
    icon: 'ph:function-duotone',
    earned: false,
    description: '高等数学课程获得A+'
  },
  {
    id: 4,
    name: '探索者',
    icon: 'ph:compass-duotone',
    earned: true,
    description: '学习超过3个不同领域的课程'
  },
  {
    id: 5,
    name: '满分学霸',
    icon: 'ph:seal-check-duotone',
    earned: false,
    description: '在一次重要考试中获得满分'
  },
  {
    id: 6,
    name: '代码新星',
    icon: 'ph:code-duotone',
    earned: true,
    description: '首次完成一个编程练习'
  },
  {
    id: 7,
    name: '周末学霸',
    icon: 'ph:coffee-duotone',
    earned: false,
    description: '在一个周末完成超过5小时的学习'
  },
  {
    id: 8,
    name: '提问达人',
    icon: 'ph:question-duotone',
    earned: true,
    description: '向AI助教累计提问超过20次'
  },
  {
    id: 9,
    name: '网络先锋',
    icon: 'ph:globe-duotone',
    earned: false,
    description: '完成《计算机网络》课程'
  },
  {
    id: 10,
    name: '全能王者',
    icon: 'ph:crown-duotone',
    earned: false,
    description: '解锁所有其他成就徽章'
  }
]);

// --- 图表配置与交互逻辑 ---

const timeDimension = ref('week');
const pieData = {
  week: [
    { value: 40, name: '高等数学' },
    { value: 25, name: '大学英语' },
    { value: 35, name: '计算机网络' }
  ],
  month: [
    { value: 120, name: '高等数学' },
    { value: 80, name: '大学英语' },
    { value: 100, name: '计算机网络' }
  ]
};
const { domRef: pieRef, setOptions: setPieOptions } = useEcharts(() => ({
  title: { text: '学科学习时长分布', left: 'center', show: false },
  tooltip: { trigger: 'item' },
  legend: { orient: 'vertical', left: 'left', top: '10%' },
  series: [
    {
      name: '学习时长',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['65%', '50%'],
      data: pieData.week,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
}));

watch(timeDimension, newValue => {
  setPieOptions({
    title: { text: '学科学习时长分布', left: 'center', show: false },
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left', top: '10%' },
    series: [
      {
        name: '学习时长',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['65%', '50%'],
        data: pieData[newValue as keyof typeof pieData],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  });
});

const { domRef: doughnutRef } = useEcharts(() => ({
  tooltip: { trigger: 'item' },
  legend: { orient: 'vertical', left: 'left', top: '10%' },
  series: [
    {
      name: '学习方式',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['65%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: { show: false },
      emphasis: {
        label: {
          show: true,
          fontSize: 20,
          fontWeight: 'bold'
        }
      },
      labelLine: { show: false },
      data: [
        { value: 45, name: '观看视频' },
        { value: 25, name: '阅读文档' },
        { value: 20, name: '完成测验' },
        { value: 10, name: '编程练习' }
      ]
    }
  ]
}));

const showAverage = ref(false);
const myScores = [88, 92, 85, 95];
const averageScores = [85, 88, 86, 90];
const predictedScores = [92, 94, 88, 96];
const { domRef: lineRef, setOptions: setLineOptions } = useEcharts(() => ({
  title: { text: '近期成绩趋势', left: 'center' },
  tooltip: { trigger: 'axis' },
  legend: { data: ['我的成绩', '班级平均分', '预测成绩'], top: '10%' },
  grid: {
    top: '25%',
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ['第一次测验', '第二次测验', '期中考试', '第三次测验']
  },
  yAxis: { type: 'value', min: 60 },
  series: [
    { name: '我的成绩', data: myScores, type: 'line', smooth: true },
    {
      name: '班级平均分',
      data: [] as number[],
      type: 'line',
      smooth: true,
      lineStyle: { type: 'dashed' }
    },
    {
      name: '预测成绩',
      data: predictedScores,
      type: 'line',
      smooth: true,
      lineStyle: { type: 'dotted' },
      itemStyle: { color: '#ff7f50' }
    }
  ]
}));

watch(showAverage, newValue => {
  setLineOptions({
    title: { text: '近期成绩趋势', left: 'center' },
    tooltip: { trigger: 'axis' },
    legend: { data: ['我的成绩', '班级平均分', '预测成绩'], top: '10%' },
    grid: {
      top: '25%',
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['第一次测验', '第二次测验', '期中考试', '第三次测验']
    },
    yAxis: { type: 'value', min: 60 },
    series: [
      {
        name: '我的成绩',
        data: myScores,
        type: 'line',
        smooth: true
      },
      {
        name: '班级平均分',
        data: newValue ? averageScores : [],
        type: 'line',
        smooth: true,
        lineStyle: { type: 'dashed' }
      },
      {
        name: '预测成绩',
        data: predictedScores,
        type: 'line',
        smooth: true,
        lineStyle: { type: 'dotted' },
        itemStyle: { color: '#ff7f50' }
      }
    ]
  });
});

const { domRef: radarRef } = useEcharts(() => ({
  title: {
    text: '分学科能力评估',
    left: 'center'
  },
  tooltip: { trigger: 'item' },
  legend: {
    data: ['我的成绩', '目标水平'],
    bottom: '2%'
  },
  radar: {
    indicator: [
      { name: '高等数学', max: 100 },
      { name: '大学英语', max: 100 },
      { name: '计算机网络', max: 100 },
      { name: '数据结构', max: 100 },
      { name: '操作系统', max: 100 }
    ],
    center: ['50%', '55%']
  },
  series: [
    {
      name: '学科成绩',
      type: 'radar',
      data: [
        { value: [92, 88, 78, 85, 95], name: '我的成绩' },
        {
          value: [95, 90, 85, 90, 95],
          name: '目标水平',
          lineStyle: { type: 'dashed' },
          areaStyle: { opacity: 0.3 }
        }
      ]
    }
  ]
}));

// --- 学习预测图表 ---

const { domRef: predictionRef } = useEcharts(() => ({
  title: { text: '学习效果预测', left: 'center' },
  tooltip: { trigger: 'axis' },
  legend: { data: ['当前成绩', '预测成绩'], top: '10%' },
  grid: {
    top: '25%',
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: learningPredictions.value.map(p => p.course)
  },
  yAxis: { type: 'value', min: 60, max: 100 },
  series: [
    {
      name: '当前成绩',
      data: learningPredictions.value.map(p => p.currentScore),
      type: 'bar',
      itemStyle: { color: '#6495ed' }
    },
    {
      name: '预测成绩',
      data: learningPredictions.value.map(p => p.predictedScore),
      type: 'bar',
      itemStyle: { color: '#ff7f50' }
    }
  ]
}));

// 路由跳转方法
const { routerPushByKey } = useRouterPush();

// 学习提示语数组
const studyTips = [
  '今日事今日毕，别让拖延成为习惯。',
  '温故而知新，记得复习昨天学过的内容。',
  '设定一个小目标，然后去完成它！',
  '分享是最好的学习方式，试着把新知识讲给别人听。',
  '保持好奇心，它是探索知识的源动力。'
];

// 随机选择一条提示语
const randomTip = computed(() => studyTips[Math.floor(Math.random() * studyTips.length)]);

// 计算风险等级数量
// const highRiskCount = computed(() => learningRisks.value.filter(r => r.level === 'high').length);
// const mediumRiskCount = computed(() => learningRisks.value.filter(r => r.level === 'medium').length);

// 获取风险等级对应的样式
function getRiskStyle(level: string) {
  switch (level) {
    case 'high':
      return { type: 'error' as const, icon: 'ph:alert-circle-duotone' };
    case 'medium':
      return { type: 'warning' as const, icon: 'ph:alert-triangle-duotone' };
    case 'low':
      return { type: 'info' as const, icon: 'ph:info-duotone' };
    default:
      return { type: 'default' as const, icon: 'ph:info-duotone' };
  }
}

// 获取趋势对应的样式
function getTrendStyle(trend: string) {
  switch (trend) {
    case 'up':
      return { color: '#67c23a', icon: 'ph:trending-up-duotone' };
    case 'down':
      return { color: '#f56c6c', icon: 'ph:trending-down-duotone' };
    case 'stable':
      return { color: '#409eff', icon: 'ph:trending-up-down-duotone' };
    default:
      return { color: '#909399', icon: 'ph:minus-duotone' };
  }
}

const myCoursesProgress = ref([
  { id: 'c1', name: '高等数学', progress: 75, icon: 'ph:function-duotone' },
  { id: 'c2', name: '大学英语', progress: 90, icon: 'ph:translate-duotone' },
  {
    id: 'c3',
    name: '计算机网络',
    progress: 50,
    icon: 'ph:globe-hemisphere-west-duotone'
  },
  {
    id: 'c4',
    name: '数据结构',
    progress: 82,
    icon: 'ph:tree-structure-duotone'
  }
]);

// 新增：近期测验记录数据
const recentTests = ref([
  { id: 't1', name: '高等数学 - 单元测验(一)', score: 95, date: '2025-10-27' },
  { id: 't2', name: '大学英语 - 听力测试', score: 88, date: '2025-10-25' },
  { id: 't3', name: '计算机网络 - 随堂练习', score: 78, date: '2025-10-24' },
  { id: 't4', name: 'java - 随堂练习', score: 99, date: '2025-10-24' }
]);

// 新增：学习习惯分析
const studyHabits = ref([
  {
    id: 'h1',
    name: '早起学习',
    score: 85,
    trend: 'up',
    description: '早晨6-8点学习效率较高'
  },
  {
    id: 'h2',
    name: '晚间复习',
    score: 75,
    trend: 'stable',
    description: '晚上8-10点进行复习'
  },
  {
    id: 'h3',
    name: '周末学习',
    score: 60,
    trend: 'down',
    description: '周末学习时间较少'
  },
  {
    id: 'h4',
    name: '连续学习',
    score: 90,
    trend: 'up',
    description: '能够保持较长时间的专注学习'
  }
]);

// 新增：学习资源推荐
const learningResources = ref([
  {
    id: 'r1',
    title: '高等数学易错点总结',
    type: '文档',
    relevance: 0.95,
    progress: 0
  },
  {
    id: 'r2',
    title: '英语听力提升技巧',
    type: '视频',
    relevance: 0.88,
    progress: 50
  },
  {
    id: 'r3',
    title: '计算机网络拓扑图',
    type: '图表',
    relevance: 0.92,
    progress: 0
  },
  {
    id: 'r4',
    title: 'Java核心概念解析',
    type: '文档',
    relevance: 0.9,
    progress: 75
  }
]);

// 新增：学习计划跟踪
const studyPlans = ref([
  {
    id: 'p1',
    title: '本周学习计划',
    completed: 6,
    total: 8,
    progress: 75,
    deadline: '2025-11-02'
  },
  {
    id: 'p2',
    title: '高数复习计划',
    completed: 3,
    total: 5,
    progress: 60,
    deadline: '2025-11-10'
  },
  {
    id: 'p3',
    title: '英语听力练习',
    completed: 12,
    total: 20,
    progress: 60,
    deadline: '2025-11-15'
  }
]);

// onMounted 逻辑
onMounted(() => {
  const items = document.querySelectorAll<HTMLElement>('.interactive-item');

  items.forEach(item => {
    item.addEventListener('mousemove', (e: MouseEvent) => {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      (e.currentTarget as HTMLElement).style.setProperty('--ripple-x', `${x}px`);
      (e.currentTarget as HTMLElement).style.setProperty('--ripple-y', `${y}px`);
    });
  });
});
</script>

<template>
  <div class="learning-progress-container">
    <!-- 装饰性背景元素 -->
    <div class="background-decoration"></div>

    <NSpace vertical :size="12">
      <!-- 1. 欢迎问候区 -->
      <NCard :bordered="false" class="interactive-item card-wrapper">
        <div class="card-decoration"></div>
        <NGrid :x-gap="16" :y-gap="16" cols="1 s:1 m:1 l:3" responsive="screen">
          <!-- 左侧：问候语和操作按钮 -->
          <NGi span="1 l:2">
            <div class="h-full flex flex-col justify-center">
              <h2 class="text-2xl text-blue-400 font-bold">你好, fgwh!</h2>
              <p class="mt-2 text-gray-500">今日学习小贴士：{{ randomTip }}</p>
              <NSpace class="mt-6">
                <NButton
                  type="primary"
                  size="large"
                  class="animate-pulse"
                  @click="routerPushByKey('student_dashboard')"
                >
                  开始新课程
                </NButton>
                <NButton size="large" @click="routerPushByKey('student_ai-tutor')">咨询AI助教</NButton>
              </NSpace>
            </div>
          </NGi>

          <!-- 右侧：插图 -->
          <NGi span="1 l:1" class="l:flex hidden items-center justify-center">
            <SvgIcon local-icon="banner" class="text-300px text-primary" />
          </NGi>
        </NGrid>
      </NCard>

      <!-- 2. 核心指标区 -->
      <NCard :bordered="false" class="card-wrapper">
        <div class="card-decoration"></div>
        <NGrid :x-gap="12" :y-gap="12" cols="2 s:3 m:5" responsive="screen">
          <NGi v-for="(item, index) in kpiData" :key="index">
            <div class="kpi-item interactive-item">
              <div class="kpi-icon-bg"></div>
              <div class="flex items-center text-gray-500">
                <SvgIcon :icon="item.icon" class="mr-2 text-lg" />
                <span>{{ item.label }}</span>
              </div>
              <p class="mt-1 text-2xl font-semibold">{{ item.value }}</p>
            </div>
          </NGi>
        </NGrid>
      </NCard>

      <!-- 3. 图表分析区 -->
      <div class="charts-section">
        <NGrid :x-gap="12" :y-gap="12" cols="1 s:1 l:2" responsive="screen" item-style="display: flex;">
          <NGi>
            <NCard title="学习投入分析" :bordered="false" class="interactive-item h-full card-wrapper">
              <div class="card-decoration"></div>
              <NTabs type="line" animated>
                <NTabPane name="duration" tab="时长分布">
                  <template #tab>
                    <NRadioGroup v-model:value="timeDimension" name="radiogroup" size="small">
                      <NRadioButton value="week">本周</NRadioButton>
                      <NRadioButton value="month">本月</NRadioButton>
                    </NRadioGroup>
                  </template>
                  <div ref="pieRef" class="h-280px w-full"></div>
                </NTabPane>
                <NTabPane name="method" tab="方式分布">
                  <div ref="doughnutRef" class="h-280px w-full"></div>
                </NTabPane>
              </NTabs>
            </NCard>
          </NGi>
          <NGi>
            <NCard title="成绩趋势分析" :bordered="false" class="interactive-item h-full card-wrapper">
              <div class="card-decoration"></div>
              <template #header-extra>
                <NCheckbox v-model:checked="showAverage">对比班级平均分</NCheckbox>
              </template>
              <div ref="lineRef" class="h-280px w-full"></div>
            </NCard>
          </NGi>
        </NGrid>

        <NGrid :x-gap="12" :y-gap="12" cols="1 s:1 l:2" responsive="screen" item-style="display: flex;">
          <NGi>
            <NCard title="分学科能力评估" :bordered="false" class="interactive-item h-full card-wrapper">
              <div class="card-decoration"></div>
              <div ref="radarRef" class="h-280px w-full"></div>
            </NCard>
          </NGi>
          <NGi>
            <NCard title="学习效果预测" :bordered="false" class="interactive-item h-full card-wrapper">
              <div class="card-decoration"></div>
              <div ref="predictionRef" class="h-280px w-full"></div>
            </NCard>
          </NGi>
        </NGrid>

        <NGrid :x-gap="12" :y-gap="12" cols="1 s:1 l:2" responsive="screen" item-style="display: flex;">
          <NGi>
            <NCard
              title="学习风险预警"
              :bordered="false"
              class="interactive-item h-full card-wrapper"
              content-style="height: 100%;"
            >
              <div class="card-decoration"></div>
              <div class="risk-analysis-container">
                <NGrid :x-gap="12" :y-gap="12" cols="1 s:2" responsive="screen">
                  <NGi v-for="risk in learningRisks" :key="risk.id" class="pattern-item-wrapper">
                    <div class="risk-card interactive-item" :class="risk.level">
                      <div class="risk-header">
                        <div class="risk-icon-wrapper" :class="risk.level">
                          <SvgIcon :icon="getRiskStyle(risk.level).icon" class="risk-icon" />
                        </div>
                        <div class="risk-title-section">
                          <h4 class="risk-title">{{ risk.title }}</h4>
                          <NTag :type="getRiskStyle(risk.level).type" size="small" class="risk-level-tag">
                            {{ risk.level === 'high' ? '高风险' : risk.level === 'medium' ? '中风险' : '低风险' }}
                          </NTag>
                        </div>
                      </div>

                      <div class="risk-content">
                        <p class="risk-description">{{ risk.description }}</p>
                        <div v-if="risk.course" class="risk-course">
                          <SvgIcon icon="ph:book-open-duotone" class="course-icon" />
                          <NTag size="small" type="info" effect="light">{{ risk.course }}</NTag>
                        </div>
                      </div>

                      <div class="risk-suggestion">
                        <div class="suggestion-header">
                          <SvgIcon icon="ph:lightbulb-duotone" class="suggestion-icon" />
                          <span class="suggestion-title">建议措施</span>
                        </div>
                        <p class="suggestion-text">{{ risk.action }}</p>
                      </div>

                      <div class="risk-actions">
                        <NButton text size="small" type="primary">立即处理</NButton>
                        <NButton text size="small">设置提醒</NButton>
                        <NButton text size="small">忽略</NButton>
                      </div>
                    </div>
                  </NGi>
                  <NGi v-if="learningRisks.length < 4" class="pattern-item-wrapper">
                    <div class="risk-card interactive-item placeholder-card">
                      <div class="risk-header">
                        <div class="risk-icon-wrapper low">
                          <SvgIcon icon="ph:shield-check-duotone" class="risk-icon" />
                        </div>
                        <div class="risk-title-section">
                          <h4 class="risk-title">暂无风险</h4>
                          <NTag type="info" size="small" class="risk-level-tag">低风险</NTag>
                        </div>
                      </div>

                      <div class="risk-content">
                        <p class="risk-description">学习状态良好，继续保持当前的学习节奏</p>
                      </div>

                      <div class="risk-suggestion">
                        <div class="suggestion-header">
                          <SvgIcon icon="ph:lightbulb-duotone" class="suggestion-icon" />
                          <span class="suggestion-title">建议措施</span>
                        </div>
                        <p class="suggestion-text">保持当前的学习计划，定期回顾已学内容</p>
                      </div>

                      <div class="risk-actions">
                        <NButton text size="small" type="primary">查看详情</NButton>
                        <NButton text size="small">历史记录</NButton>
                        <NButton text size="small">忽略</NButton>
                      </div>
                    </div>
                  </NGi>
                </NGrid>
              </div>
            </NCard>
          </NGi>
          <NGi>
            <NCard
              title="学习模式分析"
              :bordered="false"
              class="interactive-item h-full card-wrapper"
              content-style="height: 100%;"
            >
              <div class="card-decoration"></div>
              <div class="pattern-analysis-container">
                <NGrid :x-gap="12" :y-gap="12" cols="1 s:2" responsive="screen">
                  <NGi v-for="pattern in studyPatterns" :key="pattern.id" class="pattern-item-wrapper">
                    <div class="pattern-card interactive-item">
                      <div class="pattern-header">
                        <div class="pattern-icon-wrapper" :class="pattern.trend">
                          <SvgIcon :icon="getTrendStyle(pattern.trend).icon" class="pattern-icon" />
                        </div>
                        <div class="pattern-title-section">
                          <h4 class="pattern-name">{{ pattern.name }}</h4>
                          <div class="pattern-trend-badge" :class="pattern.trend">
                            <SvgIcon
                              :icon="
                                pattern.trend === 'up'
                                  ? 'ph:trend-up-duotone'
                                  : pattern.trend === 'down'
                                    ? 'ph:trend-down-duotone'
                                    : 'ph:minus-duotone'
                              "
                              class="trend-icon"
                            />
                            <span>
                              {{ pattern.trend === 'up' ? '上升' : pattern.trend === 'down' ? '下降' : '稳定' }}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div class="pattern-progress-section">
                        <div class="progress-header">
                          <span class="progress-label">综合评分</span>
                          <span class="progress-value" :class="pattern.trend">{{ pattern.value }}分</span>
                        </div>
                        <NProgress
                          type="line"
                          :percentage="pattern.value"
                          :show-indicator="false"
                          :height="8"
                          :status="pattern.trend === 'up' ? 'success' : pattern.trend === 'down' ? 'error' : 'info'"
                          class="pattern-progress"
                        />
                      </div>

                      <div class="pattern-description">
                        <p class="description-text">
                          {{ pattern.description }}
                        </p>
                        <div class="pattern-actions">
                          <NButton text size="small" type="primary">查看详情</NButton>
                          <NButton text size="small">历史记录</NButton>
                        </div>
                      </div>

                      <div class="pattern-stats">
                        <div class="stat-item">
                          <SvgIcon icon="ph:target-duotone" class="stat-icon" />
                          <span class="stat-label">目标</span>
                          <span class="stat-value">90分</span>
                        </div>
                        <div class="stat-item">
                          <SvgIcon icon="ph:chart-line-up-duotone" class="stat-icon" />
                          <span class="stat-label">本周</span>
                          <span class="stat-value">{{ pattern.value }}分</span>
                        </div>
                        <div class="stat-item">
                          <SvgIcon icon="ph:calendar-check-duotone" class="stat-icon" />
                          <span class="stat-label">变化</span>
                          <span class="stat-value" :class="pattern.trend">
                            {{ pattern.trend === 'up' ? '+5' : pattern.trend === 'down' ? '-3' : '0' }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </NGi>
                </NGrid>
              </div>
            </NCard>
          </NGi>
        </NGrid>

        <NGrid :x-gap="12" :y-gap="12" cols="1" responsive="screen" item-style="display: flex;">
          <NGi>
            <NCard
              title="学习活动时间线"
              :bordered="false"
              class="interactive-item h-full card-wrapper"
              content-style="height: 100%; display: flex; flex-direction: column;"
            >
              <div class="card-decoration"></div>
              <NScrollbar class="max-h-none flex-1">
                <NTimeline class="timeline-full">
                  <NTimelineItem
                    v-for="item in timelineData"
                    :key="item.id"
                    :type="item.type"
                    :time="item.time"
                    :title="item.title"
                    class="interactive-item timeline-item"
                  >
                    <template #icon>
                      <div class="timeline-icon" :class="item.type">
                        <SvgIcon
                          :icon="
                            item.type === 'success'
                              ? 'ph:check-circle-duotone'
                              : item.type === 'info'
                                ? 'ph:info-duotone'
                                : 'ph:clock-duotone'
                          "
                        />
                      </div>
                    </template>
                  </NTimelineItem>
                </NTimeline>
              </NScrollbar>
            </NCard>
          </NGi>
        </NGrid>
      </div>

      <!-- 学习状态区 -->
      <div class="study-status-section">
        <NGrid :x-gap="12" :y-gap="12" cols="1 s:1 l:2" responsive="screen" item-style="display: flex;">
          <!-- 左侧：我的课程进度 -->
          <NGi>
            <NCard title="我的课程进度" :bordered="false" class="interactive-item h-full card-wrapper">
              <div class="card-decoration"></div>
              <NSpace vertical :size="12">
                <div v-for="course in myCoursesProgress" :key="course.id" class="interactive-item">
                  <div class="mb-2 flex items-center">
                    <SvgIcon :icon="course.icon" class="mr-2 text-lg text-primary" />
                    <span class="font-semibold">{{ course.name }}</span>
                    <span class="ml-auto text-sm text-gray-500">{{ course.progress }}%</span>
                  </div>
                  <NProgress type="line" :percentage="course.progress" status="success" :show-indicator="false" />
                </div>
              </NSpace>
            </NCard>
          </NGi>

          <!-- 右侧：近期测验记录 -->
          <NGi>
            <NCard title="近期测验记录" :bordered="false" class="interactive-item h-full card-wrapper">
              <div class="card-decoration"></div>
              <NList hoverable clickable size="small">
                <NListItem v-for="test in recentTests" :key="test.id" class="interactive-item">
                  <NThing>
                    <template #header>
                      <div class="flex items-center justify-between">
                        <span class="font-medium">{{ test.name }}</span>
                        <NTag
                          :type="test.score >= 90 ? 'success' : test.score >= 60 ? 'info' : 'error'"
                          size="small"
                          round
                        >
                          {{ test.score }}分
                        </NTag>
                      </div>
                    </template>
                    <template #description>
                      <span class="text-xs text-gray-500">考试日期: {{ test.date }}</span>
                    </template>
                  </NThing>
                </NListItem>
              </NList>
            </NCard>
          </NGi>
        </NGrid>
      </div>

      <!-- 新增：学习习惯分析 -->
      <NCard :bordered="false" class="interactive-item mt-4 card-wrapper">
        <div class="card-decoration"></div>
        <h3 class="mb-4 font-medium">学习习惯分析</h3>
        <NGrid :x-gap="12" :y-gap="12" cols="2 s:4" responsive="screen">
          <NGi v-for="habit in studyHabits" :key="habit.id" class="interactive-item">
            <div class="rounded-lg bg-white p-4 shadow-sm">
              <div class="mb-2 flex items-center justify-between">
                <h4 class="font-medium">{{ habit.name }}</h4>
                <div class="flex items-center">
                  <SvgIcon
                    :icon="
                      habit.trend === 'up'
                        ? 'ph:trending-up-duotone'
                        : habit.trend === 'down'
                          ? 'ph:trending-down-duotone'
                          : 'ph:trending-up-down-duotone'
                    "
                    :style="{
                      color: habit.trend === 'up' ? '#67c23a' : habit.trend === 'down' ? '#f56c6c' : '#409eff'
                    }"
                  />
                </div>
              </div>
              <div class="mb-2">
                <NProgress
                  type="line"
                  :percentage="habit.score"
                  :show-indicator="false"
                  :status="habit.trend === 'up' ? 'success' : habit.trend === 'down' ? 'error' : 'info'"
                />
              </div>
              <p class="text-xs text-gray-500">{{ habit.description }}</p>
            </div>
          </NGi>
        </NGrid>
      </NCard>

      <!-- 新增：学习资源推荐 -->
      <NCard :bordered="false" class="interactive-item mt-4 card-wrapper">
        <div class="card-decoration"></div>
        <h3 class="mb-4 font-medium">学习资源推荐</h3>
        <NGrid :x-gap="12" :y-gap="12" cols="2 s:4" responsive="screen">
          <NGi v-for="resource in learningResources" :key="resource.id" class="interactive-item">
            <div class="rounded-lg bg-white p-4 shadow-sm">
              <div class="mb-2 flex items-start justify-between">
                <span class="font-medium">{{ resource.title }}</span>
                <NTag
                  size="tiny"
                  :type="resource.type === '文档' ? 'primary' : resource.type === '视频' ? 'success' : 'warning'"
                >
                  {{ resource.type }}
                </NTag>
              </div>
              <div class="mb-2">
                <NProgress type="line" :percentage="resource.relevance * 100" :show-indicator="false" :height="4" />
                <span class="text-xs text-gray-500">相关度：{{ Math.round(resource.relevance * 100) }}%</span>
              </div>
              <div v-if="resource.progress > 0" class="mt-2">
                <span class="text-xs text-gray-500">学习进度：{{ resource.progress }}%</span>
                <NProgress
                  type="line"
                  :percentage="resource.progress"
                  :show-indicator="false"
                  :height="4"
                  class="mt-1"
                />
              </div>
            </div>
          </NGi>
        </NGrid>
      </NCard>

      <!-- 新增：学习计划跟踪 -->
      <NCard :bordered="false" class="interactive-item mt-4 card-wrapper">
        <div class="card-decoration"></div>
        <h3 class="mb-4 font-medium">学习计划跟踪</h3>
        <NSpace vertical :size="12">
          <div v-for="plan in studyPlans" :key="plan.id" class="interactive-item">
            <div class="mb-2 flex items-center justify-between">
              <span class="font-semibold">{{ plan.title }}</span>
              <div class="flex items-center gap-2">
                <span class="text-sm">{{ plan.completed }}/{{ plan.total }}</span>
                <NTag :type="plan.progress >= 70 ? 'success' : plan.progress >= 40 ? 'warning' : 'error'" size="small">
                  {{ plan.progress }}%
                </NTag>
              </div>
            </div>
            <NProgress
              type="line"
              :percentage="plan.progress"
              :status="plan.progress >= 70 ? 'success' : plan.progress >= 40 ? 'warning' : 'error'"
            />
            <div class="mt-1 flex items-center justify-between">
              <span class="text-xs text-gray-500">截止日期：{{ plan.deadline }}</span>
              <NButton text size="small">查看详情</NButton>
            </div>
          </div>
        </NSpace>
      </NCard>

      <!-- 4. 目标与激励区 -->
      <div class="goals-section">
        <NGrid :x-gap="12" :y-gap="12" cols="1 s:1 l:2" responsive="screen" item-style="display: flex;">
          <NGi>
            <NCard title="我的学习目标" :bordered="false" class="interactive-item h-full card-wrapper">
              <div class="card-decoration"></div>
              <NSpace vertical :size="12">
                <div v-for="goal in learningGoals" :key="goal.id" class="interactive-item">
                  <div class="mb-1 flex items-center justify-between">
                    <span>{{ goal.title }}</span>
                    <span class="text-sm font-medium">
                      {{ goal.current }}{{ goal.unit }} / {{ goal.target }}{{ goal.unit }}
                    </span>
                  </div>
                  <NProgress type="line" :percentage="(goal.current / goal.target) * 100" :show-indicator="false" />
                </div>
              </NSpace>
            </NCard>
          </NGi>
          <NGi>
            <NCard title="成就徽章墙" :bordered="false" class="interactive-item h-full card-wrapper">
              <div class="card-decoration"></div>
              <NGrid :x-gap="12" :y-gap="12" cols="3 s:4 m:5" responsive="screen">
                <NGi v-for="badge in achievementBadges" :key="badge.id" class="interactive-item flex-col-center">
                  <NTooltip trigger="hover">
                    <template #trigger>
                      <div class="badge-wrapper">
                        <SvgIcon
                          :icon="badge.icon"
                          class="text-4xl"
                          :class="[badge.earned ? 'text-primary' : 'text-gray-400']"
                        />
                        <div v-if="badge.earned" class="badge-glow"></div>
                      </div>
                    </template>
                    {{ badge.description }}
                  </NTooltip>
                  <p class="mt-1 text-sm" :class="[badge.earned ? 'text-primary' : 'text-gray-400']">
                    {{ badge.name }}
                  </p>
                </NGi>
              </NGrid>
            </NCard>
          </NGi>
        </NGrid>
      </div>
    </NSpace>
  </div>
</template>

<style scoped>
/* 容器样式 */
.learning-progress-container {
  position: relative;
  padding: 12px;
  background: linear-gradient(135deg, rgba(245, 247, 250, 0.5), rgba(250, 250, 252, 0.5));
  border-radius: 12px;
  overflow: visible;
  min-height: 100vh;
}

/* 背景装饰 */
.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background:
    radial-gradient(circle at 20% 50%, rgba(102, 126, 234, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(100, 108, 255, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 60% 80%, rgba(100, 108, 255, 0.04) 0%, transparent 50%);
  z-index: 0;
  pointer-events: none;
}

/* 卡片容器样式 */
.card-wrapper {
  min-height: 120px;
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  transition: box-shadow 0.3s ease;
}

.card-wrapper:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

/* 卡片装饰元素 */
.card-decoration {
  position: absolute;
  top: 0;
  right: 0;
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, rgba(100, 108, 255, 0.1) 0%, transparent 70%);
  opacity: 0.5;
  border-radius: 50%;
  transform: translate(50%, -50%);
  z-index: 0;
  pointer-events: none;
  transition: all 0.3s ease;
}

.card-wrapper:hover .card-decoration {
  transform: translate(50%, -50%) scale(1.2);
  opacity: 0.8;
}

/* 交互元素样式 */
.interactive-item {
  position: relative;
  overflow: hidden;
  z-index: 1;
  transition: transform 0.3s ease-in-out;
  border-radius: 8px;
  padding: 12px;
  min-height: 50px;
}

.interactive-item:hover {
  transform: scale(1.02);
  z-index: 10;
}

.interactive-item::after {
  content: '';
  position: absolute;
  top: var(--ripple-y);
  left: var(--ripple-x);
  width: 0;
  height: 0;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: rgba(100, 108, 255, 0.15);
  opacity: 0.6;
  transition: 0s;
  pointer-events: none;
  z-index: 1;
}

.interactive-item:hover::after {
  width: 300px;
  height: 300px;
  opacity: 0;
  transition:
    width 0.6s ease-out,
    height 0.6s ease-out,
    opacity 0.6s ease-out;
}

/* 区域容器样式 */
.charts-section,
.study-status-section,
.goals-section {
  position: relative;
}

/* KPI指标项样式 */
.kpi-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  border: 1px solid rgba(100, 108, 255, 0.15);
  border-radius: 12px;
  padding: 16px 8px;
  text-align: center;
  min-height: 90px;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  z-index: 1;
}

/* KPI图标背景 */
.kpi-icon-bg {
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 40px;
  background: radial-gradient(circle, rgba(100, 108, 255, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  z-index: 0;
  opacity: 0.5;
}

/* 为每个KPI项添加不同的左侧边框和图标颜色 */
.kpi-item:nth-child(1) {
  border-left-color: #64b5f6;
}

.kpi-item:nth-child(1) .iconify {
  color: #64b5f6;
}

.kpi-item:nth-child(2) {
  border-left-color: #81c784;
}

.kpi-item:nth-child(2) .iconify {
  color: #81c784;
}

.kpi-item:nth-child(3) {
  border-left-color: #ffb74d;
}

.kpi-item:nth-child(3) .iconify {
  color: #ffb74d;
}

.kpi-item:nth-child(4) {
  border-left-color: #f06292;
}

.kpi-item:nth-child(4) .iconify {
  color: #f06292;
}

.kpi-item:nth-child(5) {
  border-left-color: #9575cd;
}

.kpi-item:nth-child(5) .iconify {
  color: #9575cd;
}

/* KPI项悬停效果 */
.kpi-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
  border-color: rgba(100, 108, 255, 0.3);
}

/* KPI项内部文本样式 */
.kpi-item p {
  margin-top: 8px;
  font-size: 22px;
  font-weight: 600;
  color: #333639;
  z-index: 1;
  position: relative;
}

.kpi-item span {
  font-size: 13px;
  color: #666;
  line-height: 1.4;
  z-index: 1;
  position: relative;
}

/* 徽章包装器 */
.badge-wrapper {
  position: relative;
  display: inline-block;
}

/* 徽章发光效果 */
.badge-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  background: radial-gradient(circle, rgba(100, 108, 255, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  opacity: 0.6;
  animation: pulse 2s ease-in-out infinite;
  z-index: -1;
}

@keyframes pulse {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.6;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.1);
    opacity: 0.3;
  }
}

/* 图表容器 */
.h-280px {
  height: 280px;
}

/* 时间线铺满样式 */
.timeline-full {
  padding: 16px;
  min-height: 100%;
}

.timeline-item {
  padding: 16px;
  margin-bottom: 12px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  border: 1px solid rgba(100, 108, 255, 0.1);
  transition: all 0.3s ease;
}

.timeline-item:hover {
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateX(4px);
}

.timeline-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.timeline-icon.success {
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
  color: white;
}

.timeline-icon.info {
  background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
  color: white;
}

.timeline-icon.default {
  background: linear-gradient(135deg, #722ed1 0%, #9254de 100%);
  color: white;
}

.timeline-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.timeline-title {
  font-weight: 600;
  font-size: 15px;
  color: #333;
  flex: 1;
}

.timeline-tag {
  flex-shrink: 0;
}

.timeline-description {
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.timeline-time {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
  font-size: 13px;
}

.time-icon {
  color: #999;
}

.timeline-actions {
  display: flex;
  gap: 8px;
}

/* 学习模式分析铺满样式 */
.pattern-analysis-container {
  height: 100%;
  min-height: 280px;
}

.pattern-item-wrapper {
  display: flex;
}

.pattern-card {
  width: 100%;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(100, 108, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pattern-card:hover {
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.pattern-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.pattern-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.pattern-icon-wrapper.up {
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
  color: white;
}

.pattern-icon-wrapper.down {
  background: linear-gradient(135deg, #f56c6c 0%, #fa5555 100%);
  color: white;
}

.pattern-icon-wrapper.stable {
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  color: white;
}

.pattern-icon {
  font-size: 24px;
}

.pattern-title-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.pattern-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.pattern-trend-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  width: fit-content;
}

.pattern-trend-badge.up {
  background: rgba(82, 196, 26, 0.1);
  color: #52c41a;
}

.pattern-trend-badge.down {
  background: rgba(245, 108, 108, 0.1);
  color: #f56c6c;
}

.pattern-trend-badge.stable {
  background: rgba(64, 158, 255, 0.1);
  color: #409eff;
}

.trend-icon {
  font-size: 14px;
}

.pattern-progress-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress-label {
  font-size: 13px;
  color: #666;
}

.progress-value {
  font-size: 18px;
  font-weight: 700;
}

.progress-value.up {
  color: #52c41a;
}

.progress-value.down {
  color: #f56c6c;
}

.progress-value.stable {
  color: #409eff;
}

.pattern-progress {
  margin-top: 4px;
}

.pattern-description {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.description-text {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  margin: 0;
}

.pattern-actions {
  display: flex;
  gap: 8px;
}

.pattern-stats {
  display: flex;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid rgba(100, 108, 255, 0.1);
  margin-top: auto;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-icon {
  font-size: 16px;
  color: #999;
}

.stat-label {
  font-size: 11px;
  color: #999;
}

.stat-value {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.stat-value.up {
  color: #52c41a;
}

.stat-value.down {
  color: #f56c6c;
}

.stat-value.stable {
  color: #409eff;
}

/* 学习风险预警铺满样式 */
.risk-analysis-container {
  height: 100%;
  min-height: 280px;
  display: flex;
  flex-direction: column;
}

.no-risk-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 24px;
  background: rgba(82, 196, 26, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(82, 196, 26, 0.2);
}

.no-risk-stats {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid rgba(82, 196, 26, 0.2);
}

.risk-cards-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
}

.risk-card {
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(100, 108, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.risk-card:hover {
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.risk-card.high {
  border-left: 4px solid #f56c6c;
}

.risk-card.medium {
  border-left: 4px solid #e6a23c;
}

.risk-card.low {
  border-left: 4px solid #409eff;
}

.risk-card.placeholder-card {
  background: rgba(255, 255, 255, 0.4);
  border-left: 4px solid #409eff;
  opacity: 0.8;
}

.risk-card.placeholder-card:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.7);
}

.risk-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.risk-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.risk-icon-wrapper.high {
  background: linear-gradient(135deg, #f56c6c 0%, #fa5555 100%);
  color: white;
}

.risk-icon-wrapper.medium {
  background: linear-gradient(135deg, #e6a23c 0%, #ebb563 100%);
  color: white;
}

.risk-icon-wrapper.low {
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  color: white;
}

.risk-icon {
  font-size: 24px;
}

.risk-title-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.risk-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.risk-level-tag {
  align-self: flex-start;
}

.risk-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.risk-description {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin: 0;
}

.risk-course {
  display: flex;
  align-items: center;
  gap: 8px;
}

.course-icon {
  font-size: 14px;
  color: #999;
}

.risk-suggestion {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px;
  background: rgba(230, 162, 60, 0.08);
  border-radius: 8px;
  border: 1px solid rgba(230, 162, 60, 0.2);
}

.suggestion-header {
  display: flex;
  align-items: center;
  gap: 6px;
}

.suggestion-icon {
  font-size: 16px;
  color: #e6a23c;
}

.suggestion-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.suggestion-text {
  font-size: 13px;
  color: #666;
  line-height: 1.4;
  margin: 0;
  margin-left: 22px;
}

.risk-actions {
  display: flex;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid rgba(100, 108, 255, 0.1);
}

/* 滚动条样式 */
.risk-cards-container::-webkit-scrollbar {
  width: 6px;
}

.risk-cards-container::-webkit-scrollbar-track {
  background: rgba(100, 108, 255, 0.05);
  border-radius: 3px;
}

.risk-cards-container::-webkit-scrollbar-thumb {
  background: rgba(100, 108, 255, 0.3);
  border-radius: 3px;
}

.risk-cards-container::-webkit-scrollbar-thumb:hover {
  background: rgba(100, 108, 255, 0.5);
}

/* 垂直居中 */
.flex-col-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* 响应式设计优化 */
@media (max-width: 768px) {
  .learning-progress-container {
    padding: 8px;
  }

  .card-wrapper {
    min-height: 100px;
  }

  .kpi-item {
    min-height: 80px;
    padding: 12px 8px;
  }

  .kpi-item p {
    font-size: 20px;
  }

  .kpi-item span {
    font-size: 12px;
  }

  .h-280px {
    height: 240px;
  }
}
</style>
