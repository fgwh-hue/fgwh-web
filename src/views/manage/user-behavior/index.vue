<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { type ECOption, useEcharts } from '@/hooks/common/echarts';
import BehaviorGuide from './modules/behavior-guide.vue';

defineOptions({
  name: 'UserBehaviorAnalysis'
});

const dateRange = ref<[number, number]>([Date.now() - 7 * 24 * 60 * 60 * 1000, Date.now()]);

const behaviorStats = ref({
  totalUsers: 12856,
  activeUsers: 8920,
  avgSessionTime: '28分钟',
  avgDailyLogins: 3.2,
  retentionRate: '68.5%',
  churnRate: '8.2%'
});

const { domRef: activityRef, updateOptions: _updateActivity } = useEcharts(
  (): ECOption => ({
    tooltip: { trigger: 'axis' },
    legend: { data: ['登录次数', '活跃用户'], bottom: 0 },
    grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
    xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] },
    yAxis: [
      { type: 'value', name: '登录次数' },
      { type: 'value', name: '活跃用户' }
    ],
    series: [
      {
        name: '登录次数',
        type: 'line',
        smooth: true,
        data: [4200, 3800, 4500, 3900, 4800, 5200, 5800],
        itemStyle: { color: '#8e9dff' }
      },
      {
        name: '活跃用户',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        data: [2800, 3200, 3500, 2900, 3800, 4200, 4500],
        itemStyle: { color: '#26deca' }
      }
    ]
  })
);

const { domRef: retentionRef, updateOptions: _updateRetention } = useEcharts(
  (): ECOption => ({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '10%', containLabel: true },
    xAxis: { type: 'category', data: ['新增', '次日', '3日', '7日', '14日', '30日'] },
    yAxis: { type: 'value', name: '留存率 (%)' },
    series: [{ name: '留存率', type: 'bar', data: [100, 65, 48, 35, 28, 22], itemStyle: { color: '#4096ff' } }]
  })
);

const { domRef: heatmapRef, updateOptions: updateHeatmap } = useEcharts(
  (): ECOption => ({
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    legend: {
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      bottom: '0%',
      textStyle: { color: '#666' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['0-2', '2-4', '4-6', '6-8', '8-10', '10-12', '12-14', '14-16', '16-18', '18-20', '20-22', '22-24'],
      axisLabel: {
        color: '#666',
        fontSize: 12
      },
      axisLine: {
        lineStyle: {
          color: '#e0e0e0'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: '活跃度',
      nameTextStyle: {
        color: '#666',
        fontSize: 13
      },
      axisLabel: {
        color: '#666',
        fontSize: 12
      },
      axisLine: {
        lineStyle: {
          color: '#e0e0e0'
        }
      },
      splitLine: {
        lineStyle: {
          color: '#f0f0f0',
          type: 'dashed'
        }
      }
    },
    series: [
      {
        name: '周一',
        type: 'bar',
        stack: 'total',
        barMaxWidth: 40,
        itemStyle: {
          color: '#409eff',
          borderRadius: [4, 4, 0, 0]
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.3)'
          }
        },
        data: [] as number[]
      },
      {
        name: '周二',
        type: 'bar',
        stack: 'total',
        barMaxWidth: 40,
        itemStyle: {
          color: '#2ecc71',
          borderRadius: [4, 4, 0, 0]
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.3)'
          }
        },
        data: [] as number[]
      },
      {
        name: '周三',
        type: 'bar',
        stack: 'total',
        barMaxWidth: 40,
        itemStyle: {
          color: '#9b59b6',
          borderRadius: [4, 4, 0, 0]
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.3)'
          }
        },
        data: [] as number[]
      },
      {
        name: '周四',
        type: 'bar',
        stack: 'total',
        barMaxWidth: 40,
        itemStyle: {
          color: '#f1c40f',
          borderRadius: [4, 4, 0, 0]
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.3)'
          }
        },
        data: [] as number[]
      },
      {
        name: '周五',
        type: 'bar',
        stack: 'total',
        barMaxWidth: 40,
        itemStyle: {
          color: '#e67e22',
          borderRadius: [4, 4, 0, 0]
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.3)'
          }
        },
        data: [] as number[]
      },
      {
        name: '周六',
        type: 'bar',
        stack: 'total',
        barMaxWidth: 40,
        itemStyle: {
          color: '#e74c3c',
          borderRadius: [4, 4, 0, 0]
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.3)'
          }
        },
        data: [] as number[]
      },
      {
        name: '周日',
        type: 'bar',
        stack: 'total',
        barMaxWidth: 40,
        itemStyle: {
          color: '#3498db',
          borderRadius: [4, 4, 0, 0]
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.3)'
          }
        },
        data: [] as number[]
      }
    ]
  })
);

interface UserSegment {
  id: number;
  name: string;
  count: number;
  percentage: number;
  growth: number;
  description: string;
}

interface FeatureUsage {
  feature: string;
  usage: number;
  avgDuration: number;
  trend: 'up' | 'down' | 'stable';
}

interface FunnelStep {
  name: string;
  value: number;
  rate: string;
}

const userSegments = ref<UserSegment[]>([
  { id: 1, name: '高度活跃用户', count: 3200, percentage: 25, growth: 15.2, description: '每周使用5次以上' },
  { id: 2, name: '中度活跃用户', count: 4820, percentage: 37.5, growth: 8.5, description: '每周使用2-4次' },
  { id: 3, name: '低度活跃用户', count: 2816, percentage: 21.9, growth: -3.2, description: '每周使用1次' },
  { id: 4, name: '流失风险用户', count: 2000, percentage: 15.6, growth: -12.8, description: '30天未活跃' }
]);

const featureUsage = ref<FeatureUsage[]>([
  { feature: '课程视频学习', usage: 8920, avgDuration: 45, trend: 'up' },
  { feature: '作业提交', usage: 6540, avgDuration: 12, trend: 'up' },
  { feature: 'AI智能问答', usage: 4280, avgDuration: 8, trend: 'up' },
  { feature: '学习进度查看', usage: 5120, avgDuration: 3, trend: 'stable' },
  { feature: '社区讨论', usage: 1890, avgDuration: 15, trend: 'down' },
  { feature: '资料下载', usage: 2340, avgDuration: 5, trend: 'stable' }
]);

const topActiveUsers = ref([
  { rank: 1, username: '王小明', role: '学生', logins: 156, totalTime: '89小时', lastLogin: '刚刚', score: 98 },
  { rank: 2, username: '李老师', role: '教师', logins: 142, totalTime: '112小时', lastLogin: '5分钟前', score: 95 },
  { rank: 3, username: '张小华', role: '学生', logins: 138, totalTime: '76小时', lastLogin: '10分钟前', score: 92 },
  { rank: 4, username: '刘管理员', role: '管理员', logins: 125, totalTime: '95小时', lastLogin: '15分钟前', score: 88 },
  { rank: 5, username: '陈同学', role: '学生', logins: 118, totalTime: '68小时', lastLogin: '20分钟前', score: 85 }
]);

const funnelData = ref<FunnelStep[]>([
  { name: '注册用户', value: 12856, rate: '100%' },
  { name: '激活用户', value: 11560, rate: '89.9%' },
  { name: '活跃用户', value: 8920, rate: '69.4%' },
  { name: '核心用户', value: 3200, rate: '24.9%' },
  { name: '付费用户', value: 856, rate: '6.7%' }
]);

function initCharts() {
  updateHeatmap((opts, _optsFactory) => {
    const options = opts as ECOption;
    // 为每个系列生成数据
    if (options.series && Array.isArray(options.series)) {
      options.series.forEach((series: any, _index: number) => {
        const data: number[] = [];
        for (let i = 0; i < 12; i += 1) {
          data.push(Math.round(30 + Math.random() * 70));
        }
        series.data = data;
      });
    }
    return options;
  });
}

function getTrendIcon(trend: FeatureUsage['trend']) {
  if (trend === 'up') return 'ph:trend-up-fill';
  if (trend === 'down') return 'ph:trend-down-fill';
  return 'ph:minus-fill';
}

function getTrendColor(trend: FeatureUsage['trend']) {
  if (trend === 'up') return 'text-green-500';
  if (trend === 'down') return 'text-red-500';
  return 'text-gray-500';
}

onMounted(() => {
  // 等待 DOM 渲染后再初始化图表
  setTimeout(() => {
    initCharts();
  }, 100);
});
</script>

<template>
  <div class="user-behavior-analysis">
    <NSpace vertical :size="16">
      <NCard :bordered="false" class="card-wrapper">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-18px font-semibold">用户行为分析</h2>
            <p class="mt-4px text-gray-500">深度分析用户行为模式与学习习惯</p>
          </div>
          <NSpace :size="12">
            <NDatePicker v-model:value="dateRange" type="daterange" />
            <NButton type="primary">
              <template #icon>
                <SvgIcon icon="ph:download-simple" />
              </template>
              导出报告
            </NButton>
          </NSpace>
        </div>
      </NCard>

      <NGrid cols="s:1 m:2 l:6" :x-gap="16" :y-gap="16">
        <NGi>
          <NCard :bordered="false" class="card-wrapper">
            <div class="flex items-center gap-12px">
              <div class="size-48px flex-center rd-8px bg-blue-50 dark:bg-blue-900/20">
                <SvgIcon icon="ph:users-three-fill" class="text-24px text-blue-500" />
              </div>
              <div>
                <div class="text-12px text-gray-500">总用户数</div>
                <div class="text-24px font-semibold">{{ behaviorStats.totalUsers.toLocaleString() }}</div>
              </div>
            </div>
          </NCard>
        </NGi>
        <NGi>
          <NCard :bordered="false" class="card-wrapper">
            <div class="flex items-center gap-12px">
              <div class="size-48px flex-center rd-8px bg-green-50 dark:bg-green-900/20">
                <SvgIcon icon="ph:user-circle-check-fill" class="text-24px text-green-500" />
              </div>
              <div>
                <div class="text-12px text-gray-500">活跃用户</div>
                <div class="text-24px font-semibold">{{ behaviorStats.activeUsers.toLocaleString() }}</div>
                <div class="text-12px text-green-500">↑ 12.5%</div>
              </div>
            </div>
          </NCard>
        </NGi>
        <NGi>
          <NCard :bordered="false" class="card-wrapper">
            <div class="flex items-center gap-12px">
              <div class="size-48px flex-center rd-8px bg-purple-50 dark:bg-purple-900/20">
                <SvgIcon icon="ph:clock-fill" class="text-24px text-purple-500" />
              </div>
              <div>
                <div class="text-12px text-gray-500">平均会话时长</div>
                <div class="text-24px font-semibold">{{ behaviorStats.avgSessionTime }}</div>
              </div>
            </div>
          </NCard>
        </NGi>
        <NGi>
          <NCard :bordered="false" class="card-wrapper">
            <div class="flex items-center gap-12px">
              <div class="size-48px flex-center rd-8px bg-orange-50 dark:bg-orange-900/20">
                <SvgIcon icon="ph:sign-in-fill" class="text-24px text-orange-500" />
              </div>
              <div>
                <div class="text-12px text-gray-500">日均登录次数</div>
                <div class="text-24px font-semibold">{{ behaviorStats.avgDailyLogins }}</div>
              </div>
            </div>
          </NCard>
        </NGi>
        <NGi>
          <NCard :bordered="false" class="card-wrapper">
            <div class="flex items-center gap-12px">
              <div class="size-48px flex-center rd-8px bg-cyan-50 dark:bg-cyan-900/20">
                <SvgIcon icon="ph:user-rectangle-fill" class="text-24px text-cyan-500" />
              </div>
              <div>
                <div class="text-12px text-gray-500">留存率</div>
                <div class="text-24px font-semibold">{{ behaviorStats.retentionRate }}</div>
                <div class="text-12px text-green-500">↑ 5.2%</div>
              </div>
            </div>
          </NCard>
        </NGi>
        <NGi>
          <NCard :bordered="false" class="card-wrapper">
            <div class="flex items-center gap-12px">
              <div class="size-48px flex-center rd-8px bg-red-50 dark:bg-red-900/20">
                <SvgIcon icon="ph:user-minus-fill" class="text-24px text-red-500" />
              </div>
              <div>
                <div class="text-12px text-gray-500">流失率</div>
                <div class="text-24px font-semibold">{{ behaviorStats.churnRate }}</div>
                <div class="text-12px text-red-500">↑ 2.1%</div>
              </div>
            </div>
          </NCard>
        </NGi>
      </NGrid>

      <NGrid cols="s:1 m:2" :x-gap="16" :y-gap="16">
        <NGi>
          <NCard :bordered="false" class="card-wrapper" title="用户活跃趋势">
            <div ref="activityRef" class="h-300px overflow-hidden"></div>
          </NCard>
        </NGi>
        <NGi>
          <NCard :bordered="false" class="card-wrapper" title="用户留存率">
            <div ref="retentionRef" class="h-300px overflow-hidden"></div>
          </NCard>
        </NGi>
      </NGrid>

      <NCard :bordered="false" class="card-wrapper" title="用户活跃时段热力图">
        <div ref="heatmapRef" class="h-400px overflow-hidden"></div>
      </NCard>

      <NGrid :x-gap="16" :y-gap="16" responsive="screen" item-responsive>
        <NGi span="24 s:24 m:12">
          <NCard :bordered="false" class="h-400px overflow-hidden card-wrapper" title="用户分层分析">
            <div class="h-full flex flex-col">
              <NTable :bordered="false" size="small" class="flex-1">
                <thead>
                  <tr>
                    <th>用户群体</th>
                    <th>数量</th>
                    <th>占比</th>
                    <th>变化趋势</th>
                    <th>特征描述</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="segment in userSegments" :key="segment.id">
                    <td>
                      <div class="flex items-center gap-8px">
                        <div
                          class="size-8px rd-1/2"
                          :style="{
                            backgroundColor:
                              segment.name === '高度活跃用户'
                                ? '#18a058'
                                : segment.name === '中度活跃用户'
                                  ? '#2080f0'
                                  : segment.name === '低度活跃用户'
                                    ? '#f0a020'
                                    : '#d03050'
                          }"
                        ></div>
                        {{ segment.name }}
                      </div>
                    </td>
                    <td>{{ segment.count.toLocaleString() }} 人</td>
                    <td>{{ segment.percentage }}%</td>
                    <td>
                      <span :class="segment.growth > 0 ? 'text-green-500' : 'text-red-500'">
                        {{ segment.growth > 0 ? '↑' : '↓' }} {{ Math.abs(segment.growth) }}%
                      </span>
                    </td>
                    <td class="text-gray-500">{{ segment.description }}</td>
                  </tr>
                </tbody>
              </NTable>
            </div>
          </NCard>
        </NGi>
        <NGi span="24 s:24 m:12">
          <NCard :bordered="false" class="h-400px overflow-hidden card-wrapper" title="用户转化漏斗">
            <div class="h-full flex flex-col">
              <NTable :bordered="false" size="small" class="flex-1">
                <thead>
                  <tr>
                    <th>阶段</th>
                    <th>用户数</th>
                    <th>转化率</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="step in funnelData" :key="step.name">
                    <td>{{ step.name }}</td>
                    <td>{{ step.value.toLocaleString() }}</td>
                    <td>
                      <NTag size="small" :type="step.rate === '100%' ? 'warning' : 'success'">{{ step.rate }}</NTag>
                    </td>
                  </tr>
                </tbody>
              </NTable>
            </div>
          </NCard>
        </NGi>
      </NGrid>

      <NGrid :x-gap="16" :y-gap="16" responsive="screen" item-responsive class="mb-24px">
        <NGi span="24 s:24 m:12">
          <NCard :bordered="false" class="h-400px overflow-hidden card-wrapper" title="功能使用分析">
            <div class="h-full flex flex-col">
              <NTable :bordered="false" size="small" class="flex-1">
                <thead>
                  <tr>
                    <th>功能模块</th>
                    <th>使用次数</th>
                    <th>平均时长(分钟)</th>
                    <th>趋势</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="feature in featureUsage" :key="feature.feature">
                    <td>{{ feature.feature }}</td>
                    <td>{{ feature.usage.toLocaleString() }}</td>
                    <td>{{ feature.avgDuration }}</td>
                    <td>
                      <SvgIcon :icon="getTrendIcon(feature.trend)" :class="getTrendColor(feature.trend)" />
                    </td>
                  </tr>
                </tbody>
              </NTable>
            </div>
          </NCard>
        </NGi>
        <NGi span="24 s:24 m:12">
          <NCard :bordered="false" class="h-400px overflow-hidden card-wrapper" title="活跃用户排行榜">
            <div class="h-full flex flex-col">
              <NTable :bordered="false" size="small" class="flex-1">
                <thead>
                  <tr>
                    <th width="60">排名</th>
                    <th>用户名</th>
                    <th>角色</th>
                    <th>登录次数</th>
                    <th>在线时长</th>
                    <th>活跃度评分</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in topActiveUsers" :key="user.rank">
                    <td>
                      <NTag :type="user.rank <= 3 ? 'warning' : 'default'" size="small">
                        {{ user.rank }}
                      </NTag>
                    </td>
                    <td>{{ user.username }}</td>
                    <td>
                      <NTag
                        :type="user.role === '管理员' ? 'error' : user.role === '教师' ? 'warning' : 'primary'"
                        size="small"
                      >
                        {{ user.role }}
                      </NTag>
                    </td>
                    <td>{{ user.logins }}</td>
                    <td>{{ user.totalTime }}</td>
                    <td>
                      <NProgress type="line" :percentage="user.score" :show-indicator="false" />
                    </td>
                  </tr>
                </tbody>
              </NTable>
            </div>
          </NCard>
        </NGi>
      </NGrid>
    </NSpace>

    <!-- 用户行为分析指南和案例 -->
    <BehaviorGuide />
  </div>
</template>

<style scoped></style>
