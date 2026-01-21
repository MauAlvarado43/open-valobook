const { app, BrowserWindow, ipcMain, dialog, protocol, net, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

const isDev = process.env.NODE_ENV === 'development';

// Register custom protocol for production
if (!isDev) {
  protocol.registerSchemesAsPrivileged([
    {
      scheme: 'app',
      privileges: {
        standard: true,
        secure: true,
        supportFetchAPI: true,
        allowServiceWorkers: true
      }
    }
  ]);
}

ipcMain.on('app:quit', () => {
  app.quit();
});

let strategiesPath = path.join(app.getPath('userData'), 'strategies');
const CONFIG_PATH = path.join(app.getPath('userData'), 'settings.json');

// Helper to get current strategies path from config
function getStrategiesPath() {
  if (fs.existsSync(CONFIG_PATH)) {
    try {
      const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
      if (config['openvalobook-store']?.storagePath) {
        return config['openvalobook-store'].storagePath;
      }
    } catch (e) { }
  }
  return strategiesPath;
}

// Ensure default directory exists
if (!fs.existsSync(strategiesPath)) {
  fs.mkdirSync(strategiesPath, { recursive: true });
}

// Config handlers
ipcMain.handle('config:get', async () => {
  if (fs.existsSync(CONFIG_PATH)) {
    try {
      const content = fs.readFileSync(CONFIG_PATH, 'utf-8');
      return JSON.parse(content);
    } catch (e) {
      console.error('Failed to parse config file', e);
      return {};
    }
  }
  return {};
});

ipcMain.handle('config:save', async (event, data) => {
  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(data, null, 2));
    return true;
  } catch (e) {
    console.error('Failed to save config file', e);
    return false;
  }
});

ipcMain.handle('library:save', async (event, filename, data) => {
  const currentPath = getStrategiesPath();
  if (!fs.existsSync(currentPath)) {
    fs.mkdirSync(currentPath, { recursive: true });
  }
  const filePath = path.join(currentPath, filename.endsWith('.ovb') ? filename : `${filename}.ovb`);
  fs.writeFileSync(filePath, data);
  return filePath;
});

ipcMain.handle('library:list', async () => {
  const currentPath = getStrategiesPath();
  if (!fs.existsSync(currentPath)) return [];
  const files = fs.readdirSync(currentPath);
  return files
    .filter(file => file.endsWith('.ovb'))
    .map(file => {
      const fullPath = path.join(currentPath, file);
      const stats = fs.statSync(fullPath);
      const content = fs.readFileSync(fullPath, 'utf-8');
      try {
        const data = JSON.parse(content);
        return {
          id: file,
          name: (data.canvasData && data.canvasData.name) || data.name || file.replace('.ovb', ''),
          mapName: data.mapName,
          side: data.side,
          updatedAt: stats.mtime,
          data: data
        };
      } catch {
        return null; // Skip corrupted files
      }
    })
    .filter(Boolean);
});

ipcMain.handle('library:delete', async (event, filename) => {
  const filePath = path.join(getStrategiesPath(), filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return true;
  }
  return false;
});

ipcMain.handle('file:save-dialog', async (event, data, isImage = false, format = 'ovb') => {
  const filters = [];
  if (format === 'png') filters.push({ name: 'PNG Image', extensions: ['png'] });
  else if (format === 'pdf') filters.push({ name: 'PDF Document', extensions: ['pdf'] });
  else filters.push({ name: 'OpenValoBook Strategy', extensions: ['ovb'] });

  const { filePath } = await dialog.showSaveDialog({
    title: isImage ? `Export as ${format.toUpperCase()}` : 'Save Strategy',
    defaultPath: `strategy.${format}`,
    filters: filters
  });

  if (filePath) {
    if (isImage || format === 'pdf') {
      // Data is a base64 string
      const base64Data = data.replace(/^data:.*;base64,/, "");
      fs.writeFileSync(filePath, base64Data, 'base64');
    } else {
      fs.writeFileSync(filePath, data);
    }
    return filePath;
  }
  return null;
});

ipcMain.handle('file:open-dialog', async () => {
  const { filePaths } = await dialog.showOpenDialog({
    title: 'Open Strategy',
    properties: ['openFile'],
    filters: [{ name: 'OpenValoBook Strategy', extensions: ['ovb'] }]
  });

  if (filePaths && filePaths.length > 0) {
    const content = fs.readFileSync(filePaths[0], 'utf-8');
    return { path: filePaths[0], content };
  }
  return null;
});

ipcMain.handle('file:select-directory', async () => {
  const { filePaths } = await dialog.showOpenDialog({
    title: 'Select Storage Folder',
    properties: ['openDirectory', 'createDirectory']
  });
  return filePaths && filePaths.length > 0 ? filePaths[0] : null;
});

if (isDev) {
  process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';
}

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, '../public/icon.png'),
    title: 'OpenValoBook - Valorant Strategy Planner',
  });

  // Hide the default menu bar
  mainWindow.setMenu(null);
  if (!isDev) {
    Menu.setApplicationMenu(null);
  }

  if (isDev) {
    // Development mode: load from Next.js dev server
    const devUrl = 'http://127.0.0.1:3001';
    const loadWithRetry = () => {
      mainWindow.loadURL(devUrl).catch(() => {
        setTimeout(loadWithRetry, 2000);
      });
    };
    loadWithRetry();
    mainWindow.webContents.openDevTools();
  } else {
    // Production mode: load via custom protocol
    mainWindow.loadURL('app://./index.html');
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  if (!isDev) {
    protocol.handle('app', (request) => {
      const url = request.url.substring(6); // remove 'app://'
      let filePath = path.join(__dirname, '../out', url);

      // Handle trailing slash and clean paths
      if (url.endsWith('/') || !url.includes('.')) {
        filePath = path.join(__dirname, '../out', url, 'index.html');
      }

      return net.fetch('file://' + filePath);
    });
  }

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
