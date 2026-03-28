# COSCLI 首次安装配置指南

本文档提供腾讯云 COSCLI 工具的完整安装和配置流程。

## 目录

- [系统要求](#系统要求)
- [安装步骤](#安装步骤)
- [配置方法](#配置方法)
- [验证安装](#验证安装)
- [故障排查](#故障排查)

## 系统要求

- **操作系统**: macOS 或 Linux
- **权限**: 需要写入权限（如 /usr/local/bin 或 ~/bin）
- **网络**: 能访问腾讯云 COS 服务

## 安装步骤

### 1. 检测系统架构

```bash
# 检测操作系统
uname -s  # Darwin (macOS) 或 Linux

# 检测 CPU 架构
uname -m  # arm64 (Apple Silicon) 或 x86_64 (Intel/AMD)
```

### 2. 下载 COSCLI

根据操作系统和架构选择正确的下载链接：

**macOS:**
- Apple Silicon (M1/M2/M3): `https://cosbrowser.cloud.tencent.com/software/coscli/coscli-darwin-arm64`
- Intel: `https://cosbrowser.cloud.tencent.com/software/coscli/coscli-darwin-amd64`

**Linux:**
- x86_64: `https://cosbrowser.cloud.tencent.com/software/coscli/coscli-linux-amd64`
- ARM64: `https://cosbrowser.cloud.tencent.com/software/coscli/coscli-linux-arm64`

### 3. 安装到用户专属目录

**创建专属目录并安装**

```bash
# 创建工具专属目录
mkdir -p ~/.tencent-cos-skills

# 下载 COSCLI 到专属目录
# macOS Apple Silicon (M1/M2/M3)
curl -L -o ~/.tencent-cos-skills/coscli https://cosbrowser.cloud.tencent.com/software/coscli/coscli-darwin-arm64
chmod 755 ~/.tencent-cos-skills/coscli

# macOS Intel
curl -L -o ~/.tencent-cos-skills/coscli https://cosbrowser.cloud.tencent.com/software/coscli/coscli-darwin-amd64
chmod 755 ~/.tencent-cos-skills/coscli

# Linux x86_64
curl -L -o ~/.tencent-cos-skills/coscli https://cosbrowser.cloud.tencent.com/software/coscli/coscli-linux-amd64
chmod 755 ~/.tencent-cos-skills/coscli

# Linux ARM64
curl -L -o ~/.tencent-cos-skills/coscli https://cosbrowser.cloud.tencent.com/software/coscli/coscli-linux-arm64
chmod 755 ~/.tencent-cos-skills/coscli

# 添加到 PATH（需要在 ~/.bashrc 或 ~/.zshrc 中添加）
export PATH="$HOME/.tencent-cos-skills:$PATH"

# 使配置生效
source ~/.bashrc  # 或 source ~/.zshrc
```

**或使用 shell alias 方式**

如果不想修改 PATH，可以添加 alias：

```bash
# 编辑 shell 配置文件
echo 'alias coscli="$HOME/.tencent-cos-skills/coscli"' >> ~/.bashrc
# 或
echo 'alias coscli="$HOME/.tencent-cos-skills/coscli"' >> ~/.zshrc

# 使配置生效
source ~/.bashrc  # 或 source ~/.zshrc
```

### 4. 验证安装

```bash
coscli --version
```

## 配置方法

配置 COSCLI 需要以下信息：
- **Secret ID**: 腾讯云 API 密钥 ID
- **Secret Key**: 腾讯云 API 密钥 Key
- **APPID**: 用户的 APPID
- **Bucket Name**: 存储桶名称（格式：bucketname-APPID）
- **Region**: 存储桶所在地域

### 获取密钥信息

1. **Secret ID 和 Secret Key**:
   - 访问：https://console.cloud.tencent.com/cam/capi
   - 创建或查看 API 密钥

2. **APPID**:
   - 访问：https://console.cloud.tencent.com/developer
   - 在账号信息中查看 APPID

3. **存储桶信息**:
   - 访问：https://console.cloud.tencent.com/cos/bucket
   - 查看存储桶名称和所属地域

### 方法 A: 交互式配置（推荐）

```bash
# 初始化配置
coscli config init

# 按提示输入：
# - Secret ID
# - Secret Key
# - APPID
# - 存储桶名称
# - 地域（如 ap-shanghai, ap-guangzhou, ap-beijing 等）
```

**添加多个存储桶配置：**

```bash
coscli config add
# 输入新的存储桶信息
```

### 方法 B: 手动创建配置文件

创建 `~/.cos.yaml` 文件：

```yaml
cos:
  base:
    secretid: <你的 Secret ID>
    secretkey: <你的 Secret Key>
    sessiontoken: ""
    protocol: https
  buckets:
  - name: <bucket-name-appid>      # 例如：mybucket-1250000000
    alias: <bucket-alias>           # 别名，如：mybucket
    region: <region>                # 地域，如：ap-shanghai
    endpoint: cos.<region>.myqcloud.com
    ofs: false
```

**地域代码对照表：**

| 地区 | 代码 |
|------|------|
| 北京 | ap-beijing |
| 上海 | ap-shanghai |
| 广州 | ap-guangzhou |
| 成都 | ap-chengdu |
| 重庆 | ap-chongqing |
| 南京 | ap-nanjing |
| 香港 | ap-hongkong |
| 新加坡 | ap-singapore |

### 方法 C: 使用命令行配置

```bash
coscmd config -a <Secret ID> -s <Secret Key> -b <bucket-name-appid> -r <region>
```

## 验证安装

### 1. 验证配置

```bash
# 查看配置文件
cat ~/.cos.yaml
```

### 2. 测试上传

```bash
# 创建测试文件
echo "Hello COS" > test.txt

# 上传测试
coscli cp test.txt cos://<bucket-alias>/test.txt

# 清理测试文件
rm test.txt
```

## 故障排查

### 问题 1: Command not found

**原因**: coscli 不在 PATH 中或 alias 未设置

**解决方案**:
```bash
# 检查 coscli 是否存在
ls -la ~/.tencent-cos-skills/coscli

# 如果文件存在，检查是否可执行
test -x ~/.tencent-cos-skills/coscli && echo "可执行" || echo "不可执行，需要 chmod +x"

# 设置可执行权限
chmod +x ~/.tencent-cos-skills/coscli

# 方法 A: 添加到 PATH
echo 'export PATH="$HOME/.tencent-cos-skills:$PATH"' >> ~/.bashrc
source ~/.bashrc

# 方法 B: 或使用 alias
echo 'alias coscli="$HOME/.tencent-cos-skills/coscli"' >> ~/.bashrc
source ~/.bashrc

# 验证
which coscli || alias coscli
```

### 问题 3: 配置文件权限错误

**原因**: ~/.cos.yaml 权限过于开放

**解决方案**:
```bash
# 设置正确的权限
chmod 600 ~/.cos.yaml
```

### 问题 4: AccessDenied 错误

**原因**: Secret ID/Key 不正确或权限不足

**解决方案**:
1. 检查 Secret ID 和 Secret Key 是否正确
2. 确认 API 密钥有 COS 相关权限
3. 在腾讯云控制台检查访问管理策略，官方说明文档：https://cloud.tencent.com/document/product/436/63669

### 问题 5: NoSuchBucket 错误

**原因**: 存储桶名称或地域不正确

**解决方案**:
1. 确认存储桶名称格式为 `bucketname-APPID`
2. 确认地域代码正确
3. 在控制台验证存储桶是否存在

## 安全建议

1. **保护密钥**:
   - 不要将 Secret ID 和 Secret Key 提交到代码仓库
   - 定期轮换 API 密钥
   - 使用子账号密钥并限制权限

2. **配置文件安全**:
   ```bash
   chmod 600 ~/.cos.yaml
   ```

3. **最小权限原则**:
   - 为 API 密钥分配最小必要权限
   - 使用资源级访问控制

4. **会话令牌**:
   - 临时访问时使用 session token
   - 设置合理的过期时间

## 技能默认配置（首次使用必需）

完成 COSCLI 安装配置后，**首次使用技能时需要配置默认参数**，以简化后续操作。

### 配置步骤

1. **检查用户配置文件**

   ```bash
   # 确认 ~/.cos.yaml 存在且包含存储桶配置
   cat ~/.cos.yaml
   ```

2. **列出可用存储桶**

   - 从 `~/.cos.yaml` 中读取所有已配置的存储桶
   - 展示给用户供选择

3. **询问用户选择默认配置**

   1. 请选择默认存储桶：列出已配置的存储桶列表

   2. 请设置默认上传路径：提示用户如 uploads/, backup/, documents/，直接回车使用根目录 /

4. **保存配置到 `.env` 文件**

   编辑用户目录下的 `.env` 文件：
   ```bash
   # .env 文件路径: ~/.tencent-cos-skills/.env

   # 设置默认存储桶别名
   DEFAULT_BUCKET_ALIAS=

   # 设置默认上传路径（路径末尾需要带斜杠）
   DEFAULT_UPLOAD_PATH=
   ```

### 配置参数说明

```bash
# 默认上传路径
# 上传文件时，如果没有指定具体路径，将上传到此文件夹
# 示例: uploads/, backup/, documents/
# 注意: 路径末尾需要带斜杠 /，根目录使用 /
DEFAULT_UPLOAD_PATH=uploads/

# 默认存储桶别名
# 如果用户没有指定存储桶，默认使用此存储桶
# 示例: mybucket, prod-bucket, backup-bucket
# 注意: 需要在 ~/.cos.yaml 中已经配置了此别名
DEFAULT_BUCKET_ALIAS=bucket1
```

### 配置效果

**配置后的使用：**
```bash
# 用户只需说"上传文件到 COS"
# 技能会自动使用默认存储桶和路径
coscli cp file.txt cos://${DEFAULT_UPLOAD_PATH}/${DEFAULT_BUCKET_ALIAS}/file.txt
```

**用户仍可指定其他值：**
```bash
# 用户可以覆盖默认配置
coscli cp file.txt cos://prod-bucket/backup/file.txt
```

### 查看和修改配置

```bash
# 查看当前配置
cat ~/.tencent-cos-skills/.env

# 修改配置
vim ~/.tencent-cos-skills/.env
```

**重要说明：**
- ✅ 首次使用必须配置，后续操作将直接使用默认值
- ✅ 用户可在任何操作中指定其他值，覆盖默认配置
- ✅ 修改 `.env` 文件不会影响 COSCLI 工具本身的配置文件 `~/.cos.yaml`
- ✅ 可以随时修改 `.env` 文件来调整默认行为

## 下一步

配置完成后，请参考 `file-upload.md` 了解文件上传的详细用法。
