<script setup lang="ts">
import { computed } from 'vue';
import { createReusableTemplate } from '@vueuse/core';

defineOptions({
  name: 'EnhancedAdminCardData'
});

interface CardData {
  key: string;
  title: string;
  value: number;
  unit: string;
  color: { start: string; end: string };
  icon: string;
  trend: number;
  trendUp: boolean;
}

const cardData = computed<CardData[]>(() => [
  {
    key: 'userCount',
    title: '用户总数',
    value: 1280,
    unit: '',
    color: { start: '#ec4786', end: '#b955a4' },
    icon: 'ant-design:user-outlined',
    trend: 12.5,
    trendUp: true
  },
  {
    key: 'teacherCount',
    title: '教师数量',
    value: 86,
    unit: '',
    color: { start: '#865ec0', end: '#5144b4' },
    icon: 'ant-design:team-outlined',
    trend: 8.2,
    trendUp: true
  },
  {
    key: 'studentCount',
    title: '学生数量',
    value: 1194,
    unit: '',
    color: { start: '#56cdf3', end: '#719de3' },
    icon: 'ant-design:solution-outlined',
    trend: 15.3,
    trendUp: true
  },
  {
    key: 'courseCount',
    title: '课程总数',
    value: 156,
    unit: '',
    color: { start: '#fcbc25', end: '#f68057' },
    icon: 'ant-design:book-outlined',
    trend: 5.7,
    trendUp: false
  }
]);

const quickStats = computed(() => [
  { key: 'onlineUsers', title: '在线用户', value: 328, icon: 'ph:users-three-fill', color: '#18a058' },
  { key: 'activeCourses', title: '进行中课程', value: 42, icon: 'ph:books-fill', color: '#2080f0' },
  { key: 'pendingTasks', title: '待处理任务', value: 18, icon: 'ph:list-checks-fill', color: '#f0a020' },
  { key: 'systemHealth', title: '系统健康度', value: '98%', icon: 'ph:heartbeat-fill', color: '#d03050' }
]);

interface GradientBgProps {
  gradientColor: string;
}

const [DefineGradientBg, GradientBg] = createReusableTemplate<GradientBgProps>();

function getGradientColor(color: CardData['color']) {
  return `linear-gradient(to bottom right, ${color.start}, ${color.end})`;
}
</script>

<template>
  <NCard :bordered="false" size="small" class="card-wrapper">
    <DefineGradientBg v-slot="{ $slots, gradientColor }">
      <div class="rd-8px px-16px pb-4px pt-8px text-white" :style="{ backgroundImage: gradientColor }">
        <component :is="$slots.default" />
      </div>
    </DefineGradientBg>

    <NGrid cols="s:1 m:2 l:4" responsive="screen" :x-gap="16" :y-gap="16">
      <NGi v-for="item in cardData" :key="item.key">
        <GradientBg :gradient-color="getGradientColor(item.color)" class="flex-1">
          <div class="flex items-start justify-between">
            <div>
              <h3 class="text-16px">{{ item.title }}</h3>
              <div class="flex items-center gap-8px pt-8px">
                <CountTo
                  :prefix="item.unit"
                  :start-value="1"
                  :end-value="item.value"
                  class="text-28px text-white dark:text-dark"
                />
              </div>
              <div class="flex items-center gap-4px pt-4px text-12px">
                <span :class="item.trendUp ? 'text-green-200' : 'text-red-200'">
                  {{ item.trendUp ? '↑' : '↓' }} {{ item.trend }}%
                </span>
                <span class="text-white/70">较上周</span>
              </div>
            </div>
            <SvgIcon :icon="item.icon" class="text-36px text-white/80" />
          </div>
        </GradientBg>
      </NGi>
    </NGrid>

    <NDivider />

    <NGrid cols="s:2 m:4" responsive="screen" :x-gap="16" :y-gap="16">
      <NGi v-for="item in quickStats" :key="item.key">
        <div class="flex items-center gap-12px rounded-lg bg-gray-50 p-12px dark:bg-dark">
          <div class="size-40px flex-center rd-8px" :style="{ backgroundColor: item.color + '20' }">
            <SvgIcon :icon="item.icon" class="text-20px" :style="{ color: item.color }" />
          </div>
          <div>
            <div class="text-12px text-gray-500">{{ item.title }}</div>
            <div class="text-18px font-semibold">{{ item.value }}</div>
          </div>
        </div>
      </NGi>
    </NGrid>
  </NCard>
</template>

<style scoped></style>
