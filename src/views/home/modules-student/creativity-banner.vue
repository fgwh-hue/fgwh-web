<script setup lang="ts">
defineOptions({
  name: 'StudentCreativityBanner'
});
</script>

<template>
  <NCard title="学习目标" :bordered="false" size="small" class="h-full card-wrapper">
    <div class="h-full flex-center">
      <icon-local-banner class="text-400px text-primary sm:text-320px" />
    </div>
  </NCard>
</template>

<style scoped></style>
