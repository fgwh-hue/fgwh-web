<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

defineOptions({
  name: 'SystemMonitor'
});

interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  uptime: string;
}

interface ServiceStatus {
  name: string;
  status: 'online' | 'offline' | 'degraded';
  responseTime: number;
  uptime: string;
  requests: number;
  errorRate: number;
}

interface ApiMetrics {
  name: string;
  requests: number;
  avgResponseTime: number;
  errorRate: number;
  peakTime: string;
}

interface OnlineUser {
  id: number;
  username: string;
  role: string;
  loginTime: string;
  ip: string;
  lastActivity: string;
  duration: string;
}

interface AlertEvent {
  id: number;
  level: 'info' | 'warning' | 'error';
  message: string;
  time: string;
}

interface ResourceTrend {
  time: string;
  cpu: number;
  memory: number;
  network: number;
  disk: number;
}

interface ProcessInfo {
  name: string;
  cpu: number;
  memory: number;
  threads: number;
  status: 'running' | 'sleeping' | 'zombie';
}

const currentTime = ref(new Date().toLocaleString());

const systemMetrics = ref<SystemMetrics>({
  cpu: 42,
  memory: 68,
  disk: 45,
  network: 32,
  uptime: '15天 8小时 23分钟'
});

const services = ref<ServiceStatus[]>([
  { name: 'Web服务', status: 'online', responseTime: 23, uptime: '15天 8小时', requests: 125600, errorRate: 0.12 },
  { name: '数据库', status: 'online', responseTime: 12, uptime: '15天 8小时', requests: 89600, errorRate: 0.08 },
  { name: '缓存服务', status: 'online', responseTime: 5, uptime: '15天 8小时', requests: 45600, errorRate: 0.02 },
  { name: 'AI模型服务', status: 'online', responseTime: 156, uptime: '2天 3小时', requests: 3250, errorRate: 1.25 },
  { name: '文件存储', status: 'online', responseTime: 28, uptime: '15天 8小时', requests: 12400, errorRate: 0.15 },
  { name: '消息队列', status: 'degraded', responseTime: 89, uptime: '6小时 12分钟', requests: 8900, errorRate: 0.45 }
]);

const apiMetrics = ref<ApiMetrics[]>([
  { name: '用户登录', requests: 12560, avgResponseTime: 45, errorRate: 0.12, peakTime: '09:00' },
  { name: '课程查询', requests: 8960, avgResponseTime: 32, errorRate: 0.08, peakTime: '10:30' },
  { name: '作业提交', requests: 4520, avgResponseTime: 156, errorRate: 0.25, peakTime: '14:00' },
  { name: 'AI问答', requests: 3250, avgResponseTime: 890, errorRate: 1.25, peakTime: '15:30' },
  { name: '数据统计', requests: 2100, avgResponseTime: 280, errorRate: 0.45, peakTime: '16:00' }
]);

const onlineUsers = ref<OnlineUser[]>([
  {
    id: 1,
    username: '张三',
    role: '学生',
    loginTime: '2024-01-15 09:23',
    ip: '192.168.1.101',
    lastActivity: '课程学习',
    duration: '2小时32分'
  },
  {
    id: 2,
    username: '李老师',
    role: '教师',
    loginTime: '2024-01-15 08:30',
    ip: '192.168.1.102',
    lastActivity: '作业批改',
    duration: '3小时15分'
  },
  {
    id: 3,
    username: '王同学',
    role: '学生',
    loginTime: '2024-01-15 10:15',
    ip: '192.168.1.103',
    lastActivity: 'AI助教',
    duration: '1小时20分'
  },
  {
    id: 4,
    username: '赵管理员',
    role: '管理员',
    loginTime: '2024-01-15 08:00',
    ip: '192.168.1.100',
    lastActivity: '系统管理',
    duration: '3小时45分'
  },
  {
    id: 5,
    username: '孙同学',
    role: '学生',
    loginTime: '2024-01-15 11:20',
    ip: '192.168.1.105',
    lastActivity: '视频观看',
    duration: '25分'
  }
]);

const alertEvents = ref<AlertEvent[]>([
  { id: 1, level: 'warning', message: '消息队列响应时间过高', time: '2024-01-15 11:30' },
  { id: 2, level: 'info', message: 'AI模型服务自动重启完成', time: '2024-01-15 10:15' },
  { id: 3, level: 'error', message: '数据库连接池接近上限', time: '2024-01-15 09:45' },
  { id: 4, level: 'warning', message: '内存使用率达到70%', time: '2024-01-15 09:00' }
]);

const resourceTrends = ref<ResourceTrend[]>([
  { time: '00:00', cpu: 35, memory: 58, network: 28, disk: 42 },
  { time: '04:00', cpu: 28, memory: 55, network: 18, disk: 43 },
  { time: '08:00', cpu: 52, memory: 68, network: 45, disk: 44 },
  { time: '12:00', cpu: 68, memory: 75, network: 62, disk: 45 },
  { time: '16:00', cpu: 72, memory: 78, network: 58, disk: 46 },
  { time: '20:00', cpu: 45, memory: 65, network: 38, disk: 47 }
]);

const topProcesses = ref<ProcessInfo[]>([
  { name: 'nginx', cpu: 12.5, memory: 8.2, threads: 8, status: 'running' },
  { name: 'postgres', cpu: 8.3, memory: 15.6, threads: 24, status: 'running' },
  { name: 'redis-server', cpu: 2.1, memory: 4.8, threads: 4, status: 'running' },
  { name: 'node', cpu: 15.8, memory: 12.4, threads: 16, status: 'running' },
  { name: 'python3', cpu: 6.2, memory: 9.1, threads: 12, status: 'sleeping' }
]);

function getStatusColor(status: ServiceStatus['status']) {
  if (status === 'online') return 'success';
  if (status === 'degraded') return 'warning';
  return 'error';
}

function getStatusText(status: ServiceStatus['status']) {
  if (status === 'online') return '正常';
  if (status === 'degraded') return '降级';
  return '离线';
}

function getRoleTagType(role: string) {
  if (role === '管理员') return 'error';
  if (role === '教师') return 'warning';
  return 'primary';
}

function getAlertLevelType(level: AlertEvent['level']) {
  if (level === 'error') return 'error';
  if (level === 'warning') return 'warning';
  return 'info';
}

function getProcessStatusType(status: ProcessInfo['status']) {
  if (status === 'running') return 'success';
  if (status === 'zombie') return 'error';
  return 'warning';
}

function getProcessStatusText(status: ProcessInfo['status']) {
  if (status === 'running') return '运行';
  if (status === 'zombie') return '僵尸';
  return '休眠';
}

let timer: number;

onMounted(() => {
  timer = window.setInterval(() => {
    currentTime.value = new Date().toLocaleString();
    systemMetrics.value = {
      cpu: Math.round(30 + Math.random() * 30),
      memory: Math.round(60 + Math.random() * 20),
      disk: Math.round(40 + Math.random() * 10),
      network: Math.round(20 + Math.random() * 40),
      uptime: '15天 8小时 23分钟'
    };
  }, 3000);
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<template>
  <div class="system-monitor">
    <NSpace vertical :size="16">
      <NCard :bordered="false" class="card-wrapper">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-18px font-semibold">系统监控中心</h2>
            <p class="mt-4px text-gray-500">实时监控系统运行状态与性能指标</p>
          </div>
          <NSpace align="center" :size="12">
            <NButton>
              <template #icon>
                <SvgIcon icon="ph:arrows-clockwise" />
              </template>
              刷新
            </NButton>
            <NButton>
              <template #icon>
                <SvgIcon icon="ph:download-simple" />
              </template>
              导出报告
            </NButton>
            <NTag type="success" :bordered="false">
              <template #icon>
                <SvgIcon icon="ph:circle-fill" class="animate-pulse" />
              </template>
              系统在线
            </NTag>
            <span class="text-gray-500">{{ currentTime }}</span>
          </NSpace>
        </div>
      </NCard>

      <NGrid cols="s:1 m:2 l:4" :x-gap="16" :y-gap="16">
        <NGi>
          <NCard :bordered="false" class="card-wrapper">
            <div class="flex items-center gap-12px">
              <div class="size-48px flex-center rd-8px bg-red-50 dark:bg-red-900/20">
                <SvgIcon icon="ph:cpu-fill" class="text-24px text-red-500" />
              </div>
              <div>
                <div class="text-12px text-gray-500">CPU 使用率</div>
                <div class="text-24px font-semibold">{{ systemMetrics.cpu }}%</div>
                <NProgress
                  type="line"
                  :percentage="systemMetrics.cpu"
                  indicator-placement="inside"
                  :status="systemMetrics.cpu > 80 ? 'error' : 'success'"
                />
              </div>
            </div>
          </NCard>
        </NGi>
        <NGi>
          <NCard :bordered="false" class="card-wrapper">
            <div class="flex items-center gap-12px">
              <div class="size-48px flex-center rd-8px bg-purple-50 dark:bg-purple-900/20">
                <SvgIcon icon="ph:memory-fill" class="text-24px text-purple-500" />
              </div>
              <div>
                <div class="text-12px text-gray-500">内存使用率</div>
                <div class="text-24px font-semibold">{{ systemMetrics.memory }}%</div>
                <NProgress
                  type="line"
                  :percentage="systemMetrics.memory"
                  indicator-placement="inside"
                  :status="systemMetrics.memory > 80 ? 'error' : 'warning'"
                />
              </div>
            </div>
          </NCard>
        </NGi>
        <NGi>
          <NCard :bordered="false" class="card-wrapper">
            <div class="flex items-center gap-12px">
              <div class="size-48px flex-center rd-8px bg-blue-50 dark:bg-blue-900/20">
                <SvgIcon icon="ph:hard-drives-fill" class="text-24px text-blue-500" />
              </div>
              <div>
                <div class="text-12px text-gray-500">磁盘使用率</div>
                <div class="text-24px font-semibold">{{ systemMetrics.disk }}%</div>
                <NProgress
                  type="line"
                  :percentage="systemMetrics.disk"
                  indicator-placement="inside"
                  :status="systemMetrics.disk > 90 ? 'error' : 'info'"
                />
              </div>
            </div>
          </NCard>
        </NGi>
        <NGi>
          <NCard :bordered="false" class="card-wrapper">
            <div class="flex items-center gap-12px">
              <div class="size-48px flex-center rd-8px bg-green-50 dark:bg-green-900/20">
                <SvgIcon icon="ph:network-fill" class="text-24px text-green-500" />
              </div>
              <div>
                <div class="text-12px text-gray-500">网络带宽</div>
                <div class="text-24px font-semibold">{{ systemMetrics.network }}%</div>
                <NProgress
                  type="line"
                  :percentage="systemMetrics.network"
                  indicator-placement="inside"
                  :status="systemMetrics.network > 90 ? 'error' : 'success'"
                />
              </div>
            </div>
          </NCard>
        </NGi>
      </NGrid>

      <NGrid :x-gap="16" :y-gap="16" responsive="screen" item-responsive>
        <NGi span="24 s:24 m:12">
          <NCard :bordered="false" class="h-520px overflow-hidden card-wrapper" title="服务状态">
            <template #header-extra>
              <NTag type="primary" :bordered="false">
                {{ services.filter(s => s.status === 'online').length }}/{{ services.length }} 在线
              </NTag>
            </template>
            <div class="h-full flex flex-col overflow-hidden">
              <NTable :bordered="false" size="small" class="flex-1">
                <thead>
                  <tr>
                    <th>服务名称</th>
                    <th>状态</th>
                    <th>响应时间</th>
                    <th>请求数</th>
                    <th>错误率</th>
                    <th>运行时间</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="service in services" :key="service.name">
                    <td>
                      <div class="flex items-center gap-8px">
                        <SvgIcon
                          icon="ph:cloud-fill"
                          class="text-16px"
                          :class="
                            getStatusColor(service.status) === 'success'
                              ? 'text-green-500'
                              : getStatusColor(service.status) === 'warning'
                                ? 'text-yellow-500'
                                : 'text-red-500'
                          "
                        />
                        {{ service.name }}
                      </div>
                    </td>
                    <td>
                      <NTag :type="getStatusColor(service.status)" size="small">
                        {{ getStatusText(service.status) }}
                      </NTag>
                    </td>
                    <td>{{ service.responseTime }} ms</td>
                    <td>{{ service.requests.toLocaleString() }}</td>
                    <td>
                      <NTag :type="service.errorRate > 1 ? 'error' : 'success'" size="small">
                        {{ service.errorRate }}%
                      </NTag>
                    </td>
                    <td>{{ service.uptime }}</td>
                  </tr>
                </tbody>
              </NTable>
            </div>
          </NCard>
        </NGi>
        <NGi span="24 s:24 m:12">
          <NCard :bordered="false" class="h-520px overflow-hidden card-wrapper" title="API性能">
            <template #header-extra>
              <NTag type="primary" :bordered="false">
                {{ apiMetrics.reduce((a, b) => a + b.requests, 0).toLocaleString() }} 总请求
              </NTag>
            </template>
            <div class="h-full flex flex-col overflow-hidden">
              <NTable :bordered="false" size="small" class="flex-1">
                <thead>
                  <tr>
                    <th>接口名称</th>
                    <th>请求数</th>
                    <th>平均响应</th>
                    <th>错误率</th>
                    <th>峰值时间</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="api in apiMetrics" :key="api.name">
                    <td>{{ api.name }}</td>
                    <td>{{ api.requests.toLocaleString() }}</td>
                    <td>{{ api.avgResponseTime }} ms</td>
                    <td>
                      <NTag :type="api.errorRate > 1 ? 'error' : 'success'" size="small">{{ api.errorRate }}%</NTag>
                    </td>
                    <td>{{ api.peakTime }}</td>
                  </tr>
                </tbody>
              </NTable>
            </div>
          </NCard>
        </NGi>
      </NGrid>

      <NCard :bordered="false" class="h-520px card-wrapper" title="系统资源趋势">
        <template #header-extra>
          <NSpace :size="8">
            <NTag type="primary" :bordered="false">
              <template #icon>
                <SvgIcon icon="ph:trend-up" />
              </template>
              24 小时趋势
            </NTag>
            <NButton size="small" quaternary>
              <template #icon>
                <SvgIcon icon="ph:arrows-clockwise" />
              </template>
            </NButton>
          </NSpace>
        </template>
        <div class="h-full flex flex-col">
          <div class="grid grid-cols-4 mb-12px flex-shrink-0 gap-12px">
            <div class="trend-indicator">
              <div class="trend-icon bg-red-50 dark:bg-red-900/20">
                <SvgIcon icon="ph:cpu-fill" class="text-red-500" />
              </div>
              <div class="trend-info">
                <div class="trend-label">CPU 平均</div>
                <div class="trend-value text-red-500">50.0%</div>
                <div class="trend-change text-red-500">
                  <SvgIcon icon="ph:arrow-up-right" />
                  +12.5%
                </div>
              </div>
            </div>
            <div class="trend-indicator">
              <div class="trend-icon bg-purple-50 dark:bg-purple-900/20">
                <SvgIcon icon="ph:memory-fill" class="text-purple-500" />
              </div>
              <div class="trend-info">
                <div class="trend-label">内存平均</div>
                <div class="trend-value text-purple-500">66.5%</div>
                <div class="trend-change text-purple-500">
                  <SvgIcon icon="ph:arrow-up-right" />
                  +8.3%
                </div>
              </div>
            </div>
            <div class="trend-indicator">
              <div class="trend-icon bg-blue-50 dark:bg-blue-900/20">
                <SvgIcon icon="ph:network-fill" class="text-blue-500" />
              </div>
              <div class="trend-info">
                <div class="trend-label">网络峰值</div>
                <div class="trend-value text-blue-500">62%</div>
                <div class="trend-change text-blue-500">
                  <SvgIcon icon="ph:arrow-down-right" />
                  -5.2%
                </div>
              </div>
            </div>
            <div class="trend-indicator">
              <div class="trend-icon bg-orange-50 dark:bg-orange-900/20">
                <SvgIcon icon="ph:hard-drives-fill" class="text-orange-500" />
              </div>
              <div class="trend-info">
                <div class="trend-label">磁盘使用</div>
                <div class="trend-value text-orange-500">45%</div>
                <div class="trend-change text-green-500">
                  <SvgIcon icon="ph:arrow-down-right" />
                  +1.2%
                </div>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-2 min-h-0 flex-1 gap-12px">
            <div class="trend-chart">
              <div v-for="(trend, index) in resourceTrends" :key="index" class="chart-bar">
                <div class="bar-group">
                  <div class="bar-segment bar-cpu" :style="{ height: `${trend.cpu}%` }"></div>
                  <div class="bar-segment bar-memory" :style="{ height: `${trend.memory}%` }"></div>
                </div>
                <div class="bar-label">{{ trend.time }}</div>
              </div>
            </div>
            <div class="process-list">
              <div class="process-header">
                <span>进程名称</span>
                <span>CPU</span>
                <span>内存</span>
                <span>状态</span>
              </div>
              <div class="flex-1 overflow-y-auto">
                <div v-for="process in topProcesses" :key="process.name" class="process-item">
                  <div class="process-name">
                    <SvgIcon icon="ph:terminal-window" class="mr-8px text-gray-400" />
                    {{ process.name }}
                  </div>
                  <div class="process-metric">
                    <NProgress
                      type="line"
                      :percentage="process.cpu"
                      :status="process.cpu > 10 ? 'error' : 'success'"
                      :show-indicator="false"
                      class="w-64px"
                    />
                  </div>
                  <div class="process-metric">
                    <NProgress
                      type="line"
                      :percentage="process.memory"
                      :status="process.memory > 10 ? 'warning' : 'success'"
                      :show-indicator="false"
                      class="w-64px"
                    />
                  </div>
                  <div class="process-status">
                    <NTag :type="getProcessStatusType(process.status)" size="small" :bordered="false">
                      {{ getProcessStatusText(process.status) }}
                    </NTag>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </NCard>

      <NGrid :x-gap="16" :y-gap="16" responsive="screen" item-responsive>
        <NGi span="24 s:24 m:12">
          <NCard :bordered="false" class="h-400px card-wrapper" title="在线用户">
            <template #header-extra>
              <NTag type="primary" :bordered="false">{{ onlineUsers.length }} 人在线</NTag>
            </template>
            <div class="h-full flex flex-col">
              <NTable :bordered="false" size="small" class="flex-1">
                <thead>
                  <tr>
                    <th>用户名</th>
                    <th>角色</th>
                    <th>登录时间</th>
                    <th>在线时长</th>
                    <th>IP地址</th>
                    <th>最后活动</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in onlineUsers" :key="user.id">
                    <td>{{ user.username }}</td>
                    <td>
                      <NTag :type="getRoleTagType(user.role)" size="small">
                        {{ user.role }}
                      </NTag>
                    </td>
                    <td>{{ user.loginTime }}</td>
                    <td>{{ user.duration }}</td>
                    <td>{{ user.ip }}</td>
                    <td>{{ user.lastActivity }}</td>
                  </tr>
                </tbody>
              </NTable>
            </div>
          </NCard>
        </NGi>
        <NGi span="24 s:24 m:12">
          <NCard :bordered="false" class="h-400px card-wrapper" title="告警事件">
            <template #header-extra>
              <NTag type="error" :bordered="false">{{ alertEvents.filter(a => a.level === 'error').length }} 严重</NTag>
            </template>
            <div class="h-full flex flex-col overflow-hidden">
              <NTable :bordered="false" size="small" class="flex-1">
                <thead>
                  <tr>
                    <th>级别</th>
                    <th>消息</th>
                    <th>时间</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="alert in alertEvents" :key="alert.id">
                    <td>
                      <NTag :type="getAlertLevelType(alert.level)" size="small">
                        {{ alert.level === 'error' ? '错误' : alert.level === 'warning' ? '警告' : '信息' }}
                      </NTag>
                    </td>
                    <td>{{ alert.message }}</td>
                    <td class="text-gray-500">{{ alert.time }}</td>
                  </tr>
                </tbody>
              </NTable>
            </div>
          </NCard>
        </NGi>
      </NGrid>
    </NSpace>
  </div>
</template>

<style scoped>
.system-monitor :deep(.n-card) {
  --n-color: var(--n-color);
}

.system-monitor :deep(.n-card .n-card__content) {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.system-monitor :deep(.n-data-table) {
  font-size: 13px;
  flex: 1;
}

.system-monitor :deep(.n-data-table-th) {
  flex-shrink: 0;
}

.system-monitor :deep(.n-data-table-tr) {
  flex-shrink: 0;
}

.system-monitor :deep(.n-data-table-tbody) {
  flex: 1;
}

.system-monitor :deep(.n-data-table th) {
  font-weight: 600;
  color: #374151;
  padding: 10px 8px;
}

.system-monitor :deep(.n-data-table td) {
  padding: 8px;
  vertical-align: middle;
}

.system-monitor :deep(.n-tag) {
  font-weight: 500;
}

.h-520px {
  height: 520px;
}

.h-320px {
  height: 320px;
}

.metric-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px;
  border-radius: 8px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  border-color: #d1d5db;
}

.metric-label {
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
  line-height: 1.4;
}

.metric-value {
  font-size: 18px;
  font-weight: 600;
  line-height: 1.3;
  word-break: break-all;
}

.dark .metric-card {
  background: #1f2937;
  border-color: #374151;
}

.dark .metric-label {
  color: #9ca3af;
}

.dark .metric-value {
  color: #f3f4f6;
}

.h-400px {
  height: 400px;
}

.trend-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 10px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 0;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.trend-indicator::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.trend-indicator:hover::before {
  opacity: 1;
}

.trend-indicator:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.1);
  border-color: #d1d5db;
}

.trend-indicator:active {
  transform: translateY(-2px) scale(0.98);
}

.trend-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  flex-shrink: 0;
}

.trend-icon svg {
  width: 18px;
  height: 18px;
}

.trend-info {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.trend-label {
  font-size: 11px;
  color: #6b7280;
  font-weight: 500;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.trend-value {
  font-size: 16px;
  font-weight: 600;
  line-height: 1.2;
  margin: 2px 0;
  white-space: nowrap;
}

.trend-change {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 10px;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
}

.trend-change svg {
  width: 10px;
  height: 10px;
  flex-shrink: 0;
}

.trend-chart {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  padding: 16px 16px 24px 16px;
  background: linear-gradient(180deg, rgba(249, 250, 251, 0.8) 0%, rgba(255, 255, 255, 0.5) 100%);
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  flex: 1;
  min-height: 160px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
  overflow: hidden;
}

.trend-chart:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border-color: #d1d5db;
  transform: translateY(-2px);
}

.chart-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex: 1;
  max-width: 80px;
  min-width: 45px;
  cursor: pointer;
  height: 100%;
}

.chart-bar:hover {
  transform: scale(1.05);
}

.bar-group {
  display: flex;
  gap: 4px;
  align-items: flex-end;
  height: 85%;
  width: 100%;
}

.bar-segment {
  flex: 1;
  border-radius: 4px 4px 0 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 4px;
  position: relative;
}

.bar-segment::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 100%);
  border-radius: 4px 4px 0 0;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.bar-segment:hover::before {
  opacity: 1;
}

.bar-segment:hover {
  opacity: 0.9;
  transform: scaleY(1.08);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.bar-segment:active {
  transform: scaleY(0.95);
}

.bar-cpu {
  background: linear-gradient(180deg, #ef4444 0%, #f87171 100%);
}

.bar-memory {
  background: linear-gradient(180deg, #a855f7 0%, #c084fc 100%);
}

.bar-label {
  font-size: 10px;
  color: #6b7280;
  font-weight: 500;
  text-align: center;
  white-space: nowrap;
  line-height: 1;
}

.process-list {
  display: flex;
  flex-direction: column;
  padding: 12px;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  flex: 1;
  min-height: 160px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
}

.process-list:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border-color: #d1d5db;
}

.process-header {
  display: grid;
  grid-template-columns: 1.2fr 70px 70px 50px;
  gap: 8px;
  padding: 12px 8px;
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
  margin-bottom: 8px;
  flex-shrink: 0;
  background: linear-gradient(180deg, #f3f4f6 0%, #f9fafb 100%);
  border-radius: 8px 8px 0 0;
}

.process-item {
  display: grid;
  grid-template-columns: 1.2fr 70px 70px 50px;
  gap: 8px;
  align-items: center;
  padding: 12px 8px;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  border: 1px solid transparent;
  cursor: pointer;
}

.process-item:hover {
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  border-color: #e5e7eb;
  transform: translateX(4px);
}

.process-item:active {
  transform: translateX(2px) scale(0.98);
}

.process-name {
  display: flex;
  align-items: center;
  font-size: 13px;
  font-weight: 500;
  color: #1f2937;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.process-name svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.process-metric {
  display: flex;
  align-items: center;
  justify-content: center;
}

.process-status {
  display: flex;
  align-items: center;
  justify-content: center;
}

.dark .trend-indicator {
  background: #1f2937;
  border-color: #374151;
}

.dark .trend-chart {
  background: linear-gradient(180deg, rgba(31, 41, 55, 0.5) 0%, rgba(17, 24, 39, 0) 100%);
  border-color: #374151;
}

.dark .bar-label {
  color: #9ca3af;
}

.dark .process-list {
  background: #1f2937;
  border-color: #374151;
}

.dark .process-header {
  color: #e5e7eb;
  border-bottom-color: #374151;
}

.dark .process-item {
  color: #d1d5db;
}

.dark .process-item:hover {
  background: #374151;
}

.dark .process-name {
  color: #f3f4f6;
}

@media (max-width: 768px) {
  .h-520px {
    height: auto;
    min-height: 700px;
  }
  .h-400px {
    height: auto;
    min-height: 500px;
  }
  .h-320px {
    height: auto;
    min-height: 280px;
  }
  .grid.grid-cols-4 {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  .grid.grid-cols-2 {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .trend-chart {
    overflow-x: auto;
    padding: 12px 12px 20px 12px;
    flex: 1;
    min-height: 120px;
  }
  .bar-group {
    height: 80%;
  }
  .process-list {
    max-height: none;
    flex: 1;
    min-height: 160px;
    padding: 10px;
  }
  .process-header,
  .process-item {
    grid-template-columns: 1fr 50px 50px 45px;
    gap: 6px;
    font-size: 10px;
    padding: 8px 6px;
  }
  .trend-indicator {
    padding: 10px;
    gap: 8px;
  }
  .trend-icon {
    width: 32px;
    height: 32px;
  }
  .trend-icon svg {
    width: 16px;
    height: 16px;
  }
  .trend-value {
    font-size: 14px;
  }
  .trend-label {
    font-size: 10px;
  }
  .system-monitor :deep(.n-data-table) {
    font-size: 11px;
  }
  .system-monitor :deep(.n-data-table th),
  .system-monitor :deep(.n-data-table td) {
    padding: 6px 4px;
  }
  .system-monitor :deep(.n-tag) {
    font-size: 10px;
  }
  /* 移动端禁用部分交互效果以提升性能 */
  .trend-chart:hover,
  .trend-indicator:hover,
  .process-item:hover,
  .process-list:hover {
    transform: none;
  }
  .bar-segment:hover {
    transform: none;
    box-shadow: none;
  }
}
</style>
