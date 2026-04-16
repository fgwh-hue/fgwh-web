// 文件：src/views/student/learning-progress/modules/LineChart.vue
<script setup lang="ts">
import { watch } from 'vue';
import { useEcharts } from '@/hooks/common/echarts';

interface Props {
  showAverage: boolean;
  averageScores: number[];
}
const props = defineProps<Props>();

const { domRef, setOptions } = useEcharts(() => ({
  tooltip: { trigger: 'axis' },
  legend: {
    data: ['我的成绩', '班级平均分'],
    top: '5%'
  },
  grid: { top: '25%', left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: {
    type: 'category',
    data: ['第一次测验', '第二次测验', '期中考试', '第三次测验']
  },
  yAxis: { type: 'value', min: 60 },
  series: [
    {
      name: '我的成绩',
      data: [88, 92, 85, 95],
      type: 'line',
      smooth: true
    },
    {
      name: '班级平均分',
      data: [] as number[],
      type: 'line',
      smooth: true,
      lineStyle: {
        type: 'dashed'
      }
    }
  ]
}));

watch(
  () => props.showAverage,
  newValue => {
    setOptions({
      tooltip: { trigger: 'axis' },
      legend: {
        data: ['我的成绩', '班级平均分'],
        top: '5%'
      },
      grid: { top: '25%', left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        data: ['第一次测验', '第二次测验', '期中考试', '第三次测验']
      },
      yAxis: { type: 'value', min: 60 },
      series: [
        {
          name: '我的成绩',
          data: [88, 92, 85, 95],
          type: 'line',
          smooth: true
        },
        {
          name: '班级平均分',
          data: newValue ? props.averageScores : [],
          type: 'line',
          smooth: true,
          lineStyle: {
            type: 'dashed'
          }
        }
      ]
    });
  }
);
</script>

<template>
  <div ref="domRef" class="h-full w-full"></div>
</template>
