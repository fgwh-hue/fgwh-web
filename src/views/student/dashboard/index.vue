<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { TagProps } from 'naive-ui';
import { useAuthStore } from '@/store/modules/auth';
import g from '@/assets/imgs/g.jpg';
import GaugeChart from './modules/GaugeChart.vue';
import RadarChart from './modules/RadarChart.vue';
import BarChart from './modules/BarChart.vue';

const authStore = useAuthStore();

interface TodoItem {
  id: number;
  content: string;
  isDone: boolean;
  tag: string;
  tagType: TagProps['type'];
}

interface RecommendationItem {
  id: string;
  title: string;
  type: string;
  tagType: TagProps['type'];
}
// 模拟的学生信息
const studentInfo = {
  gender: '男',
  nation: '汉',
  major: '信息与计算科学',
  education: '专科'
};

// 模拟的数据卡片
const dataCards = ref([
  { label: '课程数', value: '1' },
  { label: '总学时', value: '32' },
  { label: '到课率', value: '87.5%' },
  { label: '合格率', value: '100%' },
  { label: '奖学金', value: '9000' },
  { label: '上网时间', value: '14215' },
  { label: '缴费及欠费', value: '0' },
  { label: '违纪', value: '666' },
  { label: '心理卫生', value: '99' },
  { label: '校园卡余额', value: '10000' }
]);

// 模拟雷达图数据
const comprehensiveAbility = {
  indicator: [
    { name: '个人发展', max: 100 },
    { name: '学会发展', max: 100 },
    { name: '社会发展', max: 100 },
    { name: '职业发展', max: 100 }
  ],
  data: [{ name: '能力评估', value: [80, 70, 90, 85] }]
};

const academicAbility = {
  indicator: [
    { name: '公共课程', max: 100 },
    { name: '学科基础教育', max: 100 },
    { name: '师范教育', max: 100 },
    { name: '实体教学课程', max: 100 },
    { name: '专业课程', max: 100 }
  ],
  data: [{ name: '成绩模型', value: [90, 85, 75, 88, 92] }]
};
const todoList = ref<TodoItem[]>([
  { id: 1, content: '完成《高等数学》第三章的课后练习', isDone: false, tag: '作业', tagType: 'info' },
  { id: 2, content: '准备下周的《大学英语》随堂测验', isDone: false, tag: '考试', tagType: 'warning' },
  { id: 3, content: '观看“AI技术与未来”线上讲座', isDone: true, tag: '活动', tagType: 'success' },
  { id: 4, content: '提交《计算机网络》实验报告', isDone: false, tag: '实验', tagType: 'error' }
]);
// 模拟的“学习推荐”数据
const recommendations = ref<RecommendationItem[]>([
  { id: 'rec1', title: '黑马程序员快速入门', type: '视频', tagType: 'info' },
  { id: 'rec2', title: '文章：如何高效记笔记', type: '文章', tagType: 'success' },
  { id: 'rec3', title: '练习题：高数第一章单元测验', type: '练习', tagType: 'warning' },
  { id: 'rec4', title: '免费课程：Python数据分析实战', type: '视频', tagType: 'info' },
  { id: 'rec5', title: '技巧：使用思维导图整理知识点', type: '文章', tagType: 'success' },
  { id: 'rec6', title: '模拟题：大学英语四级真题训练', type: '练习', tagType: 'warning' },
  { id: 'rec7', title: '视频：机器学习基础概念讲解', type: '视频', tagType: 'info' },
  { id: 'rec8', title: '干货：程序员面试常见问题解析', type: '文章', tagType: 'success' }
]);

// 模拟的“进阶阶段”数据
const nextStages = ref([
  { id: 'stage1', title: '掌握 TypeScript 高级类型', description: '深入学习泛型、条件类型等', status: '进行中' },
  { id: 'stage2', title: '学习 Vue 3 源码', description: '理解响应式原理和编译过程', status: '已完成' },
  { id: 'stage3', title: '学习 gemini cli', description: 'gemini CLI 是谷歌开发的AI辅助编程工具', status: '已完成' }
]);

// 模拟的“我的课程”数据
const myCourses = ref([
  { id: 'c1', name: '高等数学', teacher: '王老师', progress: 75 },
  { id: 'c2', name: '大学英语', teacher: '李老师', progress: 90 },
  { id: 'c3', name: '计算机网络', teacher: '赵老师', progress: 50 }
]);

// 模拟的“最近考试”数据
const recentExams = ref([
  { id: 'e1', name: '高等数学期末考试', time: '2025-6-6 09:00', status: '待开考' },
  { id: 'e2', name: '计算机基础', time: '2025-6-6 14:00', status: '待开考' },
  { id: 'e3', name: 'web前端', time: '2025-6-6 14:00', status: '待开考' }
]);

// onMounted 逻辑
onMounted(() => {
  // 【更新】现在只为 .interactive-item 添加事件监听
  const items = document.querySelectorAll<HTMLElement>('.interactive-item');

  items.forEach(item => {
    item.addEventListener('mousemove', (e: MouseEvent) => {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      (e.currentTarget as HTMLElement).style.setProperty('--ripple-x', `${x}px`);
      (e.currentTarget as HTMLElement).style.setProperty('--ripple-y', `${y}px`);
    });
  });
});
</script>

<template>
  <div>
    <!-- 仪表盘主体内容 -->
    <NSpace vertical :size="16">
      <NGrid :x-gap="16" :y-gap="16" cols="1 s:1 m:1 l:3" responsive="screen">
        <!-- 左侧：用户信息 -->
        <NGi span="1">
          <NCard :bordered="false" class="interactive-item h-full card-wrapper">
            <div class="h-full flex-col-center">
              <NAvatar round :size="80" :src="g" />
              <p class="mt-4 text-lg font-semibold">{{ authStore.userInfo.userName }}</p>
              <NDescriptions label-placement="left" :column="2" bordered size="small" class="mt-4 w-full">
                <NDescriptionsItem label="性别">{{ studentInfo.gender }}</NDescriptionsItem>
                <NDescriptionsItem label="专业名称">{{ studentInfo.major }}</NDescriptionsItem>
                <NDescriptionsItem label="民族">{{ studentInfo.nation }}</NDescriptionsItem>
                <NDescriptionsItem label="学历层次">{{ studentInfo.education }}</NDescriptionsItem>
              </NDescriptions>
            </div>
          </NCard>
        </NGi>
        <!-- 中间：综合得分 -->
        <NGi span="1">
          <NCard title="综合得分" :bordered="false" class="interactive-item h-full card-wrapper">
            <GaugeChart class="h-200px" />
          </NCard>
        </NGi>
        <!-- 右侧：综合能力模型 -->
        <NGi span="1">
          <NCard :bordered="false" class="interactive-item h-full card-wrapper">
            <RadarChart
              class="h-240px"
              title="综合能力发展模型"
              :indicator="comprehensiveAbility.indicator"
              :data="comprehensiveAbility.data"
            />
          </NCard>
        </NGi>
      </NGrid>

      <!-- 数据卡片 -->
      <NGrid :x-gap="16" :y-gap="16" cols="2 s:3 m:4 l:5" responsive="screen">
        <NGi v-for="(item, index) in dataCards" :key="index">
          <NCard :bordered="false" class="interactive-item card-wrapper">
            <NStatistic :label="item.label" :value="item.value" class="text-center" />
          </NCard>
        </NGi>
      </NGrid>

      <!-- 底部图表 -->
      <NGrid
        :x-gap="16"
        :y-gap="16"
        cols="1 s:1 l:2"
        responsive="screen"
        class="flex-1-hidden"
        item-style="display: flex;"
      >
        <!-- 左侧：本周考勤 -->
        <NGi class="flex-1-hidden">
          <NCard
            :bordered="false"
            class="interactive-item h-full card-wrapper"
            content-style="display: flex; flex-direction: column; height: 100%;"
          >
            <BarChart class="flex-1-hidden" />
          </NCard>
        </NGi>

        <!-- 右侧：成绩能力模型 -->
        <NGi>
          <NCard :bordered="false" class="interactive-item h-300px card-wrapper">
            <RadarChart
              class="h-full"
              title="成绩能力模型"
              :indicator="academicAbility.indicator"
              :data="academicAbility.data"
            />
          </NCard>
        </NGi>
      </NGrid>

      <!-- 我的课程和最近考试模块 -->
      <NGrid :x-gap="16" :y-gap="16" cols="1 s:1 l:2" responsive="screen">
        <!-- 左侧：我的课程 -->
        <NGi>
          <NCard title="我的课程" :bordered="false" class="h-full card-wrapper">
            <template #header-extra>
              <a href="#" class="text-sm text-primary">查看全部课程</a>
            </template>
            <NList hoverable clickable>
              <!-- 【更新】添加 interactive-item 类 -->
              <NListItem
                v-for="course in myCourses"
                :key="course.id"
                class="interactive-item transition-background-color !px-0"
              >
                <NThing :title="course.name" :description="`授课教师: ${course.teacher}`" />
              </NListItem>
            </NList>
          </NCard>
        </NGi>
        <!-- 右侧：最近考试 -->
        <NGi>
          <NCard title="最近考试" :bordered="false" class="h-full card-wrapper">
            <!-- 【更新】添加 interactive-item 类 -->
            <NThing v-for="exam in recentExams" :key="exam.id" class="interactive-item mb-4 last:mb-0">
              <template #header>
                <div class="flex items-center justify-between">
                  <span>{{ exam.name }}</span>
                  <NTag :type="exam.status === '待开考' ? 'warning' : 'error'" size="small">{{ exam.status }}</NTag>
                </div>
              </template>
              <template #description>考试时间：{{ exam.time }}</template>
            </NThing>
          </NCard>
        </NGi>
      </NGrid>
      <!-- 每日一句卡片 -->
      <NCard :bordered="false" class="interactive-item card-wrapper">
        <div class="relative h-120px overflow-hidden rounded-lg">
          <img src="@/assets/imgs/z.jpg" class="absolute left-0 top-0 h-full w-full object-cover" />
          <div
            class="absolute left-0 top-0 h-full w-full flex flex-col items-center justify-center bg-black bg-opacity-30"
          >
            <p class="z-10 text-lg text-white font-semibold">"真正的梦想为何物"</p>
            <p class="z-10 mt-2 text-sm text-white">- 宇智波斑</p>
          </div>
        </div>
      </NCard>
      <!-- 我的待办 -->
      <NCard title="我的待办" :bordered="false" class="card-wrapper">
        <template #header-extra>
          <a href="#" class="text-primary">查看全部</a>
        </template>
        <NList hoverable clickable>
          <NListItem v-for="item in todoList" :key="item.id" class="interactive-item">
            <div class="flex items-center">
              <NCheckbox v-model:checked="item.isDone" class="mr-4" />
              <span class="flex-1" :class="{ 'line-through text-gray-400': item.isDone }">
                {{ item.content }}
              </span>
              <NTag :type="item.tagType" size="small">{{ item.tag }}</NTag>
            </div>
          </NListItem>
        </NList>
      </NCard>
      <!-- 学习推荐和进阶阶段模块 -->
      <NGrid :x-gap="16" :y-gap="16" cols="1 s:1 l:2" responsive="screen">
        <!-- 左侧：学习推荐 -->
        <NGi>
          <NCard title="学习推荐" :bordered="false" class="h-full card-wrapper">
            <template #header-extra>
              <a href="#" class="text-sm text-primary">换一批</a>
            </template>
            <div class="recommendations-container">
              <NList hoverable clickable :show-divider="true">
                <NListItem v-for="rec in recommendations" :key="rec.id" class="interactive-item recommendation-item">
                  <div class="w-full flex items-center justify-between">
                    <span class="flex-1 ellipsis-text">{{ rec.title }}</span>
                    <NTag :type="rec.tagType" size="small" :bordered="false" :round="true">{{ rec.type }}</NTag>
                  </div>
                </NListItem>
              </NList>
            </div>
          </NCard>
        </NGi>

        <!-- 右侧：进阶阶段 -->
        <NGi>
          <NCard title="进阶阶段" :bordered="false" class="h-full card-wrapper">
            <NThing v-for="stage in nextStages" :key="stage.id" class="interactive-item mb-4 last:mb-0">
              <template #header>
                <div class="flex items-center justify-between">
                  <span>{{ stage.title }}</span>
                  <NTag :type="stage.status === '进行中' ? 'primary' : 'default'" size="small">{{ stage.status }}</NTag>
                </div>
              </template>
              <template #description>
                {{ stage.description }}
              </template>
            </NThing>
          </NCard>
        </NGi>
      </NGrid>
    </NSpace>
  </div>
</template>

<style scoped>
/* 【更新】为所有可交互的卡片/项目添加基础样式 */
.card-wrapper.interactive-item,
.interactive-item {
  min-height: 50px; /* 确保小项目也有最小高度 */
  position: relative;
  overflow: hidden;
  z-index: 0;
  transition: transform 0.3s ease-in-out;
  border-radius: 8px; /* 为列表项添加圆角，使其看起来更像卡片 */
  padding: 12px; /* 为列表项添加内边距 */
}

/* 【更新】将悬浮效果应用到 .interactive-item 上 */
.card-wrapper.interactive-item:hover,
.interactive-item:hover {
  transform: scale(1.05);
  z-index: 10;
}

/* 涟漪效果的伪元素 */
.card-wrapper.interactive-item::after,
.interactive-item::after {
  content: '';
  position: absolute;
  top: var(--ripple-y);
  left: var(--ripple-x);
  width: 0;
  height: 0;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.1);
  opacity: 0.5;
  transition: 0s;
  pointer-events: none;
  z-index: 1;
}

/* 鼠标悬浮时触发涟漪动画 */
.card-wrapper.interactive-item:hover::after,
.interactive-item:hover::after {
  width: 400px;
  height: 400px;
  opacity: 0;
  transition:
    width 0.6s ease-out,
    height 0.6s ease-out,
    opacity 0.6s ease-out;
}

/* 学习推荐区域样式 */
.recommendations-container {
  max-height: 280px; /* 控制容器最大高度，确保不撑大卡片 */
  overflow-y: auto; /* 添加垂直滚动条 */
  padding-right: 8px;
  scrollbar-width: thin;
  scrollbar-color: rgba(100, 108, 255, 0.5) transparent;
}

/* 滚动条样式 */
.recommendations-container::-webkit-scrollbar {
  width: 6px;
}

.recommendations-container::-webkit-scrollbar-track {
  background: transparent;
}

.recommendations-container::-webkit-scrollbar-thumb {
  background: rgba(100, 108, 255, 0.5);
  border-radius: 3px;
}

.recommendations-container::-webkit-scrollbar-thumb:hover {
  background: rgba(100, 108, 255, 0.7);
}

/* 学习推荐列表项样式 */
.recommendation-item {
  padding: 12px 0 !important;
  min-height: auto;
  border-radius: 8px;
  margin: 4px 0;
  transition: all 0.2s ease;
}

.recommendation-item:hover {
  background-color: rgba(100, 108, 255, 0.05);
  transform: translateX(4px);
}

/* 省略文本样式 */
.ellipsis-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
