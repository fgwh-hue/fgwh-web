<script setup lang="ts">
import { computed } from 'vue';
import { createReusableTemplate } from '@vueuse/core';

defineOptions({
  name: 'StudentCardData'
});

interface CardData {
  key: string;
  title: string;
  value: number;
  unit: string;
  color: { start: string; end: string };
  icon: string;
}

const cardData = computed<CardData[]>(() => [
  {
    key: 'courseCount',
    title: '在学课程',
    value: 8,
    unit: '',
    color: { start: '#ec4786', end: '#b955a4' },
    icon: 'ant-design:book-outlined'
  },
  {
    key: 'studyHours',
    title: '学习时长(小时)',
    value: 126,
    unit: '',
    color: { start: '#865ec0', end: '#5144b4' },
    icon: 'ant-design:clock-circle-outlined'
  },
  {
    key: 'completedTask',
    title: '完成作业',
    value: 45,
    unit: '',
    color: { start: '#56cdf3', end: '#719de3' },
    icon: 'ant-design:check-circle-outlined'
  },
  {
    key: 'avgScore',
    title: '平均成绩',
    value: 92,
    unit: '',
    color: { start: '#fcbc25', end: '#f68057' },
    icon: 'ant-design:trophy-outlined'
  }
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
          <h3 class="text-16px">{{ item.title }}</h3>
          <div class="flex justify-between pt-12px">
            <SvgIcon :icon="item.icon" class="text-32px" />
            <CountTo
              :prefix="item.unit"
              :start-value="1"
              :end-value="item.value"
              class="text-30px text-white dark:text-dark"
            />
          </div>
        </GradientBg>
      </NGi>
    </NGrid>
  </NCard>
</template>

<style scoped></style>
