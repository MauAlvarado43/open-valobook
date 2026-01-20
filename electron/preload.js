const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  platform: process.platform,
  quitApp: () => ipcRenderer.send('app:quit'),
  saveFileDialog: (data, isImage) => ipcRenderer.invoke('file:save-dialog', data, isImage),
  openFileDialog: () => ipcRenderer.invoke('file:open-dialog'),
  saveToLibrary: (filename, data) => ipcRenderer.invoke('library:save', filename, data),
  listLibrary: () => ipcRenderer.invoke('library:list'),
  deleteFromLibrary: (filename) => ipcRenderer.invoke('library:delete', filename),
});
