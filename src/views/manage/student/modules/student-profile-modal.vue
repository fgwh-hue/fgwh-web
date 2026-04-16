<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  NAvatar,
  NCard,
  NDescriptions,
  NDescriptionsItem,
  NDivider,
  NGrid,
  NGridItem,
  NModal,
  NProgress,
  NTabPane,
  NTabs,
  NTag
} from 'naive-ui';
import { enableStatusRecord, userGenderRecord } from '@/constants/business';
import { $t } from '@/locales';
import SvgIcon from '@/components/custom/svg-icon.vue';

defineOptions({
  name: 'StudentProfileModal'
});

interface Props {
  studentData?: Api.SystemManage.Student | null;
}

const props = defineProps<Props>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const activeTab = ref<'profile' | 'academic' | 'attendance' | 'courses'>('profile');

const genderLabel = computed(() => {
  if (!props.studentData?.studentGender) return '-';
  return $t(userGenderRecord[props.studentData.studentGender as Api.SystemManage.UserGender]);
});

const statusTagType = computed(() => {
  if (!props.studentData?.status) return 'default';
  return props.studentData.status === 1 ? 'success' : 'warning';
});

const statusLabel = computed(() => {
  if (!props.studentData?.status) return '-';
  return $t(enableStatusRecord[props.studentData.status]);
});

const mockAcademicData = ref({
  gpa: 3.75,
  totalCredits: 128,
  completedCredits: 96,
  ranking: 15,
  totalStudents: 180,
  semesterGrades: [
    { semester: '2024-秋', gpa: 3.8, rank: 12 },
    { semester: '2024-春', gpa: 3.7, rank: 18 },
    { semester: '2023-秋', gpa: 3.85, rank: 8 },
    { semester: '2023-春', gpa: 3.65, rank: 22 }
  ]
});

const mockAttendanceData = ref({
  total: 180,
  present: 172,
  absent: 4,
  late: 4,
  attendanceRate: 95.6,
  monthlyData: [
    { month: '9月', rate: 96.5 },
    { month: '10月', rate: 94.2 },
    { month: '11月', rate: 95.8 },
    { month: '12月', rate: 96.0 }
  ]
});

const mockCourseData = ref({
  enrolled: [
    { name: '数据结构', teacher: '张教授', credits: 4, grade: 'A', status: 'completed' },
    { name: '算法设计', teacher: '李副教授', credits: 3, grade: 'A-', status: 'completed' },
    { name: '数据库原理', teacher: '王讲师', credits: 3, grade: 'B+', status: 'completed' },
    { name: '计算机网络', teacher: '刘教授', credits: 3, grade: 'B', status: 'in-progress' },
    { name: '操作系统', teacher: '陈教授', credits: 4, grade: '-', status: 'in-progress' }
  ],
  completed: 32,
  inProgress: 8,
  totalCredits: 128
});

function getTrend(row: { semester: string; gpa: number; rank: number }) {
  const grades = mockAcademicData.value.semesterGrades;
  const index = grades.findIndex(item => item.semester === row.semester);
  if (index <= 0) return 0;
  const currentGpa = row.gpa;
  const previousGpa = grades[index - 1].gpa;
  return currentGpa - previousGpa;
}
</script>

<template>
  <NModal
    v-model:show="visible"
    preset="card"
    :title="'学生画像 - ' + (studentData?.studentName || '')"
    class="w-900px"
    :bordered="false"
  >
    <div v-if="studentData" class="student-profile">
      <NTabs v-model:value="activeTab" type="line" animated>
        <NTabPane name="profile" tab="基本信息" class="h-400px">
          <div class="profile-content">
            <div class="profile-header">
              <div class="avatar-section">
                <NAvatar :size="80" round :src="studentData.avatar">
                  {{ studentData.studentName?.charAt(0) }}
                </NAvatar>
                <div class="student-info">
                  <h2 class="student-name">{{ studentData.studentName }}</h2>
                  <p class="student-meta">
                    <NTag :type="statusTagType" size="small" bordered>{{ statusLabel }}</NTag>
                    <span class="ml-8px">{{ studentData.studentNo }}</span>
                  </p>
                </div>
              </div>
              <div class="quick-stats">
                <div class="stat-item">
                  <span class="stat-value text-24px text-primary font-bold">{{ mockAcademicData.gpa }}</span>
                  <span class="stat-label">GPA</span>
                </div>
                <div class="stat-item">
                  <span class="stat-value text-24px text-success font-bold">
                    {{ mockAcademicData.completedCredits }}/{{ mockAcademicData.totalCredits }}
                  </span>
                  <span class="stat-label">已获学分</span>
                </div>
                <div class="stat-item">
                  <span class="stat-value text-24px text-warning font-bold">第{{ mockAcademicData.ranking }}名</span>
                  <span class="stat-label">专业排名</span>
                </div>
              </div>
            </div>

            <NDivider />

            <NGrid :cols="3" :x-gap="24" :y-gap="16">
              <NGridItem>
                <div class="info-card">
                  <h4 class="info-title">
                    <SvgIcon icon="ph:user-circle" class="mr-4px text-18px text-primary" />
                    基本信息
                  </h4>
                  <NDescriptions :column="1" size="small">
                    <NDescriptionsItem label="学号">{{ studentData.studentNo }}</NDescriptionsItem>
                    <NDescriptionsItem label="姓名">{{ studentData.studentName }}</NDescriptionsItem>
                    <NDescriptionsItem label="性别">{{ genderLabel }}</NDescriptionsItem>
                    <NDescriptionsItem label="昵称">{{ studentData.nickName || '-' }}</NDescriptionsItem>
                  </NDescriptions>
                </div>
              </NGridItem>
              <NGridItem>
                <div class="info-card">
                  <h4 class="info-title">
                    <SvgIcon icon="ph:books" class="mr-4px text-18px text-primary" />
                    学业信息
                  </h4>
                  <NDescriptions :column="1" size="small">
                    <NDescriptionsItem label="专业">{{ studentData.studentMajor }}</NDescriptionsItem>
                    <NDescriptionsItem label="班级">{{ studentData.studentClass }}</NDescriptionsItem>
                    <NDescriptionsItem label="年级">2021级</NDescriptionsItem>
                    <NDescriptionsItem label="培养方案">计算机科学与技术</NDescriptionsItem>
                  </NDescriptions>
                </div>
              </NGridItem>
              <NGridItem>
                <div class="info-card">
                  <h4 class="info-title">
                    <SvgIcon icon="ph:phone" class="mr-4px text-18px text-primary" />
                    联系信息
                  </h4>
                  <NDescriptions :column="1" size="small">
                    <NDescriptionsItem label="手机">{{ studentData.studentPhone || '-' }}</NDescriptionsItem>
                    <NDescriptionsItem label="邮箱">{{ studentData.studentEmail || '-' }}</NDescriptionsItem>
                    <NDescriptionsItem label="辅导员">王老师</NDescriptionsItem>
                    <NDescriptionsItem label="联系电话">13800138000</NDescriptionsItem>
                  </NDescriptions>
                </div>
              </NGridItem>
            </NGrid>
          </div>
        </NTabPane>

        <NTabPane name="academic" tab="学业分析" class="h-400px">
          <div class="academic-content">
            <NGrid :cols="4" :x-gap="16" :y-gap="16" class="mb-16px">
              <NGridItem>
                <div class="mini-stat-card">
                  <div class="mini-stat-value text-primary">{{ mockAcademicData.gpa }}</div>
                  <div class="mini-stat-label">当前GPA</div>
                  <NProgress type="line" :percentage="75" :show-indicator="false" :height="4" class="mt-8px" />
                </div>
              </NGridItem>
              <NGridItem>
                <div class="mini-stat-card">
                  <div class="mini-stat-value text-success">{{ mockAcademicData.completedCredits }}</div>
                  <div class="mini-stat-label">已完成学分</div>
                  <NProgress
                    type="line"
                    :percentage="75"
                    :show-indicator="false"
                    :height="4"
                    class="mt-8px"
                    color="#52c41a"
                  />
                </div>
              </NGridItem>
              <NGridItem>
                <div class="mini-stat-card">
                  <div class="mini-stat-value text-warning">
                    {{ mockAcademicData.ranking }}/{{ mockAcademicData.totalStudents }}
                  </div>
                  <div class="mini-stat-label">专业排名</div>
                  <NProgress
                    type="line"
                    :percentage="8"
                    :show-indicator="false"
                    :height="4"
                    class="mt-8px"
                    color="#faad14"
                  />
                </div>
              </NGridItem>
              <NGridItem>
                <div class="mini-stat-card">
                  <div class="mini-stat-value text-info">32</div>
                  <div class="mini-stat-label">已修课程数</div>
                  <NProgress
                    type="line"
                    :percentage="100"
                    :show-indicator="false"
                    :height="4"
                    class="mt-8px"
                    color="#1890ff"
                  />
                </div>
              </NGridItem>
            </NGrid>

            <div class="semester-trend">
              <h4 class="section-title">学期成绩趋势</h4>
              <div class="trend-list">
                <div v-for="(item, index) in mockAcademicData.semesterGrades" :key="item.semester" class="trend-item">
                  <div class="trend-index">{{ index + 1 }}</div>
                  <div class="trend-info">
                    <span class="trend-semester">{{ item.semester }}</span>
                    <span class="trend-gpa">GPA: {{ item.gpa }}</span>
                  </div>
                  <div class="trend-rank">排名: 第{{ item.rank }}名</div>
                  <div class="trend-status">
                    <SvgIcon v-if="getTrend(item) > 0" icon="ph:trend-up" class="text-20px text-success" />
                    <SvgIcon v-else-if="getTrend(item) < 0" icon="ph:trend-down" class="text-20px text-error" />
                    <span v-else class="text-gray-400">-</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </NTabPane>

        <NTabPane name="attendance" tab="考勤记录" class="h-400px">
          <div class="attendance-content">
            <NGrid :cols="4" :x-gap="16" :y-gap="16" class="mb-16px">
              <NGridItem>
                <div class="mini-stat-card">
                  <div class="mini-stat-value text-primary">{{ mockAttendanceData.attendanceRate }}%</div>
                  <div class="mini-stat-label">出勤率</div>
                </div>
              </NGridItem>
              <NGridItem>
                <div class="mini-stat-card">
                  <div class="mini-stat-value text-success">{{ mockAttendanceData.present }}</div>
                  <div class="mini-stat-label">出勤次数</div>
                </div>
              </NGridItem>
              <NGridItem>
                <div class="mini-stat-card">
                  <div class="mini-stat-value text-warning">{{ mockAttendanceData.late }}</div>
                  <div class="mini-stat-label">迟到次数</div>
                </div>
              </NGridItem>
              <NGridItem>
                <div class="mini-stat-card">
                  <div class="mini-stat-value text-error">{{ mockAttendanceData.absent }}</div>
                  <div class="mini-stat-label">缺勤次数</div>
                </div>
              </NGridItem>
            </NGrid>

            <NCard title="月度出勤率趋势" :bordered="false" size="small">
              <div class="attendance-chart">
                <div v-for="item in mockAttendanceData.monthlyData" :key="item.month" class="attendance-bar">
                  <div class="bar-label">{{ item.month }}</div>
                  <div class="bar-container">
                    <div class="bar-fill" :style="{ width: item.rate + '%' }"></div>
                  </div>
                  <div class="bar-value">{{ item.rate }}%</div>
                </div>
              </div>
            </NCard>
          </div>
        </NTabPane>

        <NTabPane name="courses" tab="课程信息" class="h-400px">
          <div class="courses-content">
            <NGrid :cols="3" :x-gap="16" :y-gap="16" class="mb-16px">
              <NGridItem>
                <div class="mini-stat-card">
                  <div class="mini-stat-value text-primary">{{ mockCourseData.enrolled.length }}</div>
                  <div class="mini-stat-label">本学期课程</div>
                </div>
              </NGridItem>
              <NGridItem>
                <div class="mini-stat-card">
                  <div class="mini-stat-value text-success">{{ mockCourseData.completed }}</div>
                  <div class="mini-stat-label">已完成</div>
                </div>
              </NGridItem>
              <NGridItem>
                <div class="mini-stat-card">
                  <div class="mini-stat-value text-warning">{{ mockCourseData.inProgress }}</div>
                  <div class="mini-stat-label">进行中</div>
                </div>
              </NGridItem>
            </NGrid>

            <div class="course-list">
              <h4 class="section-title">课程列表</h4>
              <div class="course-items">
                <div v-for="course in mockCourseData.enrolled" :key="course.name" class="course-item">
                  <div class="course-icon">
                    <SvgIcon icon="ph:book-open" class="text-24px" />
                  </div>
                  <div class="course-info">
                    <div class="course-name">{{ course.name }}</div>
                    <div class="course-teacher">{{ course.teacher }}</div>
                  </div>
                  <div class="course-credits">{{ course.credits }}学分</div>
                  <div class="course-grade">
                    <NTag
                      v-if="course.grade !== '-'"
                      :type="course.status === 'completed' ? 'success' : 'warning'"
                      size="small"
                    >
                      {{ course.grade }}
                    </NTag>
                    <span v-else class="text-gray-400">-</span>
                  </div>
                  <div class="course-status">
                    <NTag :type="course.status === 'completed' ? 'success' : 'warning'" size="small">
                      {{ course.status === 'completed' ? '已完成' : '进行中' }}
                    </NTag>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </NTabPane>
      </NTabs>
    </div>
  </NModal>
</template>

<style scoped>
.student-profile {
  padding: 8px 0;
}

.profile-content,
.academic-content,
.attendance-content,
.courses-content {
  padding: 8px 0;
  overflow-y: auto;
  max-height: 360px;
}

.profile-header {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  margin-bottom: 16px;
  gap: 32px;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.avatar-section :deep(.n-avatar) {
  flex-shrink: 0;
}

.avatar-section :deep(.n-avatar img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.student-info {
  min-width: 100px;
  max-width: 300px;
  flex-shrink: 1;
  overflow: hidden;
}

.student-info .student-name {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.student-meta {
  display: flex;
  align-items: center;
  color: #666;
}

.quick-stats {
  display: flex;
  gap: 32px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
}

.stat-label {
  font-size: 12px;
  color: #999;
}

.info-card {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 16px;
}

.info-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
}

.mini-stat-card {
  background: linear-gradient(135deg, #f0f5ff 0%, #e6f4ff 100%);
  border-radius: 12px;
  padding: 16px;
  text-align: center;
}

.mini-stat-value {
  font-size: 28px;
  font-weight: 700;
}

.mini-stat-label {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

.attendance-chart {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.attendance-bar {
  display: flex;
  align-items: center;
  gap: 12px;
}

.bar-label {
  width: 50px;
  font-size: 13px;
  color: #666;
}

.bar-container {
  flex: 1;
  height: 24px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #1890ff 0%, #52c41a 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.bar-value {
  width: 50px;
  text-align: right;
  font-size: 13px;
  font-weight: 600;
  color: #1890ff;
}

.semester-trend {
  background: #fafafa;
  border-radius: 8px;
  padding: 16px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
}

.trend-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.trend-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
}

.trend-index {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgb(var(--primary-rgb) / 10%);
  color: rgb(var(--primary));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
}

.trend-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.trend-semester {
  font-weight: 600;
  color: #333;
}

.trend-gpa {
  font-size: 12px;
  color: #666;
}

.trend-rank {
  font-size: 13px;
  color: #666;
  min-width: 80px;
}

.trend-status {
  min-width: 30px;
  text-align: center;
}

.course-list {
  background: #fafafa;
  border-radius: 8px;
  padding: 16px;
}

.course-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.course-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
}

.course-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: rgb(var(--primary-rgb) / 10%);
  color: rgb(var(--primary));
  display: flex;
  align-items: center;
  justify-content: center;
}

.course-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.course-name {
  font-weight: 600;
  color: #333;
}

.course-teacher {
  font-size: 12px;
  color: #666;
}

.course-credits {
  font-size: 13px;
  color: #666;
  min-width: 50px;
}

.course-grade {
  min-width: 40px;
  text-align: center;
}

.course-status {
  min-width: 70px;
  text-align: center;
}
</style>
