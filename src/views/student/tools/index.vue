<script setup lang="ts">
/**
 * 学生工具集页面
 * 提供学习相关的实用工具和网站推荐
 * 新增：交互式学习内容编辑器、内容自适应调整、协作学习功能
 */

import { computed, ref } from 'vue';
import {
  NBadge,
  NButton,
  NCard,
  NInput,
  NList,
  NListItem,
  NProgress,
  NRadio,
  NRadioGroup,
  NSelect,
  NTab,
  NTabs,
  NTag,
  NUpload
} from 'naive-ui';
import SvgIcon from '@/components/custom/svg-icon.vue';

defineOptions({
  name: 'StudentTools'
});

// 学习工具和网站列表数据
interface ToolItem {
  id: string;
  name: string;
  icon: string;
  localIcon?: string;
  description: string;
  url: string;
  type: string;
  color: string;
  bgColor: string;
}

// 学习网页数据（保持原有内容）
const webTools: ToolItem[] = [
  {
    id: 'baidu',
    name: '百度',
    icon: 'mdi:web',
    description: '国内最大的搜索引擎，提供全面的信息检索服务',
    url: 'https://www.baidu.com',
    type: '搜索引擎',
    color: '#4CAF50',
    bgColor: 'rgba(76, 175, 80, 0.1)'
  },
  {
    id: 'zhihu',
    name: '知乎',
    icon: 'mdi:message-reply-text-outline',
    description: '高质量问答社区，获取专业知识和经验分享',
    url: 'https://www.zhihu.com',
    type: '问答社区',
    color: '#0084FF',
    bgColor: 'rgba(0, 132, 255, 0.1)'
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: 'mdi:github',
    description: '全球最大的代码托管平台，学习编程和开源项目',
    url: 'https://github.com',
    type: '代码平台',
    color: '#333333',
    bgColor: 'rgba(51, 51, 51, 0.1)'
  },
  {
    id: 'leetcode',
    name: 'LeetCode',
    icon: 'mdi:code-json',
    description: '编程算法练习平台，提升编程能力',
    url: 'https://leetcode.cn',
    type: '编程练习',
    color: '#FFA116',
    bgColor: 'rgba(255, 161, 22, 0.1)'
  },
  {
    id: 'csdn',
    name: 'CSDN',
    icon: 'mdi:book-open-variant',
    description: '中国最大的IT技术社区，提供技术文章和学习资源',
    url: 'https://www.csdn.net',
    type: '技术社区',
    color: '#F05A28',
    bgColor: 'rgba(240, 90, 40, 0.1)'
  },
  {
    id: 'notion',
    name: 'Notion',
    icon: 'mdi:notebook-outline',
    description: '多功能笔记工具，支持文档协作和知识管理',
    url: 'https://www.notion.so',
    type: '笔记工具',
    color: '#2E8B57',
    bgColor: 'rgba(46, 139, 87, 0.1)'
  }
];

// AI工具列表数据（新增的AI相关工具）
const aiTools: ToolItem[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    icon: 'mdi:robot-outline',
    description: 'OpenAI开发的先进AI语言模型，支持多轮对话和内容生成',
    url: 'https://chat.openai.com',
    type: 'AI大模型',
    color: '#10A37F',
    bgColor: 'rgba(16, 163, 127, 0.1)'
  },
  {
    id: 'gemini',
    name: 'Gemini',
    icon: 'mdi:google',
    description: 'Google开发的多模态AI模型，支持文本、图像、音频等多种输入',
    url: 'https://gemini.google.com',
    type: 'AI大模型',
    color: '#4285F4',
    bgColor: 'rgba(66, 133, 244, 0.1)'
  },
  {
    id: 'claude',
    name: 'Claude',
    icon: 'mdi:brain',
    description: 'Anthropic开发的AI助手，以长文本处理和安全性著称',
    url: 'https://claude.ai',
    type: 'AI大模型',
    color: '#FF6B6B',
    bgColor: 'rgba(255, 107, 107, 0.1)'
  },
  {
    id: 'kimi',
    name: 'Kimi',
    icon: 'mdi:book-open-variant',
    description: '支持超长文本处理的AI助手，适合文档分析和理解',
    url: 'https://kimi.moonshot.cn',
    type: 'AI大模型',
    color: '#1890FF',
    bgColor: 'rgba(24, 144, 255, 0.1)'
  },
  {
    id: 'copilot',
    name: 'GitHub Copilot',
    icon: 'mdi:github',
    description: 'AI编程助手，实时提供代码建议和自动补全功能',
    url: 'https://github.com/features/copilot',
    type: 'AI编程工具',
    color: '#5E6AD2',
    bgColor: 'rgba(94, 106, 210, 0.1)'
  },
  {
    id: 'cursor',
    name: 'Trea CN',
    icon: 'mdi:cursor-default-outline',
    description: '基于AI的代码编辑器，集成deepseek，支持自然语言编程',
    url: 'https://cursor.sh',
    type: 'AI编程工具',
    color: '#000000',
    bgColor: 'rgba(0, 0, 0, 0.05)'
  },
  {
    id: 'devin',
    name: 'Devin',
    icon: 'mdi:code-braces',
    description: 'AI软件工程师，能够自主完成端到端的软件开发任务',
    url: 'https://www.cognition-labs.com/devin',
    type: 'AI编程工具',
    color: '#6366F1',
    bgColor: 'rgba(99, 102, 241, 0.1)'
  },
  {
    id: 'perplexity',
    name: 'Perplexity AI',
    icon: 'mdi:magnify',
    description: 'AI搜索引擎，提供精准的信息检索和答案生成',
    url: 'https://www.perplexity.ai',
    type: 'AI搜索工具',
    color: '#4F46E5',
    bgColor: 'rgba(79, 70, 229, 0.1)'
  },
  {
    id: 'phind',
    name: 'Phind',
    icon: 'mdi:magnify',
    description: '面向开发者的AI搜索引擎，专注于技术问题解答',
    url: 'https://www.phind.com',
    type: 'AI搜索工具',
    color: '#FF5722',
    bgColor: 'rgba(255, 87, 34, 0.1)'
  }
];

// 工具点击事件
function handleToolClick(url: string) {
  // 打开链接到新窗口
  window.open(url, '_blank', 'noopener,noreferrer');
}

// 获取URL的主机名
function getHostname(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

// 学习技巧列表数据
interface StudyTip {
  id: string;
  title: string;
  icon: string;
  description: string;
  color: string;
}

const studyTips: StudyTip[] = [
  {
    id: 'tip1',
    title: '番茄工作法',
    icon: 'mdi:clock-outline',
    description: '25分钟工作，5分钟休息，提高专注力和工作效率',
    color: '#FF6B6B'
  },
  {
    id: 'tip2',
    title: '费曼学习法',
    icon: 'mdi:book-open-page-variant-outline',
    description: '通过讲解知识来加深理解，发现知识盲区',
    color: '#4ECDC4'
  },
  {
    id: 'tip3',
    title: '思维导图',
    icon: 'mdi:map',
    description: '用图形化方式组织知识，建立知识间的联系',
    color: '#FFD166'
  },
  {
    id: 'tip4',
    title: '间隔重复',
    icon: 'mdi:refresh',
    description: '定期复习知识，增强长期记忆效果',
    color: '#06D6A0'
  }
];

// 新增：交互式学习内容编辑器
const activeTab = ref('editor');
const contentTitle = ref('');
const contentBody = ref('');
const contentType = ref('article');
const learningStyle = ref('visual');
const collaborationEnabled = ref(false);
const collaborators = ref<string[]>([]);
const newCollaborator = ref('');
const contentHistory = ref<string[]>([]);
const currentVersion = ref(0);
const shareLink = ref('');
const sharingEnabled = ref(false);
const sharedWith = ref<string[]>([]);
const newShareUser = ref('');

// 新增：工具分类筛选
const selectedCategory = ref('all');
const toolCategories = [
  { id: 'all', name: '全部' },
  { id: '搜索引擎', name: '搜索引擎' },
  { id: '问答社区', name: '问答社区' },
  { id: '编程练习', name: '编程练习' },
  { id: '技术社区', name: '技术社区' },
  { id: '笔记工具', name: '笔记工具' },
  { id: 'AI大模型', name: 'AI大模型' },
  { id: 'AI编程工具', name: 'AI编程工具' },
  { id: 'AI搜索工具', name: 'AI搜索工具' }
];

// 新增：工具使用统计
const toolUsageStats = ref([
  { id: 'stat1', name: '百度', usage: 15 },
  { id: 'stat2', name: 'GitHub', usage: 12 },
  { id: 'stat3', name: 'ChatGPT', usage: 10 },
  { id: 'stat4', name: 'LeetCode', usage: 8 }
]);

// 新增：收藏的工具
const favoriteTools = ref([
  {
    id: 'fav1',
    name: 'ChatGPT',
    icon: 'mdi:robot-outline',
    category: 'AI大模型'
  },
  { id: 'fav2', name: 'GitHub', icon: 'mdi:github', category: '代码平台' },
  { id: 'fav3', name: 'LeetCode', icon: 'mdi:code-json', category: '编程练习' },
  {
    id: 'fav4',
    name: 'Notion',
    icon: 'mdi:notebook-outline',
    category: '笔记工具'
  }
]);

// 新增：最近使用的工具
const recentTools = ref([
  { id: 'rec1', name: '百度', icon: 'mdi:web', time: '10分钟前' },
  { id: 'rec2', name: 'ChatGPT', icon: 'mdi:robot-outline', time: '30分钟前' },
  { id: 'rec3', name: 'GitHub', icon: 'mdi:github', time: '1小时前' },
  { id: 'rec4', name: 'LeetCode', icon: 'mdi:code-json', time: '2小时前' }
]);

// 新增：工具评分系统
const toolRatings = ref([
  { id: 'rate1', name: 'ChatGPT', rating: 4.8, reviews: 1250 },
  { id: 'rate2', name: 'GitHub', rating: 4.9, reviews: 2500 },
  { id: 'rate3', name: 'LeetCode', rating: 4.7, reviews: 850 },
  { id: 'rate4', name: 'Notion', rating: 4.6, reviews: 720 }
]);

// 过滤工具
const filteredWebTools = computed(() => {
  if (selectedCategory.value === 'all') {
    return webTools;
  }
  return webTools.filter(tool => tool.type === selectedCategory.value);
});

const filteredAiTools = computed(() => {
  if (selectedCategory.value === 'all') {
    return aiTools;
  }
  return aiTools.filter(tool => tool.type === selectedCategory.value);
});
const collaborationRequests = ref([
  {
    id: 1,
    user: '张三',
    message: '请求加入协作编辑',
    time: '10:30',
    status: 'pending'
  },
  {
    id: 2,
    user: '李四',
    message: '想参与这个项目',
    time: '11:15',
    status: 'accepted'
  }
]);
const notifications = ref([
  { id: 1, user: '王五', action: '修改了内容', time: '12:00', read: false },
  { id: 2, user: '赵六', action: '添加了评论', time: '12:30', read: true }
]);

// 学习内容类型选项
const contentTypes = [
  { value: 'article', label: '文章' },
  { value: 'note', label: '笔记' },
  { value: 'presentation', label: '演示文稿' },
  { value: 'worksheet', label: '练习工作表' },
  { value: 'mindmap', label: '思维导图' },
  { value: 'code', label: '代码片段' },
  { value: 'math', label: '数学公式' },
  { value: 'quiz', label: '测验题' }
];

// 学习风格选项
const learningStyles = [
  { value: 'visual', label: '视觉型' },
  { value: 'auditory', label: '听觉型' },
  { value: 'kinesthetic', label: '动觉型' },
  { value: 'reading', label: '阅读/写作型' }
];

// 保存内容
function saveContent() {
  const content = {
    title: contentTitle.value,
    body: contentBody.value,
    type: contentType.value,
    style: learningStyle.value,
    timestamp: new Date().toISOString()
  };
  contentHistory.value.push(JSON.stringify(content));
  currentVersion.value = contentHistory.value.length - 1;
  localStorage.setItem('learningContent', JSON.stringify(contentHistory.value));
  window.$message?.success('内容已保存！');
}

// 加载历史版本
function loadVersion(index: number) {
  if (contentHistory.value[index]) {
    const content = JSON.parse(contentHistory.value[index]);
    contentTitle.value = content.title;
    contentBody.value = content.body;
    contentType.value = content.type;
    learningStyle.value = content.style;
    currentVersion.value = index;
  }
}

// 添加协作者
function addCollaborator() {
  if (newCollaborator.value && !collaborators.value.includes(newCollaborator.value)) {
    collaborators.value.push(newCollaborator.value);
    newCollaborator.value = '';
  }
}

// 移除协作者
function removeCollaborator(collaborator: string) {
  collaborators.value = collaborators.value.filter(c => c !== collaborator);
}

// 根据学习风格自适应调整内容
const adaptiveContent = computed(() => {
  switch (learningStyle.value) {
    case 'visual':
      return contentBody.value.replace(/\n/g, '<br>').replace(/\*(.*?)\*/g, '<strong>$1</strong>');
    case 'auditory':
      return `${contentBody.value}\n\n💡 提示：尝试朗读这段内容来加深理解`;
    case 'kinesthetic':
      return `${contentBody.value}\n\n💡 提示：边学习边做笔记，或通过实践来巩固知识`;
    case 'reading':
      return `${contentBody.value.replace(/\n/g, '\n\n')}\n\n💡 提示：将重点内容整理成笔记或思维导图`;
    default:
      return contentBody.value;
  }
});

// 模拟协作学习消息
const collaborationMessages = ref([
  { id: 1, user: '张三', message: '我添加了一些关于AI的内容', time: '10:30' },
  { id: 2, user: '李四', message: '我修改了第三段，使其更清晰', time: '10:45' },
  { id: 3, user: '王五', message: '建议添加一些例子来帮助理解', time: '11:00' }
]);
const newMessage = ref('');

// 发送协作消息
function sendMessage() {
  if (newMessage.value) {
    collaborationMessages.value.push({
      id: Date.now(),
      user: '我',
      message: newMessage.value,
      time: new Date().toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
      })
    });
    newMessage.value = '';
  }
}

// 上传文件处理
function handleFileUpload(_data: any) {
  // 这里可以实现文件上传逻辑
  // 上传文件: _data.file.name
  return true;
}

// 生成分享链接
function generateShareLink() {
  const uniqueId = Math.random().toString(36).substring(2, 15);
  shareLink.value = `https://learning-platform.com/share/${uniqueId}`;
  sharingEnabled.value = true;
  localStorage.setItem('shareLink', shareLink.value);
  window.$message?.success('分享链接已生成！');
}

// 复制分享链接
function copyShareLink() {
  navigator.clipboard.writeText(shareLink.value).then(() => {
    window.$message?.success('分享链接已复制到剪贴板！');
  });
}

// 添加分享用户
function addShareUser() {
  if (newShareUser.value && !sharedWith.value.includes(newShareUser.value)) {
    sharedWith.value.push(newShareUser.value);
    newShareUser.value = '';
  }
}

// 移除分享用户
function removeShareUser(user: string) {
  sharedWith.value = sharedWith.value.filter(u => u !== user);
}

// 处理协作请求
function handleCollaborationRequest(id: number, action: 'accept' | 'reject') {
  const request = collaborationRequests.value.find(r => r.id === id);
  if (request) {
    request.status = action === 'accept' ? 'accepted' : 'rejected';
    if (action === 'accept') {
      collaborators.value.push(request.user);
    }
  }
}

// 标记通知为已读
function markNotificationAsRead(id: number) {
  const notification = notifications.value.find(n => n.id === id);
  if (notification) {
    notification.read = true;
  }
}

// 从本地存储加载内容历史
function loadContentHistory() {
  const saved = localStorage.getItem('learningContent');
  if (saved) {
    contentHistory.value = JSON.parse(saved);
    currentVersion.value = contentHistory.value.length - 1;
    if (contentHistory.value.length > 0) {
      const lastContent = JSON.parse(contentHistory.value[currentVersion.value]);
      contentTitle.value = lastContent.title;
      contentBody.value = lastContent.body;
      contentType.value = lastContent.type;
      learningStyle.value = lastContent.style;
    }
  }

  const savedShareLink = localStorage.getItem('shareLink');
  if (savedShareLink) {
    shareLink.value = savedShareLink;
    sharingEnabled.value = true;
  }
}

// 获取统计项颜色
function getStatColor(id: string): string {
  const colorMap: Record<string, string> = {
    stat1: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    stat2: 'linear-gradient(90deg, #11998e 0%, #38ef7d 100%)',
    stat3: 'linear-gradient(90deg, #eb3349 0%, #f45c43 100%)',
    stat4: 'linear-gradient(90deg, #f093fb 0%, #f5576c 100%)'
  };
  return colorMap[id] || 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)';
}

// 初始化加载内容历史
loadContentHistory();
</script>

<template>
  <div class="student-tools">
    <!-- 1. 交互式学习内容编辑器 -->
    <NCard title="交互式学习内容编辑器" :bordered="false" content-style="padding: 12px;">
      <div class="tools-header">
        <h2 class="tools-title">学习内容创作与协作</h2>
        <p class="tools-subtitle">创建、编辑和协作学习内容，根据学习风格自适应调整</p>
      </div>

      <NTabs v-model:value="activeTab" class="mt-2">
        <NTab name="editor" tab="内容编辑器" />
        <NTab name="collaboration" tab="协作学习" />
        <NTab name="history" tab="版本历史" />
      </NTabs>

      <!-- 内容编辑器 -->
      <div v-if="activeTab === 'editor'" class="editor-content">
        <div class="editor-form">
          <div class="form-row">
            <div class="form-item">
              <label class="form-label">内容标题</label>
              <NInput v-model:value="contentTitle" placeholder="输入内容标题" />
            </div>
            <div class="form-item">
              <label class="form-label">内容类型</label>
              <NSelect v-model:value="contentType" :options="contentTypes" placeholder="选择内容类型" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-item">
              <label class="form-label">学习风格适配</label>
              <NRadioGroup v-model:value="learningStyle" name="learning-style">
                <div class="radio-group">
                  <NRadio v-for="style in learningStyles" :key="style.value" :value="style.value">
                    {{ style.label }}
                  </NRadio>
                </div>
              </NRadioGroup>
            </div>
          </div>

          <div class="form-item">
            <label class="form-label">内容正文</label>
            <NInput
              v-model:value="contentBody"
              type="textarea"
              placeholder="输入学习内容..."
              :rows="6"
              resize="vertical"
            />
          </div>

          <div class="form-actions">
            <NUpload :default-file-list="[]" :on-change="handleFileUpload" :max="5" multiple>
              <NButton type="default" size="small">
                <template #icon>
                  <SvgIcon icon="mdi:upload" />
                </template>
                上传附件
              </NButton>
            </NUpload>
            <NButton type="primary" size="small" @click="saveContent">
              <template #icon>
                <SvgIcon icon="mdi:content-save" />
              </template>
              保存内容
            </NButton>
          </div>
        </div>

        <!-- 内容预览 -->
        <div class="content-preview">
          <h3 class="preview-title">内容预览</h3>
          <div class="preview-content">{{ adaptiveContent }}</div>
          <div class="preview-info">
            <NTag size="small">{{ contentType }}</NTag>
            <NTag size="small" type="info">适配: {{ learningStyles.find(s => s.value === learningStyle)?.label }}</NTag>
          </div>
        </div>
      </div>

      <!-- 协作学习 -->
      <div v-else-if="activeTab === 'collaboration'" class="collaboration-content">
        <div class="collaboration-settings">
          <h3 class="section-title">协作设置</h3>
          <div class="form-row">
            <div class="form-item">
              <label class="form-label">启用协作</label>
              <NRadioGroup v-model:value="collaborationEnabled" name="collaboration">
                <NRadio value="true">启用</NRadio>
                <NRadio value="false">禁用</NRadio>
              </NRadioGroup>
            </div>
          </div>

          <div v-if="collaborationEnabled" class="form-item">
            <label class="form-label">协作者</label>
            <div class="collaborators-list">
              <NBadge v-for="collaborator in collaborators" :key="collaborator" type="info" class="collaborator-badge">
                {{ collaborator }}
                <template #suffix>
                  <NButton size="small" circle quaternary @click="removeCollaborator(collaborator)">
                    <SvgIcon icon="mdi:close" />
                  </NButton>
                </template>
              </NBadge>
            </div>
            <div class="add-collaborator">
              <NInput v-model:value="newCollaborator" placeholder="输入协作者邮箱" />
              <NButton size="small" @click="addCollaborator">添加</NButton>
            </div>
          </div>
        </div>

        <!-- 内容分享 -->
        <div class="collaboration-settings mt-3">
          <h3 class="section-title">内容分享</h3>
          <div class="form-row">
            <div class="form-item">
              <label class="form-label">启用分享</label>
              <NRadioGroup v-model:value="sharingEnabled" name="sharing">
                <NRadio value="true">启用</NRadio>
                <NRadio value="false">禁用</NRadio>
              </NRadioGroup>
            </div>
          </div>

          <div v-if="sharingEnabled" class="form-item">
            <label class="form-label">分享链接</label>
            <div class="form-row">
              <NInput v-model:value="shareLink" placeholder="生成分享链接" readonly />
              <NButton size="small" @click="generateShareLink">生成</NButton>
              <NButton size="small" @click="copyShareLink">复制</NButton>
            </div>
            <div class="form-item mt-2">
              <label class="form-label">分享给</label>
              <div class="collaborators-list">
                <NBadge v-for="user in sharedWith" :key="user" type="success" class="collaborator-badge">
                  {{ user }}
                  <template #suffix>
                    <NButton size="small" circle quaternary @click="removeShareUser(user)">
                      <SvgIcon icon="mdi:close" />
                    </NButton>
                  </template>
                </NBadge>
              </div>
              <div class="add-collaborator">
                <NInput v-model:value="newShareUser" placeholder="输入用户邮箱" />
                <NButton size="small" @click="addShareUser">添加</NButton>
              </div>
            </div>
          </div>
        </div>

        <!-- 协作请求 -->
        <div class="collaboration-settings mt-3">
          <h3 class="section-title">协作请求</h3>
          <div v-if="collaborationRequests.length === 0" class="py-3 text-center">
            <p class="text-gray-500">暂无协作请求</p>
          </div>
          <NList v-else bordered>
            <NListItem v-for="request in collaborationRequests" :key="request.id">
              <template #prefix>
                <div class="message-avatar">{{ request.user.charAt(0) }}</div>
              </template>
              <div class="message-content">
                <div class="message-header">
                  <span class="message-user">{{ request.user }}</span>
                  <span class="message-time">{{ request.time }}</span>
                </div>
                <div class="message-body">{{ request.message }}</div>
                <div class="mt-2 flex gap-2">
                  <NButton
                    v-if="request.status === 'pending'"
                    size="small"
                    type="success"
                    @click="handleCollaborationRequest(request.id, 'accept')"
                  >
                    接受
                  </NButton>
                  <NButton
                    v-if="request.status === 'pending'"
                    size="small"
                    type="error"
                    @click="handleCollaborationRequest(request.id, 'reject')"
                  >
                    拒绝
                  </NButton>
                  <NTag v-else :type="request.status === 'accepted' ? 'success' : 'error'" size="small">
                    {{ request.status === 'accepted' ? '已接受' : '已拒绝' }}
                  </NTag>
                </div>
              </div>
            </NListItem>
          </NList>
        </div>

        <!-- 通知中心 -->
        <div class="collaboration-settings mt-3">
          <h3 class="section-title">通知中心</h3>
          <div v-if="notifications.length === 0" class="py-3 text-center">
            <p class="text-gray-500">暂无通知</p>
          </div>
          <NList v-else bordered>
            <NListItem
              v-for="notification in notifications"
              :key="notification.id"
              @click="markNotificationAsRead(notification.id)"
            >
              <template #prefix>
                <div class="message-avatar">
                  {{ notification.user.charAt(0) }}
                </div>
              </template>
              <div class="message-content">
                <div class="message-header">
                  <span class="message-user">{{ notification.user }}</span>
                  <span class="message-time">{{ notification.time }}</span>
                </div>
                <div class="message-body">{{ notification.action }}</div>
              </div>
              <template #suffix>
                <NBadge v-if="!notification.read" type="error" dot />
              </template>
            </NListItem>
          </NList>
        </div>

        <!-- 协作消息 -->
        <div class="collaboration-messages mt-3">
          <h3 class="section-title">协作讨论</h3>
          <div class="messages-list">
            <NList bordered>
              <NListItem v-for="msg in collaborationMessages" :key="msg.id">
                <template #prefix>
                  <div class="message-avatar">{{ msg.user.charAt(0) }}</div>
                </template>
                <div class="message-content">
                  <div class="message-header">
                    <span class="message-user">{{ msg.user }}</span>
                    <span class="message-time">{{ msg.time }}</span>
                  </div>
                  <div class="message-body">{{ msg.message }}</div>
                </div>
              </NListItem>
            </NList>
          </div>
          <div class="message-input">
            <NInput v-model:value="newMessage" placeholder="输入消息..." @keyup.enter="sendMessage" />
            <NButton size="small" @click="sendMessage">发送</NButton>
          </div>
        </div>
      </div>

      <!-- 版本历史 -->
      <div v-else-if="activeTab === 'history'" class="history-content">
        <h3 class="section-title">版本历史</h3>
        <div class="history-list">
          <NList bordered>
            <NListItem
              v-for="(version, index) in contentHistory"
              :key="index"
              class="version-item"
              :class="{ 'active-version': index === currentVersion }"
              @click="loadVersion(index)"
            >
              <template #prefix>
                <div class="version-badge">{{ index + 1 }}</div>
              </template>
              <div class="version-info">
                <div class="version-title">
                  {{ JSON.parse(version).title || '未命名内容' }}
                </div>
                <div class="version-meta">
                  <span class="version-type">{{ JSON.parse(version).type }}</span>
                  <span class="version-time">
                    {{ new Date(JSON.parse(version).timestamp).toLocaleString() }}
                  </span>
                </div>
              </div>
              <template #suffix>
                <NProgress v-if="index === currentVersion" type="line" :percentage="100" indicator-placement="inside" />
              </template>
            </NListItem>
          </NList>
        </div>
      </div>
    </NCard>

    <!-- 2. 学习网页推荐区域 -->
    <NCard title="学习网页" :bordered="false" class="mt-4">
      <div class="tools-header">
        <h2 class="tools-title">推荐学习网页</h2>
        <p class="tools-subtitle">精选优质学习网站和资源，助力高效学习</p>
      </div>

      <!-- 工具分类筛选 -->
      <div class="category-filter mb-4">
        <NRadioGroup v-model:value="selectedCategory" name="category" type="button">
          <NRadio v-for="category in toolCategories" :key="category.id" :value="category.id" size="small">
            {{ category.name }}
          </NRadio>
        </NRadioGroup>
      </div>

      <!-- 工具使用统计和收藏工具 -->
      <div class="stats-favorites mb-4">
        <NGrid :x-gap="8" :y-gap="8" cols="1 s:2" responsive="screen" :items-per-row="2">
          <!-- 工具使用统计 -->
          <NGi>
            <NCard
              :bordered="false"
              class="interactive-item tools-stats-card"
              content-style="padding: 12px; height: 100%; display: flex; flex-direction: column;"
            >
              <h3 class="mb-3 text-sm font-medium">工具使用统计</h3>
              <div class="stats-container flex-1">
                <div v-for="stat in toolUsageStats" :key="stat.id" class="stat-item">
                  <div class="stat-header">
                    <span class="stat-name">{{ stat.name }}</span>
                    <span class="stat-count">{{ stat.usage }}次</span>
                  </div>
                  <div class="stat-bar-wrapper">
                    <div
                      class="stat-bar"
                      :style="{
                        width: (stat.usage / 15) * 100 + '%',
                        background: getStatColor(stat.id)
                      }"
                    ></div>
                  </div>
                </div>
              </div>
            </NCard>
          </NGi>

          <!-- 收藏的工具 -->
          <NGi>
            <NCard
              :bordered="false"
              class="interactive-item favorites-card"
              content-style="padding: 12px; height: 100%; display: flex; flex-direction: column;"
            >
              <h3 class="mb-2 text-sm font-medium">收藏的工具</h3>
              <div class="favorites-grid flex-1">
                <div
                  v-for="tool in favoriteTools"
                  :key="tool.id"
                  class="favorite-tool"
                  @click="handleToolClick('https://example.com')"
                >
                  <div class="favorite-icon-wrapper">
                    <SvgIcon :icon="tool.icon" class="favorite-icon" />
                  </div>
                  <span class="tool-name">{{ tool.name }}</span>
                  <NTag size="tiny" type="info" class="tool-category">{{ tool.category }}</NTag>
                </div>
              </div>
            </NCard>
          </NGi>
        </NGrid>
      </div>

      <!-- 最近使用的工具 -->
      <NCard :bordered="false" class="interactive-item mb-4" content-style="padding: 12px;">
        <h3 class="mb-2 text-sm font-medium">最近使用的工具</h3>
        <div class="recent-tools">
          <div
            v-for="tool in recentTools"
            :key="tool.id"
            class="recent-tool-item"
            @click="handleToolClick('https://example.com')"
          >
            <SvgIcon :icon="tool.icon" class="mr-2 text-20px text-primary" />
            <div class="tool-info">
              <span class="tool-name">{{ tool.name }}</span>
              <span class="tool-time text-xs">{{ tool.time }}</span>
            </div>
          </div>
        </div>
      </NCard>

      <!-- 工具评分系统 -->
      <NCard :bordered="false" class="interactive-item mb-4" content-style="padding: 12px;">
        <h3 class="mb-2 text-sm font-medium">工具评分</h3>
        <NGrid :x-gap="6" :y-gap="6" cols="2 s:4" responsive="screen">
          <NGi v-for="rating in toolRatings" :key="rating.id" class="interactive-item">
            <div class="rating-card">
              <h4 class="text-sm font-medium">{{ rating.name }}</h4>
              <div class="rating-stars">
                <span class="rating-value text-sm">{{ rating.rating }}</span>
                <div class="stars">
                  <SvgIcon icon="ph:star-fill" class="text-xs text-yellow-400" />
                  <SvgIcon icon="ph:star-fill" class="text-xs text-yellow-400" />
                  <SvgIcon icon="ph:star-fill" class="text-xs text-yellow-400" />
                  <SvgIcon icon="ph:star-fill" class="text-xs text-yellow-400" />
                  <SvgIcon icon="ph:star-half-fill" class="text-xs text-yellow-400" />
                </div>
              </div>
              <span class="text-xs text-gray-500">{{ rating.reviews }}条评价</span>
            </div>
          </NGi>
        </NGrid>
      </NCard>

      <div class="tools-grid">
        <div
          v-for="tool in filteredWebTools"
          :key="tool.id"
          class="tool-card"
          :style="{ backgroundColor: tool.bgColor, '--card-color': tool.color }"
          @click="handleToolClick(tool.url)"
        >
          <!-- 装饰性背景元素 -->
          <div class="tool-card-bg-decoration" :style="{ backgroundColor: tool.color + '08' }"></div>

          <!-- 工具卡片头部 -->
          <div class="tool-card-header">
            <div class="tool-icon-wrapper" :style="{ backgroundColor: tool.color + '20', color: tool.color }">
              <SvgIcon :icon="tool.icon" :local-icon="tool.localIcon" class="text-40px" />
            </div>
            <NTag
              size="small"
              :style="{
                backgroundColor: tool.color + '20',
                color: tool.color,
                borderColor: tool.color + '40'
              }"
            >
              {{ tool.type }}
            </NTag>
          </div>

          <!-- 工具卡片内容 -->
          <div class="tool-card-content">
            <h3 class="tool-name">{{ tool.name }}</h3>
            <p class="tool-description">{{ tool.description }}</p>
          </div>

          <!-- 工具卡片底部 -->
          <div class="tool-card-footer">
            <div class="tool-url" :style="{ color: tool.color }">
              <SvgIcon icon="mdi:web" class="mr-1 text-sm" />
              {{ getHostname(tool.url) }}
            </div>
            <NButton size="small" circle :title="'访问' + tool.name" @click.stop="handleToolClick(tool.url)">
              <template #icon>
                <SvgIcon icon="mdi:arrow-top-right" />
              </template>
            </NButton>
          </div>
        </div>
      </div>
    </NCard>

    <!-- 3. 学习工具列表区域 -->
    <NCard title="AI工具列表" :bordered="false" class="mt-4">
      <div class="tools-header">
        <h2 class="tools-title">AI大模型与编程工具</h2>
        <p class="tools-subtitle">精选优质AI工具，助力高效学习和编程</p>
      </div>

      <div class="tools-list-grid">
        <div
          v-for="tool in filteredAiTools"
          :key="tool.id"
          class="tool-grid-item interactive-item"
          @click="handleToolClick(tool.url)"
        >
          <div class="tool-grid-content">
            <div class="mb-2 flex items-center">
              <div class="tool-list-icon mr-3" :style="{ color: tool.color }">
                <SvgIcon :icon="tool.icon" :local-icon="tool.localIcon" class="text-24px" />
              </div>
              <h3 class="tool-list-name font-medium">{{ tool.name }}</h3>
            </div>
            <p class="tool-list-desc mb-2 text-sm text-gray-500">
              {{ tool.description }}
            </p>
            <div class="flex items-center justify-between">
              <NTag
                size="small"
                :style="{
                  backgroundColor: tool.color + '20',
                  color: tool.color,
                  borderColor: tool.color + '40'
                }"
              >
                {{ tool.type }}
              </NTag>
              <SvgIcon icon="mdi:arrow-right" class="text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </NCard>

    <!-- 4. 高效学习技巧区域 -->
    <NCard title="高效学习技巧" :bordered="false" class="mt-4">
      <div class="tools-header">
        <h2 class="tools-title">高效学习技巧</h2>
        <p class="tools-subtitle">掌握科学的学习方法，提升学习效率</p>
      </div>

      <div class="tips-grid">
        <div v-for="tip in studyTips" :key="tip.id" class="tip-card" :style="{ '--tip-color': tip.color }">
          <!-- 技巧卡片头部 -->
          <div class="tip-card-header">
            <div class="tip-icon-wrapper" :style="{ backgroundColor: tip.color + '20', color: tip.color }">
              <SvgIcon :icon="tip.icon" class="text-40px" />
            </div>
          </div>

          <!-- 技巧卡片内容 -->
          <div class="tip-card-content">
            <h3 class="tip-title">{{ tip.title }}</h3>
            <p class="tip-description">{{ tip.description }}</p>
          </div>

          <!-- 装饰性箭头 -->
          <div class="tip-arrow" :style="{ color: tip.color }">
            <SvgIcon icon="mdi:arrow-right" />
          </div>
        </div>
      </div>
    </NCard>
  </div>
</template>

<style scoped>
.student-tools {
  width: 100%;
  position: relative;
  overflow: visible;
  min-height: auto;
}

/* 装饰性背景元素 */
.student-tools::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 50% 50%, rgba(102, 126, 234, 0.05) 0%, transparent 50%);
  z-index: -1;
  animation: float 20s ease-in-out infinite;
  max-height: 600px;
}

@keyframes float {
  0%,
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
  33% {
    transform: translate(30px, -30px) rotate(5deg);
  }
  66% {
    transform: translate(-20px, 20px) rotate(-5deg);
  }
}

.tools-header {
  text-align: center;
  margin-bottom: 20px;
  position: relative;
}

/* 装饰性线条 */
.tools-header::before,
.tools-header::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.3));
}

.tools-header::before {
  left: 0;
  transform: translateY(-50%);
}

.tools-header::after {
  right: 0;
  transform: translateY(-50%) rotate(180deg);
}

.tools-title {
  font-size: 32px;
  font-weight: 700;
  color: #333639;
  margin-bottom: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: fadeInUp 0.8s ease-out;
}

.tools-subtitle {
  font-size: 16px;
  color: #666;
  line-height: 1.5;
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

/* 工具网格样式 */
.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 12px;
  animation: fadeInUp 0.8s ease-out 0.4s both;
}

/* 工具卡片样式 */
.tool-card {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 10px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  animation: fadeInUp 0.8s ease-out 0.6s both;
}

.tool-card:nth-child(2) {
  animation-delay: 0.7s;
}
.tool-card:nth-child(3) {
  animation-delay: 0.8s;
}
.tool-card:nth-child(4) {
  animation-delay: 0.9s;
}
.tool-card:nth-child(5) {
  animation-delay: 1s;
}
.tool-card:nth-child(6) {
  animation-delay: 1.1s;
}
.tool-card:nth-child(7) {
  animation-delay: 1.2s;
}
.tool-card:nth-child(8) {
  animation-delay: 1.3s;
}
.tool-card:nth-child(9) {
  animation-delay: 1.4s;
}

/* 卡片背景装饰 */
.tool-card-bg-decoration {
  position: absolute;
  bottom: -20px;
  right: -20px;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  opacity: 0.5;
  transition: all 0.3s ease;
  z-index: 0;
}

.tool-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--card-color), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
}

.tool-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
}

.tool-card:hover::before {
  opacity: 1;
}

.tool-card:hover .tool-card-bg-decoration {
  transform: scale(1.2);
  opacity: 0.8;
}

/* 卡片头部样式 */
.tool-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  position: relative;
  z-index: 1;
}

.tool-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.tool-card:hover .tool-icon-wrapper {
  transform: scale(1.15) rotate(5deg);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

/* 卡片内容样式 */
.tool-card-content {
  flex: 1;
  margin-bottom: 12px;
  position: relative;
  z-index: 1;
}

.tool-name {
  font-size: 20px;
  font-weight: 600;
  color: #333639;
  margin-bottom: 12px;
  transition: color 0.3s ease;
  position: relative;
}

.tool-card:hover .tool-name {
  color: var(--card-color);
}

.tool-description {
  font-size: 14px;
  color: #666;
  line-height: 1.7;
  margin-bottom: 0;
  transition: color 0.3s ease;
}

.tool-card:hover .tool-description {
  color: #444;
}

/* 卡片底部样式 */
.tool-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 1;
}

.tool-url {
  font-size: 13px;
  display: flex;
  align-items: center;
  font-weight: 500;
  transition: all 0.3s ease;
}

/* 学习技巧区域样式 */
.tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
  animation: fadeInUp 0.8s ease-out 0.6s both;
  margin-top: 16px;
}

.tip-card {
  background: white;
  border-radius: 10px;
  padding: 12px;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  animation: fadeInUp 0.8s ease-out 0.8s both;
}

.tip-card:nth-child(2) {
  animation-delay: 0.9s;
}
.tip-card:nth-child(3) {
  animation-delay: 1s;
}
.tip-card:nth-child(4) {
  animation-delay: 1.1s;
}

.tip-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: var(--tip-color);
  transition: transform 0.3s ease;
  transform: scaleY(0);
  transform-origin: top;
}

.tip-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.tip-card:hover::before {
  transform: scaleY(1);
}

.tip-card-header {
  margin-bottom: 16px;
  position: relative;
  z-index: 1;
}

.tip-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 12px;
  transition: all 0.3s ease;
  margin-bottom: 12px;
}

.tip-card:hover .tip-icon-wrapper {
  transform: scale(1.1);
}

.tip-card-content {
  flex: 1;
  position: relative;
  z-index: 1;
}

.tip-title {
  font-size: 18px;
  font-weight: 600;
  color: #333639;
  margin-bottom: 8px;
  transition: color 0.3s ease;
}

.tip-card:hover .tip-title {
  color: var(--tip-color);
}

.tip-description {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 0;
}

.tip-arrow {
  position: absolute;
  bottom: 16px;
  right: 16px;
  opacity: 0.3;
  transition: all 0.3s ease;
  font-size: 24px;
}

.tip-card:hover .tip-arrow {
  opacity: 1;
  transform: translateX(10px);
}

/* 动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 学习工具列表样式 */
.tools-list-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.tool-grid-item {
  background: white;
  border-radius: 10px;
  padding: 12px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
}

.tool-grid-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: rgba(100, 108, 255, 0.2);
}

.tool-grid-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* 学习工具列表项样式 */
.tool-list-item {
  padding: 16px;
  border-radius: 12px;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
  margin-bottom: 8px;
}

.tool-list-item:last-child {
  margin-bottom: 0;
}

.tool-list-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: rgba(100, 108, 255, 0.2);
}

/* 工具列表图标样式 */
.tool-list-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(100, 108, 255, 0.05);
  border-radius: 8px;
}

/* 工具列表名称样式 */
.tool-list-name {
  font-size: 16px;
  font-weight: 500;
  color: #333639;
  margin-bottom: 4px;
}

/* 工具列表描述样式 */
.tool-list-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

/* 新增：编辑器样式 */
.editor-content {
  margin-top: 16px;
  animation: fadeInUp 0.8s ease-out;
}

.editor-form {
  background: white;
  border-radius: 10px;
  padding: 16px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 16px;
}

.form-row {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.form-item {
  flex: 1;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 6px;
}

.radio-group {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.form-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.content-preview {
  background: white;
  border-radius: 10px;
  padding: 16px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.preview-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.preview-content {
  font-size: 14px;
  line-height: 1.5;
  color: #444;
  margin-bottom: 12px;
  min-height: 80px;
}

.preview-info {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* 新增：协作学习样式 */
.collaboration-content {
  margin-top: 16px;
  animation: fadeInUp 0.8s ease-out;
}

.collaboration-settings {
  background: white;
  border-radius: 10px;
  padding: 16px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.collaborators-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.collaborator-badge {
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 14px;
}

.add-collaborator {
  display: flex;
  gap: 8px;
}

.add-collaborator .n-input {
  flex: 1;
}

.collaboration-messages {
  background: white;
  border-radius: 10px;
  padding: 16px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.messages-list {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 16px;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
}

.message-content {
  flex: 1;
  margin-left: 12px;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.message-user {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.message-time {
  font-size: 12px;
  color: #999;
}

.message-body {
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

.message-input {
  display: flex;
  gap: 8px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.message-input .n-input {
  flex: 1;
}

/* 新增：版本历史样式 */
.history-content {
  margin-top: 16px;
  animation: fadeInUp 0.8s ease-out;
}

.history-list {
  background: white;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.version-item {
  cursor: pointer;
  transition: all 0.3s ease;
}

.version-item:hover {
  background-color: rgba(100, 108, 255, 0.05);
}

.active-version {
  background-color: rgba(100, 108, 255, 0.1) !important;
}

.version-badge {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #667eea;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
}

.version-info {
  flex: 1;
  margin-left: 12px;
}

.version-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.version-meta {
  display: flex;
  gap: 12px;
  font-size: 14px;
  color: #999;
}

.version-type {
  padding: 2px 8px;
  border-radius: 12px;
  background: rgba(100, 108, 255, 0.1);
  color: #667eea;
}

/* 图标大小 */
.text-40px {
  font-size: 40px;
}

.text-24px {
  font-size: 24px;
}

.text-sm {
  font-size: 14px;
}

/* 间距工具类 */
.mt-4 {
  margin-top: 16px;
}

.mr-1 {
  margin-right: 4px;
}

.mr-2 {
  margin-right: 8px;
}

.ml-4 {
  margin-left: 16px;
}

/* 布局工具类 */
.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-between {
  justify-content: space-between;
}

.font-medium {
  font-weight: 500;
}

.text-gray-500 {
  color: #666;
}

.text-gray-400 {
  color: #999;
}

/* 交互项样式 */
.interactive-item {
  transition: all 0.3s ease;
}

.interactive-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* 工具分类筛选样式 */
.category-filter {
  overflow-x: auto;
  padding-bottom: 8px;
}

.category-filter .n-radio-group {
  display: flex;
  gap: 8px;
}

/* 工具使用统计样式 */
.stats-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
  width: 100%;
  justify-content: space-between;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-name {
  font-size: 14px;
  font-weight: 500;
  color: #333639;
}

.stat-count {
  font-size: 14px;
  font-weight: 600;
  color: #667eea;
}

.stat-bar-wrapper {
  width: 100%;
  height: 8px;
  background: rgba(100, 108, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.stat-bar {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 收藏的工具样式 */
.favorites-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  align-items: stretch;
  height: 100%;
  width: 100%;
}

.favorite-tool {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px 8px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(100, 108, 255, 0.1) 0%, rgba(100, 108, 255, 0.03) 100%);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid rgba(100, 108, 255, 0.08);
}

/* 工具使用统计样式优化 */
.tools-stats-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 180px;
}

.tools-stats-card .n-list {
  flex: 1;
  height: 100%;
  min-height: 140px;
}

.tools-stats-card .n-list .n-list-item {
  padding: 8px 12px;
  min-height: 32px;
}

/* 收藏工具卡片样式优化 */
.favorites-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 180px;
}

.favorites-card .favorites-grid {
  flex: 1;
  align-content: stretch;
  min-height: 140px;
  width: 100%;
}

/* 统计和收藏区域整体对齐 */
.stats-favorites {
  display: flex;
  flex-direction: column;
}

.stats-favorites .n-grid {
  width: 100%;
}

.stats-favorites .n-grid > div {
  display: flex;
  align-items: stretch;
}

.stats-favorites .n-card {
  height: 100%;
  flex: 1;
}

.favorite-tool:hover {
  background: linear-gradient(135deg, rgba(100, 108, 255, 0.15) 0%, rgba(100, 108, 255, 0.08) 100%);
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 8px 24px rgba(100, 108, 255, 0.2);
  border-color: rgba(100, 108, 255, 0.3);
}

.favorite-icon-wrapper {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(100, 108, 255, 0.15) 0%, rgba(100, 108, 255, 0.05) 100%);
  border-radius: 14px;
  margin-bottom: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(100, 108, 255, 0.1);
}

.favorite-tool:hover .favorite-icon-wrapper {
  background: linear-gradient(135deg, rgba(100, 108, 255, 0.25) 0%, rgba(100, 108, 255, 0.12) 100%);
  transform: scale(1.08);
  border-color: rgba(100, 108, 255, 0.25);
  box-shadow: 0 4px 12px rgba(100, 108, 255, 0.15);
}

.favorite-icon {
  font-size: 28px;
  color: #646cff;
  transition: all 0.3s ease;
}

.favorite-tool:hover .favorite-icon {
  transform: scale(1.15);
  color: #535bf2;
}

.favorite-tool .tool-name {
  font-size: 14px;
  font-weight: 600;
  margin: 4px 0;
  text-align: center;
  line-height: 1.3;
  color: #333639;
  transition: color 0.3s ease;
}

.favorite-tool:hover .tool-name {
  color: #646cff;
}

.favorite-tool .n-tag {
  font-size: 11px;
  padding: 3px 10px;
  margin-top: 4px;
  border-radius: 12px;
  font-weight: 500;
  border: none;
  background: rgba(100, 108, 255, 0.1);
  color: #646cff;
}

/* 工具列表项样式优化 */
.tools-list {
  margin-top: 8px;
}

.tool-list-item {
  padding: 12px;
  border-radius: 8px;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
  margin-bottom: 6px;
}

.tool-list-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-color: rgba(100, 108, 255, 0.2);
}

/* 最近使用的工具样式优化 */
.recent-tool-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 8px;
  background-color: rgba(100, 108, 255, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 6px;
}

.recent-tool-item:hover {
  background-color: rgba(100, 108, 255, 0.1);
  transform: translateX(2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* 工具评分样式优化 */
.rating-card {
  padding: 10px;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  text-align: center;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.rating-stars {
  margin: 6px 0;
}

/* 卡片间距优化 */
.mb-4 {
  margin-bottom: 12px;
}

/* 工具网格优化 */
.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 12px;
  animation: fadeInUp 0.8s ease-out 0.4s both;
}

/* 工具卡片优化 */
.tool-card {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 12px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  animation: fadeInUp 0.8s ease-out 0.6s both;
}

.tool-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  position: relative;
  z-index: 1;
}

.tool-card-content {
  flex: 1;
  margin-bottom: 12px;
  position: relative;
  z-index: 1;
}

.tool-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 8px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 1;
}

/* 最近使用的工具样式 */
.recent-tools {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.recent-tool-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  background-color: rgba(100, 108, 255, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
}

.recent-tool-item:hover {
  background-color: rgba(100, 108, 255, 0.1);
  transform: translateX(4px);
}

.recent-tool-item .tool-info {
  flex: 1;
}

.recent-tool-item .tool-name {
  font-weight: 500;
  display: block;
}

.recent-tool-item .tool-time {
  font-size: 12px;
  color: #999;
  display: block;
  margin-top: 2px;
}

/* 工具评分样式 */
.rating-card {
  padding: 12px;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.rating-stars {
  margin: 8px 0;
}

.rating-value {
  font-size: 18px;
  font-weight: 600;
  color: #ffb74d;
  margin-right: 8px;
}

.stars {
  display: inline-flex;
  align-items: center;
}

.stars .svg-icon {
  font-size: 16px;
  margin-right: 2px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .tools-header::before,
  .tools-header::after {
    display: none;
  }
}

@media (max-width: 768px) {
  .tools-grid,
  .tips-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .tool-card,
  .tip-card {
    padding: 20px;
  }

  .tools-title {
    font-size: 28px;
  }

  .tools-subtitle {
    font-size: 16px;
  }

  .tools-header {
    margin-bottom: 32px;
  }

  .form-row {
    flex-direction: column;
  }

  .radio-group {
    flex-direction: column;
    gap: 8px;
  }

  .form-actions {
    flex-direction: column;
  }

  .message-input {
    flex-direction: column;
  }

  .add-collaborator {
    flex-direction: column;
  }
}
</style>
