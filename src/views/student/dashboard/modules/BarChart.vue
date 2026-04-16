<script setup lang="ts">
import { watch } from 'vue';
import { type ECOption, useEcharts } from '@/hooks/common/echarts';

const props = defineProps<{
  data?: number[];
  labels?: string[];
  title?: string;
  colors?: string[];
  chartType?: 'bar' | 'line';
  seriesData?: Array<{
    name: string;
    data: number[];
    color?: string;
    lineStyle?: any;
    symbol?: string;
    smooth?: boolean;
  }>;
}>();

function createChartOption(): ECOption {
  const defaultConfig: ECOption = {
    title: {
      text: props.title || '数据图表',
      left: 'center',
      textStyle: {
        fontSize: 14,
        fontWeight: 'normal' as const
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: props.chartType === 'bar' ? 'shadow' : 'cross'
      }
    },
    grid: {
      top: '20%',
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: props.labels || ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: {
      type: 'value',
      max: 100
    },
    series: []
  };

  if (props.seriesData && props.seriesData.length > 0) {
    defaultConfig.series = props.seriesData.map((item, index) => ({
      name: item.name,
      type: props.chartType || 'line',
      data: item.data,
      smooth: item.smooth !== undefined ? item.smooth : true,
      symbol: item.symbol || 'circle',
      symbolSize: 6,
      lineStyle: {
        width: 3,
        ...item.lineStyle
      },
      itemStyle: {
        color: item.color || getDefaultColor(index)
      },
      areaStyle:
        props.chartType === 'line'
          ? {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: item.color ? `${item.color}80` : `${getDefaultColor(index)}80`
                  },
                  {
                    offset: 1,
                    color: item.color ? `${item.color}10` : `${getDefaultColor(index)}10`
                  }
                ]
              }
            }
          : undefined
    }));

    defaultConfig.legend = {
      data: props.seriesData.map(item => item.name),
      bottom: '2%'
    };
  } else if (props.data) {
    defaultConfig.series = [
      {
        name: '数据',
        type: props.chartType || 'line',
        data: props.data,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          width: 3,
          type: 'solid'
        },
        itemStyle: {
          color: props.colors?.[0] || '#667eea'
        },
        areaStyle:
          props.chartType === 'line'
            ? {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: `${props.colors?.[0] || '#667eea'}80`
                    },
                    {
                      offset: 1,
                      color: `${props.colors?.[0] || '#667eea'}10`
                    }
                  ]
                }
              }
            : undefined
      }
    ];
  }

  return defaultConfig;
}

const { domRef, updateOptions } = useEcharts(createChartOption);

watch(
  () => [props.data, props.labels, props.title, props.seriesData, props.chartType],
  () => {
    updateOptions(() => createChartOption());
  },
  { deep: true }
);

function getDefaultColor(index: number): string {
  const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe'];
  return colors[index % colors.length];
}
</script>

<template>
  <div ref="domRef" class="h-full w-full"></div>
</template>
