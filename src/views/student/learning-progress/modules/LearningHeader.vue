<script setup lang="ts">
import { computed } from 'vue';
import { useRouterPush } from '@/hooks/common/router';

defineOptions({
  name: 'LearningHeader'
});

interface Kpi {
  label: string;
  value: string | number;
  icon: string; // 新增图标属性
}

interface Props {
  kpiData: Kpi[];
}

defineProps<Props>();

const { routerPushByKey } = useRouterPush();

// 学习提示语数组
const studyTips = [
  '今日事今日毕，别让拖延成为习惯。',
  '温故而知新，记得复习昨天学过的内容。',
  '设定一个小目标，然后去完成它！',
  '分享是最好的学习方式，试着把新知识讲给别人听。',
  '保持好奇心，它是探索知识的源动力。'
];

// 随机选择一条提示语
const randomTip = computed(() => studyTips[Math.floor(Math.random() * studyTips.length)]);
</script>

<template>
  <NCard :bordered="false" class="interactive-item card-wrapper">
    <NGrid :x-gap="16" :y-gap="16" cols="1 s:1 m:1 l:3" responsive="screen">
      <!-- 左侧：问候语和操作按钮 -->
      <NGi span="1 l:2">
        <div class="h-full flex flex-col justify-center">
          <h2 class="text-2xl font-bold">你好, fgwh!</h2>
          <p class="mt-2 text-gray-500">今日学习小贴士：{{ randomTip }}</p>
          <NSpace class="mt-6">
            <NButton type="primary" size="large" class="animate-pulse" @click="routerPushByKey('student_dashboard')">
              开始新课程
            </NButton>
            <NButton size="large" @click="routerPushByKey('student_ai-tutor')">咨询AI助教</NButton>
          </NSpace>
        </div>
      </NGi>

      <!-- 右侧：插图 -->
      <NGi span="1 l:1" class="l:flex hidden items-center justify-center">
        <SvgIcon local-icon="banner" class="text-300px text-primary" />
      </NGi>
    </NGrid>

    <!-- 底部：核心指标 -->
    <NDivider class="!my-6" />
    <NGrid :x-gap="16" :y-gap="16" cols="2 s:3 m:5" responsive="screen">
      <NGi v-for="(item, index) in kpiData" :key="index">
        <div class="flex flex-col items-center">
          <div class="flex items-center text-gray-500">
            <SvgIcon :icon="item.icon" class="mr-2 text-lg" />
            <span>{{ item.label }}</span>
          </div>
          <p class="mt-1 text-2xl font-semibold">{{ item.value }}</p>
        </div>
      </NGi>
    </NGrid>
  </NCard>
</template>

<style scoped>
/* 确保 NCard 内容区域有足够空间 */
:deep(.n-card__content) {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
