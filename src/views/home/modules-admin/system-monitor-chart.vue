<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useEcharts } from '@/hooks/common/echarts';

defineOptions({
  name: 'SystemMonitorChart'
});

const isLoading = ref(true);

const { domRef, updateOptions } = useEcharts(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      lineStyle: {
        color: 'rgba(64, 158, 255, 0.3)'
      }
    },
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: '#e8e8e8',
    borderWidth: 1,
    textStyle: {
      color: '#333'
    }
  },
  legend: {
    data: ['CPU使用率', '内存使用率', '网络带宽'],
    bottom: 0,
    textStyle: {
      fontSize: 12,
      color: '#666'
    },
    itemWidth: 10,
    itemHeight: 10
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '15%',
    top: '5%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: [] as string[],
    axisLine: {
      lineStyle: {
        color: '#e8e8e8'
      }
    },
    axisLabel: {
      fontSize: 11,
      color: '#999',
      rotate: 45
    }
  },
  yAxis: [
    {
      type: 'value',
      name: '百分比 (%)',
      min: 0,
      max: 100,
      axisLabel: {
        formatter: '{value}%',
        fontSize: 11,
        color: '#999'
      },
      axisLine: {
        show: false
      },
      splitLine: {
        lineStyle: {
          color: '#f0f0f0',
          type: 'dashed'
        }
      }
    },
    {
      type: 'value',
      name: '带宽 (Mbps)',
      min: 0,
      max: 100,
      axisLabel: {
        formatter: '{value} Mbps',
        fontSize: 11,
        color: '#999'
      },
      axisLine: {
        show: false
      },
      splitLine: {
        show: false
      }
    }
  ],
  series: [
    {
      name: 'CPU使用率',
      type: 'line',
      smooth: true,
      data: [] as number[],
      itemStyle: { color: '#f5222d' },
      lineStyle: {
        width: 2
      },
      symbol: 'circle',
      symbolSize: 4,

      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(245,34,45,0.3)' },
            { offset: 1, color: 'rgba(245,34,45,0.05)' }
          ]
        }
      }
    },
    {
      name: '内存使用率',
      type: 'line',
      smooth: true,
      data: [] as number[],
      itemStyle: { color: '#722ed1' },
      lineStyle: {
        width: 2
      },
      symbol: 'circle',
      symbolSize: 4,

      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(114,46,209,0.3)' },
            { offset: 1, color: 'rgba(114,46,209,0.05)' }
          ]
        }
      }
    },
    {
      name: '网络带宽',
      type: 'line',
      yAxisIndex: 1,
      smooth: true,
      data: [] as number[],
      itemStyle: { color: '#13c2c2' },
      lineStyle: {
        width: 2
      },
      symbol: 'circle',
      symbolSize: 4,

      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(19,194,194,0.3)' },
            { offset: 1, color: 'rgba(19,194,194,0.05)' }
          ]
        }
      }
    }
  ]
}));

function generateTimeLabels() {
  const labels: string[] = [];
  const now = new Date();
  for (let i = 23; i >= 0; i -= 1) {
    const time = new Date(now.getTime() - i * 3600000);
    labels.push(`${time.getHours().toString().padStart(2, '0')}:00`);
  }
  return labels;
}

function generateRandomData(min: number, max: number, count: number) {
  return Array.from({ length: count }, () => Math.round((Math.random() * (max - min) + min) * 10) / 10);
}

let updateInterval: number | null = null;

async function mockData() {
  await new Promise(resolve => {
    setTimeout(resolve, 300);
  });

  updateOptions(opts => {
    if (Array.isArray(opts.xAxis)) {
      opts.xAxis[0].data = generateTimeLabels();
    } else if (opts.xAxis) {
      opts.xAxis.data = generateTimeLabels();
    }
    const cpuData = generateRandomData(20, 65, 24);
    const memData = generateRandomData(40, 80, 24);
    const netData = generateRandomData(10, 85, 24);
    (opts.series as any)[0].data = cpuData;
    (opts.series as any)[1].data = memData;
    (opts.series as any)[2].data = netData;
    return opts;
  });

  isLoading.value = false;
}

function startRealTimeUpdate() {
  updateInterval = window.setInterval(() => {
    updateOptions(opts => {
      const cpuData = generateRandomData(20, 65, 24);
      const memData = generateRandomData(40, 80, 24);
      const netData = generateRandomData(10, 85, 24);
      (opts.series as any)[0].data = cpuData;
      (opts.series as any)[1].data = memData;
      (opts.series as any)[2].data = netData;
      return opts;
    });
  }, 5000);
}

onMounted(() => {
  mockData();
  startRealTimeUpdate();
});

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval);
  }
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
