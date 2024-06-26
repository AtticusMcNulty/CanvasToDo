const { Tray, Menu, nativeImage } = require('electron');
const path = require('path');

class TrayGenerator {
  constructor(mainWindow) {
    this.tray = null;
    this.mainWindow = mainWindow;
  }

  getWindowPosition = () => {
    const windowBounds = this.mainWindow.getBounds();
    const trayBounds = this.tray.getBounds();
    // const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2));
    // const y = Math.round(trayBounds.y + trayBounds.height);
    const x = Math.round(trayBounds.x);
    const y = Math.round(trayBounds.y);
    return { x, y };
  };

  showWindow = () => {
    const position = this.getWindowPosition();
    this.mainWindow.setPosition(position.x, position.y, false);
    this.mainWindow.show();
    this.mainWindow.setVisibleOnAllWorkspaces(true);
    this.mainWindow.focus();
    this.mainWindow.setVisibleOnAllWorkspaces(false);
  };

  toggleWindow = () => {
    if (this.mainWindow.isVisible()) {
      this.mainWindow.hide();
    } else {
      this.showWindow();
    }
  };

  rightClickMenu = () => {
    const menu = [
      {
        role: 'quit',
        accelerator: 'Command+Q'
      }
    ];
    this.tray.popUpContextMenu(Menu.buildFromTemplate(menu));
  }

  createTray = () => {
    let icon = nativeImage.createFromPath(path.join(__dirname, './icon.icns'));
    icon = icon.resize({ width: 22, height: 22 });

    this.tray = new Tray(icon);
    this.tray.setIgnoreDoubleClickEvents(true);

    this.tray.on('click', this.toggleWindow);
    this.tray.on('right-click', this.rightClickMenu);
  }
}

module.exports = TrayGenerator;