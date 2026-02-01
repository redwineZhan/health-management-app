// preload.js
const { contextBridge, ipcRenderer } = require('electron');

// 安全地暴露API给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 示例API - 根据需要添加更多功能
  setTitle: (title) => ipcRenderer.invoke('set-title', title),
  
  // 打开外部链接
  openExternal: (url) => shell.openExternal(url),
  
  // 获取应用信息
  getAppInfo: () => ipcRenderer.invoke('get-app-info'),
  
  // 文件操作API
  selectDirectory: () => ipcRenderer.invoke('select-directory'),
  saveFile: (content, options) => ipcRenderer.invoke('save-file', content, options),
  
  // 系统通知
  showNotification: (options) => ipcRenderer.invoke('show-notification', options)
});