<script setup lang="ts">
import { useEcharts } from '@/hooks/common/echarts';

const { domRef } = useEcharts(() => ({
  series: [
    {
      type: 'gauge',
      center: ['50%', '60%'],
      startAngle: 200,
      endAngle: -20,
      min: 0,
      max: 100,
      splitNumber: 10,
      progress: {
        show: true,
        width: 15
      },
      axisLine: {
        lineStyle: {
          width: 15
        }
      },
      axisTick: {
        distance: -25,
        length: 5,
        lineStyle: {
          width: 1,
          color: '#999'
        }
      },
      splitLine: {
        distance: -28,
        length: 10,
        lineStyle: {
          width: 2,
          color: '#999'
        }
      },
      axisLabel: {
        distance: -10,
        color: '#999',
        fontSize: 14
      },
      anchor: {
        show: false
      },
      pointer: {
        show: false
      },
      detail: {
        valueAnimation: true,
        fontSize: 24,
        offsetCenter: [0, 0],
        formatter: '{value}%'
      },
      title: {
        offsetCenter: [0, '35%'],
        fontSize: 16
      },
      data: [
        {
          value: 80, // 模拟数据
          name: '综合得分'
        }
      ]
    }
  ]
}));
</script>

<template>
  <div ref="domRef" class="h-full w-full"></div>
</template>
