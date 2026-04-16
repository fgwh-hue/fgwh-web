<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useEcharts } from '@/hooks/common/echarts';

defineOptions({
  name: 'PopularFeaturesChart'
});

const isLoading = ref(true);

const { domRef, updateOptions } = useEcharts(() => ({
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c} ({d}%)',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: '#e8e8e8',
    borderWidth: 1,
    textStyle: {
      color: '#333'
    }
  },
  legend: {
    orient: 'vertical',
    right: '5%',
    top: 'center',
    textStyle: {
      fontSize: 12,
      color: '#666'
    },
    itemWidth: 10,
    itemHeight: 10,
    itemGap: 12
  },
  series: [
    {
      name: '功能使用',
      type: 'pie',
      radius: ['45%', '70%'],
      center: ['35%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 8,
        borderColor: '#fff',
        borderWidth: 2,
        shadowBlur: 5,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.1)'
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 16,
          fontWeight: 'bold',
          color: '#333'
        },
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.2)'
        }
      },
      labelLine: {
        show: false
      },
      data: [] as { value: number; name: string }[]
    }
  ]
}));

const featureColors = [
  '#f5222d', // 红色
  '#fa8c16', // 橙色
  '#faad14', // 黄色
  '#52c41a', // 绿色
  '#1890ff', // 蓝色
  '#722ed1' // 紫色
];

async function mockData() {
  await new Promise(resolve => {
    setTimeout(resolve, 300);
  });

  updateOptions(opts => {
    const data = [
      { value: 2840, name: '课程学习' },
      { value: 1650, name: '作业提交' },
      { value: 980, name: 'AI助教' },
      { value: 720, name: '学习进度' },
      { value: 450, name: '数据分析' },
      { value: 280, name: '社区互动' }
    ];

    // 为每个数据项添加颜色
    data.forEach((item, index) => {
      (item as any).itemStyle = {
        color: featureColors[index % featureColors.length]
      };
    });

    (opts.series as any)[0].data = data;
    return opts;
  });

  isLoading.value = false;
}

onMounted(() => {
  mockData();
});
</script>

<template>
  <div class="relative h-full w-full">
    <div v-if="isLoading" class="absolute inset-0 z-10 flex items-center justify-center bg-white/80">
      <div class="h-8 w-8 animate-spin border-b-2 border-blue-500 rounded-full"></div>
    </div>
    <div ref="domRef" class="h-full w-full overflow-hidden"></div>
  </div>
</template>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
