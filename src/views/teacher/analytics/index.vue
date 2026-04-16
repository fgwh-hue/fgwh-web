<script setup lang="ts">
import { computed, h, onUnmounted, ref } from 'vue';
import type { DataTableColumns } from 'naive-ui';
import {
  NButton,
  NDescriptions,
  NDescriptionsItem,
  NGi,
  NGrid,
  NModal,
  NProgress,
  NSpace,
  NSpin,
  NSwitch,
  NTab,
  NTabs,
  NTag
} from 'naive-ui';
import * as echarts from 'echarts';
import { useAppStore } from '@/store/modules/app';
import type { ECOption } from '@/hooks/common/echarts';
import { useEcharts } from '@/hooks/common/echarts';

defineOptions({
  name: 'TeacherAnalytics'
});

const appStore = useAppStore();

const gap = computed(() => (appStore.isMobile ? 0 : 16));

// 弹窗状态
const showAllAlertsModal = ref(false);
const showStudentDetailModal = ref(false);
const showExportModal = ref(false);
const showRefreshLogsModal = ref(false);
const selectedStudent = ref<StudentAlert | null>(null);

// 时间范围选择
const timeRange = ref<'week' | 'month' | 'semester'>('week');
const timeRangeOptions = [
  { label: '本周', value: 'week' },
  { label: '本月', value: 'month' },
  { label: '本学期', value: 'semester' }
];

// 趋势分析时间范围
const trendTimeRange = ref<'week' | 'month' | 'semester'>('month');

// AI分析功能状态
const showAIModal = ref(false);
const aiAnalysisLoading = ref(false);
const aiAnalysisResult = ref('');
const aiAnalysisType = ref<'trend' | 'prediction' | 'recommendation'>('trend');

// AI智能分析
async function handleAIAnalysis(type: 'trend' | 'prediction' | 'recommendation') {
  aiAnalysisType.value = type;
  aiAnalysisLoading.value = true;
  showAIModal.value = true;

  // 模拟AI分析过程
  await new Promise(resolve => {
    setTimeout(resolve, 1500);
  });

  const analysisMap = {
    trend: {
      title: '📊 学习趋势智能分析',
      content: `基于过去30天的数据分析：

1. **整体趋势向好**
   - 平均分从78.5分上升至82.5分，增长5.1%
   - 及格率从82%提升至87.5%，提升5.5个百分点

2. **课程表现差异**
   - 计算机编程课程表现最优，平均分88分
   - 物理实验课程略有下滑，建议加强实验指导

3. **学生活跃度分析**
   - 周三、周四活跃度最高
   - 建议在周末增加互动内容

4. **改进建议**
   - 继续保持当前教学节奏
   - 针对物理实验课程增加辅导时间`
    },
    prediction: {
      title: '🔮 学习效果预测',
      content: `基于AI模型预测分析：

1. **期末成绩预测**
   - 预计班级平均分：83-86分
   - 预计及格率：88%-92%

2. **风险预警**
   - 5名学生可能有不及格风险
   - 建议重点关注：张三(数学)、赵六(物理)

3. **成绩分布预测**
   - 优秀率(≥90)：约18-22%
   - 良好率(80-89)：约35-40%
   - 及格率(60-79)：约30-35%

4. **干预建议**
   - 建议对高风险学生进行一对一辅导
   - 可组织小组学习互助活动`
    },
    recommendation: {
      title: '💡 个性化教学建议',
      content: `基于AI分析的教学建议：

1. **教学内容优化**
   - 增加编程实践环节，学生更偏好动手操作
   - 物理课程可增加可视化演示

2. **教学方法建议**
   - 采用混合式教学，线上线下结合
   - 增加小组讨论和协作学习

3. **作业设计**
   - 适当增加开放性作业比例
   - 减少机械性重复练习

4. **重点关注学生**
   - 张三：数学基础薄弱，建议加强辅导
   - 李四：英语口语需提升
   - 王五：物理理解有困难

5. **家校合作**
   - 建议与高风险学生家长保持沟通
   - 定期发送学习进度报告`
    }
  };

  const result = analysisMap[type];
  aiAnalysisResult.value = `### ${result.title}\n\n${result.content}`;
  aiAnalysisLoading.value = false;
}

function handleExportAIReport() {
  window.$message?.success('AI分析报告已生成！');
  showAIModal.value = false;
}

// 切换趋势时间范围
function handleTrendTimeChange(range: 'week' | 'month' | 'semester') {
  trendTimeRange.value = range;
  let rangeText = '本学期';
  if (range === 'week') {
    rangeText = '本周';
  } else if (range === 'month') {
    rangeText = '本月';
  }
  window.$message?.success(`已切换到${rangeText}数据`);
}

// 加载状态
const loading = ref(false);

// 刷新数据
function handleRefresh() {
  loading.value = true;
  window.$message?.success('数据刷新中...');
  setTimeout(() => {
    loading.value = false;
    window.$message?.success('数据刷新成功！');
  }, 1000);
}

// 导出报告
function handleExport() {
  showExportModal.value = true;
}

// 智能工具箱数据
const showAllTools = ref(false);

interface ToolItem {
  id: number;
  name: string;
  description: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  type: string;
  usageCount: number;
  efficiency?: number;
  badge?: string;
  badgeType?: 'new' | 'hot' | 'ai';
}

const toolsList: ToolItem[] = [
  {
    id: 1,
    name: '数据对比',
    description: '多维度数据对比分析，发现教学差异',
    icon: 'i-mdi-chart-compare',
    iconBg: 'linear-gradient(135deg, rgba(32, 128, 240, 0.15) 0%, rgba(32, 128, 240, 0.05) 100%)',
    iconColor: '#2080f0',
    type: 'primary',
    usageCount: 156,
    efficiency: 25,
    badge: '热门',
    badgeType: 'hot'
  },
  {
    id: 2,
    name: '高级筛选',
    description: '智能条件筛选，快速定位目标数据',
    icon: 'i-mdi-filter-variant',
    iconBg: 'linear-gradient(135deg, rgba(24, 160, 88, 0.15) 0%, rgba(24, 160, 88, 0.05) 100%)',
    iconColor: '#18a058',
    type: 'success',
    usageCount: 89,
    efficiency: 40
  },
  {
    id: 3,
    name: '报告生成',
    description: '一键生成专业分析报告，支持多种格式',
    icon: 'i-mdi-file-document-outline',
    iconBg: 'linear-gradient(135deg, rgba(240, 160, 32, 0.15) 0%, rgba(240, 160, 32, 0.05) 100%)',
    iconColor: '#f0a020',
    type: 'warning',
    usageCount: 234,
    efficiency: 60,
    badge: 'AI',
    badgeType: 'ai'
  },
  {
    id: 4,
    name: '数据导出',
    description: '支持 Excel、CSV 等多种格式导出',
    icon: 'i-mdi-download-box',
    iconBg: 'linear-gradient(135deg, rgba(96, 165, 250, 0.15) 0%, rgba(96, 165, 250, 0.05) 100%)',
    iconColor: '#60a5fa',
    type: 'info',
    usageCount: 178,
    efficiency: 35
  },
  {
    id: 5,
    name: '趋势预测',
    description: 'AI 驱动的学习趋势预测和预警',
    icon: 'i-mdi-chart-timeline-variant',
    iconBg: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.05) 100%)',
    iconColor: '#ef4444',
    type: 'error',
    usageCount: 145,
    efficiency: 50,
    badge: 'NEW',
    badgeType: 'new'
  },
  {
    id: 6,
    name: '数据分享',
    description: '安全便捷的数据共享和协作',
    icon: 'i-mdi-share-all',
    iconBg: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0.05) 100%)',
    iconColor: '#8b5cf6',
    type: 'purple',
    usageCount: 67
  },
  {
    id: 7,
    name: '学情诊断',
    description: '全面诊断学生学习情况，精准定位问题',
    icon: 'i-mdi-stethoscope',
    iconBg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)',
    iconColor: '#10b981',
    type: 'success',
    usageCount: 112,
    efficiency: 45,
    badge: 'AI',
    badgeType: 'ai'
  },
  {
    id: 8,
    name: '成绩分析',
    description: '深度分析成绩分布和变化趋势',
    icon: 'i-mdi-scoreboard-outline',
    iconBg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0.05) 100%)',
    iconColor: '#f59e0b',
    type: 'warning',
    usageCount: 198,
    efficiency: 30
  },
  {
    id: 9,
    name: '课堂互动',
    description: '实时课堂互动统计和参与度分析',
    icon: 'i-mdi-account-group',
    iconBg: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(236, 72, 153, 0.05) 100%)',
    iconColor: '#ec4899',
    type: 'pink',
    usageCount: 143,
    efficiency: 38
  },
  {
    id: 10,
    name: '作业分析',
    description: '智能分析作业完成情况和错误率',
    icon: 'i-mdi-book-open-page-variant',
    iconBg: 'linear-gradient(135deg, rgba(14, 165, 233, 0.15) 0%, rgba(14, 165, 233, 0.05) 100%)',
    iconColor: '#0ea5e9',
    type: 'sky',
    usageCount: 167,
    efficiency: 42,
    badge: '热门',
    badgeType: 'hot'
  },
  {
    id: 11,
    name: '资源管理',
    description: '教学资源分类整理和版本控制',
    icon: 'i-mdi-folder-lock',
    iconBg: 'linear-gradient(135deg, rgba(120, 119, 198, 0.15) 0%, rgba(120, 119, 198, 0.05) 100%)',
    iconColor: '#7877c6',
    type: 'indigo',
    usageCount: 134,
    efficiency: 36
  },
  {
    id: 12,
    name: '考勤统计',
    description: '学生出勤率统计和异常提醒',
    icon: 'i-mdi-calendar-check',
    iconBg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)',
    iconColor: '#059669',
    type: 'teal',
    usageCount: 189,
    efficiency: 48,
    badge: 'AI',
    badgeType: 'ai'
  }
];

const displayTools = computed(() => {
  if (showAllTools.value) {
    return toolsList;
  }
  return toolsList.slice(0, 6);
});

const totalUsageCount = computed(() => {
  return toolsList.reduce((sum, tool) => sum + tool.usageCount, 0);
});

const favoriteCount = computed(() => {
  return toolsList.filter(tool => tool.badgeType === 'hot').length;
});

// 处理工具点击
function handleToolClick(tool: ToolItem) {
  window.$message?.success(`正在打开${tool.name}功能...`);
}

// 显示消息提示
function showMessage(type: 'info' | 'success' | 'warning' | 'error', content: string) {
  window.$message?.[type](content);
}

// 确认导出
function confirmExport(format: string) {
  showMessage('success', `正在导出${format}格式报告...`);
  showExportModal.value = false;
  setTimeout(() => {
    showMessage('success', '报告导出成功！');
  }, 1500);
}

// 联系学生
function handleContactStudent() {
  showMessage('info', '正在打开联系方式...');
  showStudentDetailModal.value = false;
}

interface CourseAnalytics {
  name: string;
  avgScore: number;
  passRate: number;
  students: number;
  trend: string;
}

interface StudentAlert {
  id: number;
  name: string;
  avatar: string;
  failCount: number;
  lastSubmit: string;
  score: number;
  riskLevel: 'high' | 'medium' | 'low';
}

const courseAnalytics: CourseAnalytics[] = [
  { name: '高等数学', avgScore: 82, passRate: 88, students: 45, trend: 'up' },
  { name: '英语写作', avgScore: 85, passRate: 92, students: 38, trend: 'up' },
  { name: '物理实验', avgScore: 79, passRate: 84, students: 42, trend: 'down' },
  { name: '化学基础', avgScore: 81, passRate: 86, students: 31, trend: 'up' },
  { name: '计算机编程', avgScore: 88, passRate: 95, students: 52, trend: 'up' },
  { name: '数据结构', avgScore: 76, passRate: 82, students: 48, trend: 'down' }
];

// 学生学习行为分析数据 - 直接在模板中使用的模拟数据

const studentAlerts: StudentAlert[] = [
  {
    id: 1,
    name: '张三',
    avatar: '',
    failCount: 5,
    lastSubmit: '3天前',
    score: 45,
    riskLevel: 'high'
  },
  {
    id: 2,
    name: '李四',
    avatar: '',
    failCount: 3,
    lastSubmit: '2天前',
    score: 58,
    riskLevel: 'medium'
  },
  {
    id: 3,
    name: '王五',
    avatar: '',
    failCount: 2,
    lastSubmit: '1天前',
    score: 62,
    riskLevel: 'low'
  },
  {
    id: 4,
    name: '赵六',
    avatar: '',
    failCount: 4,
    lastSubmit: '4天前',
    score: 52,
    riskLevel: 'high'
  },
  {
    id: 5,
    name: '孙七',
    avatar: '',
    failCount: 2,
    lastSubmit: '1天前',
    score: 65,
    riskLevel: 'low'
  }
];

// 所有预警学生（用于"查看全部"）
const allStudentAlerts: StudentAlert[] = [
  ...studentAlerts,
  {
    id: 6,
    name: '周八',
    avatar: '',
    failCount: 3,
    lastSubmit: '2天前',
    score: 55,
    riskLevel: 'medium'
  },
  {
    id: 7,
    name: '吴九',
    avatar: '',
    failCount: 6,
    lastSubmit: '5天前',
    score: 42,
    riskLevel: 'high'
  },
  {
    id: 8,
    name: '郑十',
    avatar: '',
    failCount: 1,
    lastSubmit: '1天前',
    score: 68,
    riskLevel: 'low'
  },
  {
    id: 9,
    name: '钱十一',
    avatar: '',
    failCount: 4,
    lastSubmit: '3天前',
    score: 48,
    riskLevel: 'high'
  },
  {
    id: 10,
    name: '孙十二',
    avatar: '',
    failCount: 2,
    lastSubmit: '2天前',
    score: 63,
    riskLevel: 'low'
  }
];

// 查看全部预警学生
function handleViewAllAlerts() {
  showAllAlertsModal.value = true;
}

// AI学习风险预测
const riskPrediction = ref<
  {
    studentId: string;
    studentName: string;
    currentScore: number;
    predictedScore: number;
    riskProbability: number;
    trend: 'up' | 'stable' | 'down';
    recommendations: string[];
  }[]
>([
  {
    studentId: 'STU001',
    studentName: '张三',
    currentScore: 62,
    predictedScore: 58,
    riskProbability: 85,
    trend: 'down',
    recommendations: ['建议增加一对一辅导', '关注作业完成情况', '调整学习方法']
  },
  {
    studentId: 'STU002',
    studentName: '李四',
    currentScore: 75,
    predictedScore: 78,
    riskProbability: 35,
    trend: 'up',
    recommendations: ['保持当前学习状态', '鼓励参与课堂讨论']
  },
  {
    studentId: 'STU003',
    studentName: '王芳',
    currentScore: 88,
    predictedScore: 90,
    riskProbability: 10,
    trend: 'stable',
    recommendations: ['可以挑战更高难度内容', '发挥带头作用']
  },
  {
    studentId: 'STU004',
    studentName: '赵六',
    currentScore: 55,
    predictedScore: 48,
    riskProbability: 92,
    trend: 'down',
    recommendations: ['需要重点关注', '建议家长沟通', '制定补差计划']
  },
  {
    studentId: 'STU005',
    studentName: '钱七',
    currentScore: 68,
    predictedScore: 65,
    riskProbability: 65,
    trend: 'down',
    recommendations: ['加强基础练习', '提高课堂专注度', '定期复习巩固']
  },
  {
    studentId: 'STU006',
    studentName: '孙八',
    currentScore: 82,
    predictedScore: 85,
    riskProbability: 25,
    trend: 'up',
    recommendations: ['继续保持良好状态', '尝试拓展学习', '帮助其他同学']
  }
]);

// 刷新系统状态
interface RefreshState {
  isRefreshing: boolean;
  lastRefreshTime: string;
  refreshProgress: number;
  status: 'idle' | 'refreshing' | 'success' | 'error';
  errorMessage: string | null;
}

const refreshState = ref<RefreshState>({
  isRefreshing: false,
  lastRefreshTime: '',
  refreshProgress: 0,
  status: 'idle',
  errorMessage: null
});

// 刷新日志
interface RefreshLog {
  id: number;
  timestamp: string;
  duration: number;
  dataChanges: number;
  status: 'success' | 'error';
  errorMessage?: string;
}

const refreshLogs = ref<RefreshLog[]>([]);

// 自动刷新配置
const autoRefreshConfig = ref({
  enabled: false,
  interval: 30 // 分钟
});

let autoRefreshTimer: ReturnType<typeof setInterval> | null = null;
let logIdCounter = 1;

// 模拟数据更新（用于演示数据变化）
function simulateDataUpdate(): number {
  const changes = Math.floor(Math.random() * 3);
  riskPrediction.value = riskPrediction.value.map(student => {
    const scoreChange = Math.floor(Math.random() * 10) - 5;
    const newCurrentScore = Math.max(0, Math.min(100, student.currentScore + scoreChange));
    const newPredictedScore = Math.max(0, Math.min(100, student.predictedScore + scoreChange));
    const newRiskProbability = Math.max(0, Math.min(100, student.riskProbability + Math.floor(Math.random() * 10) - 5));

    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (newCurrentScore > student.currentScore) {
      trend = 'up';
    } else if (newCurrentScore < student.currentScore) {
      trend = 'down';
    }

    return {
      ...student,
      currentScore: newCurrentScore,
      predictedScore: newPredictedScore,
      riskProbability: newRiskProbability,
      trend
    };
  });
  return changes;
}

// 核心刷新逻辑
async function performRefresh(_isManual: boolean = true): Promise<void> {
  if (refreshState.value.isRefreshing) {
    return;
  }

  const startTime = Date.now();
  const logEntry: RefreshLog = {
    id: (logIdCounter += 1),
    timestamp: new Date().toLocaleString('zh-CN'),
    duration: 0,
    dataChanges: 0,
    status: 'success'
  };

  try {
    refreshState.value.isRefreshing = true;
    refreshState.value.status = 'refreshing';
    refreshState.value.errorMessage = null;
    refreshState.value.refreshProgress = 0;

    // 模拟异步刷新过程（分阶段）
    // 阶段1：获取最新数据 (0-30%)
    await new Promise(resolve => {
      setTimeout(resolve, 300);
    });
    refreshState.value.refreshProgress = 30;

    // 阶段2：AI模型分析 (30-70%)
    await new Promise(resolve => {
      setTimeout(resolve, 400);
    });
    refreshState.value.refreshProgress = 70;

    // 阶段3：更新预测结果 (70-100%)
    const dataChanges = simulateDataUpdate();
    logEntry.dataChanges = dataChanges;
    refreshState.value.refreshProgress = 100;

    const endTime = Date.now();
    logEntry.duration = endTime - startTime;

    // 更新刷新状态
    refreshState.value.lastRefreshTime = new Date().toLocaleString('zh-CN');
    refreshState.value.status = 'success';
    refreshState.value.isRefreshing = false;

    // 记录成功日志
    refreshLogs.value.unshift(logEntry);
    if (refreshLogs.value.length > 50) {
      refreshLogs.value.pop();
    }

    // 显示成功消息
    window.$message?.success(`预测数据已更新，耗时 ${logEntry.duration}ms，数据变化 ${dataChanges} 项`);
  } catch (error) {
    const endTime = Date.now();
    logEntry.duration = endTime - startTime;
    logEntry.status = 'error';
    logEntry.errorMessage = error instanceof Error ? error.message : '未知错误';

    // 更新刷新状态为错误
    refreshState.value.status = 'error';
    refreshState.value.errorMessage = logEntry.errorMessage;
    refreshState.value.isRefreshing = false;

    // 记录错误日志
    refreshLogs.value.unshift(logEntry);
    if (refreshLogs.value.length > 50) {
      refreshLogs.value.pop();
    }

    // 显示错误消息
    window.$message?.error(`刷新失败：${logEntry.errorMessage}`);
  }
}

// 手动触发刷新
function handleManualRefresh() {
  performRefresh(true);
}

// 切换自动刷新
function toggleAutoRefresh() {
  autoRefreshConfig.value.enabled = !autoRefreshConfig.value.enabled;

  if (autoRefreshConfig.value.enabled) {
    startAutoRefresh();
    window.$message?.info(`已开启自动刷新，间隔 ${autoRefreshConfig.value.interval} 分钟`);
  } else {
    stopAutoRefresh();
    window.$message?.info('已关闭自动刷新');
  }
}

// 启动自动刷新
function startAutoRefresh() {
  if (autoRefreshTimer) {
    clearInterval(autoRefreshTimer);
  }

  autoRefreshTimer = setInterval(
    () => {
      performRefresh(false);
    },
    autoRefreshConfig.value.interval * 60 * 1000
  );
}

// 停止自动刷新
function stopAutoRefresh() {
  if (autoRefreshTimer) {
    clearInterval(autoRefreshTimer);
    autoRefreshTimer = null;
  }
}

// 切换自动刷新时间间隔
function handleIntervalChange(minutes: number) {
  autoRefreshConfig.value.interval = minutes;
  if (autoRefreshConfig.value.enabled) {
    stopAutoRefresh();
    startAutoRefresh();
  }
  window.$message?.success(`自动刷新间隔已设置为 ${minutes} 分钟`);
}

// 组件卸载时清理
onUnmounted(() => {
  stopAutoRefresh();
});

// 生成个性化干预建议
function generateIntervention(student: (typeof riskPrediction.value)[0]) {
  const interventions: string[] = [];

  if (student.riskProbability >= 70) {
    interventions.push('🚨 高风险学生 - 需要立即干预');
  }
  if (student.trend === 'down') {
    interventions.push('📉 成绩呈下降趋势 - 需要分析原因');
  }
  if (student.currentScore < 60) {
    interventions.push('📚 当前成绩不及格 - 需要补基础');
  }

  return [...interventions, ...student.recommendations];
}

// 批量发送预警通知
function handleSendWarning(student: (typeof riskPrediction.value)[0]) {
  window.$message?.success(`已向 ${student.studentName} 发送预警通知`);
}

// 批量发送预警通知给所有高风险学生
function handleBatchWarning() {
  const highRiskCount = riskPrediction.value.filter(r => r.riskProbability >= 70).length;
  window.$message?.success(`已向 ${highRiskCount} 名高风险学生发送预警通知`);
}

// 查看学生详情
function handleViewStudentDetail(student: StudentAlert) {
  selectedStudent.value = student;
  showStudentDetailModal.value = true;
}

const scoreDistribution = [
  { range: '90-100', count: 45 },
  { range: '80-89', count: 78 },
  { range: '70-79', count: 52 },
  { range: '60-69', count: 28 },
  { range: '0-59', count: 12 }
];

const dailyActivity = [
  { day: '周一', views: 320, submissions: 45, logins: 156 },
  { day: '周二', views: 380, submissions: 52, logins: 142 },
  { day: '周三', views: 420, submissions: 48, logins: 138 },
  { day: '周四', views: 350, submissions: 38, logins: 145 },
  { day: '周五', views: 280, submissions: 42, logins: 132 },
  { day: '周六', views: 180, submissions: 15, logins: 85 },
  { day: '周日', views: 150, submissions: 12, logins: 68 }
];

const weeklyTrend = [
  { week: '第1周', avgScore: 75, passRate: 82 },
  { week: '第2周', avgScore: 78, passRate: 85 },
  { week: '第3周', avgScore: 80, passRate: 87 },
  { week: '第4周', avgScore: 82, passRate: 88 }
];

const getAvatarGradient = (id: number) => {
  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  ];
  return gradients[id % gradients.length];
};

const { domRef: activityDomRef } = useEcharts(() => {
  const option: ECOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e5e7eb',
      textStyle: { color: '#1f2937' },
      padding: [12, 16],
      extraCssText: 'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); border-radius: 8px;'
    },
    legend: {
      data: ['浏览量', '提交数', '登录数'],
      top: 0,
      itemWidth: 16,
      itemHeight: 16,
      textStyle: { fontSize: 13, color: '#6b7280' }
    },
    grid: {
      left: '4%',
      right: '3%',
      bottom: '4%',
      top: '60px',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: dailyActivity.map(item => item.day),
      axisLine: { lineStyle: { color: '#e5e7eb' } },
      axisLabel: { color: '#6b7280', fontSize: 12 },
      axisTick: { lineStyle: { color: '#e5e7eb' } }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#f3f4f6', type: 'dashed' } },
      axisLabel: { color: '#6b7280', fontSize: 12 }
    },
    series: [
      {
        name: '浏览量',
        type: 'bar',
        data: dailyActivity.map(item => item.views),
        barMaxWidth: 50,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(32, 128, 240, 0.8)' },
            { offset: 1, color: 'rgba(32, 128, 240, 0.3)' }
          ]),
          borderRadius: [4, 4, 0, 0]
        }
      },
      {
        name: '提交数',
        type: 'bar',
        data: dailyActivity.map(item => item.submissions),
        barMaxWidth: 50,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(24, 160, 88, 0.8)' },
            { offset: 1, color: 'rgba(24, 160, 88, 0.3)' }
          ]),
          borderRadius: [4, 4, 0, 0]
        }
      },
      {
        name: '登录数',
        type: 'bar',
        data: dailyActivity.map(item => item.logins),
        barMaxWidth: 50,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(240, 160, 32, 0.8)' },
            { offset: 1, color: 'rgba(240, 160, 32, 0.3)' }
          ]),
          borderRadius: [4, 4, 0, 0]
        }
      }
    ],
    animationDuration: 800,
    animationEasing: 'cubicOut'
  };
  return option;
});

const { domRef: scoreDomRef } = useEcharts(() => {
  const option: ECOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}人 ({d}%)',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e5e7eb',
      textStyle: { color: '#1f2937' },
      padding: [12, 16],
      extraCssText: 'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); border-radius: 8px;'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'middle',
      itemWidth: 16,
      itemHeight: 16,
      textStyle: { fontSize: 13, color: '#6b7280' }
    },
    series: [
      {
        name: '成绩分布',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['60%', '50%'],
        data: scoreDistribution.map(item => ({
          value: item.count,
          name: item.range
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 20,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.15)'
          }
        },
        label: {
          fontSize: 13,
          formatter: '{b}\n{c}人'
        },
        labelLine: {
          length: 10,
          length2: 15,
          lineStyle: { width: 1 }
        },
        itemStyle: {
          borderRadius: 6,
          borderColor: '#fff',
          borderWidth: 2
        },
        color: ['#18a058', '#2080f0', '#f0a020', '#667eea', '#ef4444']
      }
    ],
    animationDuration: 1000,
    animationEasing: 'cubicOut'
  };
  return option;
});

const { domRef: trendDomRef } = useEcharts(() => {
  const option: ECOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e5e7eb',
      textStyle: { color: '#1f2937' },
      padding: [12, 16],
      extraCssText: 'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); border-radius: 8px;'
    },
    legend: {
      data: ['平均分', '及格率'],
      top: 0,
      itemWidth: 16,
      itemHeight: 16,
      textStyle: { fontSize: 13, color: '#6b7280' }
    },
    grid: {
      left: '4%',
      right: '3%',
      bottom: '4%',
      top: '60px',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: weeklyTrend.map(item => item.week),
      boundaryGap: false,
      axisLine: { lineStyle: { color: '#e5e7eb' } },
      axisLabel: { color: '#6b7280', fontSize: 12 },
      axisTick: { lineStyle: { color: '#e5e7eb' } }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#f3f4f6', type: 'dashed' } },
      axisLabel: { color: '#6b7280', fontSize: 12 }
    },
    series: [
      {
        name: '平均分',
        type: 'line',
        data: weeklyTrend.map(item => item.avgScore),
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: { color: '#2080f0', borderWidth: 2, borderColor: '#fff' },
        lineStyle: { width: 3 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(32, 128, 240, 0.2)' },
            { offset: 1, color: 'rgba(32, 128, 240, 0.02)' }
          ])
        }
      },
      {
        name: '及格率',
        type: 'line',
        data: weeklyTrend.map(item => item.passRate),
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: { color: '#18a058', borderWidth: 2, borderColor: '#fff' },
        lineStyle: { width: 3 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(24, 160, 88, 0.2)' },
            { offset: 1, color: 'rgba(24, 160, 88, 0.02)' }
          ])
        }
      }
    ],
    animationDuration: 1000,
    animationEasing: 'cubicOut'
  };
  return option;
});

const alertColumns: DataTableColumns<StudentAlert> = [
  {
    title: '学生',
    key: 'name',
    width: 120,
    render: row => {
      return h('div', { class: 'flex-y-center gap-8px' }, [
        h(
          'div',
          {
            class: 'size-32px rd-1/2 flex-center text-white font-medium',
            style: { background: getAvatarGradient(row.id) }
          },
          [h('span', { class: 'text-14px' }, row.name.charAt(0))]
        ),
        h('span', row.name)
      ]);
    }
  },
  {
    title: '缺交次数',
    key: 'failCount',
    width: 100,
    render: row => h('span', `${row.failCount} 次`)
  },
  { title: '最后提交', key: 'lastSubmit', width: 100 },
  {
    title: '分数',
    key: 'score',
    width: 80,
    render: row => h('span', { class: 'font-bold' }, `${row.score}分`)
  },
  {
    title: '风险等级',
    key: 'riskLevel',
    width: 100,
    render: row => {
      const typeMap = { high: 'error', medium: 'warning', low: 'info' };
      const textMap = { high: '高风险', medium: '中风险', low: '低风险' };
      return h(NTag, { type: typeMap[row.riskLevel] as any }, { default: () => textMap[row.riskLevel] });
    }
  },
  {
    title: '操作',
    key: 'actions',
    width: 100,
    render: row =>
      h(
        NButton,
        {
          size: 'small',
          type: 'primary',
          text: true,
          onClick: () => handleViewStudentDetail(row)
        },
        { default: () => '查看详情' }
      )
  }
];

const courseColumns: DataTableColumns<CourseAnalytics> = [
  { title: '课程名称', key: 'name', width: 150 },
  {
    title: '平均分',
    key: 'avgScore',
    width: 100,
    render: row => h('span', { class: 'font-bold' }, row.avgScore)
  },
  {
    title: '及格率',
    key: 'passRate',
    width: 200,
    render: row => {
      return h('div', { class: 'flex-y-center gap-8px' }, [
        h(NProgress, {
          type: 'line',
          percentage: row.passRate,
          showIndicator: false
        }),
        h('span', { class: 'text-12px' }, `${row.passRate}%`)
      ]);
    }
  },
  { title: '学生数', key: 'students', width: 100 },
  {
    title: '趋势',
    key: 'trend',
    width: 80,
    render: row => {
      const icon = row.trend === 'up' ? 'i-mdi-trending-up' : 'i-mdi-trending-down';
      const color = row.trend === 'up' ? 'text-success' : 'text-error';
      return h('div', { class: `${icon} text-20px ${color}` });
    }
  }
];
</script>

<template>
  <NSpace vertical :size="16">
    <div class="analytics-header">
      <div class="header-left">
        <div class="header-title">
          <div class="i-mdi-chart-analytics text-24px text-primary" />
          <h2 class="text-20px font-semibold">数据分析中心</h2>
        </div>
        <p class="header-subtitle">实时监控教学数据，AI 驱动优化教学效果</p>
      </div>
      <NSpace :size="12" :wrap="false">
        <NSelect v-model:value="timeRange" :options="timeRangeOptions" class="w-120px" size="medium" />
        <NButton size="medium" @click="handleExport">
          <template #icon>
            <div class="i-mdi-download" />
          </template>
          导出报告
        </NButton>
        <NButton type="info" size="medium" @click="handleAIAnalysis('trend')">
          <template #icon>
            <div class="i-mdi-robot" />
          </template>
          AI 分析
        </NButton>
        <NButton type="primary" :loading="loading" size="medium" @click="handleRefresh">
          <template #icon>
            <div :class="loading ? 'i-mdi-loading animate-spin' : 'i-mdi-refresh'" />
          </template>
          {{ loading ? '刷新中...' : '刷新数据' }}
        </NButton>
      </NSpace>
    </div>

    <NGrid :x-gap="gap" :y-gap="16" responsive="screen" item-responsive>
      <NGi span="24 s:12 m:6">
        <NCard :bordered="false" class="stat-card stat-card-primary card-wrapper">
          <div class="flex-y-center justify-between">
            <div>
              <div class="text-32px font-bold">156</div>
              <div class="mt-8px text-14px opacity-80">总学生数</div>
              <div class="mt-4px text-12px opacity-60">↑ 12% 较上周</div>
            </div>
            <div class="size-56px flex-center rd-12px bg-white bg-op-20">
              <div class="i-mdi-account-group text-32px" />
            </div>
          </div>
        </NCard>
      </NGi>
      <NGi span="24 s:12 m:6">
        <NCard :bordered="false" class="stat-card stat-card-success card-wrapper">
          <div class="flex-y-center justify-between">
            <div>
              <div class="text-32px font-bold">82.5</div>
              <div class="mt-8px text-14px opacity-80">平均分</div>
              <div class="mt-4px text-12px opacity-60">↑ 3.5 较上周</div>
            </div>
            <div class="size-56px flex-center rd-12px bg-white bg-op-20">
              <div class="i-mdi-chart-line text-32px" />
            </div>
          </div>
        </NCard>
      </NGi>
      <NGi span="24 s:12 m:6">
        <NCard :bordered="false" class="stat-card stat-card-warning card-wrapper">
          <div class="flex-y-center justify-between">
            <div>
              <div class="text-32px font-bold">87.5%</div>
              <div class="mt-8px text-14px opacity-80">及格率</div>
              <div class="mt-4px text-12px opacity-60">↑ 2.5% 较上周</div>
            </div>
            <div class="size-56px flex-center rd-12px bg-white bg-op-20">
              <div class="i-mdi-trophy text-32px" />
            </div>
          </div>
        </NCard>
      </NGi>
      <NGi span="24 s:12 m:6">
        <NCard :bordered="false" class="stat-card stat-card-info card-wrapper">
          <div class="flex-y-center justify-between">
            <div>
              <div class="text-32px font-bold">92%</div>
              <div class="mt-8px text-14px opacity-80">作业完成率</div>
              <div class="mt-4px text-12px opacity-60">↑ 5% 较上周</div>
            </div>
            <div class="size-56px flex-center rd-12px bg-white bg-op-20">
              <div class="i-mdi-clipboard-check text-32px" />
            </div>
          </div>
        </NCard>
      </NGi>
    </NGrid>

    <!-- 周趋势分析 - 移到最上面 -->
    <NCard :bordered="false" class="card-wrapper">
      <template #header>
        <div class="flex-y-center justify-between">
          <span class="font-semibold">周趋势分析</span>
          <NSpace>
            <NButton
              text
              size="small"
              :type="trendTimeRange === 'week' ? 'primary' : 'default'"
              @click="handleTrendTimeChange('week')"
            >
              本周
            </NButton>
            <NButton
              text
              size="small"
              :type="trendTimeRange === 'month' ? 'primary' : 'default'"
              @click="handleTrendTimeChange('month')"
            >
              本月
            </NButton>
            <NButton
              text
              size="small"
              :type="trendTimeRange === 'semester' ? 'primary' : 'default'"
              @click="handleTrendTimeChange('semester')"
            >
              本学期
            </NButton>
          </NSpace>
        </div>
      </template>
      <div class="flex-col">
        <div ref="trendDomRef" class="h-280px" />
        <div class="mt-16px border-t pt-16px">
          <NGrid :x-gap="16" :y-gap="12" :cols="4">
            <NGi>
              <div class="text-center">
                <div class="text-24px text-primary font-bold">82.5</div>
                <div class="mt-4px text-12px text-#999">当前平均分</div>
                <div class="mt-2px text-11px text-success">↑ 3.5</div>
              </div>
            </NGi>
            <NGi>
              <div class="text-center">
                <div class="text-24px text-success font-bold">87.5%</div>
                <div class="mt-4px text-12px text-#999">当前及格率</div>
                <div class="mt-2px text-11px text-success">↑ 2.5%</div>
              </div>
            </NGi>
            <NGi>
              <div class="text-center">
                <div class="text-24px text-warning font-bold">+7.5</div>
                <div class="mt-4px text-12px text-#999">平均分增长</div>
                <div class="mt-2px text-11px text-#999">较第1周</div>
              </div>
            </NGi>
            <NGi>
              <div class="text-center">
                <div class="text-24px text-info font-bold">+5.5%</div>
                <div class="mt-4px text-12px text-#999">及格率增长</div>
                <div class="mt-2px text-11px text-#999">较第1周</div>
              </div>
            </NGi>
          </NGrid>
        </div>
      </div>
    </NCard>

    <NGrid :x-gap="gap" :y-gap="16" responsive="screen" item-responsive>
      <NGi span="24 s:24 m:12">
        <NCard :bordered="false" class="card-wrapper">
          <template #header>
            <span class="font-semibold">每日活跃度趋势</span>
          </template>
          <div ref="activityDomRef" class="h-320px" />
        </NCard>
      </NGi>

      <NGi span="24 s:24 m:12">
        <NCard :bordered="false" class="card-wrapper">
          <template #header>
            <span class="font-semibold">成绩分布</span>
          </template>
          <div class="h-320px flex-col">
            <div ref="scoreDomRef" class="flex-1" />
            <div class="mt-16px border-t pt-16px">
              <NSpace vertical :size="8">
                <div class="flex-y-center justify-between">
                  <span class="text-12px text-#999">总人数</span>
                  <span class="text-14px font-bold">215</span>
                </div>
                <div class="flex-y-center justify-between">
                  <span class="text-12px text-#999">优秀率 (≥90)</span>
                  <span class="text-14px text-success font-bold">20.9%</span>
                </div>
                <div class="flex-y-center justify-between">
                  <span class="text-12px text-#999">不及格率 (&lt;60)</span>
                  <span class="text-14px text-error font-bold">5.6%</span>
                </div>
              </NSpace>
            </div>
          </div>
        </NCard>
      </NGi>
    </NGrid>

    <!-- 数据洞察卡片 -->
    <NGrid :x-gap="gap" :y-gap="16" responsive="screen" item-responsive>
      <!-- 学生学习行为分析 -->
      <NGi span="24 s:24 m:12">
        <NCard :bordered="false" class="h-full card-wrapper">
          <template #header>
            <div class="flex-y-center justify-between">
              <div class="flex-y-center gap-8px">
                <div class="i-mdi-chart-bell-curve text-20px text-primary" />
                <span class="font-semibold">学生学习行为分析</span>
              </div>
            </div>
          </template>
          <div class="h-full space-y-16px">
            <!-- 关键指标卡片 -->
            <div class="grid grid-cols-2 gap-8px">
              <div
                class="border border-blue-100 rounded-lg from-blue-50 to-white bg-gradient-to-br p-6px text-center transition-all hover:shadow-sm"
              >
                <div class="i-mdi-clock-outline mb-2px text-20px text-blue-500" />
                <div class="text-11px text-blue-600">平均学习时长</div>
                <div class="text-18px text-blue-800 font-bold">2.5小时/天</div>
                <div class="mt-1px text-10px text-blue-500">↑ 15% 较上周</div>
              </div>
              <div
                class="border border-green-100 rounded-lg from-green-50 to-white bg-gradient-to-br p-6px text-center transition-all hover:shadow-sm"
              >
                <div class="i-mdi-login mb-2px text-20px text-green-500" />
                <div class="text-11px text-green-600">平均登录次数</div>
                <div class="text-18px text-green-800 font-bold">3.2次/天</div>
                <div class="mt-1px text-10px text-green-500">↑ 8% 较上周</div>
              </div>
              <div
                class="border border-purple-100 rounded-lg from-purple-50 to-white bg-gradient-to-br p-6px text-center transition-all hover:shadow-sm"
              >
                <div class="i-mdi-file-document-check mb-2px text-20px text-purple-500" />
                <div class="text-11px text-purple-600">作业提交率</div>
                <div class="text-18px text-purple-800 font-bold">92%</div>
                <div class="mt-1px text-10px text-purple-500">↑ 5% 较上周</div>
              </div>
              <div
                class="border border-orange-100 rounded-lg from-orange-50 to-white bg-gradient-to-br p-6px text-center transition-all hover:shadow-sm"
              >
                <div class="i-mdi-comment-processing mb-2px text-20px text-orange-500" />
                <div class="text-11px text-orange-600">互动参与度</div>
                <div class="text-18px text-orange-800 font-bold">78%</div>
                <div class="mt-1px text-10px text-orange-500">↑ 12% 较上周</div>
              </div>
            </div>

            <!-- 学习高峰时段 -->
            <div class="border border-gray-100 rounded-lg bg-white p-6px">
              <h3 class="mb-6px flex-y-center text-12px font-semibold">
                <div class="i-mdi-clock-time-five mr-3px text-14px text-primary" />
                学习高峰时段
              </h3>
              <div class="space-y-4px">
                <div class="flex-y-center justify-between">
                  <span class="text-11px text-#666">08:00-10:00</span>
                  <div class="mx-8px flex-1">
                    <NProgress type="line" :percentage="65" :show-indicator="false" :height="5" />
                  </div>
                  <span class="text-11px font-bold">65%</span>
                </div>
                <div class="flex-y-center justify-between">
                  <span class="text-11px text-#666">14:00-16:00</span>
                  <div class="mx-8px flex-1">
                    <NProgress type="line" :percentage="85" :show-indicator="false" :height="5" />
                  </div>
                  <span class="text-11px font-bold">85%</span>
                </div>
                <div class="flex-y-center justify-between">
                  <span class="text-11px text-#666">19:00-21:00</span>
                  <div class="mx-8px flex-1">
                    <NProgress type="line" :percentage="95" :show-indicator="false" :height="5" />
                  </div>
                  <span class="text-11px font-bold">95%</span>
                </div>
              </div>
            </div>

            <!-- 学习设备分布 -->
            <div class="border border-gray-100 rounded-lg bg-white p-6px">
              <h3 class="mb-6px flex-y-center text-12px font-semibold">
                <div class="i-mdi-devices mr-3px text-14px text-primary" />
                学习设备分布
              </h3>
              <div class="space-y-4px">
                <div class="flex-y-center justify-between">
                  <span class="text-11px text-#666">桌面端</span>
                  <div class="mx-8px flex-1">
                    <NProgress type="line" :percentage="68" :show-indicator="false" :height="5" />
                  </div>
                  <span class="text-11px font-bold">68%</span>
                </div>
                <div class="flex-y-center justify-between">
                  <span class="text-11px text-#666">移动端</span>
                  <div class="mx-8px flex-1">
                    <NProgress type="line" :percentage="32" :show-indicator="false" :height="5" />
                  </div>
                  <span class="text-11px font-bold">32%</span>
                </div>
              </div>
            </div>

            <!-- 作业完成时间分布 -->
            <div class="border border-gray-100 rounded-lg bg-white p-6px">
              <h3 class="mb-6px flex-y-center text-12px font-semibold">
                <div class="i-mdi-calendar-check mr-3px text-14px text-primary" />
                作业完成时间分布
              </h3>
              <div class="grid grid-cols-2 gap-8px">
                <div
                  class="border border-green-100 rounded-lg from-green-50 to-white bg-gradient-to-br p-5px text-center transition-all hover:shadow-sm"
                >
                  <div class="text-10px text-gray-600">提前完成</div>
                  <div class="text-14px text-green-800 font-bold">45%</div>
                </div>
                <div
                  class="border border-blue-100 rounded-lg from-blue-50 to-white bg-gradient-to-br p-5px text-center transition-all hover:shadow-sm"
                >
                  <div class="text-10px text-gray-600">按时完成</div>
                  <div class="text-14px text-blue-800 font-bold">38%</div>
                </div>
                <div
                  class="border border-orange-100 rounded-lg from-orange-50 to-white bg-gradient-to-br p-5px text-center transition-all hover:shadow-sm"
                >
                  <div class="text-10px text-gray-600">逾期1天内</div>
                  <div class="text-14px text-orange-800 font-bold">12%</div>
                </div>
                <div
                  class="border border-red-100 rounded-lg from-red-50 to-white bg-gradient-to-br p-5px text-center transition-all hover:shadow-sm"
                >
                  <div class="text-10px text-gray-600">逾期1天以上</div>
                  <div class="text-14px text-red-800 font-bold">5%</div>
                </div>
              </div>
            </div>

            <!-- 学习进度分布 -->
            <div class="border border-gray-100 rounded-lg bg-white p-6px">
              <h3 class="mb-6px flex-y-center text-12px font-semibold">
                <div class="i-mdi-chart-bar mr-3px text-14px text-primary" />
                学习进度分布
              </h3>
              <div class="space-y-4px">
                <div class="flex-y-center justify-between">
                  <span class="text-11px text-#666">进度领先</span>
                  <div class="mx-8px flex-1">
                    <NProgress type="line" :percentage="28" :show-indicator="false" :height="5" />
                  </div>
                  <span class="text-11px font-bold">28%</span>
                </div>
                <div class="flex-y-center justify-between">
                  <span class="text-11px text-#666">进度正常</span>
                  <div class="mx-8px flex-1">
                    <NProgress type="line" :percentage="52" :show-indicator="false" :height="5" />
                  </div>
                  <span class="text-11px font-bold">52%</span>
                </div>
                <div class="flex-y-center justify-between">
                  <span class="text-11px text-#666">进度落后</span>
                  <div class="mx-8px flex-1">
                    <NProgress type="line" :percentage="20" :show-indicator="false" :height="5" />
                  </div>
                  <span class="text-11px font-bold">20%</span>
                </div>
              </div>
            </div>
          </div>
        </NCard>
      </NGi>

      <!-- 课程表现深度分析 -->
      <NGi span="24 s:24 m:12">
        <NCard :bordered="false" class="h-full card-wrapper">
          <template #header>
            <div class="flex-y-center justify-between">
              <div class="flex-y-center gap-8px">
                <div class="i-mdi-chart-areaspline text-20px text-primary" />
                <span class="font-semibold">课程表现深度分析</span>
              </div>
              <NButton text type="primary" size="small">查看全部</NButton>
            </div>
          </template>
          <div class="h-full space-y-8px">
            <!-- 课程表现列表 -->
            <NSpace vertical :size="8">
              <div
                v-for="(course, index) in courseAnalytics.slice(0, 4)"
                :key="index"
                class="border border-gray-100 rounded-lg bg-white p-6px transition-all hover:shadow-sm"
              >
                <div class="mb-4px flex-y-center justify-between">
                  <span class="text-12px font-semibold">{{ course.name }}</span>
                  <NTag :type="course.trend === 'up' ? 'success' : 'error'" size="small">
                    <template #icon>
                      <div :class="course.trend === 'up' ? 'i-mdi-trending-up' : 'i-mdi-trending-down'" />
                    </template>
                    {{ course.trend === 'up' ? '上升' : '下降' }}
                  </NTag>
                </div>
                <div class="space-y-3px">
                  <div class="flex-y-center justify-between">
                    <span class="text-10px text-#666">平均分</span>
                    <span class="text-11px font-bold">{{ course.avgScore }}</span>
                  </div>
                  <div class="flex-y-center justify-between">
                    <span class="text-10px text-#666">及格率</span>
                    <span class="text-11px font-bold">{{ course.passRate }}%</span>
                  </div>
                  <div class="flex-y-center justify-between">
                    <span class="text-10px text-#666">学生数</span>
                    <span class="text-11px font-bold">{{ course.students }}</span>
                  </div>
                </div>
                <div class="mt-4px">
                  <NProgress type="line" :percentage="course.passRate" :show-indicator="false" :height="5" />
                </div>
              </div>
            </NSpace>

            <!-- 课程表现对比 -->
            <div class="border border-gray-100 rounded-lg bg-white p-6px">
              <h3 class="mb-6px flex-y-center text-12px font-semibold">
                <div class="i-mdi-chart-combo mr-3px text-14px text-primary" />
                课程表现对比
              </h3>
              <div class="space-y-4px">
                <div class="flex-y-center justify-between">
                  <span class="text-11px text-#666">平均分最高</span>
                  <span class="text-11px text-green-800 font-bold">计算机编程 (88)</span>
                </div>
                <div class="flex-y-center justify-between">
                  <span class="text-11px text-#666">及格率最高</span>
                  <span class="text-11px text-green-800 font-bold">英语写作 (92%)</span>
                </div>
                <div class="flex-y-center justify-between">
                  <span class="text-11px text-#666">学生数最多</span>
                  <span class="text-11px text-blue-800 font-bold">计算机编程 (52人)</span>
                </div>
                <div class="flex-y-center justify-between">
                  <span class="text-11px text-#666">进步最快</span>
                  <span class="text-11px text-orange-800 font-bold">高等数学 (↑5分)</span>
                </div>
              </div>
            </div>

            <!-- 教学建议 -->
            <div class="border border-primary/10 rounded-lg from-primary/5 to-info/5 bg-gradient-to-r p-6px">
              <div class="flex-y-center gap-6px">
                <div class="i-mdi-lightbulb-on text-16px text-primary" />
                <div class="flex-1">
                  <div class="text-11px font-semibold">教学建议</div>
                  <div class="mt-2px text-10px text-#666">
                    物理实验课程及格率呈下降趋势，建议增加实验指导时间，重点关注基础薄弱学生。
                    数据结构课程平均分较低，建议增加辅导课程或调整教学方法。
                  </div>
                </div>
              </div>
            </div>
          </div>
        </NCard>
      </NGi>
    </NGrid>

    <NCard :bordered="false" class="card-wrapper">
      <template #header>
        <div class="flex-y-center justify-between">
          <span class="font-semibold">学生预警</span>
          <NSpace>
            <NButton type="warning" size="small" @click="handleBatchWarning">
              <template #icon>
                <div class="i-mdi-bell-alert" />
              </template>
              批量预警
            </NButton>
            <NButton text type="primary" @click="handleViewAllAlerts">查看全部</NButton>
          </NSpace>
        </div>
      </template>
      <NDataTable :columns="alertColumns" :data="studentAlerts" :pagination="false" />
    </NCard>

    <!-- AI学习风险预测 -->
    <NCard :bordered="false" class="mt-16px card-wrapper">
      <template #header>
        <div class="flex-y-center justify-between">
          <div class="flex-y-center gap-8px">
            <div class="i-mdi-robot text-20px text-purple-500" />
            <span class="font-semibold">AI学习风险预测</span>
            <NTag
              v-if="refreshState.lastRefreshTime"
              size="small"
              :type="refreshState.status === 'error' ? 'error' : 'success'"
            >
              <template #icon>
                <div
                  :class="
                    refreshState.status === 'refreshing'
                      ? 'i-mdi-loading animate-spin'
                      : refreshState.status === 'success'
                        ? 'i-mdi-check-circle'
                        : 'i-mdi-alert-circle'
                  "
                />
              </template>
              {{
                refreshState.status === 'refreshing'
                  ? '刷新中'
                  : refreshState.status === 'success'
                    ? '已更新'
                    : '刷新失败'
              }}
            </NTag>
          </div>
          <NSpace>
            <NButton type="primary" size="small" :loading="refreshState.isRefreshing" @click="handleManualRefresh">
              <template #icon>
                <div :class="refreshState.isRefreshing ? 'i-mdi-loading animate-spin' : 'i-mdi-refresh'" />
              </template>
              {{ refreshState.isRefreshing ? '刷新中...' : '刷新预测' }}
            </NButton>
            <NButton :type="autoRefreshConfig.enabled ? 'warning' : 'default'" size="small" @click="toggleAutoRefresh">
              <template #icon>
                <div :class="autoRefreshConfig.enabled ? 'i-mdi-timer-alert' : 'i-mdi-timer'" />
              </template>
              {{ autoRefreshConfig.enabled ? '自动刷新中' : '自动刷新' }}
            </NButton>
            <NButton size="small" @click="showRefreshLogsModal = true">
              <template #icon>
                <div class="i-mdi-history" />
              </template>
              日志
            </NButton>
          </NSpace>
        </div>
      </template>
      <div class="risk-prediction-grid">
        <div v-for="student in riskPrediction" :key="student.studentId" class="risk-prediction-card">
          <div class="risk-header">
            <div class="student-info">
              <div
                class="student-avatar"
                :style="{
                  background: getAvatarGradient(Number(student.studentId.replace('STU', '')) || 1)
                }"
              >
                {{ student.studentName.charAt(0) }}
              </div>
              <div class="student-detail">
                <div class="student-name">{{ student.studentName }}</div>
                <div class="student-id">{{ student.studentId }}</div>
              </div>
            </div>
            <NTag
              :type="student.riskProbability >= 70 ? 'error' : student.riskProbability >= 40 ? 'warning' : 'success'"
              size="small"
            >
              {{ student.riskProbability }}% 风险
            </NTag>
          </div>

          <div class="risk-scores">
            <div class="score-item">
              <span class="score-label">当前成绩</span>
              <span class="score-value">{{ student.currentScore }}</span>
            </div>
            <div class="score-arrow">
              <div
                :class="
                  student.trend === 'up'
                    ? 'i-mdi-arrow-up'
                    : student.trend === 'down'
                      ? 'i-mdi-arrow-down'
                      : 'i-mdi-minus'
                "
              />
            </div>
            <div class="score-item">
              <span class="score-label">预测成绩</span>
              <span class="score-value" :class="{ 'text-error': student.predictedScore < 60 }">
                {{ student.predictedScore }}
              </span>
            </div>
          </div>

          <div class="risk-recommendations">
            <div class="recommendations-title">个性化建议：</div>
            <div class="recommendations-list">
              <div
                v-for="(rec, idx) in generateIntervention(student).slice(0, 3)"
                :key="idx"
                class="recommendation-item"
              >
                {{ rec }}
              </div>
            </div>
          </div>

          <div class="risk-actions">
            <NButton size="small" type="primary" @click="handleSendWarning(student)">
              <template #icon>
                <div class="i-mdi-bell" />
              </template>
              发送预警
            </NButton>
            <NButton
              size="small"
              @click="
                handleViewStudentDetail({
                  id: Number(student.studentId.replace('STU', '')),
                  name: student.studentName,
                  score: student.currentScore,
                  riskLevel: student.riskProbability >= 70 ? 'high' : student.riskProbability >= 40 ? 'medium' : 'low',
                  failCount: 0,
                  lastSubmit: '',
                  avatar: ''
                })
              "
            >
              <template #icon>
                <div class="i-mdi-eye" />
              </template>
              查看详情
            </NButton>
          </div>
        </div>
      </div>
    </NCard>

    <!-- 查看全部预警学生弹窗 -->
    <NModal v-model:show="showAllAlertsModal" preset="card" title="全部预警学生" class="w-800px">
      <NDataTable :columns="alertColumns" :data="allStudentAlerts" :pagination="{ pageSize: 10 }" />
    </NModal>

    <!-- 学生详情弹窗 -->
    <NModal v-model:show="showStudentDetailModal" preset="card" title="学生详情" class="w-600px">
      <div v-if="selectedStudent">
        <div class="mb-24px flex-center">
          <div
            class="size-80px flex-center rd-1/2 text-32px text-white font-bold"
            :style="{ background: getAvatarGradient(selectedStudent.id) }"
          >
            {{ selectedStudent.name.charAt(0) }}
          </div>
        </div>

        <NDescriptions bordered :column="2">
          <NDescriptionsItem label="姓名">{{ selectedStudent.name }}</NDescriptionsItem>
          <NDescriptionsItem label="学号">{{ `2024${String(selectedStudent.id).padStart(4, '0')}` }}</NDescriptionsItem>
          <NDescriptionsItem label="当前分数">
            <span class="text-18px font-bold">{{ selectedStudent.score }}分</span>
          </NDescriptionsItem>
          <NDescriptionsItem label="风险等级">
            <NTag
              :type="
                selectedStudent.riskLevel === 'high'
                  ? 'error'
                  : selectedStudent.riskLevel === 'medium'
                    ? 'warning'
                    : 'info'
              "
            >
              {{
                selectedStudent.riskLevel === 'high'
                  ? '高风险'
                  : selectedStudent.riskLevel === 'medium'
                    ? '中风险'
                    : '低风险'
              }}
            </NTag>
          </NDescriptionsItem>
          <NDescriptionsItem label="缺交次数">{{ selectedStudent.failCount }} 次</NDescriptionsItem>
          <NDescriptionsItem label="最后提交">{{ selectedStudent.lastSubmit }}</NDescriptionsItem>
          <NDescriptionsItem label="班级" :span="2">计算机科学与技术 2024-1班</NDescriptionsItem>
          <NDescriptionsItem label="联系方式" :span="2">
            {{ `138${String(selectedStudent.id).padStart(8, '0')}` }}
          </NDescriptionsItem>
        </NDescriptions>

        <div class="mt-24px">
          <h3 class="mb-12px text-16px font-semibold">近期作业情况</h3>
          <NSpace vertical :size="12">
            <div class="flex-y-center justify-between border-b pb-8px">
              <span>第5章练习</span>
              <NTag type="error">未提交</NTag>
            </div>
            <div class="flex-y-center justify-between border-b pb-8px">
              <span>英文作文</span>
              <NTag type="success">已提交 (85分)</NTag>
            </div>
            <div class="flex-y-center justify-between border-b pb-8px">
              <span>实验报告</span>
              <NTag type="error">未提交</NTag>
            </div>
          </NSpace>
        </div>

        <div class="mt-24px flex justify-end gap-12px">
          <NButton @click="showStudentDetailModal = false">关闭</NButton>
          <NButton type="primary" @click="handleContactStudent">
            <template #icon>
              <div class="i-mdi-phone" />
            </template>
            联系学生
          </NButton>
        </div>
      </div>
    </NModal>

    <NCard :bordered="false" class="card-wrapper">
      <template #header>
        <span class="font-semibold">课程分析</span>
      </template>
      <NDataTable :columns="courseColumns" :data="courseAnalytics" :pagination="{ pageSize: 5 }" />
    </NCard>

    <!-- 数据分析工具 -->
    <!-- 智能分析工具箱 - 全新重构组件 -->
    <NCard :bordered="false" class="smart-tools-card card-wrapper">
      <template #header>
        <div class="tools-card-header">
          <div class="header-content">
            <div class="header-icon">
              <div class="i-mdi-toolbox text-28px" />
            </div>
            <div class="header-text">
              <h3 class="tools-title">智能分析工具箱</h3>
              <p class="tools-subtitle">AI 驱动的数据分析工具，让教学决策更智能</p>
            </div>
          </div>
          <NButton size="small" secondary type="primary" @click="showAllTools = !showAllTools">
            {{ showAllTools ? '收起' : '查看全部' }}
            <template #icon>
              <div :class="showAllTools ? 'i-mdi-chevron-up' : 'i-mdi-chevron-down'" />
            </template>
          </NButton>
        </div>
      </template>

      <!-- 工具卡片网格 -->
      <div class="tools-grid">
        <div
          v-for="tool in displayTools"
          :key="tool.id"
          class="tool-card"
          :class="tool.type"
          @click="handleToolClick(tool)"
        >
          <!-- 工具图标 -->
          <div class="tool-icon-wrapper">
            <div class="tool-icon-bg" :style="{ background: tool.iconBg }" />
            <div class="tool-icon">
              <div class="icon-gradient text-32px" :class="[tool.icon]" :style="{ '--icon-color': tool.iconColor }" />
            </div>
            <div v-if="tool.badge" class="tool-badge" :class="tool.badgeType">
              {{ tool.badge }}
            </div>
          </div>

          <!-- 工具信息 -->
          <div class="tool-content">
            <h4 class="tool-title">{{ tool.name }}</h4>
            <p class="tool-description">{{ tool.description }}</p>

            <!-- 使用统计 -->
            <div class="tool-stats">
              <div class="stat-item">
                <div class="i-mdi-chart-bar text-14px" />
                <span>{{ tool.usageCount }}次使用</span>
              </div>
              <div v-if="tool.efficiency" class="stat-item highlight">
                <div class="i-mdi-lightning-bolt text-14px" />
                <span>效率 +{{ tool.efficiency }}%</span>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="tool-actions">
              <NButton size="small" type="primary" class="action-btn">
                <template #icon>
                  <div class="i-mdi-play" />
                </template>
                立即使用
              </NButton>
              <NButton size="small" secondary class="action-btn">
                <template #icon>
                  <div class="i-mdi-information" />
                </template>
                详情
              </NButton>
            </div>
          </div>
        </div>
      </div>

      <!-- 数据统计栏 -->
      <div class="tools-stats-bar">
        <div class="stats-item">
          <div class="stats-icon primary">
            <div class="i-mdi-tools" />
          </div>
          <div class="stats-content">
            <div class="stats-value">{{ toolsList.length }}</div>
            <div class="stats-label">可用工具</div>
          </div>
        </div>
        <div class="stats-item">
          <div class="stats-icon success">
            <div class="i-mdi-trending-up" />
          </div>
          <div class="stats-content">
            <div class="stats-value">{{ totalUsageCount }}</div>
            <div class="stats-label">本周使用</div>
          </div>
        </div>
        <div class="stats-item">
          <div class="stats-icon warning">
            <div class="i-mdi-star" />
          </div>
          <div class="stats-content">
            <div class="stats-value">{{ favoriteCount }}</div>
            <div class="stats-label">收藏工具</div>
          </div>
        </div>
        <div class="stats-item">
          <div class="stats-icon info">
            <div class="i-mdi-robot" />
          </div>
          <div class="stats-content">
            <div class="stats-value">AI</div>
            <div class="stats-label">智能推荐</div>
          </div>
        </div>
      </div>
    </NCard>

    <!-- 导出报告弹窗 -->
    <NModal v-model:show="showExportModal" preset="dialog" title="导出报告">
      <div class="py-20px">
        <p class="mb-16px text-14px text-#666">请选择导出格式：</p>
        <NSpace vertical :size="12">
          <NButton block @click="confirmExport('PDF')">
            <template #icon>
              <div class="i-mdi-file-pdf-box" />
            </template>
            导出为 PDF
          </NButton>
          <NButton block @click="confirmExport('Excel')">
            <template #icon>
              <div class="i-mdi-file-excel" />
            </template>
            导出为 Excel
          </NButton>
          <NButton block @click="confirmExport('Word')">
            <template #icon>
              <div class="i-mdi-file-word" />
            </template>
            导出为 Word
          </NButton>
        </NSpace>
      </div>
    </NModal>

    <!-- AI智能分析弹窗 -->
    <NModal v-model:show="showAIModal" preset="card" title="AI智能分析" class="ai-analysis-modal max-w-90vw w-600px">
      <div class="ai-analysis-content">
        <div class="ai-analysis-tabs">
          <NTabs type="segment" :value="aiAnalysisType" @update:value="(val: any) => handleAIAnalysis(val)">
            <NTab name="trend">
              <div class="flex items-center gap-8px">
                <div class="i-mdi-chart-line" />
                <span>趋势分析</span>
              </div>
            </NTab>
            <NTab name="prediction">
              <div class="flex items-center gap-8px">
                <div class="i-mdi-crystal-ball" />
                <span>效果预测</span>
              </div>
            </NTab>
            <NTab name="recommendation">
              <div class="flex items-center gap-8px">
                <div class="i-mdi-lightbulb" />
                <span>教学建议</span>
              </div>
            </NTab>
          </NTabs>
        </div>

        <div class="ai-analysis-result">
          <div v-if="aiAnalysisLoading" class="ai-loading">
            <NSpin size="large" />
            <p>AI正在分析中...</p>
          </div>
          <div v-else class="ai-result-content">
            <pre>{{ aiAnalysisResult }}</pre>
          </div>
        </div>
      </div>
      <template #footer>
        <NSpace justify="end">
          <NButton @click="showAIModal = false">关闭</NButton>
          <NButton type="primary" @click="handleExportAIReport">
            <template #icon>
              <div class="i-mdi-download" />
            </template>
            导出报告
          </NButton>
        </NSpace>
      </template>
    </NModal>

    <!-- 刷新日志弹窗 -->
    <NModal
      v-model:show="showRefreshLogsModal"
      preset="card"
      title="刷新日志"
      class="refresh-logs-modal max-w-90vw w-600px"
    >
      <div class="refresh-logs-content">
        <!-- 自动刷新设置 -->
        <div class="auto-refresh-settings">
          <div class="flex-y-center justify-between">
            <span class="font-medium">自动刷新设置</span>
            <NSwitch :value="autoRefreshConfig.enabled" @update:value="toggleAutoRefresh" />
          </div>
          <div v-if="autoRefreshConfig.enabled" class="interval-options">
            <span class="text-13px text-gray-600">刷新间隔：</span>
            <div
              v-for="interval in [15, 30, 60]"
              :key="interval"
              class="interval-btn"
              :class="{ active: autoRefreshConfig.interval === interval }"
              @click="handleIntervalChange(interval)"
            >
              {{ interval }}分钟
            </div>
          </div>
        </div>

        <!-- 刷新状态 -->
        <div class="refresh-status-bar">
          <div class="refresh-info">
            <span>上次刷新：</span>
            <span class="refresh-time">{{ refreshState.lastRefreshTime || '从未刷新' }}</span>
          </div>
          <div v-if="refreshState.status === 'error'" class="refresh-info text-red-500">
            <span class="i-mdi-alert-circle" />
            <span>{{ refreshState.errorMessage }}</span>
          </div>
        </div>

        <!-- 刷新进度 -->
        <div v-if="refreshState.isRefreshing" class="mb-16px">
          <NProgress type="line" :percentage="refreshState.refreshProgress" :height="8" />
          <p class="mt-8px text-center text-13px text-gray-500">正在刷新... {{ refreshState.refreshProgress }}%</p>
        </div>

        <!-- 错误重试 -->
        <div v-if="refreshState.status === 'error'" class="mb-16px">
          <NButton type="error" block @click="handleManualRefresh">
            <template #icon>
              <div class="i-mdi-refresh" />
            </template>
            重试刷新
          </NButton>
        </div>

        <!-- 日志列表 -->
        <div class="refresh-logs-container">
          <div v-if="refreshLogs.length === 0" class="py-20px text-center text-gray-500">暂无刷新日志</div>
          <div v-else>
            <div v-for="log in refreshLogs" :key="log.id" class="log-item">
              <div class="log-icon" :class="log.status">
                <span :class="log.status === 'success' ? 'i-mdi-check' : 'i-mdi-close'" />
              </div>
              <div class="log-content">
                <div class="log-timestamp">{{ log.timestamp }}</div>
                <div class="log-details">
                  耗时: {{ log.duration }}ms | 数据变化: {{ log.dataChanges }}项
                  <span v-if="log.errorMessage" class="text-red-500">| 错误: {{ log.errorMessage }}</span>
                </div>
              </div>
              <NTag v-if="log.status === 'success'" type="success" size="small">成功</NTag>
              <NTag v-else type="error" size="small">失败</NTag>
            </div>
          </div>
        </div>
      </div>
    </NModal>
  </NSpace>
</template>

<style scoped>
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
  .quick-action-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  /* AI分析弹窗样式 */
  .ai-analysis-content {
    padding: 8px 0;
  }

  .ai-analysis-tabs {
    margin-bottom: 20px;
  }

  .ai-analysis-result {
    min-height: 300px;
    padding: 20px;
    background: #f9fafb;
    border-radius: 8px;
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

  .ai-result-content pre {
    white-space: pre-wrap;
    word-wrap: break-word;
    font-family: inherit;
    font-size: 14px;
    line-height: 1.8;
    color: #1f2937;
    margin: 0;
  }
}

/* AI分析弹窗样式 */
.ai-analysis-content {
  padding: 8px 0;
}

.ai-analysis-tabs {
  margin-bottom: 20px;
}

.ai-analysis-result {
  min-height: 300px;
  padding: 20px;
  background: #f9fafb;
  border-radius: 8px;
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

.ai-result-content pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.8;
  color: #1f2937;
  margin: 0;
}

/* 快捷操作卡片 - 全面优化 */
.quick-action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 28px 16px;
  background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
  border-radius: 14px;
  border: 2px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  min-height: 120px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.quick-action-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
  transition: left 0.6s ease;
}

.quick-action-card:hover::before {
  left: 100%;
}

.quick-action-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
  border-color: transparent;
}

.quick-action-card:hover .quick-action-icon {
  transform: scale(1.15) rotate(5deg);
}

.quick-action-card:active {
  transform: translateY(-4px) scale(0.98);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

.quick-action-icon {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(249, 250, 251, 0.9) 100%);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 32px;
}

.quick-action-text {
  margin-top: 14px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  transition: all 0.3s;
  text-align: center;
  letter-spacing: 0.3px;
}

.quick-action-card:hover .quick-action-text {
  color: #1f2937;
  font-weight: 600;
}

/* 不同状态的颜色主题 */
.quick-action-card.primary .quick-action-icon {
  background: linear-gradient(135deg, rgba(32, 128, 240, 0.1) 0%, rgba(32, 128, 240, 0.05) 100%);
  color: #2080f0;
}

.quick-action-card.success .quick-action-icon {
  background: linear-gradient(135deg, rgba(24, 160, 88, 0.1) 0%, rgba(24, 160, 88, 0.05) 100%);
  color: #18a058;
}

.quick-action-card.warning .quick-action-icon {
  background: linear-gradient(135deg, rgba(240, 160, 32, 0.1) 0%, rgba(240, 160, 32, 0.05) 100%);
  color: #f0a020;
}

.quick-action-card.info .quick-action-icon {
  background: linear-gradient(135deg, rgba(96, 165, 250, 0.1) 0%, rgba(96, 165, 250, 0.05) 100%);
  color: #60a5fa;
}

.quick-action-card.error .quick-action-icon {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%);
  color: #ef4444;
}

.quick-action-card:hover.primary {
  border-color: #2080f0;
}

.quick-action-card:hover.success {
  border-color: #18a058;
}

.quick-action-card:hover.warning {
  border-color: #f0a020;
}

.quick-action-card:hover.info {
  border-color: #60a5fa;
}

.quick-action-card:hover.error {
  border-color: #ef4444;
}

/* AI 学习风险预测样式 */
.risk-prediction-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.risk-prediction-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s;
}

.risk-prediction-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #8b5cf6;
}

.risk-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.student-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.student-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: bold;
}

.student-detail {
  display: flex;
  flex-direction: column;
}

.student-name {
  font-weight: 600;
  color: #1f2937;
}

.student-id {
  font-size: 12px;
  color: #6b7280;
}

.risk-scores {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
  margin-bottom: 12px;
}

.score-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.score-label {
  font-size: 12px;
  color: #6b7280;
}

.score-value {
  font-size: 20px;
  font-weight: bold;
  color: #1f2937;
}

.score-arrow {
  color: #9ca3af;
  font-size: 20px;
}

.risk-recommendations {
  margin-bottom: 12px;
}

.recommendations-title {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 8px;
}

.recommendations-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.recommendation-item {
  font-size: 12px;
  color: #4b5563;
  padding: 4px 8px;
  background: #f3f4f6;
  border-radius: 4px;
}

.risk-actions {
  display: flex;
  gap: 8px;
}

/* 刷新状态显示 */
.refresh-status-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: #f9fafb;
  border-radius: 6px;
  margin-bottom: 12px;
}

.refresh-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #6b7280;
}

.refresh-time {
  font-weight: 500;
}

/* 自动刷新设置面板 */
.auto-refresh-settings {
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
  margin-bottom: 16px;
}

.interval-options {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.interval-btn {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.interval-btn.active {
  background: #18a058;
  color: #fff;
}

.interval-btn:not(.active) {
  background: #e5e7eb;
  color: #374151;
}

/* 刷新日志样式 */
.refresh-logs-container {
  max-height: 400px;
  overflow-y: auto;
}

.log-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.log-item:last-child {
  border-bottom: none;
}

.log-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.log-icon.success {
  background: #d1fae5;
  color: #10b981;
}

.log-icon.error {
  background: #fee2e2;
  color: #ef4444;
}

.log-content {
  flex: 1;
}

.log-timestamp {
  font-size: 12px;
  color: #6b7280;
}

.log-details {
  font-size: 13px;
  color: #1f2937;
  margin-top: 4px;
}

.log-duration {
  font-size: 12px;
  color: #9ca3af;
}

/* 刷新进度条样式 */
.refresh-progress-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  z-index: 10;
}

.progress-text {
  margin-top: 12px;
  font-size: 14px;
  color: #6b7280;
}

/* 动画 */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* 响应式设计 - AI 风险预测 */
@media (max-width: 1024px) {
  .risk-prediction-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

@media (max-width: 768px) {
  .risk-prediction-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .risk-prediction-card {
    padding: 14px;
  }
}

/* 智能工具箱样式 */
.smart-tools-card {
  background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.tools-card-header {
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

.tools-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.tools-subtitle {
  font-size: 13px;
  color: #6b7280;
  margin: 4px 0 0 0;
}

/* 工具卡片网格 */
.tools-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 8px;
}

.tool-card {
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: white;
  border-radius: 14px;
  border: 2px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.tool-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
  border-color: transparent;
}

.tool-card.primary:hover {
  border-color: #2080f0;
}

.tool-card.success:hover {
  border-color: #18a058;
}

.tool-card.warning:hover {
  border-color: #f0a020;
}

.tool-card.info:hover {
  border-color: #60a5fa;
}

.tool-card.error:hover {
  border-color: #ef4444;
}

.tool-card.purple:hover {
  border-color: #8b5cf6;
}

.tool-card.pink:hover {
  border-color: #ec4899;
}

.tool-card.sky:hover {
  border-color: #0ea5e9;
}

.tool-card.indigo:hover {
  border-color: #6366f1;
}

.tool-card.teal:hover {
  border-color: #14b8a6;
}

/* 工具图标 */
.tool-icon-wrapper {
  position: relative;
  margin-bottom: 16px;
  width: 64px;
  height: 64px;
}

.tool-icon-bg {
  position: absolute;
  inset: 0;
  border-radius: 14px;
  z-index: 0;
}

.tool-icon {
  position: relative;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  z-index: 1;
}

.tool-icon > div {
  position: relative;
  z-index: 1;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.icon-gradient {
  background: linear-gradient(135deg, var(--icon-color) 0%, rgba(255, 255, 255, 0.9) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.2));
}

.tool-card:hover .tool-icon {
  transform: scale(1.1) rotate(5deg);
}

.tool-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1;
}

.tool-badge.new {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.tool-badge.hot {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.tool-badge.ai {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

/* 工具内容 */
.tool-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.tool-title {
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.tool-description {
  font-size: 13px;
  color: #6b7280;
  margin: 0 0 14px 0;
  line-height: 1.5;
  flex: 1;
}

/* 工具统计 */
.tool-stats {
  display: flex;
  gap: 12px;
  margin-bottom: 14px;
  padding: 8px;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  border-radius: 8px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #6b7280;
}

.stat-item.highlight {
  color: #18a058;
  font-weight: 500;
}

/* 工具按钮 */
.tool-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  flex: 1;
  transition: all 0.2s;
}

.action-btn:hover {
  transform: translateY(-2px);
}

/* 统计栏 */
.tools-stats-bar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-top: 24px;
  padding: 20px;
  background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.stats-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stats-icon {
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

.stats-icon.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stats-icon.success {
  background: linear-gradient(135deg, #18a058 0%, #0e7e3e 100%);
}

.stats-icon.warning {
  background: linear-gradient(135deg, #f0a020 0%, #d48806 100%);
}

.stats-icon.info {
  background: linear-gradient(135deg, #2080f0 0%, #1060c9 100%);
}

.stats-icon.pink {
  background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
}

.stats-icon.sky {
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
}

.stats-icon.indigo {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
}

.stats-icon.teal {
  background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
}

.stats-content {
  display: flex;
  flex-direction: column;
}

.stats-value {
  font-size: 22px;
  font-weight: bold;
  color: #1f2937;
  line-height: 1;
}

.stats-label {
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .tools-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .tools-stats-bar {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .tools-grid {
    grid-template-columns: 1fr;
  }

  .tools-stats-bar {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    padding: 14px;
  }

  .tool-card {
    padding: 16px;
  }

  .tool-icon {
    width: 52px;
    height: 52px;
  }

  .tools-title {
    font-size: 16px;
  }

  .header-icon {
    width: 42px;
    height: 42px;
  }
}

@media (max-width: 480px) {
  .tools-stats-bar {
    grid-template-columns: 1fr;
  }

  .stats-item {
    gap: 10px;
  }

  .stats-icon {
    width: 38px;
    height: 38px;
    font-size: 18px;
  }

  .stats-value {
    font-size: 18px;
  }
}

/* 页面头部样式优化 */
.analytics-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
  margin-bottom: 8px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-subtitle {
  margin-top: 6px;
  font-size: 13px;
  opacity: 0.9;
}

/* 统计卡片增强 */
.stat-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .analytics-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    padding: 16px;
  }

  .header-left {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
  }

  .header-title {
    flex-direction: column;
    align-items: flex-start;
  }

  .risk-prediction-grid {
    grid-template-columns: 1fr;
  }

  .quick-action-card {
    padding: 20px 12px;
    min-height: 100px;
  }

  .quick-action-icon {
    width: 52px;
    height: 52px;
    font-size: 26px;
  }

  .quick-action-text {
    font-size: 13px;
    margin-top: 10px;
  }
}

@media (max-width: 480px) {
  .quick-action-card {
    padding: 16px 10px;
    min-height: 90px;
    border-radius: 10px;
  }

  .quick-action-icon {
    width: 44px;
    height: 44px;
    font-size: 22px;
  }

  .quick-action-text {
    font-size: 12px;
    margin-top: 8px;
  }
}

/* 卡片包装器 */
.card-wrapper {
  transition: all 0.3s;
}

.card-wrapper:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}
</style>
