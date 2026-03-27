# Tencent COS Skills

腾讯云对象存储（COS）Claude Code 技能集 - 支持文件上传、下载、删除、存储桶管理等操作。

## 功能特性

- ✅ **文件上传** - 单文件、批量上传、大文件优化、选择性上传
- ✅ **自动配置** - 自动安装和配置 COSCLI 工具
- ✅ **默认配置** - 支持配置默认上传路径和存储桶
- 🔜 **文件下载** - 单文件下载、批量下载、断点续传
- 🔜 **文件删除** - 单文件删除、批量删除
- 🔜 **存储桶管理** - 创建、删除、权限设置
- 🔜 **文件列表** - 列出文件、搜索文件
- 🔜 **文件复制/移动** - 跨存储桶操作

## 前置要求

- Node.js >= 14.0.0
- macOS 或 Linux（Windows 支持即将推出）
- 腾讯云账号和 API 密钥

## 快速开始

### 方式 1: 使用 npx 安装（推荐）

```bash
npx tencent-cos-skills
```

### 方式 2: 从 GitHub 安装

```bash
npx github:lifelmy/tencent-cos-skills
```

### 方式 3: 本地安装

```bash
git clone https://github.com/lifelmy/tencent-cos-skills.git
cd tencent-cos-skills
npm install
```

## 使用方法

安装完成后，在 Claude Code 中即可使用：

### 1. 首次配置

```
帮我配置腾讯云 COS
```

技能会引导你完成 COSCLI 工具的安装和配置。

### 2. 配置默认参数（可选）

编辑 `~/.claude/skills/tencent-cos-skills/.env` 文件：

```bash
# 默认上传路径
DEFAULT_UPLOAD_PATH=uploads/

# 默认存储桶别名
DEFAULT_BUCKET_ALIAS=mybucket
```

### 3. 开始使用

**上传单个文件：**

```
上传 ~/Documents/report.pdf 到腾讯云 COS
```

**上传文件夹：**

```
上传 ./dist 文件夹到 COS，存储桶是 prod-bucket
```

**大文件优化上传：**

```
上传 10GB 的数据库备份文件到 COS，需要优化速度
```

**选择性上传：**

```
只上传 images 目录下的 jpg 和 png 文件到 COS
```

## 技能详情

### 当前支持的功能

| 功能 | 状态 | 说明 |
|------|------|------|
| COSCLI 安装配置 | ✅ | 支持 macOS/Linux 自动安装 |
| 文件上传 | ✅ | 单文件、批量、大文件优化 |
| 默认配置 | ✅ | 默认上传路径、存储桶 |
| 环境检测 | ✅ | 自动检测系统和配置状态 |

### 即将支持

| 功能 | 状态 | 说明 |
|------|------|------|
| 文件下载 | 🔜 | 单文件、批量下载 |
| 文件删除 | 🔜 | 单文件、批量删除 |
| 存储桶管理 | 🔜 | 创建、删除、权限设置 |
| 文件列表 | 🔜 | 列出、搜索文件 |

## 配置说明

### COSCLI 配置（必需）

首次使用需要配置腾讯云 API 密钥：

1. **获取 API 密钥**：
   - 访问：https://console.cloud.tencent.com/cam/capi
   - 创建或查看 Secret ID 和 Secret Key

2. **获取 APPID**：
   - 访问：https://console.cloud.tencent.com/developer
   - 在账号信息中查看 APPID

3. **存储桶信息**：
   - 访问：https://console.cloud.tencent.com/cos/bucket
   - 查看存储桶名称和所属地域

技能会自动引导你完成配置。

### 默认配置（可选）

在 `~/.claude/skills/tencent-cos-skills/.env` 中配置：

```bash
# 默认上传路径（路径末尾需要带斜杠）
DEFAULT_UPLOAD_PATH=uploads/

# 默认存储桶别名（需要在 ~/.cos.yaml 中已配置）
DEFAULT_BUCKET_ALIAS=mybucket
```

**配置效果：**

- 未配置时：必须指定完整路径
  ```bash
  coscli cp file.txt cos://mybucket/path/to/file.txt
  ```

- 配置后：可简化命令
  ```bash
  coscli cp file.txt cos://mybucket/
  # 实际上传到: cos://mybucket/uploads/file.txt
  ```

## 目录结构

```
tencent-cos-skills/
├── skills/
│   └── tencent-cos-skills/      # 技能定义
│       ├── SKILL.md              # 主文件（流程引导）
│       ├── .env                  # 默认配置
│       ├── .env.example          # 配置示例
│       ├── references/           # 详细文档
│       │   ├── first-time-setup.md
│       │   └── file-upload.md
│       └── evals/                # 测试用例
│           └── evals.json
├── scripts/
│   └── install.js                # 安装脚本
├── package.json
└── README.md
```

## 开发

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

### 更新技能

```bash
# 拉取最新代码
git pull origin main

# 重新安装
node scripts/install.js
```

## 故障排查

### 安装失败

**问题：权限不足**

```bash
# 确保有写入权限
chmod +x scripts/install.js

# 或使用 sudo
sudo node scripts/install.js
```

**问题：找不到 Claude 目录**

```bash
# 手动创建目录
mkdir -p ~/.claude/skills
```

### 使用问题

**问题：COSCLI 命令不存在**

技能会自动安装 COSCLI，如遇问题请查看 `~/.claude/skills/tencent-cos-skills/references/first-time-setup.md`

**问题：上传权限错误**

检查 API 密钥权限，确保有 `cos:PutObject`、`cos:GetBucket` 等权限。

## 安全建议

1. **保护密钥**：不要将 Secret ID 和 Secret Key 提交到代码仓库
2. **最小权限**：使用子账号密钥并限制权限
3. **定期轮换**：定期更换 API 密钥
4. **配置文件权限**：设置 `chmod 600 ~/.cos.yaml`

## 相关链接

- [腾讯云 COS 官方文档](https://cloud.tencent.com/document/product/436)
- [COSCLI 工具文档](https://cloud.tencent.com/document/product/436/63144)
- [Claude Code 文档](https://github.com/anthropics/claude-code)

## 许可证

MIT

## 贡献

欢迎提交 Issue 和 Pull Request！

## 更新日志

### v1.0.3 (2025-03-27)

- 📝 改进首次配置文档和流程
- 🐛 修复配置步骤说明
- 🔗 添加腾讯云官方文档链接

### v1.0.2 (2025-03-27)

- 🔧 版本更新和维护

### v1.0.0 (2024-03-27)

- ✨ 首次发布
- ✅ 支持文件上传功能
- ✅ 自动安装配置 COSCLI
- ✅ 支持默认配置
