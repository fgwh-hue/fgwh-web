<script setup lang="ts">
import { nextTick } from 'vue';
import { useEcharts } from '@/hooks/common/echarts';

defineOptions({
  name: 'UserActivityChart'
});

const { domRef, updateOptions } = useEcharts(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {
    data: ['学生', '教师', '管理员'],
    bottom: 0
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '15%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: [] as string[]
  },
  yAxis: {
    type: 'value',
    name: '活跃用户数'
  },
  series: [
    {
      name: '学生',
      type: 'bar',
      stack: 'total',
      barWidth: '40%',
      data: [] as number[],
      itemStyle: { color: '#4096ff' }
    },
    {
      name: '教师',
      type: 'bar',
      stack: 'total',
      barWidth: '40%',
      data: [] as number[],
      itemStyle: { color: '#7c3aed' }
    },
    {
      name: '管理员',
      type: 'bar',
      stack: 'total',
      barWidth: '40%',
      data: [] as number[],
      itemStyle: { color: '#10b981' }
    }
  ]
}));

async function mockData() {
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  updateOptions(opts => {
    opts.xAxis.data = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    const seriesData = [
      [420, 380, 450, 390, 480, 520, 580],
      [45, 52, 48, 55, 42, 38, 35],
      [12, 15, 11, 18, 14, 10, 8]
    ];
    (opts.series as any)[0].data = seriesData[0];
    (opts.series as any)[1].data = seriesData[1];
    (opts.series as any)[2].data = seriesData[2];
    return opts;
  });

  // 等待数据更新后，强制图表 resize 到容器高度
  await nextTick();
  await new Promise(resolve => {
    setTimeout(resolve, 100);
  });
}

mockData();
</script>

<template>
  <div ref="domRef" class="h-full w-full overflow-hidden"></div>
</template>

<style scoped></style>
