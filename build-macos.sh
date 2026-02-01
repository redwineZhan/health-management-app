#!/bin/bash

# 构建Health Management App的macOS版本
# build-macos.sh

set -e  # 遇到错误立即退出

echo "🚀 开始构建Health Management App macOS版本"

# 检查必要工具
if ! command -v npm &> /dev/null; then
    echo "❌ npm 未找到，请先安装Node.js"
    exit 1
fi

if ! command -v electron-builder &> /dev/null; then
    echo "❌ electron-builder 未找到，正在安装..."
    npm install -g electron-builder
fi

# 创建必要目录
mkdir -p assets
mkdir -p dist

# 创建占位图标文件（实际使用时应替换为真实图标）
if [ ! -f "assets/icon.icns" ]; then
    echo "⚠️  assets/icon.icns 不存在，创建占位文件"
    touch assets/icon.icns
fi

if [ ! -f "assets/dmg-background.png" ]; then
    echo "⚠️  assets/dmg-background.png 不存在，创建占位文件"
    touch assets/dmg-background.png
fi

# 复制package.json配置
echo "📋 配置Electron应用..."
cp package-electron.json package.json

# 安装Electron依赖
echo "📦 安装Electron依赖..."
npm install electron electron-builder electron-squirrel-startup --save-dev
npm install electron-is-dev --save

# 构建前端应用（如果还未构建）
if [ ! -d "client/build" ]; then
    echo "🏗️  构建前端应用..."
    cd client
    npm install
    npm run build
    cd ..
else
    echo "✅ 前端应用已构建"
fi

# 复制构建的前端文件到根目录（Electron应用需要）
if [ -d "client/build" ]; then
    echo "📁 复制前端构建文件..."
    cp -r client/build/* .
fi

# 构建macOS应用
echo "🍎 正在构建macOS版本..."
npx electron-builder --mac --config

echo "✅ macOS版本构建完成！"
echo "📦 应用包位于 dist/ 目录中"
echo ""
echo "🔍 检查输出文件："
ls -la dist/ || echo "❌ dist/ 目录不存在"