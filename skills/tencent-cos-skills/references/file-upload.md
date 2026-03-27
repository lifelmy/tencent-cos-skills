# COS 文件上传指南

本文档提供腾讯云 COS 文件上传的详细用法和最佳实践。

## 目录

- [基本语法](#基本语法)
- [上传场景](#上传场景)
- [高级选项](#高级选项)
- [性能优化](#性能优化)
- [最佳实践](#最佳实践)

## 基本语法

COSCLI 使用 `cp` 命令上传文件：

```bash
coscli cp <本地路径> <COS路径> [选项]
```

### 路径格式

**COS 路径有两种格式：**

1. **使用别名**（推荐）:
   ```
   cos://bucket-alias/path/file.txt
   ```

2. **使用完整名称**:
   ```
   cos://bucketname-appid/path/file.txt
   ```

### 常用参数

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `-r, --recursive` | 递归上传文件夹 | 否 |
| `--storage-class` | 存储类型 | STANDARD |
| `--part-size` | 分块大小（MB） | 32 |
| `--thread-num` | 分块并发线程数 | 5 |
| `--routines` | 文件间并发数 | 3 |
| `--rate-limiting` | 单链接速率限制（MB/s） | 无限制 |
| `--include` | 包含特定模式的文件 | 无 |
| `--exclude` | 排除特定模式的文件 | 无 |
| `--meta` | 文件元信息 | 无 |
| `--acl` | 文件访问权限 | 私有 |

### 默认配置（可选）

技能支持通过 `.env` 文件设置默认参数，简化上传命令。

**配置文件位置**: `技能目录/.env`

**配置方法**: 参考 `first-time-setup.md` 中的"技能默认配置"章节

**可用参数**:

```bash
# 默认上传路径（路径末尾需要带斜杠）
DEFAULT_UPLOAD_PATH=uploads/

# 默认存储桶别名（需要在 ~/.cos.yaml 中已配置）
DEFAULT_BUCKET_ALIAS=mybucket
```

**使用规则**:

1. **用户指定了完整路径**: 使用用户指定的路径（优先级最高）
   ```bash
   coscli cp file.txt cos://mybucket/documents/file.txt
   # 上传到: cos://mybucket/documents/file.txt
   ```

2. **用户指定了存储桶但未指定路径**: 使用默认路径（如果已配置）
   ```bash
   # 假设配置了 DEFAULT_UPLOAD_PATH=uploads/
   coscli cp file.txt cos://mybucket/
   # 实际上传到: cos://mybucket/uploads/file.txt
   ```

3. **未配置默认参数**: 需要用户手动指定完整路径
   ```bash
   # 没有配置 .env 文件
   coscli cp file.txt cos://mybucket/file.txt  # 直接在根目录
   ```

**查看当前配置**:

```bash
# 查看 .env 文件
cat <技能目录>/.env
```

**重要说明**:
- ✅ 这是可选配置，不配置也不影响正常使用
- ✅ 用户明确指定的路径优先级最高，默认配置仅作为补充
- ✅ 修改 `.env` 文件不会影响 COSCLI 工具本身的配置文件 `~/.cos.yaml`
- ✅ 可以随时修改或删除 `.env` 文件来调整默认行为

## 上传场景

### 1. 上传单个文件

```bash
# 基本用法
coscli cp /local/file.txt cos://mybucket/path/file.txt

# 使用别名
coscli cp ~/Documents/report.pdf cos://prod-bucket/reports/report.pdf

# 指定存储类型
coscli cp data.zip cos://backup-bucket/archives/data.zip --storage-class ARCHIVE
```

### 2. 上传文件夹

```bash
# 递归上传整个文件夹
coscli cp /local/folder/ cos://mybucket/remote-folder/ -r

# 上传网站静态文件
coscli cp ./dist/ cos://website-bucket/ -r

# 保持目录结构
coscli cp /projects/myapp/ cos://backup-bucket/myapp/ -r
```

### 3. 选择性上传

**仅上传特定类型文件：**

```bash
# 仅上传图片文件
coscli cp ./images/ cos://image-bucket/ -r --include ".*\.(jpg|png|gif)$"

# 仅上传代码文件
coscli cp ./src/ cos://code-bucket/ -r --include ".*\.(js|ts|jsx|tsx)$"

# 仅上传文档
coscli cp ./docs/ cos://doc-bucket/ -r --include ".*\.(md|pdf|docx)$"
```

**排除特定文件：**

```bash
# 排除日志文件
coscli cp ./app/ cos://app-bucket/ -r --exclude ".*\.log$"

# 排除多个类型
coscli cp ./project/ cos://backup-bucket/ -r --exclude ".*\.(log|tmp|bak)$"

# 排除隐藏文件
coscli cp ./folder/ cos://mybucket/ -r --exclude "^\..*"
```

**组合使用：**

```bash
# 包含图片但排除缩略图
coscli cp ./photos/ cos://photo-bucket/ -r \
  --include ".*\.(jpg|png)$" \
  --exclude ".*thumbnail.*"
```

### 4. 增量上传

```bash
# 使用 sync 命令实现增量上传（仅上传变化的文件）
coscli sync /local/folder/ cos://mybucket/folder/ -r

# 或使用 cp 的 --snapshot-path 参数
coscli cp /local/folder/ cos://mybucket/folder/ -r \
  --snapshot-path ~/.cos_snapshot
```

### 5. 大文件上传

**10GB 以上的大文件优化：**

```bash
# 增大分块大小和并发数
coscli cp large-file.zip cos://mybucket/large-file.zip \
  --part-size 128 \
  --thread-num 20

# 10GB 数据库备份
coscli cp /backup/database-2024.sql cos://backup-bucket/db/database-2024.sql \
  --part-size 256 \
  --thread-num 30 \
  --rate-limiting 0
```

**分块上传原理：**
- 文件 > 5GB 自动启用分块上传
- 默认分块大小 32MB，可调整
- 每个分块独立传输，失败可重试
- 支持断点续传，中断后继续上传

## 高级选项

### 存储类型

```bash
# 标准存储（默认）
coscli cp file.txt cos://bucket/file.txt --storage-class STANDARD

# 低频存储（适合不频繁访问的数据）
coscli cp backup.tar.gz cos://bucket/backup.tar.gz --storage-class STANDARD_IA

# 归档存储（适合长期归档）
coscli cp archive.zip cos://bucket/archive.zip --storage-class ARCHIVE

# 深度归档存储（成本最低）
coscli cp historical-data.zip cos://bucket/data.zip --storage-class DEEP_ARCHIVE
```

**存储类型对比：**

| 类型 | 适用场景 | 访问频率 | 存储成本 | 取回成本 |
|------|---------|---------|---------|---------|
| STANDARD | 热点数据 | 高 | 高 | 低 |
| STANDARD_IA | 低频访问 | 低 | 中 | 中 |
| ARCHIVE | 长期归档 | 极低 | 低 | 高 |
| DEEP_ARCHIVE | 极长期归档 | 极低 | 极低 | 极高 |

### 访问权限（ACL）

```bash
# 私有读写（默认）
coscli cp sensitive.txt cos://bucket/sensitive.txt --acl private

# 公共读（适合公开资源）
coscli cp public-image.jpg cos://bucket/image.jpg --acl public-read

# 公共读写（不推荐）
coscli cp shared.txt cos://bucket/shared.txt --acl public-read-write
```

### 文件元信息

```bash
# 设置缓存策略
coscli cp style.css cos://bucket/style.css \
  --meta "Cache-Control:max-age=31536000"

# 设置内容类型
coscli cp data.json cos://bucket/data.json \
  --meta "Content-Type:application/json"

# 自定义头部
coscli cp document.pdf cos://bucket/doc.pdf \
  --meta "x-cos-meta-author:John#x-cos-meta-department:IT"
```

### 并发控制

```bash
# 高并发上传（适合带宽充足的环境）
coscli cp ./large-folder/ cos://bucket/folder/ -r \
  --thread-num 20 \
  --routines 10

# 限速上传（避免占用过多带宽）
coscli cp ./data/ cos://bucket/data/ -r \
  --rate-limiting 5

# 低并发上传（适合网络不稳定的环境）
coscli cp ./files/ cos://bucket/files/ -r \
  --thread-num 3 \
  --routines 2
```

## 性能优化

### 参数调优建议

**场景 1: 大量小文件（如网站静态资源）**

```bash
# 提高文件间并发
coscli cp ./dist/ cos://website/ -r \
  --routines 20 \
  --thread-num 5
```

**场景 2: 少量大文件（如视频、备份）**

```bash
# 提高分块并发
coscli cp video.mp4 cos://videos/video.mp4 \
  --part-size 128 \
  --thread-num 30
```

**场景 3: 带宽受限**

```bash
# 限制速率，保持并发
coscli cp ./data/ cos://backup/data/ -r \
  --rate-limiting 2 \
  --thread-num 10
```

### 性能参考

**100Mbps 带宽环境：**

| 文件大小 | 默认参数 | 优化参数 | 提升比例 |
|---------|---------|---------|---------|
| 1GB 单文件 | ~2分钟 | ~40秒 | 3x |
| 10GB 单文件 | ~15分钟 | ~4分钟 | 3.75x |
| 1000个小文件 | ~5分钟 | ~1分钟 | 5x |

**1Gbps 带宽环境：**

| 文件大小 | 默认参数 | 优化参数 | 提升比例 |
|---------|---------|---------|---------|
| 1GB 单文件 | ~30秒 | ~10秒 | 3x |
| 10GB 单文件 | ~2分钟 | ~30秒 | 4x |

### 监控上传进度

```bash
# 使用 --snapshot-path 记录进度
coscli cp ./large-folder/ cos://bucket/folder/ -r \
  --snapshot-path ~/.cos_snapshot

# 上传失败后继续
coscli cp ./large-folder/ cos://bucket/folder/ -r \
  --snapshot-path ~/.cos_snapshot
```

## 最佳实践

### 1. 数据备份

```bash
# 定期备份脚本
#!/bin/bash
DATE=$(date +%Y%m%d)
coscli cp /data/ cos://backup-bucket/$DATE/ -r \
  --storage-class STANDARD_IA \
  --thread-num 15 \
  --routines 10

# 保留最近7天的备份
coscli ls cos://backup-bucket/ | head -n -7 | awk '{print $2}' | \
  xargs -I {} coscli rm {} -r
```

### 2. 网站部署

```bash
# 上传构建产物
coscli cp ./dist/ cos://website-bucket/ -r \
  --exclude ".*\.map$" \
  --meta "Cache-Control:max-age=31536000"

# 设置 HTML 不缓存
coscli cp ./dist/index.html cos://website-bucket/index.html \
  --meta "Cache-Control:no-cache"
```

### 3. 数据归档

```bash
# 归档旧数据到低成本存储
coscli cp ./archives/ cos://archive-bucket/ -r \
  --storage-class ARCHIVE \
  --exclude ".*\.log$"
```

### 4. 增量同步

```bash
# 使用 sync 实现增量同步
coscli sync /production/data/ cos://prod-bucket/data/ -r

# 双向同步（谨慎使用）
coscli sync cos://bucket-a/ cos://bucket-b/ -r
```

### 5. 验证上传

```bash
# 上传后验证
coscli cp file.txt cos://bucket/file.txt
coscli stat cos://bucket/file.txt

# 批量验证
for file in ./dist/*; do
  filename=$(basename "$file")
  coscli stat "cos://bucket/$filename" > /dev/null && \
    echo "✓ $filename uploaded" || \
    echo "✗ $filename failed"
done
```

## 常见问题

### 问题 1: 上传速度慢

**解决方案:**
1. 增加并发数：`--thread-num 20 --routines 10`
2. 增大分块：`--part-size 64` 或更大
3. 检查网络带宽和延迟
4. 使用更近的地域

### 问题 2: 大文件上传失败

**解决方案:**
1. 使用断点续传：重新执行相同命令
2. 减小分块大小：`--part-size 16`
3. 降低并发数：`--thread-num 3`
4. 检查网络稳定性

### 问题 3: 文件权限错误

**解决方案:**
1. 检查 API 密钥权限
2. 确认存储桶 ACL 设置
3. 使用正确的 --acl 参数

### 问题 4: 正则表达式不生效

**解决方案:**
1. 使用标准正则语法
2. 正确转义特殊字符
3. 测试正则表达式：
   ```bash
   echo "test.jpg" | grep -E ".*\.jpg$"
   ```

### 问题 5: 软链接未被上传

**解决方案:**
```bash
# 上传软链接
coscli cp ./folder/ cos://bucket/ -r \
  --disable-all-symlink=false \
  --enable-symlink-dir=true
```

## 相关文档

- 首次配置请参考：`first-time-setup.md`
- 官方文档：https://cloud.tencent.com/document/product/436/63669
