<script setup lang="ts">
import { computed } from 'vue';
import { NTag } from 'naive-ui';
import { enableStatusRecord, userGenderRecord } from '@/constants/business';
import { $t } from '@/locales';

defineOptions({
  name: 'StudentDetailModal'
});

interface Props {
  studentData?: Api.SystemManage.Student | null;
}

const props = defineProps<Props>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const genderLabel = computed(() => {
  if (!props.studentData?.studentGender) return '-';
  return $t(userGenderRecord[props.studentData.studentGender as Api.SystemManage.UserGender]);
});

const statusTagType = computed(() => {
  if (!props.studentData?.status) return 'default';
  const tagMap: Record<Api.Common.EnableStatus, NaiveUI.ThemeColor> = {
    '1': 'success',
    '2': 'warning'
  };
  const statusKey = String(props.studentData.status);
  return tagMap[statusKey as Api.Common.EnableStatus] || 'default';
});

const statusLabel = computed(() => {
  if (!props.studentData?.status) return '-';
  const statusKey = String(props.studentData.status);
  return $t(enableStatusRecord[statusKey] || '');
});

function close() {
  visible.value = false;
}
</script>

<template>
  <NModal v-model:show="visible" preset="dialog" title="学生详情" :show-icon="false" class="w-600px">
    <div v-if="studentData" class="student-detail">
      <!-- 基本信息 -->
      <div class="section">
        <h3 class="section-title">
          <SvgIcon icon="ph:user-circle" class="mr-8px text-18px text-primary" />
          基本信息
        </h3>
        <NDescriptions :column="2" bordered size="small">
          <NDescriptionsItem label="学号">
            <span class="font-mono">{{ studentData.studentNo || '-' }}</span>
          </NDescriptionsItem>
          <NDescriptionsItem label="姓名">
            <span class="font-medium">{{ studentData.studentName }}</span>
          </NDescriptionsItem>
          <NDescriptionsItem label="性别">
            <NTag
              v-if="studentData.studentGender"
              size="small"
              :type="studentData.studentGender === '1' ? 'info' : 'warning'"
            >
              {{ genderLabel }}
            </NTag>
            <span v-else class="text-gray-400">-</span>
          </NDescriptionsItem>
          <NDescriptionsItem label="昵称">
            {{ studentData.nickName || '-' }}
          </NDescriptionsItem>
          <NDescriptionsItem label="状态">
            <NTag :type="statusTagType" size="small" bordered>
              {{ statusLabel }}
            </NTag>
          </NDescriptionsItem>
          <NDescriptionsItem label="创建时间">
            {{ studentData.createTime || '-' }}
          </NDescriptionsItem>
        </NDescriptions>
      </div>

      <!-- 学业信息 -->
      <div class="section">
        <h3 class="section-title">
          <SvgIcon icon="ph:books" class="mr-8px text-18px text-primary" />
          学业信息
        </h3>
        <NDescriptions :column="2" bordered size="small">
          <NDescriptionsItem label="专业">
            {{ studentData.studentMajor || '-' }}
          </NDescriptionsItem>
          <NDescriptionsItem label="班级">
            {{ studentData.studentClass || '-' }}
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
            <span class="font-mono">{{ studentData.studentPhone || '-' }}</span>
          </NDescriptionsItem>
          <NDescriptionsItem label="邮箱">
            <span class="text-sm">{{ studentData.studentEmail || '-' }}</span>
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
.student-detail {
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
