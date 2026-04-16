import { createAlova } from 'alova';
import adapterFetch from '@sa/alova/fetch';

// 获取环境变量中的 API Key
const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;

// 为 DeepSeek API 创建一个专用的 Alova 实例
// 它的 baseURL 指向我们通过 Vite 配置的代理地址 /proxy-deepseek
const deepSeekAlova = createAlova({
  baseURL: '/proxy-deepseek',
  requestAdapter: adapterFetch()
});

/** 聊天消息的类型定义 */
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**

 * 调用 DeepSeek API 获取聊天回复（流式）

 * @param history 包含上下文的完整聊天记录

 * @returns 返回原始的 Response 对象，其 body 是一个 ReadableStream

 */

export function fetchDeepSeekCompletion(history: ChatMessage[]) {
  // 1. 检查 API Key 是否存在且格式正确

  if (!DEEPSEEK_API_KEY || !DEEPSEEK_API_KEY.startsWith('sk-')) {
    const errorMsg = 'DeepSeek API Key 未配置或格式不正确，请检查您的 .env.test 文件。';

    window.$message?.error(errorMsg);

    return Promise.reject(new Error(errorMsg));
  }

  // 2. 使用专用的 alova 实例发起 POST 请求

  const methodInstance = deepSeekAlova.Post<Response>(
    '/chat/completions',

    {
      model: 'deepseek-chat',

      messages: history.map(msg => ({ role: msg.role, content: msg.content })),

      stream: true // 启用流式输出
    },

    {
      headers: {
        'Content-Type': 'application/json',

        Authorization: `Bearer ${DEEPSEEK_API_KEY}`
      },

      // 当 stream: true 时，我们需要直接处理原始的 Response 对象，而不是转换数据

      transform: undefined
    }
  );
  return methodInstance;
}
