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
  name: 'TeacherProfileModal'
});

interface Props {
  teacherData?: Api.SystemManage.Teacher | null;
}

const props = defineProps<Props>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const activeTab = ref<'profile' | 'teaching' | 'evaluation' | 'schedule'>('profile');

const genderLabel = computed(() => {
  if (!props.teacherData?.teacherGender) return '-';
  return $t(userGenderRecord[props.teacherData.teacherGender as Api.SystemManage.UserGender]);
});

const statusTagType = computed(() => {
  if (!props.teacherData?.status) return 'default';
  return props.teacherData.status === 1 ? 'success' : 'warning';
});

const statusLabel = computed(() => {
  if (!props.teacherData?.status) return '-';
  return $t(enableStatusRecord[props.teacherData.status]);
});

const mockTeachingData = ref({
  courses: [
    { name: '数据结构', semester: '2024-秋', students: 120, hours: 48, classroom: 'A301' },
    { name: '算法设计', semester: '2024-秋', students: 85, hours: 36, classroom: 'B205' },
    { name: '计算机科学导论', semester: '2024-春', students: 200, hours: 32, classroom: 'C101' }
  ],
  totalCourses: 12,
  totalStudents: 580,
  teachingHours: 320
});

const mockEvaluationData = ref({
  overall: 4.7,
  aspects: [
    { name: '教学方法', score: 4.8 },
    { name: '课堂互动', score: 4.5 },
    { name: '作业批改', score: 4.6 },
    { name: '学术水平', score: 4.9 },
    { name: '师德师风', score: 4.8 }
  ],
  totalEvaluations: 1250,
  recentComments: [
    { student: '张同学', course: '数据结构', comment: '老师讲解清晰，耐心解答问题', rating: 5 },
    { student: '李同学', course: '算法设计', comment: '课程内容丰富，实践性强', rating: 5 },
    { student: '王同学', course: '数据结构', comment: '很有责任心，作业反馈及时', rating: 4 }
  ]
});

const mockScheduleData = ref({
  weeklySchedule: [
    { day: '周一', periods: ['1-2节 数据结构', '3-4节 算法设计', '5-6节 自习'] },
    { day: '周二', periods: ['1-2节 计算机科学导论', '3-4节 教研活动', '5-6节 备课'] },
    { day: '周三', periods: ['1-2节 算法设计', '3-4节 数据结构', '5-6节 答疑'] },
    { day: '周四', periods: ['1-2节 学术研讨', '3-4节 指导学生', '5-6节 备课'] },
    { day: '周五', periods: ['1-2节 数据结构', '3-4节 教研会议', '5-6节 自习'] }
  ]
});

const scheduleData = computed(() => {
  return mockScheduleData.value.weeklySchedule.map(item => ({
    day: item.day,
    p1: item.periods[0] || '-',
    p2: item.periods[1] || '-',
    p3: item.periods[2] || '-'
  }));
});
</script>

<template>
  <NModal
    v-model:show="visible"
    preset="card"
    :title="'教师画像 - ' + (teacherData?.teacherName || '')"
    class="w-900px"
    :bordered="false"
  >
    <div v-if="teacherData" class="teacher-profile">
      <NTabs v-model:value="activeTab" type="line" animated>
        <NTabPane name="profile" tab="基本信息" class="h-400px">
          <div class="profile-content">
            <div class="profile-header">
              <div class="avatar-section">
                <NAvatar :size="80" round :src="teacherData.avatar">
                  {{ teacherData.teacherName?.charAt(0) }}
                </NAvatar>
                <div class="teacher-info">
                  <h2 class="teacher-name">{{ teacherData.teacherName }}</h2>
                  <p class="teacher-meta">
                    <NTag :type="statusTagType" size="small" bordered>{{ statusLabel }}</NTag>
                    <span class="ml-8px">{{ teacherData.teacherNo }}</span>
                    <NTag size="small" class="ml-8px">{{ teacherData.teacherTitle }}</NTag>
                  </p>
                </div>
              </div>
              <div class="quick-stats">
                <div class="stat-item">
                  <span class="stat-value text-24px text-primary font-bold">{{ mockEvaluationData.overall }}</span>
                  <span class="stat-label">综合评分</span>
                </div>
                <div class="stat-item">
                  <span class="stat-value text-24px text-success font-bold">{{ mockTeachingData.totalCourses }}</span>
                  <span class="stat-label">教授课程</span>
                </div>
                <div class="stat-item">
                  <span class="stat-value text-24px text-warning font-bold">{{ mockTeachingData.teachingHours }}</span>
                  <span class="stat-label">教学学时</span>
                </div>
              </div>
            </div>

            <NDivider />

            <NGrid :cols="3" :x-gap="24" :y-gap="16">
              <NGridItem :span="1">
                <div class="info-card">
                  <h4 class="info-title">
                    <SvgIcon icon="ph:user-circle" class="mr-4px text-18px text-primary" />
                    基本信息
                  </h4>
                  <NDescriptions :column="1" size="small">
                    <NDescriptionsItem label="工号">{{ teacherData.teacherNo }}</NDescriptionsItem>
                    <NDescriptionsItem label="姓名">{{ teacherData.teacherName }}</NDescriptionsItem>
                    <NDescriptionsItem label="性别">{{ genderLabel }}</NDescriptionsItem>
                    <NDescriptionsItem label="职称">{{ teacherData.teacherTitle }}</NDescriptionsItem>
                  </NDescriptions>
                </div>
              </NGridItem>
              <NGridItem :span="1">
                <div class="info-card">
                  <h4 class="info-title">
                    <SvgIcon icon="ph:bank" class="mr-4px text-18px text-primary" />
                    任职信息
                  </h4>
                  <NDescriptions :column="1" size="small">
                    <NDescriptionsItem label="院系">{{ teacherData.teacherDepartment }}</NDescriptionsItem>
                    <NDescriptionsItem label="入职年份">2018年</NDescriptionsItem>
                    <NDescriptionsItem label="研究方向">人工智能、数据挖掘</NDescriptionsItem>
                    <NDescriptionsItem label="学历">博士</NDescriptionsItem>
                  </NDescriptions>
                </div>
              </NGridItem>
              <NGridItem :span="1">
                <div class="info-card">
                  <h4 class="info-title">
                    <SvgIcon icon="ph:phone" class="mr-4px text-18px text-primary" />
                    联系信息
                  </h4>
                  <NDescriptions :column="1" size="small">
                    <NDescriptionsItem label="手机">{{ teacherData.teacherPhone || '-' }}</NDescriptionsItem>
                    <NDescriptionsItem label="邮箱">{{ teacherData.teacherEmail || '-' }}</NDescriptionsItem>
                    <NDescriptionsItem label="办公室">实验楼 301</NDescriptionsItem>
                    <NDescriptionsItem label="办公电话">010-12345678</NDescriptionsItem>
                  </NDescriptions>
                </div>
              </NGridItem>
            </NGrid>
          </div>
        </NTabPane>

        <NTabPane name="teaching" tab="教学信息" class="h-400px">
          <div class="teaching-content">
            <NGrid :cols="3" :x-gap="16" :y-gap="16" class="mb-16px">
              <NGridItem :span="1">
                <div class="mini-stat-card">
                  <div class="mini-stat-value text-primary">{{ mockTeachingData.totalCourses }}</div>
                  <div class="mini-stat-label">教授课程数</div>
                </div>
              </NGridItem>
              <NGridItem :span="1">
                <div class="mini-stat-card">
                  <div class="mini-stat-value text-success">{{ mockTeachingData.totalStudents }}</div>
                  <div class="mini-stat-label">累计学生数</div>
                </div>
              </NGridItem>
              <NGridItem :span="1">
                <div class="mini-stat-card">
                  <div class="mini-stat-value text-warning">{{ mockTeachingData.teachingHours }}</div>
                  <div class="mini-stat-label">本学期学时</div>
                </div>
              </NGridItem>
            </NGrid>

            <div class="teacher-course-list">
              <h4 class="section-title">本学期课程</h4>
              <div class="teacher-course-items">
                <div v-for="course in mockTeachingData.courses" :key="course.name" class="teacher-course-item">
                  <div class="course-icon">
                    <SvgIcon icon="ph:book-open" class="text-24px" />
                  </div>
                  <div class="course-info">
                    <div class="course-name">{{ course.name }}</div>
                    <div class="course-meta">
                      <span>学期: {{ course.semester }}</span>
                      <span>教室: {{ course.classroom }}</span>
                    </div>
                  </div>
                  <div class="course-students">{{ course.students }}人</div>
                  <div class="course-hours">{{ course.hours }}学时</div>
                </div>
              </div>
            </div>
          </div>
        </NTabPane>

        <NTabPane name="evaluation" tab="教学评价" class="h-400px">
          <div class="evaluation-content">
            <NGrid :cols="2" :x-gap="24" class="mb-16px">
              <NGridItem :span="1">
                <div class="evaluation-overview">
                  <div class="overall-score">
                    <span class="score-value text-48px text-primary font-bold">{{ mockEvaluationData.overall }}</span>
                    <span class="score-max">/5.0</span>
                  </div>
                  <div class="total-evaluations text-gray-500">
                    基于 {{ mockEvaluationData.totalEvaluations }} 条评价
                  </div>
                  <div class="aspects mt-16px">
                    <div v-for="aspect in mockEvaluationData.aspects" :key="aspect.name" class="aspect-item">
                      <div class="aspect-name">{{ aspect.name }}</div>
                      <NProgress
                        type="line"
                        :percentage="(aspect.score / 5) * 100"
                        :show-indicator="false"
                        :height="8"
                        class="flex-1"
                      />
                      <div class="aspect-score ml-8px">{{ aspect.score }}</div>
                    </div>
                  </div>
                </div>
              </NGridItem>
              <NGridItem :span="1">
                <NCard title="最新评价" :bordered="false" size="small">
                  <div class="recent-comments">
                    <div
                      v-for="(comment, index) in mockEvaluationData.recentComments"
                      :key="index"
                      class="comment-item"
                    >
                      <div class="comment-header">
                        <span class="comment-student">{{ comment.student }}</span>
                        <NTag size="tiny" type="warning">{{ comment.course }}</NTag>
                        <div class="comment-rating">
                          <SvgIcon
                            v-for="i in 5"
                            :key="i"
                            :icon="i <= comment.rating ? 'ph:star-fill' : 'ph:star'"
                            :class="i <= comment.rating ? 'text-warning' : 'text-gray-300'"
                            class="text-12px"
                          />
                        </div>
                      </div>
                      <p class="comment-text">{{ comment.comment }}</p>
                    </div>
                  </div>
                </NCard>
              </NGridItem>
            </NGrid>
          </div>
        </NTabPane>

        <NTabPane name="schedule" tab="课程表" class="h-400px">
          <div class="schedule-content">
            <div class="schedule-list">
              <h4 class="section-title">本周日程</h4>
              <div class="schedule-items">
                <div v-for="schedule in scheduleData" :key="schedule.day" class="schedule-item">
                  <div class="schedule-day">{{ schedule.day }}</div>
                  <div class="schedule-slots">
                    <div class="schedule-slot">
                      <span class="slot-label">1-2节</span>
                      <span class="slot-content">{{ schedule.p1 }}</span>
                    </div>
                    <div class="schedule-slot">
                      <span class="slot-label">3-4节</span>
                      <span class="slot-content">{{ schedule.p2 }}</span>
                    </div>
                    <div class="schedule-slot">
                      <span class="slot-label">5-6节</span>
                      <span class="slot-content">{{ schedule.p3 }}</span>
                    </div>
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
.teacher-profile {
  padding: 8px 0;
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

.teacher-info {
  min-width: 100px;
  max-width: 300px;
  flex-shrink: 1;
  overflow: hidden;
}

.teacher-info .teacher-name {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.teacher-meta {
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
  padding: 24px;
  text-align: center;
}

.mini-stat-value {
  font-size: 32px;
  font-weight: 700;
}

.mini-stat-label {
  font-size: 13px;
  color: #666;
  margin-top: 4px;
}

.evaluation-overview {
  background: linear-gradient(135deg, #f6ffed 0%, #e6fffb 100%);
  border-radius: 12px;
  padding: 24px;
}

.overall-score {
  display: flex;
  align-items: baseline;
}

.score-max {
  font-size: 18px;
  color: #999;
  margin-left: 4px;
}

.aspects {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.aspect-item {
  display: flex;
  align-items: center;
}

.aspect-name {
  width: 80px;
  font-size: 13px;
  color: #666;
}

.aspect-score {
  width: 30px;
  text-align: right;
  font-weight: 600;
  color: #1890ff;
}

.recent-comments {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.comment-item {
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.comment-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.comment-student {
  font-weight: 600;
  font-size: 13px;
}

.comment-rating {
  margin-left: auto;
  display: flex;
  gap: 2px;
}

.comment-text {
  font-size: 13px;
  color: #666;
  line-height: 1.6;
}

.teaching-content,
.evaluation-content,
.schedule-content {
  padding: 8px 0;
  overflow-y: auto;
  max-height: 360px;
}

.teacher-course-list {
  background: #fafafa;
  border-radius: 8px;
  padding: 16px;
}

.teacher-course-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.teacher-course-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
}

.teacher-course-item .course-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: rgb(var(--primary-rgb) / 10%);
  color: rgb(var(--primary));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.teacher-course-item .course-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.teacher-course-item .course-name {
  font-weight: 600;
  color: #333;
}

.teacher-course-item .course-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #666;
}

.teacher-course-item .course-students,
.teacher-course-item .course-hours {
  font-size: 13px;
  color: #666;
  min-width: 60px;
  text-align: center;
}

.schedule-list {
  background: #fafafa;
  border-radius: 8px;
  padding: 16px;
}

.schedule-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.schedule-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
}

.schedule-day {
  width: 50px;
  font-weight: 600;
  color: rgb(var(--primary));
  flex-shrink: 0;
}

.schedule-slots {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.schedule-slot {
  display: flex;
  align-items: center;
  gap: 8px;
}

.slot-label {
  width: 50px;
  font-size: 12px;
  color: #999;
  flex-shrink: 0;
}

.slot-content {
  font-size: 13px;
  color: #333;
}
</style>
