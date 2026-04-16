<script setup lang="ts">
import SvgIcon from '@/components/custom/svg-icon.vue';

interface Props {
  role: 'user' | 'assistant';
  content: string;
}

defineProps<Props>();
</script>

<template>
  <div class="flex items-start gap-4" :class="{ 'flex-row-reverse': role === 'user' }">
    <!-- AI 头像 -->
    <NAvatar v-if="role === 'assistant'" circle :size="36">
      <SvgIcon icon="ph:robot" class="text-2xl" />
    </NAvatar>
    <!-- 用户头像 -->
    <NAvatar v-else circle :size="36" style="background-color: #18a058">
      <SvgIcon icon="ph:user" class="text-2xl" />
    </NAvatar>

    <!-- 消息气泡 -->
    <div
      class="max-w-[80%] rounded-lg p-3 shadow-sm"
      :class="role === 'user' ? 'bg-primary text-white' : 'bg-white dark:bg-dark'"
    >
      <!-- 使用 v-html 来正确渲染换行符 -->
      <p class="leading-relaxed" v-html="content.replace(/\n/g, '<br>')"></p>
    </div>
  </div>
</template>
