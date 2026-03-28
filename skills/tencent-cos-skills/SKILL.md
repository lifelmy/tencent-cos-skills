---
name: tencent-cos-skills
description: 腾讯云对象存储（COS）综合技能集，支持文件上传、下载、删除、存储桶管理等操作。自动安装配置 COSCLI 工具。当用户提到"腾讯云 COS"、"COS 操作"、"COSCLI"、"腾讯云对象存储"、"上传/下载/删除文件到 COS"、"存储桶管理"时使用此技能。当前支持：文件上传、下载、删除、存储桶操作，持续扩展中。
---

# 腾讯云 COS 技能集

本技能集提供腾讯云对象存储（COS）的完整操作支持，包括文件管理、存储桶管理等功能。

## 目录结构

```
~/.tencent-cos-skills/
├── coscli          # COSCLI 工具可执行文件
└── .env            # 技能默认配置文件
```

## 工作流程

### 步骤 1: 环境检测和验证

检测当前环境和 COSCLI 状态：

```bash
# 检测操作系统和架构
uname -s  # Darwin (macOS) 或 Linux
uname -m  # arm64 或 x86_64

# 检查 COSCLI 是否可用
coscli --version 2>/dev/null || echo "NOT_INSTALLED"

# 如果不可用，检查专用目录是否存在
if [ $? -ne 0 ]; then
  if [ -f ~/.tencent-cos-skills/coscli ]; then
    echo "COSCLI 已下载但未配置 PATH 或 alias"
    echo "文件位置: ~/.tencent-cos-skills/coscli"
    # 尝试直接执行
    ~/.tencent-cos-skills/coscli --version
  else
    echo "COSCLI 未安装"
  fi
fi

# 检查配置文件是否存在
test -f ~/.cos.yaml && echo "COS 配置文件已存在" || echo "COS 配置文件不存在"

# 检查技能配置文件
test -f ~/.tencent-cos-skills/.env && echo "技能配置文件已存在" || echo "技能配置文件不存在"
```

### 步骤 1.1: 确保命令可用（关键步骤）

**在任何 COS 操作之前，必须执行此验证**：

```bash
# 定义获取 coscli 命令的函数
get_coscli_cmd() {
  # 先尝试直接使用 coscli
  if command -v coscli >/dev/null 2>&1; then
    echo "coscli"
    return 0
  fi

  # 检查 alias 是否设置（需要检查 shell 环境）
  if alias coscli >/dev/null 2>&1 2>/dev/null; then
    echo "coscli"
    return 0
  fi

  # 检查专用目录中的文件
  if [ -f ~/.tencent-cos-skills/coscli ]; then
    if [ -x ~/.tencent-cos-skills/coscli ]; then
      echo "$HOME/.tencent-cos-skills/coscli"
      return 0
    else
      echo "错误: ~/.tencent-cos-skills/coscli 存在但不可执行" >&2
      echo "请运行: chmod +x ~/.tencent-cos-skills/coscli" >&2
      return 1
    fi
  fi

  echo "错误: coscli 未安装" >&2
  echo "请参考 references/first-time-setup.md 安装配置" >&2
  return 1
}

# 使用示例
COSCLI_CMD=$(get_coscli_cmd)
if [ $? -eq 0 ]; then
  $COSCLI_CMD --version
  # 执行其他操作...
fi
```

### 步骤 1.2: 读取技能配置

```bash
# 读取技能默认配置
read_skill_config() {
  local env_file="$HOME/.tencent-cos-skills/.env"

  if [ ! -f "$env_file" ]; then
    echo "警告: 技能配置文件不存在: $env_file"
    echo "请先完成首次配置，参考 references/first-time-setup.md"
    return 1
  fi

  # 读取配置（支持注释和空行）
  while IFS='=' read -r key value; do
    # 跳过注释和空行
    [[ "$key" =~ ^#.*$ ]] && continue
    [[ -z "$key" ]] && continue

    # 去除前后空格
    key=$(echo "$key" | xargs)
    value=$(echo "$value" | xargs)

    # 导出变量
    export "$key=$value"
  done < "$env_file"
}

# 使用示例
read_skill_config
echo "默认存储桶: $DEFAULT_BUCKET_ALIAS"
echo "默认上传路径: $DEFAULT_UPLOAD_PATH"
```

### 步骤 2: 根据用户需求选择对应文档

根据用户的操作需求，阅读对应的参考文档：

| 用户需求 | 参考文档 |
|---------|---------|
| 首次安装配置 COSCLI | `references/first-time-setup.md` |
| 上传文件到 COS | `references/file-upload.md` |
| 下载文件（待扩展） | `references/file-download.md` |
| 删除文件（待扩展） | `references/file-delete.md` |
| 存储桶管理（待扩展） | `references/bucket-management.md` |

### 步骤 3: 执行操作

1. 阅读对应参考文档的详细说明
2. 如果有默认配置，优先使用默认配置
3. 如果用户指定了其他参数，使用用户指定的值（覆盖默认值）
4. 执行并验证结果

## 重要原则

1. **命令可用性验证**: 执行任何 COS 操作前，必须验证 `coscli` 命令是否可用
   - 首先尝试 `coscli --version`
   - 如果失败，检查 `~/.tencent-cos-skills/coscli` 是否存在
   - 如果文件存在但命令不可用，提示用户配置 PATH 或 alias
2. **不修改用户配置**: 技能不应该自动修改用户的 `~/.cos.yaml` 配置文件，除非用户明确要求
3. **首次配置引导**: 第一次使用时，引导用户设置默认存储桶和上传路径（详见 `references/first-time-setup.md`）
4. **后续直接使用**: 配置完成后，后续操作直接使用默认值，无需重复询问
5. **用户可覆盖**: 用户可以在任何操作中指定其他值，覆盖默认配置
6. **示例配置**: 不要在用户配置文件中添加示例配置

## 功能模块

### 当前支持

- ✅ **文件上传** - 单文件、批量上传、大文件优化、选择性上传等
- ✅ **工具配置** - COSCLI 安装、配置、验证

### 即将支持

- 🔜 **文件下载** - 单文件下载、批量下载、断点续传
- 🔜 **文件删除** - 单文件删除、批量删除
- 🔜 **存储桶管理** - 创建、删除、权限设置
- 🔜 **文件列表** - 列出文件、搜索文件
- 🔜 **文件复制/移动** - 跨存储桶操作

## 快速开始

如果是第一次使用，请先阅读 `references/first-time-setup.md` 完成 COSCLI 的安装和配置。

配置完成后，根据具体需求阅读对应的操作文档。

## 注意事项

1. **权限管理**: 不同操作需要不同的 API 权限，详见各功能文档
2. **安全性**: 保护好 Secret ID 和 Secret Key，不要提交到代码仓库
3. **成本控制**: 了解存储类型和流量费用，避免不必要的开支
4. **数据备份**: 重要操作前建议先备份数据

## 获取帮助

- 腾讯云 COS 官方文档: https://cloud.tencent.com/document/product/436
- COSCLI 工具文档: https://cloud.tencent.com/document/product/436/63144
