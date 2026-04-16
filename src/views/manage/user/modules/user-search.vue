<script setup lang="ts">
import { enableStatusOptions, userGenderOptions } from '@/constants/business';
import { translateOptions } from '@/utils/common';
import { $t } from '@/locales';

defineOptions({
  name: 'UserSearch'
});

interface Props {
  model: Api.SystemManage.UserSearchParams;
  isSearching?: boolean;
  isResetting?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isSearching: false,
  isResetting: false
});

interface Emits {
  (e: 'update:model', value: Api.SystemManage.UserSearchParams): void;
  (e: 'search'): void;
  (e: 'reset'): void;
}

const emit = defineEmits<Emits>();

function updateModel(key: keyof Api.SystemManage.UserSearchParams, value: any) {
  emit('update:model', { ...props.model, [key]: value });
}

function reset() {
  emit('reset');
}

function search() {
  emit('search');
}
</script>

<template>
  <NCard :bordered="false" size="small" class="card-wrapper">
    <NCollapse :default-expanded-names="['user-search']">
      <NCollapseItem :title="$t('common.search')" name="user-search">
        <NForm :model="model" label-placement="left" :label-width="80">
          <NGrid responsive="screen" item-responsive>
            <NFormItemGi span="24 s:12 m:6" :label="$t('page.manage.user.userName')" path="userName" class="pr-24px">
              <NInput
                :value="model.userName"
                placeholder="请输入用户名"
                @update:value="v => updateModel('userName', v)"
              />
            </NFormItemGi>
            <NFormItemGi
              span="24 s:12 m:6"
              :label="$t('page.manage.user.userGender')"
              path="userGender"
              class="pr-24px"
            >
              <NSelect
                :value="model.userGender"
                :placeholder="$t('page.manage.user.form.userGender')"
                :options="translateOptions(userGenderOptions, $t)"
                clearable
                @update:value="v => updateModel('userGender', v)"
              />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" :label="$t('page.manage.user.nickName')" path="nickName" class="pr-24px">
              <NInput
                :value="model.nickName"
                placeholder="请输入昵称"
                @update:value="v => updateModel('nickName', v)"
              />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" :label="$t('page.manage.user.userPhone')" path="userPhone" class="pr-24px">
              <NInput
                :value="model.userPhone"
                placeholder="请输入手机号"
                @update:value="v => updateModel('userPhone', v)"
              />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" :label="$t('page.manage.user.userEmail')" path="userEmail" class="pr-24px">
              <NInput
                :value="model.userEmail"
                placeholder="请输入邮箱"
                @update:value="v => updateModel('userEmail', v)"
              />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" :label="$t('page.manage.user.userStatus')" path="status" class="pr-24px">
              <NSelect
                :value="model.status"
                :placeholder="$t('page.manage.user.form.userStatus')"
                :options="translateOptions(enableStatusOptions, $t)"
                clearable
                @update:value="v => updateModel('status', v)"
              />
            </NFormItemGi>
            <NFormItemGi span="24 m:12" class="pr-24px">
              <NSpace class="w-full" justify="end">
                <NButton :loading="isResetting" @click="reset">
                  <template #icon>
                    <icon-ic-round-refresh class="text-icon" />
                  </template>
                  {{ $t('common.reset') }}
                </NButton>
                <NButton type="primary" :loading="isSearching" ghost @click="search">
                  <template #icon>
                    <icon-ic-round-search class="text-icon" />
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

<style scoped></style>
