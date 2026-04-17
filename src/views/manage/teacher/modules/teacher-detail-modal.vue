<script setup lang="ts">
import { computed } from 'vue';
import { NTag } from 'naive-ui';
import { enableStatusRecord, userGenderRecord } from '@/constants/business';
import { $t } from '@/locales';

defineOptions({
  name: 'TeacherDetailModal'
});

interface Props {
  teacherData?: Api.SystemManage.Teacher | null;
}

const props = defineProps<Props>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const genderLabel = computed(() => {
  if (!props.teacherData?.teacherGender) return '-';
  return $t(userGenderRecord[props.teacherData.teacherGender as Api.SystemManage.UserGender]);
});

const statusTagType = computed(() => {
  if (!props.teacherData?.status) return 'default';
  const tagMap: Record<Api.Common.EnableStatus, NaiveUI.ThemeColor> = {
    '1': 'success',
    '2': 'warning'
  };
  const statusKey = String(props.teacherData.status);
  return tagMap[statusKey as Api.Common.EnableStatus] || 'default';
});

const statusLabel = computed(() => {
  if (!props.teacherData?.status) return '-';
  const statusKey = String(props.teacherData.status);
  return $t(enableStatusRecord[statusKey] || '');
});

function close() {
  visible.value = false;
}
</script>

<template>
  <NModal v-model:show="visible" preset="dialog" title="教师详情" :show-icon="false" class="w-600px">
    <div v-if="teacherData" class="teacher-detail">
      <!-- 基本信息 -->
      <div class="section">
        <h3 class="section-title">
          <SvgIcon icon="ph:user-circle" class="mr-8px text-18px text-primary" />
          基本信息
        </h3>
        <NDescriptions :column="2" bordered size="small">
          <NDescriptionsItem label="工号">
            <span class="font-mono">{{ teacherData.teacherNo || '-' }}</span>
          </NDescriptionsItem>
          <NDescriptionsItem label="姓名">
            <span class="font-medium">{{ teacherData.teacherName }}</span>
          </NDescriptionsItem>
          <NDescriptionsItem label="性别">
            <NTag
              v-if="teacherData.teacherGender"
              size="small"
              :type="teacherData.teacherGender === '1' ? 'info' : 'warning'"
            >
              {{ genderLabel }}
            </NTag>
            <span v-else class="text-gray-400">-</span>
          </NDescriptionsItem>
          <NDescriptionsItem label="昵称">
            {{ teacherData.nickName || '-' }}
          </NDescriptionsItem>
          <NDescriptionsItem label="职称">
            {{ teacherData.teacherTitle || '-' }}
          </NDescriptionsItem>
          <NDescriptionsItem label="院系">
            {{ teacherData.teacherDepartment || '-' }}
          </NDescriptionsItem>
          <NDescriptionsItem label="状态">
            <NTag :type="statusTagType" size="small" bordered>
              {{ statusLabel }}
            </NTag>
          </NDescriptionsItem>
          <NDescriptionsItem label="创建时间">
            {{ teacherData.createTime || '-' }}
          </NDescriptionsItem>
        </NDescriptions>
      </div>

      <!-- 联系信息 -->
      <div class="section">
        <h3 class="section-title">
          <SvgIcon icon="ph:contact-card" class="mr-8px text-18px text-primary" />
          联系信息
        </h3>
        <NDescriptions :column="2" bordered size="small">
          <NDescriptionsItem label="手机号">
            <span class="font-mono">{{ teacherData.teacherPhone || '-' }}</span>
          </NDescriptionsItem>
          <NDescriptionsItem label="邮箱">
            <span class="text-sm">{{ teacherData.teacherEmail || '-' }}</span>
          </NDescriptionsItem>
        </NDescriptions>
      </div>
    </div>
    <template #action>
      <NSpace justify="end">
        <NButton @click="close">{{ $t('common.close') }}</NButton>
      </NSpace>
    </template>
  </NModal>
</template>

<style scoped>
.teacher-detail {
  padding: 8px 0;
}

.section {
  margin-bottom: 24px;
}

.section:last-child {
  margin-bottom: 0;
}

.section-title {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  color: var(--n-color);
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--primary-color);
}

:deep(.n-descriptions-table) {
  margin-bottom: 0;
}

:deep(.n-descriptions-table__label) {
  font-weight: 500;
  color: var(--n-item-text-color);
}
</style>
