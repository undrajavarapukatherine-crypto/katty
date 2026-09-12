export interface FileDialogOptions {
  title?: string;
  defaultPath?: string;
  buttonLabel?: string;
  filters?: { name: string; extensions: string[] }[];
  properties?: ('openFile' | 'openDirectory' | 'multiSelections' | 'showHiddenFiles')[];
}

export interface NativeFileResult {
  success: boolean;
  name: string;
  path: string;
  size: number;
  mtime: string;
  mimeType: string;
  base64: string;
  error?: string;
}

export interface NativeNotificationOptions {
  title: string;
  body?: string;
  icon?: string;
  silent?: boolean;
}

export interface NativeAppInfo {
  platform: string;
  arch: string;
  version: string;
  isAirGapped: boolean;
  loopbackUrl: string;
  electronVersion?: string;
  nodeVersion?: string;
}

export interface ElectronAPI {
  isElectron: boolean;
  openFileDialog: (options?: FileDialogOptions) => Promise<{ canceled: boolean; filePaths: string[] }>;
  readFile: (filePath: string) => Promise<NativeFileResult>;
  showNotification: (options: NativeNotificationOptions) => Promise<{ success: boolean; error?: string }>;
  getAppInfo: () => Promise<NativeAppInfo>;
  openPath: (targetPath: string) => Promise<string>;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
