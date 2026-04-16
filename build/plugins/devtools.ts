import VueDevtools from 'vite-plugin-vue-devtools';

export function setupDevtoolsPlugin(viteEnv: Env.ImportMeta) {
  // 仅在明确启用时加载Vue Devtools插件，避免与浏览器扩展冲突
  if (viteEnv.VITE_ENABLE_VUE_DEVTOOLS === 'Y') {
    const { VITE_DEVTOOLS_LAUNCH_EDITOR } = viteEnv;
    return VueDevtools({
      launchEditor: VITE_DEVTOOLS_LAUNCH_EDITOR
    });
  }
  // 默认返回null，不加载插件
  return null;
}
