<script setup lang="tsx">
import { ref } from 'vue';
import { NAvatar, NButton, NPopconfirm, NSpace, NTag, NTooltip } from 'naive-ui';
import { enableStatusRecord, userGenderRecord } from '@/constants/business';
import { fetchDeleteTeacher, fetchGetTeacherList } from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { $t } from '@/locales';
import SvgIcon from '@/components/custom/svg-icon.vue';
import TeacherOperateDrawer from './modules/teacher-operate-drawer.vue';
import TeacherSearch from './modules/teacher-search.vue';
import TeacherDetailModal from './modules/teacher-detail-modal.vue';
import TeacherProfileModal from './modules/teacher-profile-modal.vue';

const appStore = useAppStore();

const {
  columns,
  columnChecks,
  data,
  getData,
  getDataByPage,
  loading,
  mobilePagination,
  searchParams,
  resetSearchParams,
  total
} = useTable({
  apiFn: fetchGetTeacherList,
  showTotal: true,
  apiParams: {
    current: 1,
    size: 10,
    teacherName: null,
    teacherGender: null,
    nickName: null,
    teacherPhone: null,
    teacherEmail: null,
    teacherNo: null,
    teacherTitle: null,
    teacherDepartment: null
  },
  columns: () => [
    {
      type: 'selection',
      align: 'center',
      width: 48
    },
    {
      key: 'index',
      title: $t('common.index'),
      align: 'center',
      width: 64,
      render: (_, index) => {
        return <span class="text-gray-400 font-mono">{String(index + 1).padStart(3, '0')}</span>;
      }
    },
    {
      key: 'avatar',
      title: '头像',
      align: 'center',
      width: 72,
      render: row => {
        return (
          <NAvatar size="small" round src={row.avatar || undefined} class="ring-2 ring-primary/10">
            {row.teacherName?.charAt(0)?.toUpperCase()}
          </NAvatar>
        );
      }
    },
    {
      key: 'teacherName',
      title: '姓名',
      align: 'center',
      minWidth: 100,
      render: row => {
        return (
          <div class="flex items-center gap-8px">
            <span class="font-medium">{row.teacherName}</span>
          </div>
        );
      }
    },
    {
      key: 'teacherNo',
      title: '工号',
      align: 'center',
      minWidth: 100,
      render: row => {
        return <span class="text-sm text-gray-600 font-mono">{row.teacherNo || '-'}</span>;
      }
    },
    {
      key: 'teacherTitle',
      title: '职称',
      align: 'center',
      minWidth: 100,
      render: row => {
        return <span class="text-gray-600">{row.teacherTitle || '-'}</span>;
      }
    },
    {
      key: 'teacherDepartment',
      title: '院系',
      align: 'center',
      minWidth: 120,
      render: row => {
        return <span class="text-gray-600">{row.teacherDepartment || '-'}</span>;
      }
    },
    {
      key: 'teacherGender',
      title: '性别',
      align: 'center',
      width: 80,
      render: row => {
        if (row.teacherGender === null) {
          return <span class="text-gray-400">-</span>;
        }

        const tagMap: Record<Api.SystemManage.UserGender, NaiveUI.ThemeColor> = {
          1: 'info',
          2: 'warning'
        };

        const genderKey = String(row.teacherGender ?? '');
        const label = genderKey ? $t(userGenderRecord[genderKey] ?? '') : '-';

        return (
          <NTag type={tagMap[row.teacherGender] ?? 'default'} size="small">
            {label}
          </NTag>
        );
      }
    },
    {
      key: 'teacherPhone',
      title: '手机号',
      align: 'center',
      width: 130,
      render: row => {
        return <span class="text-sm font-mono">{row.teacherPhone || <span class="text-gray-400">-</span>}</span>;
      }
    },
    {
      key: 'teacherEmail',
      title: '邮箱',
      align: 'center',
      minWidth: 180,
      ellipsis: {
        tooltip: true
      },
      render: row => {
        return (
          <span class="block truncate text-sm text-gray-600">
            {row.teacherEmail || <span class="text-gray-400">-</span>}
          </span>
        );
      }
    },
    {
      key: 'status',
      title: '状态',
      align: 'center',
      width: 100,
      render: row => {
        if (row.status === null) {
          return <span class="text-gray-400">-</span>;
        }

        const tagMap: Record<Api.Common.EnableStatus, NaiveUI.ThemeColor> = {
          1: 'success',
          2: 'warning'
        };

        const statusKey = String(row.status ?? '');
        const statusLabel = statusKey ? $t(enableStatusRecord[statusKey] ?? '') : '-';

        return (
          <NTag type={tagMap[row.status] ?? 'default'} size="small" bordered={false}>
            {statusLabel}
          </NTag>
        );
      }
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 240,
      fixed: 'right',
      render: row => (
        <NSpace justify="center" size="small">
          <NTooltip>
            {{
              trigger: () => (
                <NButton
                  quaternary
                  type="success"
                  size="small"
                  class="transition-all-200 hover-scale-102"
                  onClick={() => viewProfile(row.id)}
                >
                  <SvgIcon icon="ph:user-circle" class="text-16px" />
                </NButton>
              ),
              default: () => '教师画像'
            }}
          </NTooltip>
          <NTooltip>
            {{
              trigger: () => (
                <NButton
                  quaternary
                  type="primary"
                  size="small"
                  class="transition-all-200 hover-scale-102"
                  onClick={() => viewDetail(row.id)}
                >
                  <SvgIcon icon="ph:eye" class="text-16px" />
                </NButton>
              ),
              default: () => '查看详情'
            }}
          </NTooltip>
          <NTooltip>
            {{
              trigger: () => (
                <NButton
                  quaternary
                  type="info"
                  size="small"
                  class="transition-all-200 hover-scale-102"
                  onClick={() => edit(row.id)}
                >
                  <SvgIcon icon="ph:pencil-simple" class="text-16px" />
                </NButton>
              ),
              default: () => '编辑'
            }}
          </NTooltip>
          <NTooltip>
            {{
              trigger: () => (
                <NPopconfirm onPositiveClick={() => handleDelete(row.id)}>
                  {{
                    default: () => $t('common.confirmDelete'),
                    trigger: () => (
                      <NButton quaternary type="error" size="small" class="transition-all-200 hover-scale-102">
                        <SvgIcon icon="ph:trash" class="text-16px" />
                      </NButton>
                    )
                  }}
                </NPopconfirm>
              ),
              default: () => '删除'
            }}
          </NTooltip>
        </NSpace>
      )
    }
  ]
});

const { drawerVisible, operateType, editingData, handleAdd, handleEdit, checkedRowKeys, onBatchDeleted, onDeleted } =
  useTableOperate(data, getData);

const detailVisible = ref(false);
const profileVisible = ref(false);
const viewingTeacher = ref<Api.SystemManage.Teacher | null>(null);

async function handleBatchDelete() {
  window.$message?.success('批量删除成功');
  onBatchDeleted();
}

function handleDelete(id: string) {
  fetchDeleteTeacher(id)
    .then(() => {
      window.$message?.success('删除成功');
      onDeleted();
    })
    .catch(() => {
      window.$message?.error('删除失败');
    });
}

function edit(id: string) {
  handleEdit(id);
}

function viewDetail(id: string) {
  const teacher = data.value.find(item => item.id === id);
  if (teacher) {
    viewingTeacher.value = teacher;
    detailVisible.value = true;
  }
}

function viewProfile(id: string) {
  const teacher = data.value.find(item => item.id === id);
  if (teacher) {
    viewingTeacher.value = teacher;
    profileVisible.value = true;
  }
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <TeacherSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <NCard title="教师列表" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
      <template #header-extra>
        <div class="flex items-center gap-12px">
          <span class="text-14px text-gray-400">共 {{ total }} 条</span>
          <TableHeaderOperation
            v-model:columns="columnChecks"
            :disabled-delete="checkedRowKeys.length === 0"
            :loading="loading"
            @add="handleAdd"
            @delete="handleBatchDelete"
            @refresh="getData"
          />
        </div>
      </template>
      <NDataTable
        v-model:checked-row-keys="checkedRowKeys"
        :columns="columns"
        :data="data"
        size="small"
        :flex-height="!appStore.isMobile"
        :scroll-x="1400"
        :loading="loading"
        remote
        :row-key="row => row.id"
        :pagination="mobilePagination"
        :row-class-name="() => 'transition-colors hover:bg-primary/5'"
        class="sm:h-full"
      />
      <TeacherOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getDataByPage"
      />
      <TeacherDetailModal v-model:visible="detailVisible" :teacher-data="viewingTeacher" />
      <TeacherProfileModal v-model:visible="profileVisible" :teacher-data="viewingTeacher" />
    </NCard>
  </div>
</template>

<style scoped>
:deep(.n-data-table-tr:hover) {
  background: rgb(var(--primary-rgb) / 5%);
}
</style>
