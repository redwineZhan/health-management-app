#!/bin/bash

# 构建Health Management App的macOS版本
# 用于快速生成测试包的自动化脚本

set -e  # 遇到错误立即退出

echo "🚀 开始构建Health Management App macOS测试包"

# 检查必要工具
if ! command -v npm &> /dev/null; then
    echo "❌ npm 未找到，请先安装Node.js"
    exit 1
fi

if ! command -v electron-builder &> /dev/null; then
    echo "⚠️  electron-builder 未全局安装，尝试使用npx..."
fi

# 创建必要目录
mkdir -p assets
mkdir -p dist

# 检查前端是否已构建，如果没有则构建
if [ ! -d "client/build" ]; then
    echo "🏗️  构建前端应用..."
    cd client
    if [ ! -f "package.json" ]; then
        echo "❌ client/package.json 不存在"
        exit 1
    fi
    npm install
    npm run build
    cd ..
else
    echo "✅ 前端应用已构建"
fi

# 检查是否已有Electron配置文件
if [ ! -f "package.json.bak" ]; then
    # 备份当前package.json
    if [ -f "package.json" ]; then
        cp package.json package.json.bak
    fi
    # 使用Electron配置
    if [ -f "package-electron.json" ]; then
        cp package-electron.json package.json
    else
        echo "❌ package-electron.json 不存在"
        exit 1
    fi
fi

# 安装Electron相关依赖（如果尚未安装）
if ! npm list electron &> /dev/null; then
    echo "📦 安装Electron依赖..."
    npm install electron electron-builder electron-squirrel-startup --save-dev
    npm install electron-is-dev --save
fi

# 复制构建的前端文件到根目录（如果需要）
if [ -d "client/build" ]; then
    echo "📁 复制前端构建文件..."
    cp -r client/build/* . 2>/dev/null || echo "注意：可能已存在静态文件"
fi

# 创建虚拟图标文件（如果不存在）
if [ ! -f "assets/icon.icns" ]; then
    echo "🎨 创建虚拟图标文件..."
    # 创建一个简单的文本文件作为占位符
    echo "ICON_PLACEHOLDER" > assets/icon.icns
fi

if [ ! -f "assets/dmg-background.png" ]; then
    echo "🎨 创建虚拟DMG背景文件..."
    echo "DMG_BG_PLACEHOLDER" > assets/dmg-background.png
fi

# 检查操作系统
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "⚠️  当前不在macOS系统上运行"
    echo "ℹ️   electron-builder 只能在macOS上构建macOS应用"
    echo "ℹ️   在macOS系统上运行此脚本以完成构建"
    echo ""
    echo "📋 构建前检查清单:"
    echo "   1. 确保在macOS系统上运行"
    echo "   2. 安装Xcode Command Line Tools: xcode-select --install"
    echo "   3. 确保已安装Node.js和npm"
    echo "   4. 运行此脚本: bash build-macos-test.sh"
    exit 0
fi

# 构建macOS应用
echo "🍎 正在构建macOS版本..."
if command -v electron-builder &> /dev/null; then
    electron-builder --mac --config
else
    npx electron-builder --mac --config
fi

echo "✅ macOS版本构建完成！"
echo "📦 应用包位于 dist/ 目录中"
echo ""
echo "🔍 检查输出文件："
ls -la dist/ || echo "⚠️  dist/ 目录可能为空"

# 恢复原始package.json（可选）
echo "🔄 构建完成，保留Electron配置用于后续构建"