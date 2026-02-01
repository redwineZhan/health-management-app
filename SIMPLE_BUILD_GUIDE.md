# 简易构建指南

## 构建Health Management App macOS版本

### 1. 环境准备
```bash
# 确保安装了Node.js
node --version

# 安装Electron构建工具
npm install -g electron-builder
```

### 2. 项目依赖安装
```bash
# 安装主项目依赖
npm install

# 安装前端依赖
cd client
npm install
npm run build
cd ..

# 安装Electron相关依赖
npm install electron electron-builder electron-squirrel-startup electron-is-dev --save-dev
```

### 3. 构建macOS应用
```bash
# 构建macOS版本（DMG格式）
npx electron-builder --mac

# 或者使用提供的构建脚本
chmod +x build-macos.sh
./build-macos.sh
```

### 4. 输出位置
构建完成后，应用包将位于 `dist/` 目录中：
- `dist/Health Management App-x.x.x.dmg` - 可安装的DMG文件
- `dist/mac/Health Management App.app` - 应用程序包

### 5. 测试应用
1. 双击DMG文件挂载
2. 将应用拖拽到Applications文件夹
3. 首次运行可能需要在系统偏好设置中允许应用运行