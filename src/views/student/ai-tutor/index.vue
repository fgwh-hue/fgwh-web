<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue';
import type { ChatMessage } from '@/service-alova/api/ai';
import { fetchDeepSeekCompletion } from '@/service-alova/api/ai';

interface ChatMessageWithId extends ChatMessage {
  id: number;
}

const isReplying = ref(false);
const endOfChat = ref<HTMLElement | null>(null);
const currentRequest = ref<any>(null); // Store the alova method instance
const selectedMessageId = ref<number | null>(null);
const inputRef = ref<HTMLElement | null>(null);

function handleSelectMessage(messageId: number) {
  selectedMessageId.value = messageId;
}

// 定义本地存储的 Key
const STORAGE_KEY = 'ai_tutor_chat_history';

// 从 localStorage 初始化消息
const messages = ref<ChatMessageWithId[]>([]);

const userInput = ref('');

// onMounted 生命周期钩子，用于在组件挂载时加载历史记录
onMounted(() => {
  const storedMessages = localStorage.getItem(STORAGE_KEY);
  if (storedMessages) {
    messages.value = JSON.parse(storedMessages);
  }
  scrollToBottom();
});

// watch 深度监听 messages 数组的变化，并将其保存到 localStorage
watch(
  messages,
  newMessages => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newMessages));
  },
  { deep: true }
);

async function scrollToBottom() {
  await nextTick();
  endOfChat.value?.scrollIntoView({ behavior: 'smooth' });
}

function parseSseChunk(chunk: string) {
  const lines = chunk.split('\n').filter(line => line.startsWith('data: '));
  const contents: string[] = [];
  for (const line of lines) {
    try {
      const jsonStr = line.substring(6);
      if (jsonStr.trim() === '[DONE]') {
        break;
      }
      const data = JSON.parse(jsonStr);
      if (data.choices && data.choices[0]?.delta?.content) {
        contents.push(data.choices[0].delta.content);
      }
    } catch {
      // 忽略无法解析的行
    }
  }
  return contents.join('');
}

async function handleSendMessage() {
  const messageContent = userInput.value.trim();
  if (!messageContent || isReplying.value) return;

  isReplying.value = true;
  messages.value.push({ id: Date.now(), role: 'user', content: messageContent });
  userInput.value = '';
  await scrollToBottom();

  const assistantMessageId = Date.now() + 1;
  messages.value.push({ id: assistantMessageId, role: 'assistant', content: '' });
  const assistantMessage = messages.value[messages.value.length - 1];

  try {
    const history = messages.value.map(({ role, content }) => ({ role, content }));
    const methodInstance = fetchDeepSeekCompletion(history);
    currentRequest.value = methodInstance; // Store the alova method instance
    const response = await methodInstance; // Await the method instance to get the response

    if (!response.body) {
      throw new Error('响应体为空');
    }

    const reader: ReadableStreamDefaultReader<Uint8Array> = response.body.getReader();
    const decoder = new TextDecoder('utf-8');

    while (true) {
      // eslint-disable-next-line no-await-in-loop
      const result = await reader.read();
      const { done, value } = result;

      if (done) {
        break;
      }
      const chunk = decoder.decode(value, { stream: true });
      const content = parseSseChunk(chunk);
      assistantMessage.content += content;
      // eslint-disable-next-line no-await-in-loop
      await scrollToBottom();
    }
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.log('Request aborted by user');
    } else {
      const errorMessage = error instanceof Error ? error.message : '发生未知网络错误';
      assistantMessage.content = `抱歉，出错了：${errorMessage}`;
    }
  } finally {
    isReplying.value = false;
    currentRequest.value = null; // Clear the request
    await scrollToBottom();
    inputRef.value?.focus(); // Focus the input field after sending
  }
}

function handleStop() {
  if (currentRequest.value) {
    currentRequest.value.abort();
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    handleSendMessage();
  }
}

function handleClearHistory() {
  window.$dialog?.warning({
    title: '清空确认',
    content: '您确定要清空所有聊天记录吗？此操作不可恢复。',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      messages.value = [];
      window.$message?.success('聊天记录已清空');
    }
  });
}
</script>

<template>
  <div class="relative h-full">
    <!-- 【核心修改】为 NCard 添加 content-style -->
    <NCard
      :bordered="false"
      class="absolute left-0 top-0 z-10 h-full card-wrapper bg-white/30 backdrop-blur-sm dark:bg-black/30"
      content-style="display: flex; flex-direction: column; height: 100%;"
    >
      <!-- 头部，绝对定位，不参与 flex 布局 -->
      <div class="absolute left-1/2 top-6px z-20 flex items-center gap-3 -translate-x-1/2">
        <span class="text-lg font-semibold">AI助教</span>
        <NButton text @click="handleClearHistory">
          <SvgIcon icon="ph:trash-duotone" class="text-lg" />
        </NButton>
      </div>

      <!-- 聊天记录区域：flex-1-hidden 使其占据所有剩余空间并可以滚动 -->
      <div class="flex-1-hidden overflow-y-auto p-4 pt-12">
        <NSpace vertical :size="16">
          <div v-if="messages.length === 0" class="flex items-start gap-3">
            <NAvatar circle :size="36">
              <SvgIcon icon="ph:robot-duotone" class="text-2xl" />
            </NAvatar>
            <div class="max-w-80% rounded-lg bg-white p-3 shadow-sm dark:bg-gray-700">
              <p>你好！我是你的AI学习助手，有什么问题都可以问我哦。</p>
            </div>
          </div>
          <div
            v-for="msg in messages"
            :key="msg.id"
            class="flex items-start gap-3"
            :class="{ 'flex-row-reverse': msg.role === 'user', 'selected-message': msg.id === selectedMessageId }"
            @click="handleSelectMessage(msg.id)"
          >
            <NAvatar v-if="msg.role === 'assistant'" circle :size="36">
              <SvgIcon icon="ph:robot-duotone" class="text-2xl" />
            </NAvatar>
            <NAvatar v-else circle :size="36" style="background-color: #18a058">
              <SvgIcon icon="ph:user-circle-duotone" class="text-2xl" />
            </NAvatar>
            <div
              class="max-w-80% rounded-lg p-3 shadow-sm"
              :class="msg.role === 'user' ? 'bg-primary text-white' : 'bg-white dark:bg-gray-700'"
            >
              <p class="leading-relaxed" v-html="msg.content.replace(/\n/g, '<br>')"></p>
            </div>
          </div>
        </NSpace>
        <div ref="endOfChat"></div>
      </div>

      <!-- 输入框区域：flex-shrink-0 使其高度固定，不被压缩 -->
      <div class="w-full flex-shrink-0 px-4 pb-4 pt-2">
        <div class="mx-auto max-w-4xl w-full">
          <NInputGroup>
            <NInput
              ref="inputRef"
              v-model:value="userInput"
              type="textarea"
              :autosize="{ minRows: 1, maxRows: 5 }"
              placeholder="请输入你的问题... (Enter 发送, Shift + Enter 换行)"
              :disabled="isReplying"
              @keydown="handleKeydown"
            />
            <NButton type="primary" :loading="isReplying" :disabled="isReplying" @click="handleSendMessage">
              发送
            </NButton>
            <NButton v-if="isReplying" type="warning" @click="handleStop">停止</NButton>
          </NInputGroup>
        </div>
      </div>
    </NCard>
  </div>
</template>

<style scoped>
.selected-message {
  background-color: #e0e0e0;
  border-radius: 8px;
  padding: 4px;
}
</style>
