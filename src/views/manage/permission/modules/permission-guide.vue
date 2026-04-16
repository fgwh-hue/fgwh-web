<script setup lang="ts">
import { ref } from 'vue';

defineOptions({
  name: 'PermissionGuide'
});

interface PermissionType {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  examples: string[];
}

interface SecurityLevel {
  level: number;
  name: string;
  description: string;
  permissions: string[];
  color: string;
}

interface ComplianceStandard {
  id: number;
  name: string;
  description: string;
  requirements: string[];
  icon: string;
}

const permissionTypes = ref<PermissionType[]>([
  {
    id: 1,
    name: '按钮权限',
    description: '控制界面按钮的显示和点击权限',
    icon: 'ph:cursor-click-fill',
    color: '#409eff',
    examples: ['新增用户', '删除课程', '导出成绩', '修改设置']
  },
  {
    id: 2,
    name: '数据权限',
    description: '控制数据的访问范围和可见性',
    icon: 'ph:database-fill',
    color: '#67c23a',
    examples: ['查看本部门数据', '查看本人数据', '查看全部数据', '查看指定区域数据']
  },
  {
    id: 3,
    name: '菜单权限',
    description: '控制菜单项的显示和访问',
    icon: 'ph:list-dashes-fill',
    color: '#f0a020',
    examples: ['用户管理菜单', '系统设置菜单', '数据分析菜单']
  },
  {
    id: 4,
    name: '接口权限',
    description: '控制 API 接口的调用权限',
    icon: 'ph:cloud-arrow-up-fill',
    color: '#d03050',
    examples: ['用户创建接口', '数据导出接口', '系统配置接口']
  }
]);

const securityLevels = ref<SecurityLevel[]>([
  {
    level: 1,
    name: '公开级',
    description: '所有用户均可访问的权限',
    permissions: ['查看公开课程', '下载公开资料', '查看个人信息'],
    color: '#18a058'
  },
  {
    level: 2,
    name: '内部级',
    description: '仅限系统注册用户访问',
    permissions: ['查看课程详情', '提交作业', '参与讨论', '查看成绩'],
    color: '#2080f0'
  },
  {
    level: 3,
    name: '机密级',
    description: '仅限特定角色或部门访问',
    permissions: ['查看学生信息', '修改成绩', '管理课程', '审批申请'],
    color: '#f0a020'
  },
  {
    level: 4,
    name: '绝密级',
    description: '仅限管理员和核心人员访问',
    permissions: ['系统配置', '用户管理', '权限分配', '数据导出'],
    color: '#d03050'
  }
]);

const complianceStandards = ref<ComplianceStandard[]>([
  {
    id: 1,
    name: '最小权限原则',
    description: '用户只应拥有完成工作所需的最小权限集合',
    requirements: ['定期审查权限分配情况', '及时回收不必要的权限', '实施权限申请和审批流程', '建立权限变更审计机制'],
    icon: 'ph:shield-check-fill'
  },
  {
    id: 2,
    name: '职责分离原则',
    description: '关键操作应由多人共同完成，避免权力过于集中',
    requirements: [
      '分离开发环境和生产环境权限',
      '分离操作权限和审批权限',
      '建立相互制约的权限体系',
      '实施双人复核机制'
    ],
    icon: 'ph:users-fill'
  },
  {
    id: 3,
    name: '权限审计原则',
    description: '定期审计权限使用情况，确保安全合规',
    requirements: ['记录所有权限变更操作', '定期生成权限审计报告', '监控异常权限使用行为', '建立权限违规处理机制'],
    icon: 'ph:magnifying-glass-fill'
  },
  {
    id: 4,
    name: '时效性原则',
    description: '权限应有明确的有效期，过期自动回收',
    requirements: ['设置权限有效期', '实施临时权限机制', '建立权限续期流程', '自动回收过期权限'],
    icon: 'ph:clock-fill'
  }
]);

const implementationSteps = ref([
  {
    step: 1,
    title: '权限需求分析',
    description: '明确各角色的权限需求和边界',
    details: ['梳理业务流程和岗位职责', '识别关键操作和敏感数据', '确定权限粒度和范围', '制定权限分配规则']
  },
  {
    step: 2,
    title: '权限模型设计',
    description: '设计合理的权限模型和结构',
    details: ['选择 RBAC 或 ABAC 模型', '定义角色和权限关系', '设计权限继承机制', '规划权限组结构']
  },
  {
    step: 3,
    title: '权限配置实施',
    description: '在系统中配置和实现权限',
    details: ['创建角色和权限组', '分配权限到角色', '配置数据权限范围', '设置权限生效条件']
  },
  {
    step: 4,
    title: '权限测试验证',
    description: '测试权限配置的正确性',
    details: ['验证权限控制效果', '测试权限边界情况', '检查权限冲突问题', '生成测试报告']
  },
  {
    step: 5,
    title: '权限运维管理',
    description: '持续优化和管理权限系统',
    details: ['定期审查权限配置', '处理权限相关问题', '优化权限结构', '更新权限策略']
  }
]);

const commonQuestions = ref([
  {
    question: '如何设计合理的权限粒度？',
    answer:
      '权限粒度应适中：过粗会导致权限控制不精确，过细会增加管理复杂度。建议：1) 按功能模块划分一级权限；2) 按操作类型划分二级权限；3) 按数据范围划分数据权限。'
  },
  {
    question: '如何处理权限冲突？',
    answer:
      '当用户拥有多个角色时，可能出现权限冲突。处理原则：1) 权限叠加：用户拥有所有角色的权限并集；2) 拒绝优先：如果任一角色明确拒绝某权限，则用户无此权限；3) 高优先级覆盖：设置角色优先级，高优先级角色的权限配置覆盖低优先级。'
  },
  {
    question: '如何实现数据权限控制？',
    answer:
      '数据权限控制方法：1) 基于组织架构：按部门、团队划分数据范围；2) 基于地域：按地区、区域划分；3) 基于项目：按项目组成员划分；4) 基于数据敏感度：按数据密级划分访问权限。'
  },
  {
    question: '权限系统如何保证安全性？',
    answer:
      '权限系统安全措施：1) 实施权限变更审批流程；2) 记录所有权限操作日志；3) 定期审计权限使用情况；4) 实施异常权限使用告警；5) 建立权限回收机制；6) 使用加密存储敏感权限数据。'
  }
]);
</script>

<template>
  <div class="space-y-16px">
    <!-- 权限类型介绍 -->
    <NCard :bordered="false" class="card-wrapper" title="权限类型详解">
      <template #header-extra>
        <NTag type="primary" size="small">四种核心权限类型</NTag>
      </template>
      <div class="grid grid-cols-1 gap-16px lg:grid-cols-4 md:grid-cols-2">
        <div
          v-for="type in permissionTypes"
          :key="type.id"
          class="interactive-card group relative overflow-hidden rounded-12px bg-white p-20px shadow-sm transition-all dark:bg-gray-800 hover:shadow-xl"
        >
          <div
            class="absolute size-80px rounded-full opacity-10 transition-all -right-16px -top-16px group-hover:scale-150"
            :style="{ backgroundColor: type.color }"
          ></div>
          <div class="relative">
            <div class="mb-16px flex items-center gap-12px">
              <div
                class="size-48px flex items-center justify-center rounded-10px"
                :style="{ backgroundColor: `${type.color}20` }"
              >
                <SvgIcon :icon="type.icon" :style="{ color: type.color }" class="text-24px" />
              </div>
              <h3 class="text-16px font-semibold">{{ type.name }}</h3>
            </div>
            <p class="mb-16px text-14px text-gray-600 dark:text-gray-400">{{ type.description }}</p>
            <div class="space-y-8px">
              <div
                v-for="example in type.examples"
                :key="example"
                class="flex items-center gap-8px text-12px text-gray-600 dark:text-gray-400"
              >
                <div class="size-6px rounded-full" :style="{ backgroundColor: type.color }"></div>
                <span>{{ example }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </NCard>

    <!-- 安全等级 -->
    <NCard :bordered="false" class="card-wrapper" title="权限安全等级">
      <div class="space-y-16px">
        <div
          v-for="level in securityLevels"
          :key="level.level"
          class="group flex items-center gap-16px border border-gray-100 rounded-12px bg-white p-20px transition-all dark:border-gray-700 dark:bg-gray-800 hover:shadow-lg"
        >
          <div
            class="size-56px flex flex-shrink-0 items-center justify-center rounded-12px text-20px text-white font-bold"
            :style="{ backgroundColor: level.color }"
          >
            {{ level.level }}
          </div>
          <div class="flex-1">
            <div class="mb-8px flex items-center gap-12px">
              <h3 class="text-16px font-semibold">{{ level.name }}</h3>
              <NTag
                :type="
                  level.color === '#18a058'
                    ? 'success'
                    : level.color === '#2080f0'
                      ? 'primary'
                      : level.color === '#f0a020'
                        ? 'warning'
                        : 'error'
                "
                size="small"
              >
                {{ level.description }}
              </NTag>
            </div>
            <div class="flex flex-wrap gap-8px">
              <NTag v-for="perm in level.permissions" :key="perm" size="small" variant="outline" :bordered="false">
                {{ perm }}
              </NTag>
            </div>
          </div>
        </div>
      </div>
    </NCard>

    <!-- 合规标准 -->
    <NCard :bordered="false" class="card-wrapper" title="权限管理合规标准">
      <div class="grid grid-cols-1 gap-16px md:grid-cols-2">
        <div
          v-for="standard in complianceStandards"
          :key="standard.id"
          class="interactive-card relative overflow-hidden rounded-12px from-white to-gray-50 bg-gradient-to-br p-20px shadow-sm transition-all dark:from-gray-800 dark:to-gray-900 hover:shadow-lg"
        >
          <div
            class="absolute size-64px rounded-full bg-gray-50 opacity-50 transition-all -right-12px -top-12px group-hover:scale-150 dark:bg-gray-700"
          ></div>
          <div class="relative">
            <div class="mb-16px flex items-center gap-12px">
              <div class="size-44px flex items-center justify-center rounded-10px bg-primary/10">
                <SvgIcon :icon="standard.icon" class="text-22px text-primary" />
              </div>
              <h3 class="text-16px font-semibold">{{ standard.name }}</h3>
            </div>
            <p class="mb-16px text-14px text-gray-600 dark:text-gray-400">{{ standard.description }}</p>
            <ul class="space-y-8px">
              <li
                v-for="(req, index) in standard.requirements"
                :key="index"
                class="flex items-start gap-8px text-13px text-gray-600 dark:text-gray-400"
              >
                <SvgIcon icon="ph:check-circle-fill" class="mt-4px flex-shrink-0 text-green-500" />
                <span>{{ req }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </NCard>

    <!-- 实施步骤 -->
    <NCard :bordered="false" class="card-wrapper" title="权限系统实施步骤">
      <NTimeline>
        <NTimelineItem
          v-for="step in implementationSteps"
          :key="step.step"
          :title="`步骤 ${step.step}: ${step.title}`"
          :content="step.description"
          type="success"
        >
          <div class="mt-12px rounded-8px bg-gray-50 p-16px dark:bg-gray-900">
            <ul class="grid grid-cols-1 gap-8px md:grid-cols-2">
              <li
                v-for="detail in step.details"
                :key="detail"
                class="flex items-center gap-8px text-13px text-gray-600 dark:text-gray-400"
              >
                <SvgIcon icon="ph:check-fill" class="text-green-500" />
                <span>{{ detail }}</span>
              </li>
            </ul>
          </div>
        </NTimelineItem>
      </NTimeline>
    </NCard>

    <!-- 常见问题 -->
    <NCard :bordered="false" class="card-wrapper" title="常见问题">
      <NCollapse>
        <NCollapseItem v-for="(item, index) in commonQuestions" :key="index" :title="item.question" :name="index">
          <div class="flex items-start gap-12px p-8px">
            <SvgIcon icon="ph:lightbulb-fill" class="mt-4px flex-shrink-0 text-yellow-500" />
            <p class="text-14px text-gray-600 dark:text-gray-400">{{ item.answer }}</p>
          </div>
        </NCollapseItem>
      </NCollapse>
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
