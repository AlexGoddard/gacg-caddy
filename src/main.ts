import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';

import * as dbm from './data/database-manager';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// Calcutta

ipcMain.handle('/calcutta/teams/post', (_, args) => {
  return dbm.createCalcuttaTeam(args.aPlayerId, args.bPlayerId);
});

ipcMain.handle('/calcutta/get', (_, args) => {
  return dbm.getCalcutta(args.day);
});

ipcMain.handle('/calcutta/sample/get', () => {
  return dbm.getCalcuttaSample();
});

ipcMain.handle('/calcutta/teams/holes/get', (_, args) => {
  return dbm.getCalcuttaTeamHoles(
    args.day,
    args.scoreType,
    args.aPlayerId,
    args.bPlayerId,
  );
});

ipcMain.handle('/calcutta/teams/delete', (_, args) => {
  return dbm.deleteCalcuttaTeam(args.playerId);
});

// Games

ipcMain.handle('/games/deuces/get', (_, args) => {
  return dbm.getDeuces(args.day);
});

ipcMain.handle('/games/payballs/get', (_, args) => {
  return dbm.getPayballs(args.day);
});

// Holes

ipcMain.handle('/holes/get', () => {
  return dbm.getHoles();
});

// Players

ipcMain.handle('/players/post', (_, args) => {
  return dbm.createPlayer(args.player);
});

ipcMain.handle('/players/get', () => {
  return dbm.getPlayers();
});

ipcMain.handle('/players/available/get', (_, args) => {
  return dbm.getAvailablePartners(args.division);
});

ipcMain.handle('/players/partner/get', (_, args) => {
  return dbm.getPartner(args.playerId);
});

ipcMain.handle('/players/put', (_, args) => {
  return dbm.updatePlayer(args.player);
});

ipcMain.handle('/players/delete', (_, args) => {
  return dbm.deletePlayer(args.playerId);
});

// Scores

ipcMain.handle('/rounds/post', (_, args) => {
  return dbm.addRound(args.round);
});

ipcMain.handle('/rounds/get', (_, args) => {
  return dbm.getRounds(args.day, args.playerId);
});

ipcMain.handle('/scores/get', (_, args) => {
  return dbm.getScores(args.day, args.scoreType, args.playerId);
});

ipcMain.handle('/rounds/put', (_, args) => {
  return dbm.updateRound(args.round);
});
