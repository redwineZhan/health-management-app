# Health Management App - macOS版本构建指南

本指南详细介绍如何构建和测试Health Management App的macOS版本。

## 目录
1. [前提条件](#前提条件)
2. [构建步骤](#构建步骤)
3. [测试步骤](#测试步骤)
4. [常见问题](#常见问题)

## 前提条件

在构建macOS版本之前，请确保满足以下要求：

### 系统要求
- macOS 10.15 (Catalina) 或更高版本
- Xcode Command Line Tools
- Node.js 16.x 或更高版本
- npm 8.x 或更高版本

### 安装Xcode Command Line Tools
```bash
xcode-select --install
```

### 安装Node.js
推荐使用Node Version Manager (nvm)：
```bash
# 安装nvm（如果未安装）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 重启终端或运行
source ~/.bashrc

# 安装并使用最新LTS版本的Node.js
nvm install --lts
nvm use --lts
```

## 构建步骤

### 1. 克隆或更新项目
```bash
git clone https://github.com/redwineZhan/health-management-app.git
cd health-management-app
```

### 2. 设置构建环境
```bash
chmod +x build-macos.sh
```

### 3. 运行构建脚本
```bash
./build-macos.sh
```

### 4. 构建过程说明
构建脚本会执行以下操作：
- 安装必要的Electron依赖
- 构建前端React应用
- 创建Electron桌面应用包
- 生成macOS DMG安装文件

### 5. 输出文件
构建完成后，macOS应用将位于 `dist/` 目录中：
- `dist/Health Management App-x.x.x.dmg` - DMG安装文件
- `dist/mac/Health Management App.app` - 应用程序包

## 测试步骤

### 1. 安装应用
双击DMG文件并将其拖拽到Applications文件夹中。

### 2. 首次启动
首次启动时可能会遇到"无法打开，因为Apple无法检查其是否包含恶意软件"的提示：
1. 打开"系统偏好设置" > "安全性与隐私"
2. 在"通用"标签页中点击"仍要打开"
3. 再次尝试启动应用

### 3. 功能测试
启动应用后，请测试以下功能：

#### 用户认证
- [ ] 注册新用户
- [ ] 登录现有用户
- [ ] 密码重置功能

#### 健康指标跟踪
- [ ] 添加新的健康指标
- [ ] 查看历史趋势图表
- [ ] 设置健康提醒

#### 减重指导
- [ ] 创建减重计划
- [ ] 记录日常习惯
- [ ] 查看TCM建议

#### 社区功能
- [ ] 浏览健康社区
- [ ] 发布帖子
- [ ] 加入训练营

#### 系统性能
- [ ] 应用启动时间
- [ ] 页面加载速度
- [ ] 数据同步稳定性

## 配置文件说明

### main.js
Electron主进程文件，负责：
- 创建浏览器窗口
- 管理应用程序生命周期
- 处理原生操作系统交互

### preload.js
预加载脚本，用于：
- 安全地暴露API给渲染进程
- 处理IPC通信
- 管理上下文隔离

### package.json
Electron应用配置，包含：
- 构建配置
- 应用元数据
- macOS特定设置

## 自定义选项

### 更换应用图标
1. 准备ICNS格式的应用图标
2. 替换 `assets/icon.icns` 文件
3. 重新运行构建脚本

### 修改应用信息
编辑 `package.json` 中的以下字段：
- `productName` - 应用名称
- `description` - 应用描述
- `build.mac.category` - 应用分类

## 常见问题

### 1. 构建失败
**问题**: electron-builder构建失败
**解决方案**:
- 确保有足够的磁盘空间
- 清除npm缓存: `npm cache clean --force`
- 删除node_modules并重新安装: `rm -rf node_modules && npm install`

### 2. 应用无法启动
**问题**: 应用启动后立即崩溃
**解决方案**:
- 检查控制台日志: `Console.app` 中查看错误信息
- 确保后端服务正在运行
- 检查网络连接

### 3. 安全警告
**问题**: macOS阻止应用运行
**解决方案**:
- 按照"首次启动"部分的说明操作
- 或使用终端运行: `sudo xattr -rd com.apple.quarantine /Applications/Health\ Management\ App.app`

### 4. 前端资源缺失
**问题**: 应用界面显示空白
**解决方案**:
- 确保前端已正确构建
- 检查 `index.html` 和静态资源路径

## 开发调试

### 启用开发模式
```bash
npm start
```

### 打开开发者工具
- 菜单栏: View > Toggle Developer Tools
- 快捷键: Option+Cmd+I

## 发布版本

### 代码签名 (可选)
对于分发给其他用户，建议进行代码签名：
```bash
# 需要Apple开发者证书
npx electron-builder --mac --publish=always
```

### 版本管理
更新 `package.json` 中的版本号：
```json
{
  "version": "1.0.1"
}
```

## 支持

如果遇到问题，请：
1. 检查GitHub Issues
2. 提交新的Issue
3. 查看构建日志获取详细错误信息

---

构建完成后，您就可以在macOS上测试Health Management App的桌面版本了！