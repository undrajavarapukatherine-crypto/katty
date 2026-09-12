const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  openFileDialog: (options) => ipcRenderer.invoke('dialog:openFile', options),
  readFile: (filePath) => ipcRenderer.invoke('fs:readFile', filePath),
  showNotification: (options) => ipcRenderer.invoke('notification:show', options),
  getAppInfo: () => ipcRenderer.invoke('app:getInfo'),
  openPath: (targetPath) => ipcRenderer.invoke('shell:openPath', targetPath),
});
