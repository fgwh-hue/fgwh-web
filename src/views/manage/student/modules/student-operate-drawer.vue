<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { enableStatusOptions, userGenderOptions } from '@/constants/business';
import { fetchAddStudent, fetchEditStudent } from '@/service/api/system-manage';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';
import SvgIcon from '@/components/custom/svg-icon.vue';

defineOptions({
  name: 'StudentOperateDrawer'
});

interface Props {
  operateType: NaiveUI.TableOperateType;
  rowData?: Api.SystemManage.Student | null;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const { formRef, validate, restoreValidation } = useNaiveForm();
const { defaultRequiredRule } = useFormRules();
const loading = ref(false);

const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: '添加学生',
    edit: '编辑学生'
  };
  return titles[props.operateType];
});

type Model = Pick<
  Api.SystemManage.Student,
  | 'studentName'
  | 'studentGender'
  | 'nickName'
  | 'studentPhone'
  | 'studentEmail'
  | 'studentNo'
  | 'studentMajor'
  | 'studentClass'
  | 'status'
>;

const model = ref(createDefaultModel());

function createDefaultModel(): Model {
  return {
    studentName: '',
    studentGender: null,
    nickName: '',
    studentPhone: '',
    studentEmail: '',
    studentNo: '',
    studentMajor: '',
    studentClass: '',
    status: null
  };
}

type RuleKey = Extract<keyof Model, 'studentName' | 'studentEmail' | 'studentPhone' | 'studentNo'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  studentName: defaultRequiredRule,
  studentNo: defaultRequiredRule
};

function handleInitModel() {
  model.value = createDefaultModel();

  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(model.value, props.rowData);
  }
}

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  try {
    await validate();
    loading.value = true;

    const data = {
      studentNo: model.value.studentNo,
      name: model.value.studentName,
      gender: model.value.studentGender || undefined,
      phone: model.value.studentPhone || undefined,
      email: model.value.studentEmail || undefined,
      major: model.value.studentMajor || undefined,
      className: model.value.studentClass || undefined
    };

    if (props.operateType === 'add') {
      await fetchAddStudent(data);
      window.$message?.success($t('common.addSuccess'));
    } else if (props.operateType === 'edit' && props.rowData?.id) {
      await fetchEditStudent(props.rowData.id, data);
      window.$message?.success($t('common.updateSuccess'));
    }

    closeDrawer();
    emit('submitted');
  } catch (error: any) {
    console.error('Failed to submit student:', error);
    const errors = error?.errors || [];
    const message = errors.length > 0 ? errors.map((e: any) => e.message).join(', ') : '操作失败';
    window.$message?.error(message || '操作失败');
  } finally {
    loading.value = false;
  }
}

watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    restoreValidation();
  }
});
</script>

<template>
  <NDrawer v-model:show="visible" display-directive="show" :width="480">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <NForm ref="formRef" :model="model" :rules="rules" label-placement="top" class="student-form">
        <NGrid :cols="2" :x-gap="16">
          <NFormItemGi label="姓名" path="studentName" class="pr-8px">
            <NInput v-model:value="model.studentName" placeholder="请输入学生姓名">
              <template #prefix>
                <SvgIcon icon="ph:user" class="text-gray-400" />
              </template>
            </NInput>
          </NFormItemGi>
          <NFormItemGi label="学号" path="studentNo" class="pl-8px">
            <NInput v-model:value="model.studentNo" placeholder="请输入学号">
              <template #prefix>
                <SvgIcon icon="ph:identification-card" class="text-gray-400" />
              </template>
            </NInput>
          </NFormItemGi>
        </NGrid>
        <NGrid :cols="2" :x-gap="16">
          <NFormItemGi label="昵称" path="nickName" class="pr-8px">
            <NInput v-model:value="model.nickName" placeholder="请输入昵称">
              <template #prefix>
                <SvgIcon icon="ph:signature" class="text-gray-400" />
              </template>
            </NInput>
          </NFormItemGi>
          <NFormItemGi label="性别" path="studentGender" class="pl-8px">
            <NSelect
              v-model:value="model.studentGender"
              placeholder="请选择性别"
              :options="userGenderOptions.map(item => ({ label: $t(item.label), value: item.value }))"
              clearable
            />
          </NFormItemGi>
        </NGrid>
        <NGrid :cols="2" :x-gap="16">
          <NFormItemGi label="专业" path="studentMajor" class="pr-8px">
            <NInput v-model:value="model.studentMajor" placeholder="请输入专业">
              <template #prefix>
                <SvgIcon icon="ph:books" class="text-gray-400" />
              </template>
            </NInput>
          </NFormItemGi>
          <NFormItemGi label="班级" path="studentClass" class="pl-8px">
            <NInput v-model:value="model.studentClass" placeholder="请输入班级">
              <template #prefix>
                <SvgIcon icon="ph:users-three" class="text-gray-400" />
              </template>
            </NInput>
          </NFormItemGi>
        </NGrid>
        <NFormItem label="手机号" path="studentPhone">
          <NInput v-model:value="model.studentPhone" placeholder="请输入手机号">
            <template #prefix>
              <SvgIcon icon="ph:phone" class="text-gray-400" />
            </template>
          </NInput>
        </NFormItem>
        <NFormItem label="邮箱" path="studentEmail">
          <NInput v-model:value="model.studentEmail" placeholder="请输入邮箱">
            <template #prefix>
              <SvgIcon icon="ph:envelope" class="text-gray-400" />
            </template>
          </NInput>
        </NFormItem>
        <NFormItem label="状态" path="status">
          <NSelect
            v-model:value="model.status"
            placeholder="请选择状态"
            :options="enableStatusOptions.map(item => ({ label: $t(item.label), value: item.value }))"
            clearable
          />
        </NFormItem>
      </NForm>
      <template #footer>
        <NSpace :size="16">
          <NButton @click="closeDrawer">{{ $t('common.cancel') }}</NButton>
          <NButton type="primary" :loading="loading" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped>
.student-form :deep(.n-form-item) {
  margin-bottom: 16px;
}

.student-form :deep(.n-input) {
  transition: all 0.2s ease;
}

.student-form :deep(.n-input:hover),
.student-form :deep(.n-input:focus) {
  border-color: rgba(64, 158, 255, 0.5);
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
}

.student-form :deep(.n-select) {
  width: 100%;
}
</style>
