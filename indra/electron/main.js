const { app, BrowserWindow, ipcMain, dialog, Notification, shell } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1024,
    minHeight: 700,
    title: 'INDRA — Sovereign AI Workbench',
    backgroundColor: '#0a0a0a',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webSecurity: true,
    },
  });

  const appUrl = process.env.APP_URL || 'http://localhost:3000';
  mainWindow.loadURL(appUrl);

  // Prevent navigation to non-localhost URLs (Air-Gap loopback guarantee)
  mainWindow.webContents.on('will-navigate', (event, url) => {
    const parsed = new URL(url);
    if (parsed.hostname !== 'localhost' && parsed.hostname !== '127.0.0.1') {
      event.preventDefault();
      console.warn(`[AIR-GAP IPC BLOCKED] Egress navigation to ${url} strictly aborted.`);
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// IPC Handlers
ipcMain.handle('dialog:openFile', async (event, options = {}) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  const result = await dialog.showOpenDialog(win, {
    title: options.title || 'Select Engineering Documents for Knowledge Base',
    defaultPath: options.defaultPath,
    buttonLabel: options.buttonLabel || 'Select Documents',
    filters: options.filters || [
      { name: 'Engineering Documents', extensions: ['pdf', 'docx', 'xlsx', 'csv', 'txt', 'png', 'jpg', 'jpeg'] },
      { name: 'P&ID Diagrams', extensions: ['png', 'jpg', 'jpeg', 'svg', 'pdf'] },
      { name: 'All Files', extensions: ['*'] },
    ],
    properties: options.properties || ['openFile', 'multiSelections'],
  });

  if (result.canceled) {
    return { canceled: true, filePaths: [] };
  }
  return { canceled: false, filePaths: result.filePaths };
});

ipcMain.handle('fs:readFile', async (event, filePath) => {
  try {
    const stats = await fs.promises.stat(filePath);
    const buffer = await fs.promises.readFile(filePath);
    const fileName = path.basename(filePath);
    const ext = path.extname(filePath).toLowerCase();

    const mimeTypes = {
      '.pdf': 'application/pdf',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.csv': 'text/csv',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.svg': 'image/svg+xml',
      '.txt': 'text/plain',
    };

    return {
      success: true,
      name: fileName,
      path: filePath,
      size: stats.size,
      mtime: stats.mtime.toISOString(),
      mimeType: mimeTypes[ext] || 'application/octet-stream',
      base64: buffer.toString('base64'),
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('notification:show', (event, { title, body, silent = false }) => {
  if (Notification.isSupported()) {
    const iconPath = path.join(__dirname, '../public/logo.png');
    const notification = new Notification({
      title: title || 'INDRA Workbench',
      body: body || '',
      icon: fs.existsSync(iconPath) ? iconPath : undefined,
      silent,
    });
    notification.show();
    return { success: true };
  }
  return { success: false, error: 'Notifications not supported' };
});

ipcMain.handle('app:getInfo', () => ({
  platform: process.platform,
  arch: process.arch,
  version: app.getVersion(),
  isAirGapped: true,
  loopbackUrl: 'http://127.0.0.1:8000',
  electronVersion: process.versions.electron,
  nodeVersion: process.versions.node,
}));

ipcMain.handle('shell:openPath', async (event, targetPath) => {
  return await shell.openPath(targetPath);
});

// App Lifecycle
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
