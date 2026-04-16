<script setup lang="ts">
import { ref } from 'vue';
import { enableStatusOptions, userGenderOptions } from '@/constants/business';
import { translateOptions } from '@/utils/common';
import { $t } from '@/locales';
import SvgIcon from '@/components/custom/svg-icon.vue';

defineOptions({
  name: 'StudentSearch'
});

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const model = defineModel<Api.SystemManage.StudentSearchParams>('model', { required: true });

const isSearching = ref(false);
const isResetting = ref(false);

function reset() {
  isResetting.value = true;
  emit('reset');
  setTimeout(() => {
    isResetting.value = false;
  }, 300);
}

function search() {
  isSearching.value = true;
  emit('search');
  setTimeout(() => {
    isSearching.value = false;
  }, 500);
}
</script>

<template>
  <NCard :bordered="false" size="small" class="search-card card-wrapper">
    <NCollapse :default-expanded-names="['student-search']">
      <NCollapseItem :title="$t('common.search')" name="student-search">
        <template #header-extra>
          <NTooltip>
            <template #trigger>
              <SvgIcon icon="ph:question" class="cursor-help text-14px text-gray-400" />
            </template>
            展开更多筛选条件
          </NTooltip>
        </template>
        <NForm :model="model" label-placement="left" :label-width="80" class="search-form">
          <NGrid responsive="screen" item-responsive>
            <NFormItemGi span="24 s:12 m:6" label="姓名" path="studentName" class="form-item-hover pr-24px">
              <NInput
                v-model:value="model.studentName"
                placeholder="请输入学生姓名"
                clearable
                class="transition-all-200"
                @keyup.enter="search"
              >
                <template #prefix>
                  <SvgIcon icon="ph:user" class="text-gray-400" />
                </template>
              </NInput>
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" label="学号" path="studentNo" class="form-item-hover pr-24px">
              <NInput
                v-model:value="model.studentNo"
                placeholder="请输入学号"
                clearable
                class="transition-all-200"
                @keyup.enter="search"
              >
                <template #prefix>
                  <SvgIcon icon="ph:identification-card" class="text-gray-400" />
                </template>
              </NInput>
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" label="性别" path="studentGender" class="form-item-hover pr-24px">
              <NSelect
                v-model:value="model.studentGender"
                placeholder="请选择性别"
                :options="translateOptions(userGenderOptions, $t)"
                clearable
                class="transition-all-200"
              >
                <template #arrow>
                  <SvgIcon icon="ph:caret-down" />
                </template>
              </NSelect>
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" label="专业" path="studentMajor" class="form-item-hover pr-24px">
              <NInput
                v-model:value="model.studentMajor"
                placeholder="请输入专业"
                clearable
                class="transition-all-200"
                @keyup.enter="search"
              >
                <template #prefix>
                  <SvgIcon icon="ph:books" class="text-gray-400" />
                </template>
              </NInput>
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" label="班级" path="studentClass" class="form-item-hover pr-24px">
              <NInput
                v-model:value="model.studentClass"
                placeholder="请输入班级"
                clearable
                class="transition-all-200"
                @keyup.enter="search"
              >
                <template #prefix>
                  <SvgIcon icon="ph:users-three" class="text-gray-400" />
                </template>
              </NInput>
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" label="手机号" path="studentPhone" class="form-item-hover pr-24px">
              <NInput
                v-model:value="model.studentPhone"
                placeholder="请输入手机号"
                clearable
                class="transition-all-200"
                @keyup.enter="search"
              >
                <template #prefix>
                  <SvgIcon icon="ph:phone" class="text-gray-400" />
                </template>
              </NInput>
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" label="邮箱" path="studentEmail" class="form-item-hover pr-24px">
              <NInput
                v-model:value="model.studentEmail"
                placeholder="请输入邮箱"
                clearable
                class="transition-all-200"
                @keyup.enter="search"
              >
                <template #prefix>
                  <SvgIcon icon="ph:envelope" class="text-gray-400" />
                </template>
              </NInput>
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" label="状态" path="status" class="form-item-hover pr-24px">
              <NSelect
                v-model:value="model.status"
                placeholder="请选择状态"
                :options="translateOptions(enableStatusOptions, $t)"
                clearable
                class="transition-all-200"
              >
                <template #arrow>
                  <SvgIcon icon="ph:caret-down" />
                </template>
              </NSelect>
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6">
              <NSpace class="w-full" justify="end">
                <NButton :loading="isResetting" class="transition-all-200 hover-scale-102" @click="reset">
                  <template #icon>
                    <SvgIcon icon="ph:arrow-counter-clockwise" />
                  </template>
                  {{ $t('common.reset') }}
                </NButton>
                <NButton
                  type="primary"
                  :loading="isSearching"
                  ghost
                  class="btn-glow-primary transition-all-200 hover-scale-102"
                  @click="search"
                >
                  <template #icon>
                    <SvgIcon icon="ph:magnifying-glass" />
                  </template>
                  {{ $t('common.search') }}
                </NButton>
              </NSpace>
            </NFormItemGi>
          </NGrid>
        </NForm>
      </NCollapseItem>
    </NCollapse>
  </NCard>
</template>

<style scoped>
.search-card :deep(.n-collapse-item__header-main) {
  font-weight: 600;
}

.form-item-hover {
  transition: all 0.2s ease;
}

.form-item-hover:hover {
  background: rgba(64, 158, 255, 0.05);
  border-radius: 6px;
}

.search-form :deep(.n-input) {
  transition: all 0.2s ease;
}

.search-form :deep(.n-input:hover),
.search-form :deep(.n-input:focus) {
  border-color: rgba(64, 158, 255, 0.5);
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
}

.search-form :deep(.n-select:hover) {
  border-color: rgba(64, 158, 255, 0.5);
}
</style>
