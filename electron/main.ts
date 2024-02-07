import { BrowserWindow, app, ipcMain } from 'electron';
import path from 'node:path';

import * as dbm from './data/database-manager';

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist');
process.env.VITE_PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, '../public');

let win: BrowserWindow | null;
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'));
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    win = null;
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(createWindow);

ipcMain.handle('/calcutta/get', (_, args) => {
  return dbm.getCalcutta(args.day);
});

ipcMain.handle('/calcutta/sample/get', () => {
  return dbm.getCalcuttaSample();
});

ipcMain.handle('/calcutta/teams/holes/get', (_, args) => {
  return dbm.getCalcuttaTeamHoles(args.day, args.scoreType, args.aPlayerId, args.bPlayerId);
});

ipcMain.handle('/deuces/get', (_, args) => {
  return dbm.getDeuces(args.day);
});

ipcMain.handle('/holes/get', () => {
  return dbm.getHoles();
});

ipcMain.handle('/payballs/get', (_, args) => {
  return dbm.getPayballs(args.day);
});

ipcMain.handle('/players/get', () => {
  return dbm.getPlayers();
});

ipcMain.handle('/rounds/get', (_, args) => {
  return dbm.getRounds(args.day);
});

ipcMain.handle('/rounds/post', (_, args) => {
  return dbm.saveRound(args.round);
});

ipcMain.handle('/scores/get', (_, args) => {
  return dbm.getScores(args.day, args.scoreType, args.playerId);
});
