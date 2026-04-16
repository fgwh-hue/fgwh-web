<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useAppStore } from '@/store/modules/app';
import HeaderBanner from './modules-admin/header-banner.vue';
import EnhancedCardData from './modules-admin/enhanced-card-data.vue';
import ProjectNews from './modules-admin/project-news.vue';

defineOptions({
  name: 'AdminHomePage'
});

const appStore = useAppStore();
const gap = computed(() => (appStore.isMobile ? 0 : 16));

type AlertLevel = 'info' | 'warning' | 'success';
type TaskCategory = 'user' | 'course' | 'system' | 'approval';

interface SystemAlert {
  id: number;
  level: AlertLevel;
  title: string;
  description: string;
  time: string;
  source: string;
  isRead: boolean;
  action?: string;
}

interface PendingTask {
  id: number;
  title: string;
  description: string;
  count: number;
  urgent: boolean;
  category: TaskCategory;
  deadline?: string;
  assignee?: string;
  priority: 'high' | 'medium' | 'low';
  progress: number;
}

const systemAlerts = ref<SystemAlert[]>([
  {
    id: 1,
    level: 'warning',
    title: 'CPU 使用率超过 80%',
    description: '服务器 CPU 使用率持续超过 80%，可能影响系统性能',
    time: '10分钟前',
    source: '系统监控',
    isRead: false,
    action: '查看详情'
  },
  {
    id: 2,
    level: 'info',
    title: '系统备份已完成',
    description: '每日自动备份已成功完成，备份文件大小 2.3GB',
    time: '30分钟前',
    source: '运维中心',
    isRead: false
  },
  {
    id: 3,
    level: 'success',
    title: '所有服务运行正常',
    description: '系统所有服务状态正常，无异常告警',
    time: '1小时前',
    source: '系统监控',
    isRead: true
  },
  {
    id: 4,
    level: 'warning',
    title: '内存使用率达到 75%',
    description: '服务器内存使用率达到 75%，建议进行内存优化',
    time: '2小时前',
    source: '系统监控',
    isRead: true,
    action: '优化内存'
  },
  {
    id: 5,
    level: 'info',
    title: '日志文件已清理',
    description: '自动清理过期日志文件，释放磁盘空间 1.2GB',
    time: '3小时前',
    source: '运维中心',
    isRead: true
  },
  {
    id: 6,
    level: 'success',
    title: '数据库优化完成',
    description: '数据库索引优化已完成，查询性能提升 40%',
    time: '5小时前',
    source: '数据库管理',
    isRead: true
  }
]);

const pendingTasks = ref<PendingTask[]>([
  {
    id: 1,
    title: '审核新用户注册申请',
    description: '收到 12 条新用户注册申请，需要进行身份验证和资格审核',
    count: 12,
    urgent: true,
    category: 'user',
    deadline: '今天 18:00',
    assignee: '管理员',
    priority: 'high',
    progress: 0
  },
  {
    id: 2,
    title: '处理教师权限变更',
    description: '5 位教师申请权限变更，需要审核并更新权限设置',
    count: 5,
    urgent: false,
    category: 'system',
    deadline: '明天 12:00',
    assignee: '系统管理员',
    priority: 'medium',
    progress: 30
  },
  {
    id: 3,
    title: '查看系统异常报告',
    description: '系统检测到 3 个异常报告，需要分析原因并采取措施',
    count: 3,
    urgent: true,
    category: 'system',
    deadline: '今天 15:00',
    assignee: '技术支持',
    priority: 'high',
    progress: 0
  },
  {
    id: 4,
    title: '更新课程内容审核',
    description: '8 门课程内容需要更新审核，确保内容符合教学要求',
    count: 8,
    urgent: false,
    category: 'course',
    deadline: '后天 17:00',
    assignee: '课程管理员',
    priority: 'medium',
    progress: 20
  },
  {
    id: 5,
    title: '审批实训项目申请',
    description: '6 个实训项目申请需要审批，包括场地、设备和资金需求',
    count: 6,
    urgent: true,
    category: 'approval',
    deadline: '今天 16:00',
    assignee: '部门主管',
    priority: 'high',
    progress: 0
  },
  {
    id: 6,
    title: '处理学生反馈问题',
    description: '15 条学生反馈需要处理，涉及课程、系统和服务等方面',
    count: 15,
    urgent: false,
    category: 'user',
    deadline: '明天 18:00',
    assignee: '学生服务',
    priority: 'medium',
    progress: 10
  }
]);

const activeTaskFilter = ref<TaskCategory | 'all'>('all');
const unreadAlertCount = computed(() => systemAlerts.value.filter(alert => !alert.isRead).length);

const filteredTasks = computed(() => {
  if (activeTaskFilter.value === 'all') {
    return pendingTasks.value;
  }
  return pendingTasks.value.filter(task => task.category === activeTaskFilter.value);
});

const taskCategoryOptions = [
  { key: 'all', label: '全部', icon: 'ph:stack-fill' },
  { key: 'user', label: '用户', icon: 'ph:users-fill' },
  { key: 'course', label: '课程', icon: 'ph:graduation-cap-fill' },
  { key: 'system', label: '系统', icon: 'ph:gear-fill' },
  { key: 'approval', label: '审批', icon: 'ph:check-circle-fill' }
];

const levelColors = {
  info: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-500', icon: 'ph:info-fill' },
  warning: { bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-500', icon: 'ph:warning-fill' },
  success: { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-500', icon: 'ph:check-circle-fill' }
};

const categoryColors = {
  user: { color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  course: { color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
  system: { color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
  approval: { color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' }
};

function getCategoryInfo(category: TaskCategory) {
  return categoryColors[category];
}

function markAlertAsRead(id: number) {
  const alert = systemAlerts.value.find(a => a.id === id);
  if (alert) {
    alert.isRead = true;
  }
}

function markAllAlertsAsRead() {
  systemAlerts.value.forEach(alert => {
    alert.isRead = true;
  });
}

function handleTaskFilterChange(category: TaskCategory | 'all') {
  activeTaskFilter.value = category;
}

const isVisible = ref(false);
const isTaskLoading = ref(false);
const isAlertLoading = ref(false);

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true;
  }, 100);

  isTaskLoading.value = true;
  isAlertLoading.value = true;

  setTimeout(() => {
    isTaskLoading.value = false;
    isAlertLoading.value = false;
  }, 500);
});
</script>

<template>
  <div class="min-h-full">
    <NSpace vertical :size="16">
      <HeaderBanner />

      <EnhancedCardData />

      <!-- 第一行：待办事项和系统提醒 -->
      <NGrid :x-gap="gap" :y-gap="16" responsive="screen" item-responsive>
        <NGi span="24 s:24 m:12">
          <NCard :bordered="false" class="card-wrapper" content-class="p-0!">
            <template #header>
              <div class="flex items-center gap-8px">
                <SvgIcon icon="ph:clipboard-text-fill" class="text-18px text-orange-500" />
                <span class="font-semibold">待办事项</span>
                <NBadge :value="pendingTasks.filter(t => t.urgent).length" :max="99" type="error" class="ml-8px" />
              </div>
            </template>
            <template #header-extra>
              <a class="text-14px text-primary" href="javascript:;">查看全部</a>
            </template>

            <div class="filter-tabs">
              <button
                v-for="option in taskCategoryOptions"
                :key="option.key"
                class="filter-tab"
                :class="{ active: activeTaskFilter === option.key }"
                @click="handleTaskFilterChange(option.key as TaskCategory | 'all')"
              >
                <SvgIcon :icon="option.icon" class="text-14px" />
                <span>{{ option.label }}</span>
              </button>
            </div>

            <div class="task-list">
              <div v-if="isTaskLoading" class="loading-container">
                <div class="loading-spinner"></div>
                <span class="text-14px text-gray-400">加载中...</span>
              </div>

              <template v-else>
                <div v-for="task in filteredTasks" :key="task.id" class="task-item" :class="{ urgent: task.urgent }">
                  <div class="task-icon-wrapper" :class="getCategoryInfo(task.category).bg">
                    <SvgIcon
                      :icon="
                        task.category === 'user'
                          ? 'ph:users-fill'
                          : task.category === 'course'
                            ? 'ph:graduation-cap-fill'
                            : task.category === 'system'
                              ? 'ph:gear-fill'
                              : 'ph:check-circle-fill'
                      "
                      class="text-18px"
                      :class="getCategoryInfo(task.category).color"
                    />
                  </div>

                  <div class="task-content">
                    <div class="task-header">
                      <span class="task-category" :class="getCategoryInfo(task.category).color">
                        {{ taskCategoryOptions.find(opt => opt.key === task.category)?.label }}
                      </span>
                      <span v-if="task.urgent" class="urgent-badge">紧急</span>
                    </div>

                    <h4 class="task-title">{{ task.title }}</h4>
                    <p class="task-description">{{ task.description }}</p>

                    <div class="task-meta">
                      <div class="task-progress">
                        <span class="progress-label">进度: {{ task.progress }}%</span>
                        <div class="progress-bar">
                          <div
                            class="progress-fill"
                            :style="{ width: task.progress + '%' }"
                            :class="task.priority === 'high' ? 'high' : task.priority === 'medium' ? 'medium' : 'low'"
                          ></div>
                        </div>
                      </div>

                      <div class="task-footer">
                        <span class="task-assignee">
                          <SvgIcon icon="ph:user-fill" class="text-12px" />
                          {{ task.assignee }}
                        </span>
                        <span class="task-deadline">
                          <SvgIcon icon="ph:calendar-fill" class="text-12px" />
                          {{ task.deadline }}
                        </span>
                        <NTag
                          :type="task.urgent ? 'error' : task.priority === 'high' ? 'warning' : 'default'"
                          size="small"
                        >
                          {{ task.count }}
                        </NTag>
                      </div>
                    </div>
                  </div>

                  <div class="task-arrow">
                    <SvgIcon icon="ph:caret-right" class="text-gray-300" />
                  </div>
                </div>

                <div v-if="filteredTasks.length === 0" class="empty-state">
                  <SvgIcon icon="ph:clipboard-text-fill" class="text-48px text-gray-300" />
                  <span class="mt-8px text-14px text-gray-400">暂无相关任务</span>
                </div>
              </template>
            </div>
          </NCard>
        </NGi>

        <NGi span="24 s:24 m:12">
          <NCard :bordered="false" class="card-wrapper" content-class="p-0!">
            <template #header>
              <div class="flex items-center gap-8px">
                <SvgIcon icon="ph:bell-fill" class="text-18px text-blue-500" />
                <span class="font-semibold">系统提醒</span>
                <NBadge v-if="unreadAlertCount > 0" :value="unreadAlertCount" :max="99" type="error" class="ml-8px" />
              </div>
            </template>
            <template #header-extra>
              <div class="flex items-center gap-8px">
                <NButton v-if="unreadAlertCount > 0" text type="primary" size="small" @click="markAllAlertsAsRead">
                  全部已读
                </NButton>
                <a class="text-14px text-primary" href="javascript:;">查看全部</a>
              </div>
            </template>

            <div class="filter-tabs">
              <div class="filter-tab placeholder">
                <SvgIcon icon="ph:stack-fill" class="text-14px" />
                <span>全部</span>
              </div>
            </div>

            <div class="alert-list">
              <div v-if="isAlertLoading" class="loading-container">
                <div class="loading-spinner"></div>
                <span class="text-14px text-gray-400">加载中...</span>
              </div>

              <template v-else>
                <div
                  v-for="alert in systemAlerts"
                  :key="alert.id"
                  class="alert-item"
                  :class="{ unread: !alert.isRead }"
                  @click="markAlertAsRead(alert.id)"
                >
                  <div class="alert-icon-wrapper" :class="levelColors[alert.level].bg">
                    <SvgIcon
                      :icon="levelColors[alert.level].icon"
                      class="text-18px"
                      :class="levelColors[alert.level].text"
                    />
                  </div>

                  <div class="alert-content">
                    <div class="alert-header">
                      <span class="alert-level" :class="levelColors[alert.level].text">
                        {{ alert.level === 'warning' ? '警告' : alert.level === 'success' ? '成功' : '信息' }}
                      </span>
                      <span v-if="!alert.isRead" class="unread-dot"></span>
                    </div>

                    <h4 class="alert-title">{{ alert.title }}</h4>
                    <p class="alert-description">{{ alert.description }}</p>

                    <div class="alert-footer">
                      <span class="alert-source">
                        <SvgIcon icon="ph:user-fill" class="text-12px" />
                        {{ alert.source }}
                      </span>
                      <span class="alert-time">
                        <SvgIcon icon="ph:clock-fill" class="text-12px" />
                        {{ alert.time }}
                      </span>
                      <NButton v-if="alert.action" text type="primary" size="small">
                        {{ alert.action }}
                      </NButton>
                    </div>
                  </div>

                  <div class="alert-arrow">
                    <SvgIcon icon="ph:caret-right" class="text-gray-300" />
                  </div>
                </div>

                <div v-if="systemAlerts.length === 0" class="empty-state">
                  <SvgIcon icon="ph:bell-fill" class="text-48px text-gray-300" />
                  <span class="mt-8px text-14px text-gray-400">暂无系统提醒</span>
                </div>
              </template>
            </div>
          </NCard>
        </NGi>
      </NGrid>

      <ProjectNews />
    </NSpace>
  </div>
</template>

<style scoped>
.card-wrapper {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-wrapper:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.1);
}

.animate-fade-in {
  animation: fadeIn 0.5s ease forwards;
}

.filter-tabs {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
  overflow-x: auto;
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 16px;
  border: none;
  background: transparent;
  color: #666;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.filter-tab:hover {
  background: #e8e8e8;
  color: #333;
}

.filter-tab.active {
  background: var(--primary-color, #18a058);
  color: white;
}

.filter-tab.placeholder {
  visibility: hidden;
  pointer-events: none;
  padding: 6px 12px;
  margin: 0;
}

.task-list,
.alert-list {
  min-height: 400px;
  max-height: 400px;
  height: 400px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(64, 158, 255, 0.3) transparent;
}

.task-list::-webkit-scrollbar,
.alert-list::-webkit-scrollbar {
  width: 6px;
}

.task-list::-webkit-scrollbar-track,
.alert-list::-webkit-scrollbar-track {
  background: transparent;
}

.task-list::-webkit-scrollbar-thumb,
.alert-list::-webkit-scrollbar-thumb {
  background-color: rgba(64, 158, 255, 0.3);
  border-radius: 3px;
}

.task-list::-webkit-scrollbar-thumb:hover,
.alert-list::-webkit-scrollbar-thumb:hover {
  background-color: rgba(64, 158, 255, 0.5);
}

.task-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  transition: all 0.2s ease;
}

.task-item:hover {
  background: #f8f9fa;
}

.task-item.urgent {
  background: linear-gradient(90deg, rgba(245, 34, 45, 0.05) 0%, transparent 50%);
}

.task-item:last-child {
  border-bottom: none;
}

.task-icon-wrapper,
.alert-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  flex-shrink: 0;
}

.task-content,
.alert-content {
  flex: 1;
  min-width: 0;
}

.task-header,
.alert-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.task-category,
.alert-level {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
}

.task-category[class*='blue'] {
  background: rgba(24, 144, 255, 0.1);
  color: #1890ff;
}

.task-category[class*='green'] {
  background: rgba(82, 196, 26, 0.1);
  color: #52c41a;
}

.task-category[class*='purple'] {
  background: rgba(114, 46, 209, 0.1);
  color: #722ed1;
}

.task-category[class*='orange'] {
  background: rgba(250, 140, 22, 0.1);
  color: #fa8c16;
}

.urgent-badge {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(245, 34, 45, 0.1);
  color: #f5222d;
}

.unread-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #f5222d;
  animation: pulse 2s infinite;
}

.task-title,
.alert-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
  line-height: 1.4;
}

.task-description,
.alert-description {
  font-size: 13px;
  color: #666;
  margin: 0 0 8px 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.task-meta {
  margin-top: 8px;
}

.task-progress {
  margin-bottom: 8px;
}

.progress-label {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
  display: block;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  transition: width 0.3s ease;
  border-radius: 3px;
}

.progress-fill.high {
  background: #f5222d;
}

.progress-fill.medium {
  background: #fa8c16;
}

.progress-fill.low {
  background: #52c41a;
}

.task-footer,
.alert-footer {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 12px;
  color: #999;
  flex-wrap: wrap;
}

.task-assignee,
.task-deadline,
.alert-source,
.alert-time {
  display: flex;
  align-items: center;
  gap: 4px;
}

.task-arrow,
.alert-arrow {
  display: flex;
  align-items: center;
  padding-top: 20px;
}

.alert-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  transition: all 0.2s ease;
}

.alert-item:hover {
  background: #f8f9fa;
}

.alert-item.unread {
  background: linear-gradient(90deg, rgba(24, 160, 88, 0.05) 0%, transparent 50%);
}

.alert-item:last-child {
  border-bottom: none;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  gap: 12px;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f0f0f0;
  border-top-color: #18a058;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
