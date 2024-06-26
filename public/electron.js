const TrayGenerator = require('./tray');

const { app, BrowserWindow } = require('electron');
const path = require("path");

let mainWindow = null;
let preventHide = false;

function createMainWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 400,
    height: 550,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    webPreferences: { nodeIntegration: true, contextIsolation: false },
  });

  // and load the index.html of the app
  mainWindow.loadFile(path.join(__dirname, "../build/index.html"));
  // mainWindow.webContents.openDevTools();
}

// method called when Electron has finished init and is ready to create browser windows
// some APIs can only be used after this event occurs
app.on('ready', () => {
  createMainWindow();
  const Tray = new TrayGenerator(mainWindow);
  Tray.createTray();
});

app.dock.hide();