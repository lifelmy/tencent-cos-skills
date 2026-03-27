---
name: tencent-cos-skills
description: 腾讯云对象存储（COS）综合技能集，支持文件上传、下载、删除、存储桶管理等操作。自动安装配置 COSCLI 工具。当用户提到"腾讯云 COS"、"COS 操作"、"COSCLI"、"腾讯云对象存储"、"上传/下载/删除文件到 COS"、"存储桶管理"时使用此技能。当前支持：文件上传、下载、删除、存储桶操作，持续扩展中。
---

# 腾讯云 COS 技能集

本技能集提供腾讯云对象存储（COS）的完整操作支持，包括文件管理、存储桶管理等功能。

## 工作流程

### 步骤 1: 环境检测

检测当前环境和 COSCLI 状态：

```bash
# 检测操作系统和架构
uname -s  # Darwin (macOS) 或 Linux
uname -m  # arm64 或 x86_64

# 检查 COSCLI 是否已安装
which coscli || echo "NOT_INSTALLED"

# 检查配置文件是否存在
test -f ~/.cos.yaml && echo "CONFIGURED" || echo "NOT_CONFIGURED"
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
2. 根据文档构建正确的命令
3. 执行并验证结果

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
