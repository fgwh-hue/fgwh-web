<script setup lang="tsx">
import { ref } from 'vue';
import { NButton, NTag } from 'naive-ui';
import { useBoolean } from '@sa/hooks';
import { fetchGetAllPages } from '@/service/api';
import { $t } from '@/locales';
import SvgIcon from '@/components/custom/svg-icon.vue';
import MenuGuide from './modules/menu-guide.vue';

const { bool: visible, setTrue: openModal } = useBoolean();

const menuStats = ref({
  total: 156,
  directories: 42,
  menus: 89,
  buttons: 25,
  hidden: 12
});

const menuModules = ref([
  { name: '首页', count: 8, icon: 'ph:house-fill', color: '#18a058' },
  { name: '学生端', count: 35, icon: 'ph:student-fill', color: '#2080f0' },
  { name: '教师端', count: 42, icon: 'ph:chalkboard-teacher-fill', color: '#f0a020' },
  { name: '管理端', count: 48, icon: 'ph:gear-fill', color: '#d03050' },
  { name: '系统设置', count: 23, icon: 'ph:settings-fill', color: '#b8b8b8' }
]);

const quickActions = ref([
  { label: '新增菜单', icon: 'ph:plus-circle-fill', type: 'primary' as const },
  { label: '同步菜单', icon: 'ph:arrows-clockwise', type: 'default' as const },
  { label: '导出配置', icon: 'ph:download-simple', type: 'default' as const }
]);

const allPages = ref<string[]>([]);

async function getAllPages() {
  const { data: pages } = await fetchGetAllPages();
  allPages.value = pages || [];
}

getAllPages();
</script>

<template>
  <div ref="wrapperRef" class="flex-col-stretch gap-16px lt-sm:overflow-auto">
    <NCard :bordered="false" class="card-wrapper">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-18px font-semibold">菜单管理</h2>
          <p class="mt-4px text-gray-500">配置系统菜单结构与路由</p>
        </div>
        <NSpace :size="12">
          <NButton v-for="action in quickActions" :key="action.label" :type="action.type">
            <template #icon><SvgIcon :icon="action.icon" /></template>
            {{ action.label }}
          </NButton>
        </NSpace>
      </div>
    </NCard>

    <NGrid cols="s:1 m:2 l:5" :x-gap="16" :y-gap="16">
      <NGi>
        <NCard :bordered="false" class="card-wrapper">
          <div class="flex items-center gap-12px">
            <div class="size-48px flex-center rd-8px bg-blue-50 dark:bg-blue-900/20">
              <SvgIcon icon="ph:list-dashes" class="text-24px text-blue-500" />
            </div>
            <div>
              <div class="text-12px text-gray-500">菜单总数</div>
              <div class="text-24px font-semibold">{{ menuStats.total }}</div>
            </div>
          </div>
        </NCard>
      </NGi>
      <NGi>
        <NCard :bordered="false" class="card-wrapper">
          <div class="flex items-center gap-12px">
            <div class="size-48px flex-center rd-8px bg-green-50 dark:bg-green-900/20">
              <SvgIcon icon="ph:folder-fill" class="text-24px text-green-500" />
            </div>
            <div>
              <div class="text-12px text-gray-500">目录</div>
              <div class="text-24px font-semibold">{{ menuStats.directories }}</div>
            </div>
          </div>
        </NCard>
      </NGi>
      <NGi>
        <NCard :bordered="false" class="card-wrapper">
          <div class="flex items-center gap-12px">
            <div class="size-48px flex-center rd-8px bg-purple-50 dark:bg-purple-900/20">
              <SvgIcon icon="ph:app-window-fill" class="text-24px text-purple-500" />
            </div>
            <div>
              <div class="text-12px text-gray-500">菜单</div>
              <div class="text-24px font-semibold">{{ menuStats.menus }}</div>
            </div>
          </div>
        </NCard>
      </NGi>
      <NGi>
        <NCard :bordered="false" class="card-wrapper">
          <div class="flex items-center gap-12px">
            <div class="size-48px flex-center rd-8px bg-orange-50 dark:bg-orange-900/20">
              <SvgIcon icon="ph:cursor-click-fill" class="text-24px text-orange-500" />
            </div>
            <div>
              <div class="text-12px text-gray-500">按钮</div>
              <div class="text-24px font-semibold">{{ menuStats.buttons }}</div>
            </div>
          </div>
        </NCard>
      </NGi>
      <NGi>
        <NCard :bordered="false" class="card-wrapper">
          <div class="flex items-center gap-12px">
            <div class="size-48px flex-center rd-8px bg-red-50 dark:bg-red-900/20">
              <SvgIcon icon="ph:eye-slash-fill" class="text-24px text-red-500" />
            </div>
            <div>
              <div class="text-12px text-gray-500">隐藏菜单</div>
              <div class="text-24px font-semibold">{{ menuStats.hidden }}</div>
            </div>
          </div>
        </NCard>
      </NGi>
    </NGrid>

    <NCard :bordered="false" class="menu-stats-card card-wrapper" title="菜单配置统计">
      <div class="menu-stats-container">
        <!-- 左侧：总体统计 -->
        <div class="stats-overview">
          <div class="overview-item">
            <div class="overview-icon bg-primary">
              <SvgIcon icon="ph:folder-fill" class="text-24px" />
            </div>
            <div class="overview-info">
              <div class="overview-value">{{ menuStats.directories }}</div>
              <div class="overview-label">目录总数</div>
            </div>
          </div>
          <div class="overview-item">
            <div class="overview-icon bg-success">
              <SvgIcon icon="ph:list-fill" class="text-24px" />
            </div>
            <div class="overview-info">
              <div class="overview-value">{{ menuStats.menus }}</div>
              <div class="overview-label">菜单总数</div>
            </div>
          </div>
          <div class="overview-item">
            <div class="overview-icon bg-warning">
              <SvgIcon icon="ph:cursor-click-fill" class="text-24px" />
            </div>
            <div class="overview-info">
              <div class="overview-value">{{ menuStats.buttons }}</div>
              <div class="overview-label">按钮总数</div>
            </div>
          </div>
          <div class="overview-item">
            <div class="overview-icon bg-error">
              <SvgIcon icon="ph:eye-slash-fill" class="text-24px" />
            </div>
            <div class="overview-info">
              <div class="overview-value">{{ menuStats.hidden }}</div>
              <div class="overview-label">隐藏菜单</div>
            </div>
          </div>
        </div>

        <!-- 中间：配置进度 -->
        <div class="stats-progress">
          <div class="progress-header">
            <span class="progress-title">配置完成度</span>
            <NTag type="success" size="small">
              {{ Math.round(((menuStats.directories + menuStats.menus + menuStats.buttons) / menuStats.total) * 100) }}%
            </NTag>
          </div>
          <div class="progress-list">
            <div class="progress-item">
              <div class="progress-info">
                <span class="progress-name">目录配置</span>
                <span class="progress-value">40/42</span>
              </div>
              <NProgress type="line" :percentage="95" :show-indicator="false" :height="8" />
            </div>
            <div class="progress-item">
              <div class="progress-info">
                <span class="progress-name">菜单配置</span>
                <span class="progress-value">78/89</span>
              </div>
              <NProgress type="line" :percentage="88" status="success" :show-indicator="false" :height="8" />
            </div>
            <div class="progress-item">
              <div class="progress-info">
                <span class="progress-name">按钮配置</span>
                <span class="progress-value">18/25</span>
              </div>
              <NProgress type="line" :percentage="72" status="warning" :show-indicator="false" :height="8" />
            </div>
          </div>
        </div>

        <!-- 右侧：模块分布 -->
        <div class="stats-modules">
          <div class="modules-header">
            <span class="modules-title">模块分布</span>
            <span class="modules-total">共 {{ menuModules.reduce((sum, m) => sum + m.count, 0) }} 个</span>
          </div>
          <div class="modules-list">
            <div v-for="mod in menuModules" :key="mod.name" class="module-item">
              <div class="module-info">
                <div class="module-icon" :style="{ backgroundColor: mod.color + '20' }">
                  <SvgIcon :icon="mod.icon" class="text-16px" :style="{ color: mod.color }" />
                </div>
                <span class="module-name">{{ mod.name }}</span>
              </div>
              <div class="module-bar">
                <div
                  class="module-fill"
                  :style="{ width: (mod.count / 48) * 100 + '%', backgroundColor: mod.color }"
                ></div>
              </div>
              <span class="module-count">{{ mod.count }}</span>
            </div>
          </div>
        </div>
      </div>
    </NCard>

    <NCard :bordered="false" class="card-wrapper" title="模块菜单分布">
      <NGrid cols="s:1 m:5" :x-gap="16" :y-gap="16">
        <NGi v-for="mod in menuModules" :key="mod.name">
          <div
            class="flex cursor-pointer items-center gap-12px rd-8px bg-gray-50 p-12px dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <div class="size-40px flex-center rd-8px" :style="{ backgroundColor: mod.color + '20' }">
              <SvgIcon :icon="mod.icon" class="text-20px" :style="{ color: mod.color }" />
            </div>
            <div>
              <div class="text-14px">{{ mod.name }}</div>
              <div class="text-12px text-gray-500">{{ mod.count }} 个菜单</div>
            </div>
          </div>
        </NGi>
      </NGrid>
    </NCard>

    <!-- 菜单指南和最佳实践 -->
    <MenuGuide />
  </div>
</template>

<style scoped>
/* 菜单配置统计区域样式 */
.menu-stats-card :deep(.n-card__content) {
  padding: 16px;
}

.menu-stats-container {
  display: grid;
  grid-template-columns: 280px 1fr 320px;
  gap: 24px;
  min-height: 280px;
}

/* 路由配置面板样式 */
.route-config-panel {
  display: flex;
  flex-direction: column;
  gap: 0;
  height: 100%;
  overflow-y: auto;
  padding: 4px;
}

.config-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

/* 文件路径列表 */
.file-path-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.file-path-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  transition: all 0.2s ease;
}

.file-path-item:hover {
  background: #f0f1f2;
  border-color: #d0d0d0;
  transform: translateX(4px);
}

.path-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}

.path-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.path-code {
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  color: #2080f0;
  background: #eff6ff;
  padding: 2px 8px;
  border-radius: 4px;
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.path-desc {
  font-size: 12px;
  color: #666;
  line-height: 1.4;
}

/* Meta 字段表格 */
.meta-table {
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: #e8e8e8;
  border-radius: 8px;
  overflow: hidden;
}

.meta-row {
  display: grid;
  grid-template-columns: 140px 100px 1fr;
  gap: 12px;
  align-items: center;
  padding: 10px 12px;
  background: #fff;
}

.meta-header {
  background: #f8f9fa;
  font-weight: 600;
  font-size: 13px;
  color: #333;
}

.meta-name {
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  color: #9333ea;
  background: #fdf4ff;
  padding: 2px 8px;
  border-radius: 4px;
}

.meta-desc {
  font-size: 13px;
  color: #666;
  line-height: 1.4;
}

/* 图标示例 */
.icon-examples {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.icon-example-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  transition: all 0.2s ease;
}

.icon-example-item:hover {
  background: #f0f1f2;
  border-color: #d0d0d0;
}

.example-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  flex-shrink: 0;
}

.example-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.example-label {
  font-size: 13px;
  font-weight: 500;
  color: #333;
}

.example-code {
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 12px;
  color: #666;
  background: #fff;
  padding: 2px 6px;
  border-radius: 3px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 左侧：总体统计 */
.stats-overview {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.overview-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.overview-item:hover {
  background: #e8e9ea;
  transform: translateY(-2px);
}

.overview-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 10px;
  color: white;
}

.bg-primary {
  background: linear-gradient(135deg, #18a058 0%, #36ad6a 100%);
}

.bg-success {
  background: linear-gradient(135deg, #2080f0 0%, #4098f7 100%);
}

.bg-warning {
  background: linear-gradient(135deg, #f0a020 0%, #f5b041 100%);
}

.bg-error {
  background: linear-gradient(135deg, #d03050 0%, #e85a71 100%);
}

.overview-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.overview-value {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  line-height: 1;
}

.overview-label {
  font-size: 13px;
  color: #666;
}

/* 中间：配置进度 */
.stats-progress {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.progress-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12px;
  border-bottom: 1px solid #e8e8e8;
}

.progress-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.progress-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
  justify-content: center;
}

.progress-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.progress-name {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.progress-value {
  font-size: 14px;
  color: #666;
  font-weight: 600;
}

/* 右侧：模块分布 */
.stats-modules {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.modules-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12px;
  border-bottom: 1px solid #e8e8e8;
}

.modules-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.modules-total {
  font-size: 13px;
  color: #666;
}

.modules-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  justify-content: center;
}

.module-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.module-info {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100px;
  flex-shrink: 0;
}

.module-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
}

.module-name {
  font-size: 13px;
  color: #333;
  font-weight: 500;
}

.module-bar {
  flex: 1;
  height: 8px;
  background: #e8e8e8;
  border-radius: 4px;
  overflow: hidden;
}

.module-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
}

.module-count {
  width: 32px;
  text-align: right;
  font-size: 13px;
  color: #666;
  font-weight: 600;
}

/* 响应式布局 */
@media (max-width: 1200px) {
  .menu-stats-container {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .stats-overview {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 768px) {
  .stats-overview {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
