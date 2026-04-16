<script setup lang="ts">
import { ref } from 'vue';
import { enableStatusOptions } from '@/constants/business';
import { translateOptions } from '@/utils/common';
import { $t } from '@/locales';

defineOptions({
  name: 'RoleSearch'
});

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const model = defineModel<Api.SystemManage.RoleSearchParams>('model', { required: true });

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
    <NCollapse :default-expanded-names="['role-search']">
      <NCollapseItem :title="$t('common.search')" name="role-search">
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
            <NFormItemGi
              span="24 s:12 m:6"
              :label="$t('page.manage.role.roleName')"
              path="roleName"
              class="form-item-hover pr-24px"
            >
              <NInput
                v-model:value="model.roleName"
                :placeholder="$t('page.manage.role.form.roleName')"
                clearable
                class="transition-all-200"
                @keyup.enter="search"
              >
                <template #prefix>
                  <SvgIcon icon="ph:shield" class="text-gray-400" />
                </template>
              </NInput>
            </NFormItemGi>
            <NFormItemGi
              span="24 s:12 m:6"
              :label="$t('page.manage.role.roleCode')"
              path="roleCode"
              class="form-item-hover pr-24px"
            >
              <NInput
                v-model:value="model.roleCode"
                :placeholder="$t('page.manage.role.form.roleCode')"
                clearable
                class="transition-all-200"
                @keyup.enter="search"
              >
                <template #prefix>
                  <SvgIcon icon="ph:code" class="text-gray-400" />
                </template>
              </NInput>
            </NFormItemGi>
            <NFormItemGi
              span="24 s:12 m:6"
              :label="$t('page.manage.role.roleStatus')"
              path="status"
              class="form-item-hover pr-24px"
            >
              <NSelect
                v-model:value="model.status"
                :placeholder="$t('page.manage.role.form.roleStatus')"
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
