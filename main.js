const { app, BrowserWindow, Menu, MenuItem, ipcMain, shell } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

// 主窗口创建函数
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    icon: path.join(__dirname, 'assets/icon.icns'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // 加载应用
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000'); // React开发服务器
  } else {
    mainWindow.loadFile('index.html'); // 生产构建文件
  }

  // 打开开发者工具（仅开发模式）
  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  // 处理外部链接在默认浏览器中打开
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  return mainWindow;
}

// 应用程序生命周期事件
app.whenReady().then(() => {
  const mainWindow = createWindow();

  // 创建菜单栏
  const menu = Menu.buildFromTemplate([
    ...(isDev ? [{
      label: 'Development',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { label: 'Open DevTools', click: () => mainWindow.webContents.openDevTools() }
      ]
    }] : []),
    {
      label: 'Application',
      submenu: [
        { label: 'About Health Management App', role: 'about' },
        { type: 'separator' },
        { label: 'Services', role: 'services' },
        { type: 'separator' },
        { label: 'Hide Health Management App', accelerator: 'Cmd+H', role: 'hide' },
        { label: 'Hide Others', accelerator: 'Cmd+Shift+H', role: 'hideOthers' },
        { label: 'Show All', role: 'unhide' },
        { type: 'separator' },
        { label: 'Quit', accelerator: 'Cmd+Q', click: () => app.quit() }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
        { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut' },
        { label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy' },
        { label: 'Paste', accelerator: 'CmdOrCtrl+V', role: 'paste' },
        { label: 'Select All', accelerator: 'CmdOrCtrl+A', role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { label: 'Reload', accelerator: 'CmdOrCtrl+R', click: () => mainWindow.reload() },
        { label: 'Toggle Full Screen', accelerator: 'Ctrl+Command+F', click: () => {
          mainWindow.setFullScreen(!mainWindow.isFullScreen());
        }},
        { label: 'Toggle Developer Tools', accelerator: 'Alt+CmdOrCtrl+I', click: () => {
          mainWindow.webContents.toggleDevTools();
        }}
      ]
    },
    {
      label: 'Window',
      submenu: [
        { label: 'Minimize', accelerator: 'CmdOrCtrl+M', role: 'minimize' },
        { label: 'Zoom', role: 'zoom' },
        ...(process.platform === 'darwin' ? [
          { type: 'separator' },
          { label: 'Bring All to Front', role: 'front' }
        ] : [])
      ]
    }
  ]);
  
  Menu.setApplicationMenu(menu);

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});