<script setup lang="ts">
import { ref } from 'vue';

defineOptions({
  name: 'MenuGuide'
});

interface BestPractice {
  id: number;
  title: string;
  description: string;
  icon: string;
  tips: string[];
}

interface DesignPrinciple {
  id: number;
  title: string;
  description: string;
  icon: string;
  example: string;
}

const bestPractices = ref<BestPractice[]>([
  {
    id: 1,
    title: '清晰的导航结构',
    description: '设计直观、层次分明的菜单结构',
    icon: 'ph:compass-fill',
    tips: ['保持菜单层级不超过 3 级', '使用清晰易懂的菜单名称', '合理分组相关功能', '避免菜单项过多']
  },
  {
    id: 2,
    title: '一致性原则',
    description: '保持菜单风格和命名的一致性',
    icon: 'ph:equals-fill',
    tips: ['统一使用图标风格', '保持命名规范一致', '使用统一的配色方案', '遵循相同的设计模式']
  },
  {
    id: 3,
    title: '权限控制',
    description: '根据角色配置菜单可见性',
    icon: 'ph:lock-key-fill',
    tips: ['实施基于角色的菜单过滤', '隐藏无权限的菜单项', '定期审查权限配置', '记录菜单访问日志']
  },
  {
    id: 4,
    title: '性能优化',
    description: '优化菜单加载和渲染性能',
    icon: 'ph:lightning-fill',
    tips: ['使用懒加载加载子菜单', '缓存菜单数据', '优化图标资源', '减少不必要的重渲染']
  }
]);

const designPrinciples = ref<DesignPrinciple[]>([
  {
    id: 1,
    title: '简洁性',
    description: '菜单设计应简洁明了，避免复杂',
    icon: 'ph:minus-circle-fill',
    example: '示例：将相关功能归类到同一菜单项下，而不是创建多个分散的菜单'
  },
  {
    id: 2,
    title: '可发现性',
    description: '确保用户能够轻松找到所需功能',
    icon: 'ph:magnifying-glass-fill',
    example: '示例：使用搜索功能快速定位菜单项，提供面包屑导航'
  },
  {
    id: 3,
    title: '可扩展性',
    description: '菜单结构应支持未来的功能扩展',
    icon: 'ph:arrows-out-line-horizontal-fill',
    example: '示例：预留菜单位置，使用模块化设计便于添加新功能'
  },
  {
    id: 4,
    title: '响应式',
    description: '菜单在不同设备上都能良好显示',
    icon: 'ph:devices-fill',
    example: '示例：移动端使用汉堡菜单，桌面端显示完整导航栏'
  }
]);

const commonQuestions = ref([
  {
    question: '如何添加新的菜单项？',
    answer:
      '点击"新增菜单"按钮，选择菜单类型（目录/菜单/按钮），填写名称、路径、图标等信息，然后选择父级菜单（如果适用），最后保存。'
  },
  {
    question: '如何调整菜单顺序？',
    answer: '在菜单列表中使用拖拽功能，或者在编辑菜单时修改"排序"字段的数值，数值越小越靠前。'
  },
  {
    question: '如何隐藏某个菜单项？',
    answer:
      '编辑菜单项，将"是否显示"开关关闭，或者设置"隐藏"属性。隐藏的菜单不会在导航栏中显示，但仍然可以通过 URL 访问。'
  },
  {
    question: '菜单图标如何选择？',
    answer:
      '系统提供了丰富的图标库（Phosphor Icons），可以在编辑菜单时从图标选择器中选择。建议使用语义相关的图标，保持视觉一致性。'
  }
]);
</script>

<template>
  <div class="space-y-16px">
    <!-- 设计原则 -->
    <NCard :bordered="false" class="card-wrapper" title="菜单设计原则">
      <div class="grid grid-cols-1 gap-16px lg:grid-cols-4 md:grid-cols-2">
        <div
          v-for="principle in designPrinciples"
          :key="principle.id"
          class="interactive-card rounded-12px from-white to-gray-50 bg-gradient-to-br p-20px shadow-sm transition-all dark:from-gray-800 dark:to-gray-900 hover:shadow-lg"
        >
          <div class="mb-16px flex items-center gap-12px">
            <div class="size-44px flex items-center justify-center rounded-10px bg-primary/10">
              <SvgIcon :icon="principle.icon" class="text-22px text-primary" />
            </div>
            <h3 class="text-16px font-semibold">{{ principle.title }}</h3>
          </div>
          <p class="mb-12px text-14px text-gray-600 dark:text-gray-400">{{ principle.description }}</p>
          <div class="rounded-6px bg-blue-50 p-12px dark:bg-blue-900/20">
            <p class="text-12px text-blue-600 dark:text-blue-400">{{ principle.example }}</p>
          </div>
        </div>
      </div>
    </NCard>

    <!-- 最佳实践 -->
    <NCard :bordered="false" class="card-wrapper" title="最佳实践">
      <div class="grid grid-cols-1 gap-16px md:grid-cols-2">
        <div
          v-for="practice in bestPractices"
          :key="practice.id"
          class="group relative overflow-hidden border border-gray-100 rounded-12px bg-white p-20px transition-all dark:border-gray-700 dark:bg-gray-800 hover:shadow-lg"
        >
          <div
            class="absolute size-64px rounded-full bg-gray-50 opacity-50 transition-all -right-12px -top-12px group-hover:scale-150 dark:bg-gray-700"
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
