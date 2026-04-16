<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '@/store/modules/auth';
import AdminHome from './admin.vue';
import StudentHome from './student.vue';
import TeacherHome from './teacher.vue';

const authStore = useAuthStore();

// 根据用户角色动态选择首页组件
const homeComponent = computed(() => {
  const roles = authStore.userInfo.roles;
  if (roles.includes('R_STUDENT')) {
    return StudentHome;
  }
  if (roles.includes('R_TEACHER')) {
    return TeacherHome;
  }
  return AdminHome;
});
</script>

<template>
  <component :is="homeComponent" />
</template>

<style scoped></style>
