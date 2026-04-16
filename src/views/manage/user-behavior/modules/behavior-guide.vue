<script setup lang="ts">
import { ref } from 'vue';

defineOptions({
  name: 'BehaviorGuide'
});

interface MetricDefinition {
  id: number;
  name: string;
  formula: string;
  description: string;
  benchmark: string;
  icon: string;
  color: string;
}

interface AnalysisMethod {
  id: number;
  name: string;
  description: string;
  应用场景: string[];
  icon: string;
}

interface ImprovementStrategy {
  id: number;
  area: string;
  problem: string;
  solutions: string[];
  expectedResult: string;
  icon: string;
}

interface CaseStudy {
  id: number;
  title: string;
  description: string;
  actions: string[];
  results: string[];
  tags: string[];
}

const metricDefinitions = ref<MetricDefinition[]>([
  {
    id: 1,
    name: '日活跃用户数 (DAU)',
    formula: '当日登录并完成至少一次操作的用户数',
    description: '反映产品每日的用户活跃程度，是衡量产品健康度的核心指标',
    benchmark: '教育类产品通常为 20%-40%',
    icon: 'ph:chart-line-up-fill',
    color: '#409eff'
  },
  {
    id: 2,
    name: '留存率',
    formula: '(期间开始用户 - 期间流失用户) / 期间开始用户 × 100%',
    description: '衡量用户粘性和产品价值，反映用户继续使用的意愿',
    benchmark: '次日留存 40-60%，7 日留存 20-40%，30 日留存 10-20%',
    icon: 'ph:chart-pie-slice-fill',
    color: '#67c23a'
  },
  {
    id: 3,
    name: '用户流失率',
    formula: '期间流失用户数 / 期间开始用户数 × 100%',
    description: '反映用户离开产品的比例，需要持续监控和降低',
    benchmark: '月流失率应控制在 5-10% 以内',
    icon: 'ph:chart-line-down-fill',
    color: '#f0a020'
  },
  {
    id: 4,
    name: '平均使用时长',
    formula: '总使用时长 / 活跃用户数',
    description: '衡量用户参与深度和产品吸引力',
    benchmark: '学习类产品平均 20-40 分钟/天',
    icon: 'ph:clock-fill',
    color: '#d03050'
  },
  {
    id: 5,
    name: '用户参与度',
    formula: '(登录 + 互动 + 内容消费) / 活跃用户数',
    description: '综合评估用户参与程度的指标',
    benchmark: '参与度指数 60 分以上为良好',
    icon: 'ph:hand-heart-fill',
    color: '#18a058'
  },
  {
    id: 6,
    name: '功能使用率',
    formula: '使用某功能的用户数 / 总用户数 × 100%',
    description: '评估各功能的受欢迎程度和使用价值',
    benchmark: '核心功能使用率应>50%',
    icon: 'ph:gear-fill',
    color: '#2080f0'
  }
]);

const analysisMethods = ref<AnalysisMethod[]>([
  {
    id: 1,
    name: '趋势分析',
    description: '通过时间序列数据分析指标的变化趋势，发现增长或下降模式',
    应用场景: ['监控核心指标变化', '识别增长机会', '预警潜在问题', '评估策略效果'],
    icon: 'ph:trend-up-fill'
  },
  {
    id: 2,
    name: '细分分析',
    description: '将用户按不同维度分组，对比各组表现，发现差异和机会',
    应用场景: ['用户分层运营', '产品功能优化', '精准营销策略', '个性化推荐'],
    icon: 'ph:chart-bar-fill'
  },
  {
    id: 3,
    name: '漏斗分析',
    description: '分析用户在各转化环节的流失情况，找出瓶颈和优化点',
    应用场景: ['优化注册流程', '提升购买转化', '改善用户体验', '提高功能采用率'],
    icon: 'ph:funnel-fill'
  },
  {
    id: 4,
    name: '留存分析',
    description: '追踪用户在一段时间后的继续使用比例，评估产品粘性',
    应用场景: ['评估产品价值', '优化用户体验', '制定召回策略', '预测收入'],
    icon: 'ph:users-three-fill'
  },
  {
    id: 5,
    name: '路径分析',
    description: '分析用户在产品中的行为路径，了解使用习惯和偏好',
    应用场景: ['优化产品流程', '发现使用障碍', '改进导航设计', '提升转化率'],
    icon: 'ph:map-trifold-fill'
  },
  {
    id: 6,
    name: '同期群分析',
    description: '追踪同一时期开始使用的用户群体，对比不同时期用户的表现',
    应用场景: ['评估产品改进效果', '分析季节性影响', '优化获客策略', '预测长期价值'],
    icon: 'ph:calendar-check-fill'
  }
]);

const improvementStrategies = ref<ImprovementStrategy[]>([
  {
    id: 1,
    area: '提升活跃度',
    problem: 'DAU 持续下降，用户活跃度低',
    solutions: [
      '优化产品核心功能体验',
      '增加用户互动和社交元素',
      '实施签到和激励机制',
      '推送个性化内容和通知',
      '举办活动和竞赛'
    ],
    expectedResult: 'DAU 提升 20-30%，用户参与度提高 15%',
    icon: 'ph:rocket-fill'
  },
  {
    id: 2,
    area: '降低流失率',
    problem: '用户流失率高，留存率低',
    solutions: [
      '分析流失用户行为和特征',
      '建立流失预警模型',
      '实施用户召回策略',
      '优化新手引导流程',
      '提升客户服务质量'
    ],
    expectedResult: '月流失率降低 30%，留存率提升 20%',
    icon: 'ph:shield-check-fill'
  },
  {
    id: 3,
    area: '提高参与度',
    problem: '用户使用时间短，互动少',
    solutions: ['丰富内容生态', '增加游戏化元素', '优化推荐算法', '建立社区和讨论区', '提供学习成就系统'],
    expectedResult: '平均使用时长增加 40%，互动率提升 50%',
    icon: 'ph:hand-heart-fill'
  },
  {
    id: 4,
    area: '功能优化',
    problem: '部分功能使用率低，价值未充分发挥',
    solutions: [
      '分析功能使用数据和用户反馈',
      '优化功能入口和可见性',
      '改进功能易用性',
      '加强功能宣传和引导',
      '考虑功能整合或下线'
    ],
    expectedResult: '核心功能使用率提升至 60% 以上',
    icon: 'ph:gear-fill'
  }
]);

const caseStudies = ref<CaseStudy[]>([
  {
    id: 1,
    title: '通过学习路径优化提升留存率',
    description:
      '某在线教育平台通过分析用户学习路径，发现新手用户在第一周流失率高达 60%。通过优化新手引导和学习路径设计，显著改善了留存表现。',
    actions: [
      '分析流失用户的学习行为数据',
      '识别关键流失节点和原因',
      '设计个性化的新手学习路径',
      '增加学习进度提醒和鼓励机制',
      '提供一对一学习顾问服务'
    ],
    results: [
      '新手 7 日留存率从 40% 提升至 65%',
      '用户平均学习时长增加 35%',
      '课程完成率提高 28%',
      '用户满意度提升至 92%'
    ],
    tags: ['留存优化', '新手引导', '学习路径']
  },
  {
    id: 2,
    title: '通过个性化推荐提升活跃度',
    description: '平台利用 AI 算法分析用户学习行为和兴趣，实现个性化内容推荐，大幅提升了用户活跃度和参与度。',
    actions: [
      '构建用户画像和兴趣模型',
      '开发智能推荐算法',
      '实施 A/B 测试优化推荐策略',
      '建立推荐效果评估体系',
      '持续迭代优化算法'
    ],
    results: ['DAU 提升 45%', '内容点击率提升 120%', '用户平均使用时长增加 50%', '功能使用率提升 38%'],
    tags: ['个性化推荐', 'AI 算法', '活跃度提升']
  }
]);
</script>

<template>
  <div class="space-y-16px">
    <!-- 核心指标定义 -->
    <NCard :bordered="false" class="card-wrapper" title="核心指标定义与解读">
      <template #header-extra>
        <NTag type="primary" size="small">关键指标说明</NTag>
      </template>
      <div class="grid grid-cols-1 gap-16px lg:grid-cols-3 md:grid-cols-2">
        <div
          v-for="metric in metricDefinitions"
          :key="metric.id"
          class="interactive-card group relative overflow-hidden rounded-12px bg-white p-20px shadow-sm transition-all dark:bg-gray-800 hover:shadow-xl"
        >
          <div
            class="absolute size-80px rounded-full opacity-10 transition-all -right-16px -top-16px group-hover:scale-150"
            :style="{ backgroundColor: metric.color }"
          ></div>
          <div class="relative">
            <div class="mb-16px flex items-center gap-12px">
              <div
                class="size-48px flex items-center justify-center rounded-10px"
                :style="{ backgroundColor: `${metric.color}20` }"
              >
                <SvgIcon :icon="metric.icon" :style="{ color: metric.color }" class="text-24px" />
              </div>
              <h3 class="text-15px font-semibold">{{ metric.name }}</h3>
            </div>
            <p class="mb-12px text-13px text-gray-600 dark:text-gray-400">{{ metric.description }}</p>
            <div class="mb-12px rounded-6px bg-gray-50 p-12px dark:bg-gray-900">
              <div class="text-11px text-gray-500 font-medium">计算公式</div>
              <div class="text-12px text-gray-700 dark:text-gray-300">{{ metric.formula }}</div>
            </div>
            <div class="rounded-6px bg-blue-50 p-12px dark:bg-blue-900/20">
              <div class="text-11px text-blue-600 font-medium dark:text-blue-400">行业基准</div>
              <div class="text-12px text-blue-700 dark:text-blue-300">{{ metric.benchmark }}</div>
            </div>
          </div>
        </div>
      </div>
    </NCard>

    <!-- 分析方法 -->
    <NCard :bordered="false" class="card-wrapper" title="用户行为分析方法">
      <div class="grid grid-cols-1 gap-16px lg:grid-cols-3 md:grid-cols-2">
        <div
          v-for="method in analysisMethods"
          :key="method.id"
          class="interactive-card relative overflow-hidden rounded-12px from-white to-gray-50 bg-gradient-to-br p-20px shadow-sm transition-all dark:from-gray-800 dark:to-gray-900 hover:shadow-lg"
        >
          <div
            class="absolute size-64px rounded-full bg-gray-50 opacity-50 transition-all -right-12px -top-12px group-hover:scale-150 dark:bg-gray-700"
          ></div>
          <div class="relative">
            <div class="mb-16px flex items-center gap-12px">
              <div class="size-44px flex items-center justify-center rounded-10px bg-primary/10">
                <SvgIcon :icon="method.icon" class="text-22px text-primary" />
              </div>
              <h3 class="text-16px font-semibold">{{ method.name }}</h3>
            </div>
            <p class="mb-16px text-14px text-gray-600 dark:text-gray-400">{{ method.description }}</p>
            <div class="space-y-8px">
              <div
                v-for="(scenario, index) in method.应用场景"
                :key="index"
                class="flex items-center gap-8px text-13px text-gray-600 dark:text-gray-400"
              >
                <SvgIcon icon="ph:check-circle-fill" class="mt-4px flex-shrink-0 text-green-500" />
                <span>{{ scenario }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </NCard>

    <!-- 改进策略 -->
    <NCard :bordered="false" class="card-wrapper" title="常见问题改进策略">
      <div class="space-y-16px">
        <div
          v-for="strategy in improvementStrategies"
          :key="strategy.id"
          class="group border border-gray-100 rounded-12px bg-white p-20px transition-all dark:border-gray-700 dark:bg-gray-800 hover:shadow-lg"
        >
          <div class="mb-16px flex items-center gap-12px">
            <div class="size-48px flex items-center justify-center rounded-10px bg-primary/10">
              <SvgIcon :icon="strategy.icon" class="text-24px text-primary" />
            </div>
            <div>
              <h3 class="text-17px font-semibold">{{ strategy.area }}</h3>
              <p class="text-13px text-gray-500">{{ strategy.problem }}</p>
            </div>
          </div>
          <div class="grid grid-cols-1 gap-16px md:grid-cols-2">
            <div>
              <h4 class="mb-12px text-14px font-medium">解决方案</h4>
              <ul class="space-y-8px">
                <li
                  v-for="(solution, index) in strategy.solutions"
                  :key="index"
                  class="flex items-start gap-8px text-13px text-gray-600 dark:text-gray-400"
                >
                  <div class="mt-4px size-16px flex items-center justify-center rounded-full bg-primary/20">
                    <span class="text-10px text-primary font-bold">{{ index + 1 }}</span>
                  </div>
                  <span>{{ solution }}</span>
                </li>
              </ul>
            </div>
            <div class="rounded-8px bg-green-50 p-16px dark:bg-green-900/20">
              <h4 class="mb-8px flex items-center gap-8px text-14px text-green-700 font-medium dark:text-green-400">
                <SvgIcon icon="ph:trend-up-fill" />
                预期效果
              </h4>
              <p class="text-14px text-green-600 dark:text-green-400">{{ strategy.expectedResult }}</p>
            </div>
          </div>
        </div>
      </div>
    </NCard>

    <!-- 成功案例 -->
    <NCard :bordered="false" class="card-wrapper" title="成功案例研究">
      <div class="grid grid-cols-1 gap-16px lg:grid-cols-2">
        <div
          v-for="item in caseStudies"
          :key="item.id"
          class="interactive-card group relative overflow-hidden rounded-12px from-white to-gray-50 bg-gradient-to-br p-20px shadow-sm transition-all dark:from-gray-800 dark:to-gray-900 hover:shadow-xl"
        >
          <div
            class="absolute size-100px rounded-full bg-primary/5 transition-all -right-20px -top-20px group-hover:scale-150"
          ></div>
          <div class="relative">
            <h3 class="mb-12px text-18px font-semibold">{{ item.title }}</h3>
            <p class="mb-16px text-14px text-gray-600 dark:text-gray-400">{{ item.description }}</p>

            <div class="mb-16px">
              <h4 class="mb-8px text-14px font-medium">关键行动</h4>
              <ul class="space-y-6px">
                <li
                  v-for="(action, index) in item.actions"
                  :key="index"
                  class="flex items-start gap-8px text-13px text-gray-600 dark:text-gray-400"
                >
                  <SvgIcon icon="ph:arrow-right-fill" class="mt-4px flex-shrink-0 text-primary" />
                  <span>{{ action }}</span>
                </li>
              </ul>
            </div>

            <div class="mb-16px">
              <h4 class="mb-8px text-14px font-medium">取得成果</h4>
              <div class="space-y-6px">
                <div
                  v-for="(result, index) in item.results"
                  :key="index"
                  class="flex items-center gap-8px rounded-6px bg-green-50 p-8px dark:bg-green-900/20"
                >
                  <SvgIcon icon="ph:check-circle-fill" class="text-green-500" />
                  <span class="text-13px text-green-600 font-medium dark:text-green-400">{{ result }}</span>
                </div>
              </div>
            </div>

            <div class="flex flex-wrap gap-8px">
              <NTag v-for="tag in item.tags" :key="tag" size="small" type="primary" :bordered="false">
                {{ tag }}
              </NTag>
            </div>
          </div>
        </div>
      </div>
    </NCard>
  </div>
</template>

<style scoped>
.interactive-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.interactive-card:hover {
  transform: translateY(-4px);
}
</style>
