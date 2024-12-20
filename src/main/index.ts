import { app, BrowserWindow, ipcMain, Menu, nativeImage, shell } from 'electron'
import path, { join } from 'path'
import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { attachTitlebarToWindow, setupTitlebar } from 'custom-electron-titlebar/main'
import { electronAppUniversalProtocolClient } from 'electron-app-universal-protocol-client'

if (!app.requestSingleInstanceLock()) {
  app.exit(0)
}

setupTitlebar()

const appIcon = nativeImage.createFromPath(path.join('..', '..', 'resources', 'icon.png'))
app.setName('NoteDown')

async function createWindow(): Promise<BrowserWindow> {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1025,
    height: 720,
    show: false,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    titleBarOverlay: false,
    icon: appIcon,
    title: 'NoteDown',
    transparent: true,
    vibrancy: 'fullscreen-ui', // on MacOS
    backgroundMaterial: 'acrylic', // on Windows 11
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    if (
      (details.url.startsWith('https://notedown') && details.url.includes('firebaseapp.com')) ||
      details.url.startsWith('https://notedown.dev/privacy') ||
      details.url.startsWith('https://notedown.dev/deletion')
    ) {
      return {
        action: 'allow',
        outlivesOpener: false,
        overrideBrowserWindowOptions: {
          frame: !details.url.includes('firebaseapp.com'),
          autoHideMenuBar: true,
          titleBarStyle: 'hidden',
          titleBarOverlay: false,
          icon: appIcon,
          transparent: true,
          vibrancy: 'fullscreen-ui', // on MacOS
          backgroundMaterial: 'acrylic', // on Windows 11
          webPreferences: {
            preload: join(__dirname, '../preload/index.mjs'),
            sandbox: false
          }
        }
      }
    }
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  mainWindow.webContents.on('will-navigate', async (event) => {
    const url = new URL(event.url)
    if (url.host !== 'notedown') {
      event.preventDefault()
      await shell.openExternal(event.url)
    }
  })

  mainWindow.on('enter-full-screen', () => {
    mainWindow.webContents.send('maximized', 'true')
  })

  mainWindow.on('leave-full-screen', () => {
    mainWindow.webContents.send('maximized', 'false')

    setTimeout(() => {
      const size = mainWindow.getSize()
      mainWindow.setSize(size[0], size[1] + 1, true) // TODO: scuffed
    }, 100)
  })

  await mainWindow.loadURL('https://notedown.dev')

  if (is.dev) {
    await mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  }

  mainWindow.isFullScreen()

  return mainWindow
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('dev.notedown')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  const mainWindow = await createWindow()

  const dockMenu = Menu.buildFromTemplate([
    {
      label: 'New Note',
      accelerator: 'CmdOrCtrl+N',
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      click() {
        mainWindow.webContents.send('new-note')
      }
    }
  ])

  if (process.platform === 'darwin') {
    app.dock.setMenu(dockMenu)
  }

  Menu.setApplicationMenu(
    Menu.buildFromTemplate([
      {
        label: 'NoteDown',
        submenu: Menu.buildFromTemplate([
          {
            label: `About ${app.name}`,
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            click() {
              mainWindow.webContents.send('about')
            }
          },
          {
            label: 'Versions',
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            click() {
              mainWindow.webContents.send('versions')
            }
          },
          {
            type: 'separator'
          },
          {
            label: 'Save Note',
            accelerator: 'CmdOrCtrl+S',
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            click() {
              mainWindow.webContents.send('save-note')
            }
          },
          ...dockMenu.items,
          {
            label: 'Discard Note',
            accelerator: 'CmdOrCtrl+D',
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            click() {
              mainWindow.webContents.send('discard-note')
            }
          },
          {
            label: 'Toggle Preview',
            accelerator: 'CmdOrCtrl+P',
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            click() {
              mainWindow.webContents.send('toggle-preview')
            }
          },
          {
            type: 'separator'
          },
          {
            role: 'reload'
          },
          {
            role: 'forceReload'
          },
          {
            type: 'separator'
          },
          {
            role: 'quit'
          }
        ])
      },
      {
        role: 'windowMenu'
      },
      {
        label: null as never
      },
      {
        label: null as never
      }
    ])
  )

  attachTitlebarToWindow(mainWindow)

  ipcMain.on('appVersion', (event) => (event.returnValue = app.getVersion()))

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  electronAppUniversalProtocolClient.on('request', async (requestUrl) => {
    const url = new URL(requestUrl)
    if (url.protocol === 'notedown:' && url.host) {
      if (!mainWindow.isVisible()) mainWindow.restore()
      mainWindow.webContents.send('open-note', url.host)
    }
  })

  await electronAppUniversalProtocolClient.initialize({
    protocol: 'notedown',
    mode: is.dev ? 'development' : 'production' // Make sure to use 'production' when script is executed in bundled app
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
