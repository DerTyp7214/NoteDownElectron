import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
// @ts-ignore
import notedownViteConfig from './src/renderer/vite.config'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    ...notedownViteConfig as any
  }
})
