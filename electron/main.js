const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const isDev = process.env.NODE_ENV === 'development';

ipcMain.on('app:quit', () => {
  app.quit();
});

const STRATEGIES_PATH = path.join(app.getPath('userData'), 'strategies');

// Ensure strategies directory exists
if (!fs.existsSync(STRATEGIES_PATH)) {
  fs.mkdirSync(STRATEGIES_PATH, { recursive: true });
}

ipcMain.handle('library:save', async (event, filename, data) => {
  const filePath = path.join(STRATEGIES_PATH, filename.endsWith('.ovb') ? filename : `${filename}.ovb`);
  fs.writeFileSync(filePath, data);
  return filePath;
});

ipcMain.handle('library:list', async () => {
  const files = fs.readdirSync(STRATEGIES_PATH);
  return files
    .filter(file => file.endsWith('.ovb'))
    .map(file => {
      const stats = fs.statSync(path.join(STRATEGIES_PATH, file));
      const content = fs.readFileSync(path.join(STRATEGIES_PATH, file), 'utf-8');
      try {
        const data = JSON.parse(content);
        return {
          id: file,
          name: file.replace('.ovb', ''),
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
  const filePath = path.join(STRATEGIES_PATH, filename);
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

  if (isDev) {
    // Development mode: load from Next.js dev server
    // Use 127.0.0.1 to avoid IPv6 localhost resolution issues on Windows
    const devUrl = 'http://127.0.0.1:3001';

    const loadWithRetry = () => {
      mainWindow.loadURL(devUrl).catch(() => {
        console.log('Failed to connect to dev server, retrying in 2s...');
        setTimeout(loadWithRetry, 2000);
      });
    };

    loadWithRetry();
    mainWindow.webContents.openDevTools();
  } else {
    // Production mode: load from built files
    mainWindow.loadFile(path.join(__dirname, '../out/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

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
