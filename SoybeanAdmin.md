# SoybeanAdmin 部署指南（Windows 本地环境）

## 1. 环境准备

### 1.1 安装 Git

Git 是一个版本控制工具，用于克隆和管理项目代码。

1. 访问 [Git 官方下载页面](https://git-scm.com/download/win)
2. 点击下载最新版本的 Git for Windows
3. 运行下载的安装程序，按照默认选项一路点击 "Next" 即可完成安装
4. 安装完成后，按下 `Win + R` 键，输入 `cmd` 并回车，打开命令提示符
5. 输入 `git --version` 并回车，如果显示 Git 版本信息，则安装成功

### 1.2 安装 Node.js

Node.js 是 JavaScript 的运行环境，用于运行前端项目。

#### 方法一：使用 nvm-windows（推荐）

nvm-windows 是一个 Node.js 版本管理工具，可以方便地切换不同版本的 Node.js。

1. 访问 [nvm-windows 官方下载页面](https://github.com/coreybutler/nvm-windows/releases)
2. 下载最新版本的 `nvm-setup.exe` 安装程序
3. 运行安装程序，按照默认选项一路点击 "Next" 即可完成安装
4. 安装完成后，按下 `Win + R` 键，输入 `cmd` 并回车，打开命令提示符
5. 输入 `nvm install 20.19.0` 并回车，安装 Node.js 20.19.0 版本（项目要求的最低版本）
6. 输入 `nvm use 20.19.0` 并回车，使用刚安装的 Node.js 版本
7. 输入 `node --version` 并回车，如果显示 `v20.19.0` 或更高版本，则安装成功

#### 方法二：直接安装 Node.js

如果您不想使用 nvm-windows，也可以直接安装 Node.js：

1. 访问 [Node.js 官方下载页面](https://nodejs.org/zh-cn/download/)
2. 点击 "Windows 安装包" 下载适合您系统的 Node.js 安装包（推荐下载 LTS 版本，确保版本 >= 20.19.0）
3. 运行下载的安装程序，按照默认选项一路点击 "Next" 即可完成安装
4. 安装完成后，按下 `Win + R` 键，输入 `cmd` 并回车，打开命令提示符
5. 输入 `node --version` 并回车，如果显示版本 >= 20.19.0，则安装成功

### 1.3 安装 pnpm

pnpm 是一个高效的 Node.js 包管理器，项目要求使用 pnpm 来安装依赖。

1. 按下 `Win + R` 键，输入 `cmd` 并回车，打开命令提示符
2. 输入 `npm install -g pnpm` 并回车，全局安装 pnpm
3. 安装完成后，输入 `pnpm --version` 并回车，如果显示版本 >= 10.5.0，则安装成功

## 2. 克隆项目

1. 选择一个合适的目录，用于存放项目代码
2. 按下 `Win + R` 键，输入 `cmd` 并回车，打开命令提示符
3. 使用 `cd` 命令进入您选择的目录，例如：
   ```cmd
   cd D:\Projects
   ```
4. 输入以下命令之一，克隆项目代码：

   ```cmd
   :: 从 GitHub 克隆（推荐）
   git clone https://github.com/soybeanjs/soybean-admin.git

   :: 或从 Gitee 克隆（国内访问速度更快）
   git clone https://gitee.com/honghuangdc/soybean-admin.git

   :: 或从 GitCode 克隆
   git clone https://gitcode.com/soybeanjs/soybean-admin.git
   ```

5. 克隆完成后，输入 `cd soybean-admin` 并回车，进入项目目录

## 3. 安装依赖

1. 确保您已经进入项目目录
2. 输入 `pnpm i` 并回车，安装项目依赖
3. 等待安装完成（可能需要几分钟时间，取决于网络速度）

> [!NOTE]
> 由于本项目采用了 pnpm monorepo 的管理方式，因此请不要使用 npm 或 yarn 来安装依赖。

## 4. 启动开发服务器

1. 确保您已经进入项目目录
2. 输入 `pnpm dev` 并回车，启动开发服务器
3. 等待服务器启动完成，您将看到类似以下输出：

   ```
   VITE v7.1.5  ready in 2000 ms

   ➜  Local:   http://localhost:5173/
   ➜  Network: http://192.168.1.100:5173/
   ➜  press h + enter to show help
   ```

4. 打开浏览器，访问 `http://localhost:5173/`，即可看到项目的登录页面

## 5. 构建生产版本（可选）

如果您需要构建生产版本的代码，可以按照以下步骤操作：

1. 确保您已经进入项目目录
2. 输入 `pnpm build` 并回车，构建生产版本
3. 等待构建完成，构建产物将生成在 `dist` 目录中

> [!NOTE]
> 您还可以使用 `pnpm build:test` 命令构建测试环境版本。

## 6. 本地预览生产版本（可选）

构建完成后，您可以在本地预览生产版本的效果：

1. 确保您已经进入项目目录
2. 输入 `pnpm preview` 并回车，启动预览服务器
3. 打开浏览器，访问显示的本地地址，即可预览生产版本

## 7. 常见问题及解决方案

### 7.1 安装依赖时失败

**问题**：执行 `pnpm i` 时失败，显示各种错误信息。

**解决方案**：
1. 确保您的网络连接正常
2. 确保您使用的是最新版本的 pnpm（>= 10.5.0）
3. 尝试删除 `node_modules` 目录和 `pnpm-lock.yaml` 文件，然后重新执行 `pnpm i`
4. 如果您在国内，可以尝试使用国内的 npm 镜像，如：
   ```cmd
   pnpm config set registry https://registry.npmmirror.com
   ```

### 7.2 启动开发服务器时失败

**问题**：执行 `pnpm dev` 时失败，显示各种错误信息。

**解决方案**：
1. 确保您已经成功安装了所有依赖
2. 确保您使用的是最新版本的 Node.js（>= 20.19.0）
3. 尝试关闭其他占用 5173 端口的程序，或使用以下命令指定其他端口：
   ```cmd
   pnpm dev --port 3000
   ```

### 7.3 构建生产版本时失败

**问题**：执行 `pnpm build` 时失败，显示各种错误信息。

**解决方案**：
1. 确保您已经成功安装了所有依赖
2. 确保您的代码没有语法错误或类型错误
3. 尝试执行以下命令，检查是否有类型错误：
   ```cmd
   pnpm typecheck
   ```
4. 尝试执行以下命令，检查是否有语法错误：
   ```cmd
   pnpm lint
   ```

## 8. 相关链接

- [项目 GitHub 仓库](https://github.com/soybeanjs/soybean-admin)
- [项目 Gitee 仓库](https://gitee.com/honghuangdc/soybean-admin)
- [项目文档](https://docs.soybeanjs.cn)
- [Vue3 官方文档](https://vuejs.org/)
- [Vite 官方文档](https://vitejs.dev/)
- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [NaiveUI 官方文档](https://www.naiveui.com/)
- [UnoCSS 官方文档](https://unocss.dev/)

## 9. 联系方式

如果您在部署过程中遇到任何问题，可以通过以下方式获取帮助：

- [GitHub Issues](https://github.com/soybeanjs/soybean-admin/issues)
- [QQ 交流群](https://soybeanjs-1300612522.cos.ap-guangzhou.myqcloud.com/uPic/qq-soybean-admin-4.jpg)
- [微信交流群](https://soybeanjs-1300612522.cos.ap-guangzhou.myqcloud.com/uPic/wechat-soybeanjs.jpg)（添加微信邀请进群）

---

希望本部署指南能够帮助您顺利在 Windows 本地环境部署 SoybeanAdmin 项目！如果您有任何建议或意见，欢迎提出。
