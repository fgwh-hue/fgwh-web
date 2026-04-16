<script setup lang="ts">
import { computed } from 'vue';

defineOptions({
  name: 'StudentProjectNews'
});

interface NewsItem {
  id: number;
  content: string;
  time: string;
}

const newses = computed<NewsItem[]>(() => [
  { id: 1, content: '完成了《Vue3基础入门》第5章学习', time: '2025-12-10 15:30:00' },
  { id: 2, content: '提交了《JavaScript高级编程》作业', time: '2025-12-09 20:00:00' },
  { id: 3, content: '获得了"学习达人"徽章', time: '2025-12-08 10:00:00' },
  { id: 4, content: '参加了AI编程助手在线讲座', time: '2025-12-07 14:00:00' },
  { id: 5, content: '完成了每日学习打卡', time: '2025-12-06 09:00:00' }
]);
</script>

<template>
  <NCard title="学习动态" :bordered="false" size="small" segmented class="card-wrapper">
    <template #header-extra>
      <a class="text-primary" href="javascript:;">查看更多</a>
    </template>
    <NList>
      <NListItem v-for="item in newses" :key="item.id">
        <template #prefix>
          <SoybeanAvatar class="size-48px!" />
        </template>
        <NThing :title="item.content" :description="item.time" />
      </NListItem>
    </NList>
  </NCard>
</template>

<style scoped></style>
