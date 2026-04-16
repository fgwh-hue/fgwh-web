<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { $t } from '@/locales';
import SvgIcon from '@/components/custom/svg-icon.vue';

defineOptions({
  name: 'RoleOperateDrawer'
});

interface Props {
  operateType: NaiveUI.TableOperateType;
  rowData?: Api.SystemManage.Role | null;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: '添加角色',
    edit: '编辑角色'
  };
  return titles[props.operateType];
});

type Model = Pick<Api.SystemManage.Role, 'roleName' | 'roleCode' | 'roleDesc' | 'status'>;

const model = ref(createDefaultModel());

function createDefaultModel(): Model {
  return {
    roleName: '',
    roleCode: '',
    roleDesc: '',
    status: null
  };
}

function handleInitModel() {
  model.value = createDefaultModel();

  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(model.value, props.rowData);
  }
}

function closeDrawer() {
  visible.value = false;
}

function handleSubmit() {
  window.$message?.info('角色管理功能开发中...');
  closeDrawer();
  emit('submitted');
}

watch(visible, () => {
  if (visible.value) {
    handleInitModel();
  }
});
</script>

<template>
  <NDrawer v-model:show="visible" display-directive="show" :width="480">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <NForm :model="model" label-placement="top" class="role-form">
        <NFormItem label="角色名称" path="roleName">
          <NInput v-model:value="model.roleName" placeholder="请输入角色名称">
            <template #prefix>
              <SvgIcon icon="ph:user-circle" class="text-gray-400" />
            </template>
          </NInput>
        </NFormItem>
        <NFormItem label="角色编码" path="roleCode">
          <NInput v-model:value="model.roleCode" placeholder="请输入角色编码">
            <template #prefix>
              <SvgIcon icon="ph:code" class="text-gray-400" />
            </template>
          </NInput>
        </NFormItem>
        <NFormItem label="描述">
          <NInput v-model:value="model.roleDesc" type="textarea" placeholder="请输入角色描述" :rows="3" />
        </NFormItem>
        <NFormItem label="状态">
          <NRadioGroup v-model:value="model.status">
            <NRadio value="1">启用</NRadio>
            <NRadio value="2">禁用</NRadio>
          </NRadioGroup>
        </NFormItem>
      </NForm>
      <template #footer>
        <NSpace :size="16">
          <NButton @click="closeDrawer">{{ $t('common.cancel') }}</NButton>
          <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped>
.role-form :deep(.n-form-item) {
  margin-bottom: 16px;
}

.role-form :deep(.n-input) {
  transition: all 0.2s ease;
}

.role-form :deep(.n-input:hover),
.role-form :deep(.n-input:focus) {
  border-color: rgba(64, 158, 255, 0.5);
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
}

.role-form :deep(.n-radio-group) {
  display: flex;
  gap: 16px;
}

.role-form :deep(.n-select) {
  width: 100%;
}
</style>
