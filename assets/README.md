# 资源文件说明

此目录包含macOS应用构建所需的资源文件。

## 必需文件

### icon.icns
- 应用程序图标文件
- 格式：ICNS (macOS图标格式)
- 包含多种尺寸：16x16, 32x32, 64x64, 128x128, 256x256, 512x512, 1024x1024

### dmg-background.png
- DMG安装盘背景图像
- 推荐尺寸：600x400像素
- 透明或白色背景效果最佳

## 如何创建ICNS文件

如果您没有ICNS文件，可以通过以下方式创建：

### 使用在线转换工具
1. 准备一个高分辨率的PNG文件（建议1024x1024）
2. 使用在线工具如：https://cloudconvert.com/png-to-icns
3. 上传PNG文件并转换为ICNS格式

### 使用命令行工具
```bash
# 安装icnsutils
brew install icnsutils

# 创建临时目录
mkdir icon.src
sips -z 16 16     icon.png --out icon.src/icon_16x16.png
sips -z 32 32     icon.png --out icon.src/icon_16x16@2x.png
sips -z 64 64     icon.png --out icon.src/icon_32x32@2x.png
sips -z 128 128   icon.png --out icon.src/icon_128x128.png
sips -z 256 256   icon.png --out icon.src/icon_128x128@2x.png
sips -z 512 512   icon.png --out icon.src/icon_256x256@2x.png
sips -z 512 512   icon.png --out icon.src/icon_512x512.png
sips -z 1024 1024 icon.png --out icon.src/icon_512x512@2x.png

# 创建ICNS文件
iconutil -c icns icon.src -o icon.icns
```

## 替代方案

如果您暂时没有合适的图标文件，构建脚本会创建占位符文件，应用仍可正常构建，但会使用默认Electron图标。