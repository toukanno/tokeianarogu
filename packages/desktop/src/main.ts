import { app, BrowserWindow, Menu, Tray, nativeImage, ipcMain } from 'electron'
import * as path from 'path'
import * as fs from 'fs'

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 520,
    height: 620,
    minWidth: 400,
    minHeight: 480,
    resizable: true,
    frame: true,
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    backgroundColor: '#1a1a2e',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    icon: getIconPath(),
    title: '時計アナログ',
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    // In production, load the built web app from resources
    const webPath = path.join(process.resourcesPath, 'web', 'index.html')
    if (fs.existsSync(webPath)) {
      mainWindow.loadFile(webPath)
    } else {
      // Fallback: look next to the app
      const fallback = path.join(__dirname, '../../web/dist/index.html')
      mainWindow.loadFile(fallback)
    }
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // Prevent default title bar context menu on some platforms
  mainWindow.webContents.on('context-menu', (e) => e.preventDefault())
}

function getIconPath(): string | undefined {
  const base = path.join(__dirname, '../../assets')
  if (process.platform === 'darwin') {
    const p = path.join(base, 'icon.icns')
    return fs.existsSync(p) ? p : undefined
  } else if (process.platform === 'win32') {
    const p = path.join(base, 'icon.ico')
    return fs.existsSync(p) ? p : undefined
  }
  const p = path.join(base, 'icon.png')
  return fs.existsSync(p) ? p : undefined
}

function createTray() {
  const iconPath = getIconPath()
  if (!iconPath) return

  const icon = nativeImage.createFromPath(iconPath)
  tray = new Tray(icon.resize({ width: 16, height: 16 }))

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '時計アナログを開く',
      click: () => {
        if (mainWindow) {
          mainWindow.show()
          mainWindow.focus()
        } else {
          createWindow()
        }
      },
    },
    { type: 'separator' },
    { label: '終了', role: 'quit' },
  ])

  tray.setToolTip('時計アナログ')
  tray.setContextMenu(contextMenu)
  tray.on('click', () => {
    if (mainWindow) {
      mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
    }
  })
}

function createAppMenu() {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: '時計アナログ',
      submenu: [
        { label: 'このアプリについて', role: 'about' },
        { type: 'separator' },
        { label: '終了', role: 'quit' },
      ],
    },
    {
      label: '表示',
      submenu: [
        { label: '拡大', role: 'zoomIn' },
        { label: '縮小', role: 'zoomOut' },
        { label: '実際のサイズ', role: 'resetZoom' },
        { type: 'separator' },
        { label: 'フルスクリーン', role: 'togglefullscreen' },
      ],
    },
  ]

  if (isDev) {
    template.push({
      label: '開発',
      submenu: [
        { label: '再読み込み', role: 'reload' },
        { label: 'DevTools', role: 'toggleDevTools' },
      ],
    })
  }

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}

app.whenReady().then(() => {
  createWindow()
  createAppMenu()
  createTray()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// IPC handlers for future use
ipcMain.handle('get-platform', () => process.platform)
ipcMain.handle('get-version', () => app.getVersion())
