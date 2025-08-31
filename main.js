// main.js - Electron Main Process
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      // In a real app, you'd use a preload script for security.
      // For this simple wrapper, we'll keep it basic.
      contextIsolation: true,
    },
    title: "PraxisOS (Omega) - Live",
  });

  // Load the index.html of the app.
  mainWindow.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});