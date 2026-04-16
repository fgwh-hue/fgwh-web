// 文件：src/views/student/learning-progress/modules/PieChart.vue
<script setup lang="ts">
import { watch } from 'vue';
import { useEcharts } from '@/hooks/common/echarts';

interface PieData {
  value: number;
  name: string;
}
interface Props {
  data: PieData[];
}
const props = defineProps<Props>();

const { domRef, setOptions } = useEcharts(() => ({
  title: { text: '学科学习时长分布', left: 'center' },
  tooltip: { trigger: 'item' },
  legend: { orient: 'vertical', left: 'left', top: '10%' },
  series: [
    {
      name: '学习时长',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['65%', '50%'],
      data: props.data,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
}));

watch(
  () => props.data,
  newData => {
    setOptions({
      title: { text: '学科学习时长分布', left: 'center' },
      tooltip: { trigger: 'item' },
      legend: { orient: 'vertical', left: 'left', top: '10%' },
      series: [
        {
          name: '学习时长',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['65%', '50%'],
          data: newData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
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
