#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

const SKILL_NAME = 'tencent-cos-skills';
const SKILL_DIR = path.join(__dirname, '..', 'skills', SKILL_NAME);

// 获取 Claude Code 技能目录
function getClaudeSkillsDir() {
  const platform = os.platform();
  let claudeDir;

  if (platform === 'darwin' || platform === 'linux') {
    claudeDir = path.join(os.homedir(), '.claude', 'skills');
  } else if (platform === 'win32') {
    claudeDir = path.join(process.env.APPDATA || os.homedir(), 'Claude', 'skills');
  } else {
    claudeDir = path.join(os.homedir(), '.claude', 'skills');
  }

  return claudeDir;
}

// 确保目录存在
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✓ 创建目录: ${dir}`);
  }
}

// 复制目录
function copyDirSync(src, dest) {
  ensureDir(dest);

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 主安装函数
function install() {
  console.log('');
  console.log('🚀 开始安装腾讯云 COS 技能集...');
  console.log('');

  // 检查技能目录是否存在
  if (!fs.existsSync(SKILL_DIR)) {
    console.error('❌ 错误: 找不到技能目录');
    console.error(`   期望路径: ${SKILL_DIR}`);
    process.exit(1);
  }

  // 获取目标目录
  const targetDir = getClaudeSkillsDir();
  const targetSkillDir = path.join(targetDir, SKILL_NAME);

  console.log('📦 安装信息:');
  console.log(`   技能名称: ${SKILL_NAME}`);
  console.log(`   源目录: ${SKILL_DIR}`);
  console.log(`   目标目录: ${targetSkillDir}`);
  console.log('');

  // 确保目标目录存在
  ensureDir(targetDir);

  // 如果目标技能已存在，先删除
  if (fs.existsSync(targetSkillDir)) {
    console.log('⚠️  检测到已安装的技能，将被覆盖');
    fs.rmSync(targetSkillDir, { recursive: true, force: true });
  }

  // 复制技能文件
  console.log('📋 复制技能文件...');
  copyDirSync(SKILL_DIR, targetSkillDir);
  console.log('✓ 技能文件复制完成');
  console.log('');

  // 检查 .env 文件
  const envExample = path.join(targetSkillDir, '.env.example');
  const envFile = path.join(targetSkillDir, '.env');

  if (fs.existsSync(envExample) && !fs.existsSync(envFile)) {
    console.log('⚙️  创建配置文件...');
    fs.copyFileSync(envExample, envFile);
    console.log('✓ 已创建 .env 配置文件');
    console.log('');
  }

  // 安装完成
  console.log('✅ 安装成功！');
  console.log('');
  console.log('📖 使用说明:');
  console.log('');
  console.log('1. 首次使用需要配置 COSCLI 工具:');
  console.log('   在 Claude Code 中输入: "帮我配置腾讯云 COS"');
  console.log('');
  console.log('2. 可选: 配置默认上传路径');
  console.log(`   编辑配置文件: ${envFile}`);
  console.log('   设置 DEFAULT_UPLOAD_PATH 和 DEFAULT_BUCKET_ALIAS');
  console.log('');
  console.log('3. 开始使用:');
  console.log('   - 上传文件: "上传文件到腾讯云 COS"');
  console.log('   - 批量上传: "上传整个文件夹到 COS"');
  console.log('');
  console.log('📚 文档:');
  console.log('   - 技能文档: https://github.com/lifelmy/tencent-cos-skills');
  console.log('   - 腾讯云 COS: https://cloud.tencent.com/document/product/436');
  console.log('');
}

// 执行安装
install();
