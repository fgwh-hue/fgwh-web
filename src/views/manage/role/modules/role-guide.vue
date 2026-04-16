<script setup lang="ts">
import { ref } from 'vue';

defineOptions({
  name: 'RoleGuide'
});

interface RoleTemplate {
  id: number;
  name: string;
  description: string;
  permissions: string[];
  suitableFor: string;
  icon: string;
  color: string;
}

interface BestPractice {
  id: number;
  title: string;
  description: string;
  icon: string;
  tips: string[];
}

interface RoleComparison {
  feature: string;
  admin: boolean;
  teacher: boolean;
  student: boolean;
}

const roleTemplates = ref<RoleTemplate[]>([
  {
    id: 1,
    name: '超级管理员',
    description: '拥有系统全部权限，适用于系统管理员和技术负责人',
    permissions: ['全部系统权限', '用户管理', '角色配置', '系统设置', '数据导出'],
    suitableFor: '系统管理员、IT 主管',
    icon: 'ph:crown-fill',
    color: '#f0a020'
  },
  {
    id: 2,
    name: '教师',
    description: '管理课程、学生和教学相关功能',
    permissions: ['课程管理', '学生管理', '作业批改', '成绩录入', '资源上传'],
    suitableFor: '任课教师、讲师',
    icon: 'ph:chalkboard-teacher-fill',
    color: '#2080f0'
  },
  {
    id: 3,
    name: '班主任',
    description: '管理班级学生，查看学习情况',
    permissions: ['班级管理', '学生查看', '成绩查看', '通知发送'],
    suitableFor: '班主任、辅导员',
    icon: 'ph:user-heart-fill',
    color: '#18a058'
  },
  {
    id: 4,
    name: '学生',
    description: '学习和完成作业的基本权限',
    permissions: ['课程学习', '作业提交', '成绩查询', '资源下载'],
    suitableFor: '在校学生',
    icon: 'ph:student-fill',
    color: '#409eff'
  }
]);

const bestPractices = ref<BestPractice[]>([
  {
    id: 1,
    title: '最小权限原则',
    description: '只授予用户完成工作所需的最小权限集',
    icon: 'ph:shield-check-fill',
    tips: ['定期审查角色权限配置', '避免过度授权', '按需分配临时权限', '及时回收离职人员权限']
  },
  {
    id: 2,
    title: '角色分层管理',
    description: '建立清晰的角色层级结构',
    icon: 'ph:layers-fill',
    tips: ['定义明确的角色职责边界', '建立角色继承关系', '避免角色重叠和冲突', '定期优化角色结构']
  },
  {
    id: 3,
    title: '权限审计',
    description: '定期进行权限使用审计',
    icon: 'ph:magnifying-glass-fill',
    tips: ['每月审查权限分配情况', '监控异常权限使用', '记录权限变更历史', '生成权限审计报告']
  },
  {
    id: 4,
    title: '安全最佳实践',
    description: '确保角色和权限管理的安全性',
    icon: 'ph:lock-key-fill',
    tips: ['启用双因素认证', '定期更新密码策略', '限制敏感操作权限', '实施权限变更审批流程']
  }
]);

const roleComparison = ref<RoleComparison[]>([
  { feature: '用户管理', admin: true, teacher: false, student: false },
  { feature: '课程管理', admin: true, teacher: true, student: false },
  { feature: '作业管理', admin: true, teacher: true, student: false },
  { feature: '成绩查看', admin: true, teacher: true, student: true },
  { feature: '资源下载', admin: true, teacher: true, student: true },
  { feature: '系统设置', admin: true, teacher: false, student: false },
  { feature: '数据导出', admin: true, teacher: false, student: false },
  { feature: '角色配置', admin: true, teacher: false, student: false }
]);

const commonQuestions = ref([
  {
    question: '如何创建新角色？',
    answer: '点击"新增角色"按钮，填写角色名称和描述，然后勾选该角色需要的权限，最后保存即可。'
  },
  {
    question: '如何修改现有角色的权限？',
    answer: '在角色列表中找到目标角色，点击"编辑"按钮，调整权限配置后保存。注意：修改会影响所有拥有该角色的用户。'
  },
  {
    question: '角色可以被删除吗？',
    answer: '可以删除自定义角色，但系统内置角色（如超级管理员）不可删除。删除前请确保该角色没有被任何用户使用。'
  },
  {
    question: '如何查看某个角色的权限详情？',
    answer: '点击角色卡片或列表中的角色名称，可以查看该角色的详细权限配置、用户数量和使用情况统计。'
  }
]);
</script>

<template>
  <div class="space-y-16px">
    <!-- 角色模板展示 -->
    <NCard :bordered="false" class="card-wrapper" title="角色模板">
      <template #header-extra>
        <NTag type="primary" size="small">预定义角色配置</NTag>
      </template>
      <div class="grid grid-cols-1 gap-16px lg:grid-cols-4 md:grid-cols-2">
        <div
          v-for="template in roleTemplates"
          :key="template.id"
          class="group relative overflow-hidden border border-gray-100 rounded-12px bg-white p-20px transition-all dark:border-gray-700 dark:bg-gray-800 hover:shadow-xl"
        >
          <div
            class="absolute size-80px rounded-full opacity-10 transition-all -right-16px -top-16px group-hover:scale-150"
            :style="{ backgroundColor: template.color }"
          ></div>
          <div class="relative">
            <div class="mb-16px flex items-center gap-12px">
              <div
                class="size-48px flex items-center justify-center rounded-10px"
                :style="{ backgroundColor: `${template.color}20` }"
              >
                <SvgIcon :icon="template.icon" :style="{ color: template.color }" class="text-24px" />
              </div>
              <div>
                <h3 class="text-16px font-semibold">{{ template.name }}</h3>
              </div>
            </div>
            <p class="mb-12px text-13px text-gray-600 dark:text-gray-400">{{ template.description }}</p>
            <div class="mb-12px">
              <div class="text-12px text-gray-500 font-medium">适用人群：</div>
              <div class="text-13px text-gray-700 dark:text-gray-300">{{ template.suitableFor }}</div>
            </div>
            <div class="flex flex-wrap gap-8px">
              <NTag
                v-for="perm in template.permissions.slice(0, 3)"
                :key="perm"
                size="small"
                :type="
                  template.color === '#f0a020'
                    ? 'warning'
                    : template.color === '#2080f0'
                      ? 'primary'
                      : template.color === '#18a058'
                        ? 'success'
                        : 'default'
                "
                :bordered="false"
              >
                {{ perm }}
              </NTag>
              <NTag v-if="template.permissions.length > 3" size="small" :bordered="false">
                +{{ template.permissions.length - 3 }}
              </NTag>
            </div>
          </div>
        </div>
      </div>
    </NCard>

    <!-- 最佳实践 -->
    <NCard :bordered="false" class="card-wrapper" title="最佳实践">
      <template #header-extra>
        <NButton text type="primary">
          <template #icon>
            <SvgIcon icon="ph:download-simple" />
          </template>
          下载指南
        </NButton>
      </template>
      <div class="grid grid-cols-1 gap-16px md:grid-cols-2">
        <div
          v-for="practice in bestPractices"
          :key="practice.id"
          class="interactive-card relative overflow-hidden rounded-12px from-white to-gray-50 bg-gradient-to-br p-20px shadow-sm transition-all dark:from-gray-800 dark:to-gray-900 hover:shadow-lg"
        >
          <div
            class="absolute size-64px rounded-full bg-gray-50 opacity-50 -right-12px -top-12px dark:bg-gray-700"
          ></div>
          <div class="relative">
            <div class="mb-16px flex items-center gap-12px">
              <div class="size-44px flex items-center justify-center rounded-10px bg-primary/10">
                <SvgIcon :icon="practice.icon" class="text-22px text-primary" />
              </div>
              <h3 class="text-16px font-semibold">{{ practice.title }}</h3>
            </div>
            <p class="mb-16px text-14px text-gray-600 dark:text-gray-400">{{ practice.description }}</p>
            <ul class="space-y-8px">
              <li
                v-for="(tip, index) in practice.tips"
                :key="index"
                class="flex items-start gap-8px text-13px text-gray-600 dark:text-gray-400"
              >
                <SvgIcon icon="ph:check-circle-fill" class="mt-4px flex-shrink-0 text-green-500" />
                <span>{{ tip }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </NCard>

    <!-- 角色权限对比表 -->
    <NCard :bordered="false" class="card-wrapper" title="角色权限对比">
      <NTable :bordered="false" size="small">
        <thead>
          <tr>
            <th class="text-left">功能模块</th>
            <th class="text-center">
              <div class="flex items-center justify-center gap-8px">
                <div class="size-8px rounded-full bg-amber-500"></div>
                超级管理员
              </div>
            </th>
            <th class="text-center">
              <div class="flex items-center justify-center gap-8px">
                <div class="size-8px rounded-full bg-blue-500"></div>
                教师
              </div>
            </th>
            <th class="text-center">
              <div class="flex items-center justify-center gap-8px">
                <div class="size-8px rounded-full bg-green-500"></div>
                学生
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in roleComparison" :key="row.feature" class="hover:bg-gray-50 dark:hover:bg-gray-800">
            <td class="font-medium">{{ row.feature }}</td>
            <td class="text-center">
              <NTag v-if="row.admin" type="warning" size="small" :bordered="false">
                <template #icon>
                  <SvgIcon icon="ph:check-fill" />
                </template>
                有权限
              </NTag>
              <span v-else class="text-gray-400">-</span>
            </td>
            <td class="text-center">
              <NTag v-if="row.teacher" type="primary" size="small" :bordered="false">
                <template #icon>
                  <SvgIcon icon="ph:check-fill" />
                </template>
                有权限
              </NTag>
              <span v-else class="text-gray-400">-</span>
            </td>
            <td class="text-center">
              <NTag v-if="row.student" type="success" size="small" :bordered="false">
                <template #icon>
                  <SvgIcon icon="ph:check-fill" />
                </template>
                有权限
              </NTag>
              <span v-else class="text-gray-400">-</span>
            </td>
          </tr>
        </tbody>
      </NTable>
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
