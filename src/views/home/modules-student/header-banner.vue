<script setup lang="ts">
import { computed } from 'vue';
import { useAppStore } from '@/store/modules/app';

defineOptions({
  name: 'StudentHeaderBanner'
});

const appStore = useAppStore();
const gap = computed(() => (appStore.isMobile ? 0 : 16));

interface StatisticData {
  id: number;
  label: string;
  value: string;
}

const statisticData = computed<StatisticData[]>(() => [
  { id: 0, label: '已学课程', value: '12' },
  { id: 1, label: '待完成作业', value: '3' },
  { id: 2, label: '学习积分', value: '860' }
]);
</script>

<template>
  <NCard :bordered="false" class="card-wrapper">
    <NGrid :x-gap="gap" :y-gap="16" responsive="screen" item-responsive>
      <NGi span="24 s:24 m:18">
        <div class="flex-y-center">
          <div class="size-72px shrink-0 overflow-hidden rd-1/2">
            <img src="@/assets/imgs/soybean.jpg" class="size-full" />
          </div>
          <div class="pl-12px">
            <h3 class="text-18px font-semibold">早安，同学，今天也要加油学习哦！</h3>
            <p class="text-#999 leading-30px">知识改变命运，学习成就未来</p>
          </div>
        </div>
      </NGi>
      <NGi span="24 s:24 m:6">
        <NSpace :size="24" justify="end">
          <NStatistic v-for="item in statisticData" :key="item.id" class="whitespace-nowrap" v-bind="item" />
        </NSpace>
      </NGi>
    </NGrid>
  </NCard>
</template>

<style scoped></style>
