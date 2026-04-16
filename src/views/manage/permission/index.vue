<script setup lang="ts">
import { ref } from 'vue';
import { useMessage } from 'naive-ui';
import { type ECOption, useEcharts } from '@/hooks/common/echarts';
import PermissionGuide from './modules/permission-guide.vue';

defineOptions({
  name: 'PermissionManagement'
});

const $message = useMessage();

interface ButtonPermission {
  id: number;
  name: string;
  code: string;
  description: string;
  enabled: boolean;
  category: string;
}

interface DataPermission {
  id: number;
  roleName: string;
  scope: 'all' | 'department' | 'self' | 'custom';
  departments: string[];
  users: string[];
  enabled: boolean;
}

interface IpWhitelist {
  id: number;
  name: string;
  ipRange: string;
  description: string;
  enabled: boolean;
  expiresAt: string;
}

const activeTab = ref('button');

const permissionStats = ref({
  totalPermissions: 156,
  buttonPermissions: 45,
  dataPermissions: 12,
  ipWhitelist: 8,
  activeRules: 89,
  monthlyChanges: 23
});

const buttonCategories = ref([
  { name: '用户管理', count: 8, icon: 'ph:users-fill' },
  { name: '课程管理', count: 12, icon: 'ph:books-fill' },
  { name: '作业管理', count: 9, icon: 'ph:clipboard-text-fill' },
  { name: '成绩管理', count: 6, icon: 'ph:chart-line-up-fill' },
  { name: '系统设置', count: 10, icon: 'ph:gear-fill' }
]);

const buttonPermissions = ref<ButtonPermission[]>([
  { id: 1, name: '新增用户', code: 'user:add', description: '创建新用户账号', enabled: true, category: '用户管理' },
  { id: 2, name: '编辑用户', code: 'user:edit', description: '修改用户信息', enabled: true, category: '用户管理' },
  { id: 3, name: '删除用户', code: 'user:delete', description: '删除用户账号', enabled: true, category: '用户管理' },
  { id: 4, name: '重置密码', code: 'user:resetpwd', description: '重置用户密码', enabled: true, category: '用户管理' },
  { id: 5, name: '导出数据', code: 'user:export', description: '导出用户数据', enabled: false, category: '用户管理' },
  { id: 6, name: '导入数据', code: 'user:import', description: '导入用户数据', enabled: false, category: '用户管理' },
  { id: 7, name: '分配角色', code: 'user:assign', description: '为用户分配角色', enabled: true, category: '用户管理' },
  { id: 8, name: '课程管理', code: 'course:*', description: '课程全部权限', enabled: true, category: '课程管理' },
  { id: 9, name: '作业批改', code: 'homework:grade', description: '批改学生作业', enabled: true, category: '作业管理' }
]);

const dataPermissions = ref<DataPermission[]>([
  { id: 1, roleName: '超级管理员', scope: 'all', departments: [], users: [], enabled: true },
  { id: 2, roleName: '教师', scope: 'department', departments: ['计算机系', '数学系'], users: [], enabled: true },
  { id: 3, roleName: '班主任', scope: 'self', departments: [], users: [], enabled: true },
  { id: 4, roleName: '学生', scope: 'self', departments: [], users: [], enabled: true },
  { id: 5, roleName: '自定义角色', scope: 'custom', departments: ['计算机系'], users: ['张三', '李四'], enabled: true }
]);

const ipWhitelist = ref<IpWhitelist[]>([
  {
    id: 1,
    name: '内网访问',
    ipRange: '192.168.0.0/16',
    description: '公司内网IP地址段',
    enabled: true,
    expiresAt: '永久'
  },
  {
    id: 2,
    name: 'VPN访问',
    ipRange: '10.0.0.0/8',
    description: 'VPN远程访问地址段',
    enabled: true,
    expiresAt: '2024-12-31'
  },
  {
    id: 3,
    name: '特定IP',
    ipRange: '114.114.114.114',
    description: 'DNS服务器',
    enabled: false,
    expiresAt: '2024-06-30'
  },
  {
    id: 4,
    name: '临时访问',
    ipRange: '123.125.115.110',
    description: '临时外部访问',
    enabled: true,
    expiresAt: '2024-03-01'
  }
]);

const quickActions = ref([
  { label: '新增权限', icon: 'ph:plus-circle-fill', type: 'primary' as const },
  { label: '同步权限', icon: 'ph:arrows-clockwise', type: 'default' as const },
  { label: '导出配置', icon: 'ph:download-simple', type: 'default' as const }
]);

const { domRef: permChartRef, updateOptions: _updatePermChart } = useEcharts(
  (): ECOption => ({
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['用户管理', '课程管理', '作业管理', '成绩管理', '系统设置']
    },
    yAxis: { type: 'value', name: '权限数量' },
    series: [
      {
        name: '按钮权限',
        type: 'bar',
        data: [8, 12, 9, 6, 10],
        itemStyle: { color: '#409eff' }
      }
    ]
  })
);

const { domRef: scopeChartRef, updateOptions: _updateScopeChart } = useEcharts(
  (): ECOption => ({
    tooltip: { trigger: 'item' },
    series: [
      {
        name: '数据权限分布',
        type: 'pie',
        radius: ['40%', '70%'],
        data: [
          { value: 1, name: '全部数据', itemStyle: { color: '#f56c6c' } },
          { value: 3, name: '部门数据', itemStyle: { color: '#e6a23c' } },
          { value: 5, name: '仅本人', itemStyle: { color: '#409eff' } },
          { value: 3, name: '自定义', itemStyle: { color: '#67c23a' } }
        ]
      }
    ]
  })
);

const showEditModal = ref(false);
const selectedPermission = ref<ButtonPermission | null>(null);

function handleToggle(permission: ButtonPermission) {
  permission.enabled = !permission.enabled;
  $message.success(`${permission.name} 已${permission.enabled ? '启用' : '禁用'}`);
}

function handleEdit(permission: ButtonPermission) {
  selectedPermission.value = { ...permission };
  showEditModal.value = true;
}

function handleDelete(permission: ButtonPermission) {
  $message.warning(`确认删除权限 ${permission.name}？`);
}

function getScopeTagType(scope: DataPermission['scope']) {
  const map: Record<string, 'success' | 'warning' | 'info' | 'error'> = {
    all: 'error',
    department: 'warning',
    self: 'info',
    custom: 'success'
  };
  return map[scope];
}

function getScopeText(scope: DataPermission['scope']) {
  const map: Record<string, string> = {
    all: '全部数据',
    department: '部门数据',
    self: '仅本人',
    custom: '自定义'
  };
  return map[scope];
}
</script>

<template>
  <div class="permission-management">
    <NSpace vertical :size="16">
      <NCard :bordered="false" class="card-wrapper">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-18px font-semibold">权限精细化管理</h2>
            <p class="mt-4px text-gray-500">细粒度控制用户权限、数据范围和访问来源</p>
          </div>
          <NSpace :size="12">
            <NButton v-for="action in quickActions" :key="action.label" :type="action.type">
              <template #icon><SvgIcon :icon="action.icon" /></template>
              {{ action.label }}
            </NButton>
          </NSpace>
        </div>
      </NCard>

      <NGrid cols="s:1 m:2 l:6" :x-gap="16" :y-gap="16">
        <NGi>
          <NCard :bordered="false" class="card-wrapper">
            <div class="flex items-center gap-12px">
              <div class="size-48px flex-center rd-8px bg-blue-50 dark:bg-blue-900/20">
                <SvgIcon icon="ph:key-fill" class="text-24px text-blue-500" />
              </div>
              <div>
                <div class="text-12px text-gray-500">权限总数</div>
                <div class="text-24px font-semibold">{{ permissionStats.totalPermissions }}</div>
              </div>
            </div>
          </NCard>
        </NGi>
        <NGi>
          <NCard :bordered="false" class="card-wrapper">
            <div class="flex items-center gap-12px">
              <div class="size-48px flex-center rd-8px bg-green-50 dark:bg-green-900/20">
                <SvgIcon icon="ph:cursor-click-fill" class="text-24px text-green-500" />
              </div>
              <div>
                <div class="text-12px text-gray-500">按钮权限</div>
                <div class="text-24px font-semibold">{{ permissionStats.buttonPermissions }}</div>
              </div>
            </div>
          </NCard>
        </NGi>
        <NGi>
          <NCard :bordered="false" class="card-wrapper">
            <div class="flex items-center gap-12px">
              <div class="size-48px flex-center rd-8px bg-purple-50 dark:bg-purple-900/20">
                <SvgIcon icon="ph:database-fill" class="text-24px text-purple-500" />
              </div>
              <div>
                <div class="text-12px text-gray-500">数据权限</div>
                <div class="text-24px font-semibold">{{ permissionStats.dataPermissions }}</div>
              </div>
            </div>
          </NCard>
        </NGi>
        <NGi>
          <NCard :bordered="false" class="card-wrapper">
            <div class="flex items-center gap-12px">
              <div class="size-48px flex-center rd-8px bg-orange-50 dark:bg-orange-900/20">
                <SvgIcon icon="ph:shield-check-fill" class="text-24px text-orange-500" />
              </div>
              <div>
                <div class="text-12px text-gray-500">IP白名单</div>
                <div class="text-24px font-semibold">{{ permissionStats.ipWhitelist }}</div>
              </div>
            </div>
          </NCard>
        </NGi>
        <NGi>
          <NCard :bordered="false" class="card-wrapper">
            <div class="flex items-center gap-12px">
              <div class="size-48px flex-center rd-8px bg-red-50 dark:bg-red-900/20">
                <SvgIcon icon="ph:check-circle-fill" class="text-24px text-red-500" />
              </div>
              <div>
                <div class="text-12px text-gray-500">生效规则</div>
                <div class="text-24px font-semibold">{{ permissionStats.activeRules }}</div>
              </div>
            </div>
          </NCard>
        </NGi>
        <NGi>
          <NCard :bordered="false" class="card-wrapper">
            <div class="flex items-center gap-12px">
              <div class="size-48px flex-center rd-8px bg-cyan-50 dark:bg-cyan-900/20">
                <SvgIcon icon="ph:clock-fill" class="text-24px text-cyan-500" />
              </div>
              <div>
                <div class="text-12px text-gray-500">本月变更</div>
                <div class="text-24px font-semibold">{{ permissionStats.monthlyChanges }}</div>
              </div>
            </div>
          </NCard>
        </NGi>
      </NGrid>

      <NGrid :x-gap="16" :y-gap="16" responsive="screen" item-responsive>
        <NGi span="24 s:24 m:16">
          <NTabs v-model:value="activeTab" type="line" animated>
            <NTabPane name="button" tab="按钮权限">
              <NCard :bordered="false" class="card-wrapper" :content-style="{ padding: '0' }">
                <NTable :bordered="false" size="small">
                  <thead>
                    <tr>
                      <th width="60">序号</th>
                      <th>权限名称</th>
                      <th>权限编码</th>
                      <th>所属分类</th>
                      <th>描述</th>
                      <th width="80">状态</th>
                      <th width="150">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(permission, index) in buttonPermissions" :key="permission.id">
                      <td>{{ index + 1 }}</td>
                      <td>
                        <div class="flex items-center gap-8px">
                          <SvgIcon icon="ph:key-fill" class="text-16px text-blue-500" />
                          {{ permission.name }}
                        </div>
                      </td>
                      <td>
                        <NTag :bordered="false" size="small" type="primary">{{ permission.code }}</NTag>
                      </td>
                      <td>
                        <NTag :bordered="false" size="small">{{ permission.category }}</NTag>
                      </td>
                      <td class="text-gray-500">{{ permission.description }}</td>
                      <td><NSwitch :value="permission.enabled" @update:value="handleToggle(permission)" /></td>
                      <td>
                        <NButton text type="primary" size="small" @click="handleEdit(permission)">
                          <template #icon><SvgIcon icon="ph:pencil-simple" /></template>
                        </NButton>
                        <NButton text type="error" size="small" @click="handleDelete(permission)">
                          <template #icon><SvgIcon icon="ph:trash" /></template>
                        </NButton>
                      </td>
                    </tr>
                  </tbody>
                </NTable>
              </NCard>
            </NTabPane>

            <NTabPane name="data" tab="数据权限">
              <NCard :bordered="false" class="card-wrapper" :content-style="{ padding: '0' }">
                <NTable :bordered="false" size="small">
                  <thead>
                    <tr>
                      <th width="60">序号</th>
                      <th>角色名称</th>
                      <th>数据范围</th>
                      <th>授权范围</th>
                      <th width="80">状态</th>
                      <th width="120">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(permission, index) in dataPermissions" :key="permission.id">
                      <td>{{ index + 1 }}</td>
                      <td>{{ permission.roleName }}</td>
                      <td>
                        <NTag :type="getScopeTagType(permission.scope)" size="small">
                          {{ getScopeText(permission.scope) }}
                        </NTag>
                      </td>
                      <td>
                        <template v-if="permission.scope === 'all'">全部数据</template>
                        <template v-else-if="permission.scope === 'department'">
                          {{ permission.departments.join('、') }}
                        </template>
                        <template v-else-if="permission.scope === 'self'">仅本人数据</template>
                        <template v-else>{{ permission.users.join('、') }}</template>
                      </td>
                      <td><NSwitch :value="permission.enabled" /></td>
                      <td>
                        <NButton text type="primary" size="small">编辑</NButton>
                        <NButton text type="error" size="small">删除</NButton>
                      </td>
                    </tr>
                  </tbody>
                </NTable>
              </NCard>
            </NTabPane>

            <NTabPane name="ip" tab="IP白名单">
              <NCard :bordered="false" class="card-wrapper" :content-style="{ padding: '0' }">
                <NTable :bordered="false" size="small">
                  <thead>
                    <tr>
                      <th width="60">序号</th>
                      <th>名称</th>
                      <th>IP地址/段</th>
                      <th>描述</th>
                      <th>过期时间</th>
                      <th width="80">状态</th>
                      <th width="120">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in ipWhitelist" :key="item.id">
                      <td>{{ index + 1 }}</td>
                      <td>
                        <div class="flex items-center gap-8px">
                          <SvgIcon icon="ph:shield-check-fill" class="text-16px text-green-500" />
                          {{ item.name }}
                        </div>
                      </td>
                      <td>
                        <NTag :bordered="false" size="small" type="info">{{ item.ipRange }}</NTag>
                      </td>
                      <td class="text-gray-500">{{ item.description }}</td>
                      <td>{{ item.expiresAt }}</td>
                      <td><NSwitch :value="item.enabled" /></td>
                      <td>
                        <NButton text type="primary" size="small">编辑</NButton>
                        <NButton text type="error" size="small">删除</NButton>
                      </td>
                    </tr>
                  </tbody>
                </NTable>
              </NCard>
            </NTabPane>
          </NTabs>
        </NGi>
        <NGi span="24 s:24 m:8">
          <NCard :bordered="false" class="card-wrapper" title="权限分类">
            <div class="space-y-12px">
              <div
                v-for="cat in buttonCategories"
                :key="cat.name"
                class="flex cursor-pointer items-center gap-8px rd-4px bg-gray-50 p-8px dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <SvgIcon :icon="cat.icon" class="text-20px text-gray-500" />
                <div class="flex-1">
                  <div class="text-14px">{{ cat.name }}</div>
                  <div class="text-12px text-gray-500">{{ cat.count }} 个权限</div>
                </div>
                <NTag size="small">{{ cat.count }}</NTag>
              </div>
            </div>
          </NCard>
        </NGi>
      </NGrid>

      <NGrid :x-gap="16" :y-gap="16" responsive="screen" item-responsive>
        <NGi span="24 s:24 m:12">
          <NCard :bordered="false" class="card-wrapper" title="分类权限统计">
            <div ref="permChartRef" class="h-280px overflow-hidden"></div>
          </NCard>
        </NGi>
        <NGi span="24 s:24 m:12">
          <NCard :bordered="false" class="card-wrapper" title="数据权限分布">
            <div ref="scopeChartRef" class="h-280px overflow-hidden"></div>
          </NCard>
        </NGi>
      </NGrid>
    </NSpace>

    <!-- 权限指南和最佳实践 -->
    <PermissionGuide />
  </div>
</template>

<style scoped></style>
