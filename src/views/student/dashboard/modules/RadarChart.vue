<script setup lang="ts">
import { useEcharts } from '@/hooks/common/echarts';

interface Props {
  title: string;
  indicator: { name: string; max: number }[];
  data: { name: string; value: number[] }[];
}
const props = defineProps<Props>();

const { domRef } = useEcharts(() => ({
  title: {
    text: props.title,
    left: 'center'
  },
  tooltip: {
    trigger: 'item'
  },
  radar: {
    indicator: props.indicator,
    center: ['50%', '60%'] // <-- 核心修改在这里
  },
  series: [
    {
      type: 'radar',
      data: props.data
    }
  ]
}));
</script>

<template>
  <div ref="domRef" class="h-full w-full"></div>
</template>
