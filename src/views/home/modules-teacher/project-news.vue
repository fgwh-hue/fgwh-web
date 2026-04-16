<script setup lang="ts">
import { computed } from 'vue';

defineOptions({
  name: 'TeacherProjectNews'
});

interface NewsItem {
  id: number;
  content: string;
  time: string;
}

const newses = computed<NewsItem[]>(() => [
  { id: 1, content: '张三同学提交了《数据结构》作业', time: '2025-12-10 16:00:00' },
  { id: 2, content: '《算法导论》课程有 5 名新学生加入', time: '2025-12-09 10:30:00' },
  { id: 3, content: '李四同学在讨论区提问', time: '2025-12-08 14:20:00' },
  { id: 4, content: '《Python编程》期末考试已安排', time: '2025-12-07 09:00:00' },
  { id: 5, content: '王五同学完成了所有课程学习', time: '2025-12-06 18:00:00' }
]);
</script>

<template>
  <NCard title="教学动态" :bordered="false" size="small" segmented class="card-wrapper">
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
