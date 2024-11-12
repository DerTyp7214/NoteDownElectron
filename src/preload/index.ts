import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import pkg from 'custom-electron-titlebar'

const { Titlebar, TitlebarColor } = pkg

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}

window.addEventListener('DOMContentLoaded', () => {
  // Title bar implementation
  new Titlebar({
    backgroundColor: TitlebarColor.TRANSPARENT,
    menuBarBackgroundColor: TitlebarColor.TRANSPARENT
  })
})
