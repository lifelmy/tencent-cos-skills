# 发布指南

本文档提供了将 tencent-cos-skills 发布到 GitHub 和 npm 的完整步骤。

## 发布前检查清单

- [x] 修改 package.json 中的作者信息
- [x] 修改所有文件中的用户名占位符
- [x] 创建 LICENSE 文件
- [x] 创建 .gitignore 文件
- [x] 验证 README.md 内容完整
- [x] 测试安装脚本

## 步骤 1: 初始化 Git 仓库

```bash
cd /Users/bytedance/tencent-cos-skills-repo

# 初始化 git 仓库
git init

# 添加所有文件
git add .

# 查看将要提交的文件
git status

# 提交
git commit -m "Initial release: Tencent COS skills for Claude Code

Features:
- Auto install and configure COSCLI
- Support file upload (single, batch, large file optimization)
- Optional default configuration
- Cross-platform support (macOS/Linux)"
```

## 步骤 2: 创建 GitHub 仓库

1. 访问 https://github.com/new
2. 填写仓库信息：
   - Repository name: `tencent-cos-skills`
   - Description: `腾讯云对象存储（COS）Claude Code 技能集`
   - 选择 Public
   - 不要勾选 "Initialize this repository with a README"（我们已经有了）
3. 点击 "Create repository"

## 步骤 3: 推送到 GitHub

```bash
# 添加远程仓库
git remote add origin https://github.com/lifelmy/tencent-cos-skills.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

## 步骤 4: 发布到 npm

### 4.1 注册 npm 账号（如果还没有）

访问 https://www.npmjs.com/signup 注册账号

### 4.2 登录 npm

```bash
npm login
```

输入你的 npm 用户名、密码和邮箱。

### 4.3 验证包名是否可用

```bash
npm search tencent-cos-skills
```

如果没有找到，说明包名可用。

### 4.4 发布

```bash
# 发布到 npm
npm publish

# 如果发布失败，可能需要验证邮箱
# 访问 npm 发送的验证邮件中的链接
```

### 4.5 验证发布成功

```bash
# 查看发布的包
npm view tencent-cos-skills

# 或访问
# https://www.npmjs.com/package/tencent-cos-skills
```

## 步骤 5: 测试安装

### 从 npm 安装（推荐）

```bash
npx tencent-cos-skills
```

### 从 GitHub 安装

```bash
npx github:lifelmy/tencent-cos-skills
```

### 本地测试

```bash
# 克隆仓库
git clone https://github.com/lifelmy/tencent-cos-skills.git
cd tencent-cos-skills

# 测试安装
node scripts/install.js

# 验证安装
ls -la ~/.claude/skills/tencent-cos-skills/
```

## 更新版本

当需要更新技能时：

### 1. 修改代码

```bash
# 修改文件后
git add .
git commit -m "feat: 添加文件下载功能"
```

### 2. 更新版本号

```bash
# 小版本更新（bug 修复）
npm version patch

# 中版本更新（新功能）
npm version minor

# 大版本更新（破坏性变更）
npm version major
```

### 3. 推送到 GitHub

```bash
git push origin main
git push --tags
```

### 4. 发布到 npm

```bash
npm publish
```

## 常见问题

### Q: npm publish 失败

**原因 1: 包名已被占用**
```bash
# 查看包名
npm search tencent-cos-skills

# 如果被占用，修改 package.json 中的 name
# 例如改为: @lifelmy/tencent-cos-skills
```

**原因 2: 邮箱未验证**
```bash
# 检查 npm 账号状态
npm whoami

# 访问 npm 发送的验证邮件
```

**原因 3: 未登录**
```bash
npm login
```

### Q: 如何删除已发布的版本

```bash
# 弃用某个版本
npm deprecate tencent-cos-skills@1.0.0 "此版本有问题，请使用最新版本"

# 删除整个包（谨慎操作，发布 24 小时后无法删除）
npm unpublish tencent-cos-skills --force
```

### Q: 如何发布 beta 版本

```bash
# 更新版本
npm version 1.1.0-beta.0

# 发布 beta 版本
npm publish --tag beta

# 用户安装 beta 版本
npm install tencent-cos-skills@beta
```

## 发布后的工作

1. ✅ 在 GitHub 创建 Release
   - 访问 https://github.com/lifelmy/tencent-cos-skills/releases/new
   - 填写版本号和更新说明

2. ✅ 更新 README.md 的徽章
   ```markdown
   [![npm version](https://badge.fury.io/js/tencent-cos-skills.svg)](https://badge.fury.io/js/tencent-cos-skills)
   [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
   ```

3. ✅ 推广你的包
   - 在社交媒体分享
   - 写博客文章介绍
   - 在相关社区发布

## 持续集成（可选）

可以设置 GitHub Actions 自动发布：

`.github/workflows/npm-publish.yml`:

```yaml
name: Publish to npm

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '16'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{secrets.NPM_TOKEN}}
```

需要在 GitHub 仓库的 Settings → Secrets 中添加 `NPM_TOKEN`。

## 获取帮助

- npm 文档: https://docs.npmjs.com/
- GitHub 文档: https://docs.github.com/
- 问题反馈: https://github.com/lifelmy/tencent-cos-skills/issues
