<script setup lang="ts">
interface Props {
  themeColor?: string;
}

defineProps<Props>();
</script>

<template>
  <div class="absolute inset-0 overflow-hidden">
    <div
      class="absolute h-1/2 w-1/2 rounded-full opacity-30 blur-3xl -left-1/4 -top-1/4"
      :style="{ backgroundColor: themeColor || '#6366f1' }"
    />
    <div
      class="absolute h-1/2 w-1/2 rounded-full opacity-20 blur-3xl -bottom-1/4 -right-1/4"
      :style="{ backgroundColor: themeColor || '#6366f1' }"
    />
    <div class="absolute bottom-0 left-0 right-0 h-32 overflow-hidden">
      <svg class="absolute bottom-0 h-full w-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path
          fill="currentColor"
          class="opacity-10"
          d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </svg>
    </div>
  </div>
</template>
