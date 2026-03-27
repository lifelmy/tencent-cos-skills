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

### 3. 安装到系统路径

**方法 A: 安装到 /usr/local/bin（推荐）**

```bash
# macOS Apple Silicon
curl -o /usr/local/bin/coscli https://cosbrowser.cloud.tencent.com/software/coscli/coscli-darwin-arm64
chmod 755 /usr/local/bin/coscli

# macOS Intel
curl -o /usr/local/bin/coscli https://cosbrowser.cloud.tencent.com/software/coscli/coscli-darwin-amd64
chmod 755 /usr/local/bin/coscli

# Linux x86_64
curl -o /usr/local/bin/coscli https://cosbrowser.cloud.tencent.com/software/coscli/coscli-linux-amd64
chmod 755 /usr/local/bin/coscli

# Linux ARM64
curl -o /usr/local/bin/coscli https://cosbrowser.cloud.tencent.com/software/coscli/coscli-linux-arm64
chmod 755 /usr/local/bin/coscli
```

**方法 B: 安装到用户目录（无需 sudo）**

```bash
# 创建用户 bin 目录
mkdir -p ~/bin

# 下载 COSCLI（以 macOS ARM64 为例）
curl -o ~/bin/coscli https://cosbrowser.cloud.tencent.com/software/coscli/coscli-darwin-arm64
chmod 755 ~/bin/coscli

# 添加到 PATH（需要在 ~/.bashrc 或 ~/.zshrc 中添加）
export PATH="$HOME/bin:$PATH"

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

# 列出存储桶文件（验证权限）
coscli ls cos://<bucket-alias>/

# 或使用完整存储桶名称
coscli ls cos://<bucket-name-appid>/
```

### 2. 测试上传

```bash
# 创建测试文件
echo "Hello COS" > test.txt

# 上传测试
coscli cp test.txt cos://<bucket-alias>/test.txt

# 验证上传
coscli ls cos://<bucket-alias>/

# 下载测试
coscli cp cos://<bucket-alias>/test.txt test_download.txt

# 清理测试文件
rm test.txt test_download.txt
coscli rm cos://<bucket-alias>/test.txt
```

## 故障排查

### 问题 1: Permission denied

**原因**: 没有写入 /usr/local/bin 的权限

**解决方案**:
```bash
# 使用 sudo
sudo curl -o /usr/local/bin/coscli https://...

# 或安装到用户目录
mkdir -p ~/bin
curl -o ~/bin/coscli https://...
chmod 755 ~/bin/coscli
export PATH="$HOME/bin:$PATH"
```

### 问题 2: Command not found

**原因**: coscli 不在 PATH 中

**解决方案**:
```bash
# 检查 coscli 位置
which coscli

# 如果在 ~/bin，添加到 PATH
echo 'export PATH="$HOME/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
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
3. 在腾讯云控制台检查访问管理策略

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

## 技能默认配置（可选）

完成 COSCLI 安装配置后，可以配置技能的默认参数，简化日常使用。

### 配置默认上传路径

编辑技能目录下的 `.env` 文件：

```bash
# 找到技能安装目录下的 .env 文件
# 如果没有 .env 文件，可以从 .env.example 复制
cp .env.example .env

# 编辑配置
vim .env
```

### 可配置参数

```bash
# 默认上传路径
# 上传文件时，如果没有指定具体路径，将上传到此文件夹
# 示例: uploads/, backup/, documents/
# 注意: 路径末尾需要带斜杠 /
DEFAULT_UPLOAD_PATH=uploads/

# 默认存储桶别名
# 如果用户没有指定存储桶，默认使用此存储桶
# 示例: mybucket, prod-bucket, backup-bucket
# 注意: 需要在 ~/.cos.yaml 中已经配置了此别名
DEFAULT_BUCKET_ALIAS=mybucket
```

### 配置效果

**未配置时：**
```bash
# 必须指定完整路径
coscli cp file.txt cos://mybucket/path/to/file.txt
```

**配置后：**
```bash
# 如果用户没有指定路径，自动使用默认路径
coscli cp file.txt cos://mybucket/
# 实际上传到: cos://mybucket/uploads/file.txt
```

**注意：**
- 这是可选配置，不配置也不影响正常使用
- 如果用户在上传命令中明确指定了路径，将使用用户指定的路径（优先级更高）
- `.env` 文件只影响本技能的行为，不会修改 COSCLI 工具本身的配置

## 下一步

配置完成后，请参考 `file-upload.md` 了解文件上传的详细用法。
