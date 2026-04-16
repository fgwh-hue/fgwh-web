<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { enableStatusOptions, userGenderOptions } from '@/constants/business';
import { fetchAddTeacher, fetchEditTeacher } from '@/service/api';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';
import SvgIcon from '@/components/custom/svg-icon.vue';

defineOptions({
  name: 'TeacherOperateDrawer'
});

interface Props {
  operateType: NaiveUI.TableOperateType;
  rowData?: Api.SystemManage.Teacher | null;
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

const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: '添加教师',
    edit: '编辑教师'
  };
  return titles[props.operateType];
});

type Model = Pick<
  Api.SystemManage.Teacher,
  | 'teacherName'
  | 'teacherGender'
  | 'nickName'
  | 'teacherPhone'
  | 'teacherEmail'
  | 'teacherNo'
  | 'teacherTitle'
  | 'teacherDepartment'
  | 'status'
>;

const model = ref(createDefaultModel());

function createDefaultModel(): Model {
  return {
    teacherName: '',
    teacherGender: null,
    nickName: '',
    teacherPhone: '',
    teacherEmail: '',
    teacherNo: '',
    teacherTitle: '',
    teacherDepartment: '',
    status: null
  };
}

type RuleKey = Extract<keyof Model, 'teacherName' | 'teacherEmail' | 'teacherPhone' | 'teacherNo'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  teacherName: defaultRequiredRule,
  teacherNo: defaultRequiredRule
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
    const data = {
      teacherNo: model.value.teacherNo,
      name: model.value.teacherName,
      gender: model.value.teacherGender || undefined,
      phone: model.value.teacherPhone || undefined,
      email: model.value.teacherEmail || undefined,
      title: model.value.teacherTitle || undefined,
      department: model.value.teacherDepartment || undefined
    };

    if (props.operateType === 'add') {
      await fetchAddTeacher(data);
      window.$message?.success($t('common.addSuccess'));
    } else if (props.operateType === 'edit' && props.rowData?.id) {
      await fetchEditTeacher(props.rowData.id, data);
      window.$message?.success($t('common.updateSuccess'));
    }

    closeDrawer();
    emit('submitted');
  } catch (error: any) {
    console.error('Failed to submit teacher:', error);
    const errors = error?.errors || [];
    const message = errors.length > 0 ? errors.map((e: any) => e.message).join(', ') : '操作失败';
    window.$message?.error(message || '操作失败');
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
      <NForm ref="formRef" :model="model" :rules="rules" label-placement="top" class="teacher-form">
        <NGrid :cols="2" :x-gap="16">
          <NFormItemGi label="姓名" path="teacherName" class="pr-8px">
            <NInput v-model:value="model.teacherName" placeholder="请输入教师姓名">
              <template #prefix>
                <SvgIcon icon="ph:user" class="text-gray-400" />
              </template>
            </NInput>
          </NFormItemGi>
          <NFormItemGi label="工号" path="teacherNo" class="pl-8px">
            <NInput v-model:value="model.teacherNo" placeholder="请输入工号">
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
          <NFormItemGi label="性别" path="teacherGender" class="pl-8px">
            <NRadioGroup v-model:value="model.teacherGender">
              <NRadio v-for="item in userGenderOptions" :key="item.value" :value="item.value" :label="$t(item.label)" />
            </NRadioGroup>
          </NFormItemGi>
        </NGrid>
        <NGrid :cols="2" :x-gap="16">
          <NFormItemGi label="职称" path="teacherTitle" class="pr-8px">
            <NInput v-model:value="model.teacherTitle" placeholder="请输入职称">
              <template #prefix>
                <SvgIcon icon="ph:certificate" class="text-gray-400" />
              </template>
            </NInput>
          </NFormItemGi>
          <NFormItemGi label="院系" path="teacherDepartment" class="pl-8px">
            <NInput v-model:value="model.teacherDepartment" placeholder="请输入院系">
              <template #prefix>
                <SvgIcon icon="ph:bank" class="text-gray-400" />
              </template>
            </NInput>
          </NFormItemGi>
        </NGrid>
        <NFormItem label="手机号" path="teacherPhone">
          <NInput v-model:value="model.teacherPhone" placeholder="请输入手机号">
            <template #prefix>
              <SvgIcon icon="ph:phone" class="text-gray-400" />
            </template>
          </NInput>
        </NFormItem>
        <NFormItem label="邮箱" path="teacherEmail">
          <NInput v-model:value="model.teacherEmail" placeholder="请输入邮箱">
            <template #prefix>
              <SvgIcon icon="ph:envelope" class="text-gray-400" />
            </template>
          </NInput>
        </NFormItem>
        <NFormItem label="状态" path="status">
          <NRadioGroup v-model:value="model.status">
            <NRadio v-for="item in enableStatusOptions" :key="item.value" :value="item.value" :label="$t(item.label)" />
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
.teacher-form :deep(.n-form-item) {
  margin-bottom: 16px;
}

.teacher-form :deep(.n-input) {
  transition: all 0.2s ease;
}

.teacher-form :deep(.n-input:hover),
.teacher-form :deep(.n-input:focus) {
  border-color: rgba(64, 158, 255, 0.5);
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
}

.teacher-form :deep(.n-radio-group) {
  display: flex;
  gap: 16px;
}

.teacher-form :deep(.n-select) {
  width: 100%;
}
</style>
