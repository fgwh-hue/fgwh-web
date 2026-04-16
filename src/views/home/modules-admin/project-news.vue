<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

defineOptions({
  name: 'AdminProjectNews'
});

type NewsCategory = 'system' | 'course' | 'user' | 'notice';
type NewsLevel = 'info' | 'warning' | 'success';

interface NewsItem {
  id: number;
  category: NewsCategory;
  level: NewsLevel;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  source?: string;
}

const newses = ref<NewsItem[]>([
  {
    id: 1,
    category: 'system',
    level: 'success',
    title: '系统安全补丁已更新',
    description: '最新安全补丁V2.5.1已部署完成，修复了3个高危漏洞',
    time: '10分钟前',
    isRead: false,
    source: '系统管理员'
  },
  {
    id: 2,
    category: 'course',
    level: 'info',
    title: '新增课程审核通过 5 门',
    description: '《机器学习基础》《Web开发实战》等5门课程已通过审核',
    time: '30分钟前',
    isRead: false,
    source: '课程管理'
  },
  {
    id: 3,
    category: 'user',
    level: 'info',
    title: '新用户注册申请',
    description: '收到 12 条新用户注册申请，待审核',
    time: '1小时前',
    isRead: true,
    source: '用户管理'
  },
  {
    id: 4,
    category: 'system',
    level: 'success',
    title: '数据库备份完成',
    description: '自动备份已成功执行，备份文件大小 2.3GB',
    time: '2小时前',
    isRead: true,
    source: '运维中心'
  },
  {
    id: 5,
    category: 'notice',
    level: 'warning',
    title: '系统维护通知',
    description: '将于本周六 02:00-06:00 进行系统维护，请提前做好准备',
    time: '3小时前',
    isRead: false,
    source: '系统公告'
  },
  {
    id: 6,
    category: 'course',
    level: 'info',
    title: '课程内容更新',
    description: '《Python数据分析》课程新增第8-12章内容',
    time: '5小时前',
    isRead: true,
    source: '课程管理'
  },
  {
    id: 7,
    category: 'user',
    level: 'warning',
    title: '异常登录提醒',
    description: '检测到用户 teacher01 在异常地点登录，已自动锁定账号',
    time: '6小时前',
    isRead: false,
    source: '安全中心'
  },
  {
    id: 8,
    category: 'system',
    level: 'success',
    title: '系统性能优化完成',
    description: 'CPU使用率降低40%，页面加载速度提升60%',
    time: '1天前',
    isRead: true,
    source: '运维中心'
  }
]);

const activeFilter = ref<NewsCategory | 'all'>('all');

const filteredNews = computed(() => {
  if (activeFilter.value === 'all') {
    return newses.value;
  }
  return newses.value.filter(news => news.category === activeFilter.value);
});

const unreadCount = computed(() => newses.value.filter(n => !n.isRead).length);

const categoryOptions = [
  { key: 'all', label: '全部', icon: 'ph:stack-fill' },
  { key: 'system', label: '系统', icon: 'ph:gear-fill' },
  { key: 'course', label: '课程', icon: 'ph:graduation-cap-fill' },
  { key: 'user', label: '用户', icon: 'ph:users-fill' },
  { key: 'notice', label: '公告', icon: 'ph:megaphone-fill' }
];

const levelColors = {
  info: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-500', icon: 'ph:info-fill' },
  warning: { bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-500', icon: 'ph:warning-fill' },
  success: { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-500', icon: 'ph:check-circle-fill' }
};

function getCategoryInfo(category: NewsCategory) {
  const info = {
    system: { label: '系统', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    course: { label: '课程', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    user: { label: '用户', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
    notice: { label: '公告', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' }
  };
  return info[category];
}

function markAsRead(id: number) {
  const news = newses.value.find(n => n.id === id);
  if (news) {
    news.isRead = true;
  }
}

function markAllAsRead() {
  newses.value.forEach(news => {
    news.isRead = true;
  });
}

function handleFilterChange(category: NewsCategory | 'all') {
  activeFilter.value = category;
}

const isLoading = ref(false);

onMounted(() => {
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
  }, 500);
});
</script>

<template>
  <NCard :bordered="false" class="card-wrapper" content-class="p-0!">
    <template #header>
      <div class="flex items-center gap-12px">
        <SvgIcon icon="ph:pulse-fill" class="text-20px text-primary" />
        <span class="font-semibold">系统动态</span>
        <NBadge v-if="unreadCount > 0" :value="unreadCount" :max="99" type="error" class="ml-8px" />
      </div>
    </template>
    <template #header-extra>
      <div class="flex items-center gap-8px">
        <NButton v-if="unreadCount > 0" text type="primary" size="small" @click="markAllAsRead">全部已读</NButton>
        <a class="text-14px text-primary" href="javascript:;">查看更多</a>
      </div>
    </template>

    <div class="filter-tabs">
      <button
        v-for="option in categoryOptions"
        :key="option.key"
        class="filter-tab"
        :class="{ active: activeFilter === option.key }"
        @click="handleFilterChange(option.key as NewsCategory | 'all')"
      >
        <SvgIcon :icon="option.icon" class="text-14px" />
        <span>{{ option.label }}</span>
      </button>
    </div>

    <div class="news-list">
      <div v-if="isLoading" class="loading-container">
        <div class="loading-spinner"></div>
        <span class="text-14px text-gray-400">加载中...</span>
      </div>

      <template v-else>
        <div
          v-for="news in filteredNews"
          :key="news.id"
          class="news-item"
          :class="{ unread: !news.isRead }"
          @click="markAsRead(news.id)"
        >
          <div class="news-icon-wrapper" :class="levelColors[news.level].bg">
            <SvgIcon :icon="levelColors[news.level].icon" class="text-18px" :class="levelColors[news.level].text" />
          </div>

          <div class="news-content">
            <div class="news-header">
              <span class="news-category" :class="getCategoryInfo(news.category).color">
                {{ getCategoryInfo(news.category).label }}
              </span>
              <span v-if="!news.isRead" class="unread-dot"></span>
            </div>

            <h4 class="news-title">{{ news.title }}</h4>
            <p class="news-description">{{ news.description }}</p>

            <div class="news-footer">
              <span class="news-source">
                <SvgIcon icon="ph:user-fill" class="text-12px" />
                {{ news.source }}
              </span>
              <span class="news-time">
                <SvgIcon icon="ph:clock-fill" class="text-12px" />
                {{ news.time }}
              </span>
            </div>
          </div>

          <div class="news-arrow">
            <SvgIcon icon="ph:caret-right" class="text-gray-300" />
          </div>
        </div>

        <div v-if="filteredNews.length === 0" class="empty-state">
          <SvgIcon icon="ph:tray-fill" class="text-48px text-gray-300" />
          <span class="mt-8px text-14px text-gray-400">暂无相关动态</span>
        </div>
      </template>
    </div>
  </NCard>
</template>

<style scoped>
.card-wrapper {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-wrapper:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.1);
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

.news-list {
  max-height: 400px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(64, 158, 255, 0.3) transparent;
}

.news-list::-webkit-scrollbar {
  width: 6px;
}

.news-list::-webkit-scrollbar-track {
  background: transparent;
}

.news-list::-webkit-scrollbar-thumb {
  background-color: rgba(64, 158, 255, 0.3);
  border-radius: 3px;
}

.news-list::-webkit-scrollbar-thumb:hover {
  background-color: rgba(64, 158, 255, 0.5);
}

.news-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  transition: all 0.2s ease;
}

.news-item:hover {
  background: #f8f9fa;
}

.news-item.unread {
  background: linear-gradient(90deg, rgba(24, 160, 88, 0.05) 0%, transparent 50%);
}

.news-item:last-child {
  border-bottom: none;
}

.news-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  flex-shrink: 0;
}

.news-content {
  flex: 1;
  min-width: 0;
}

.news-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.news-category {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
  background: currentColor;
  color: inherit;
}

.news-category[class*='purple'] {
  background: rgba(114, 46, 209, 0.1);
  color: #722ed1;
}

.news-category[class*='blue'] {
  background: rgba(24, 144, 255, 0.1);
  color: #1890ff;
}

.news-category[class*='green'] {
  background: rgba(82, 196, 26, 0.1);
  color: #52c41a;
}

.news-category[class*='orange'] {
  background: rgba(250, 140, 22, 0.1);
  color: #fa8c16;
}

.unread-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #f5222d;
  animation: pulse 2s infinite;
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

.news-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
  line-height: 1.4;
}

.news-description {
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

.news-footer {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 12px;
  color: #999;
}

.news-source,
.news-time {
  display: flex;
  align-items: center;
  gap: 4px;
}

.news-arrow {
  display: flex;
  align-items: center;
  padding-top: 20px;
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

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
}
</style>
