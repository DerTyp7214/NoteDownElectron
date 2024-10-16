import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
// @ts-ignore
/*import { existsSync } from 'fs'

let notedownViteConfig = {}
if (existsSync('./src/renderer/vite.config')) {
  // @ts-ignore
  notedownViteConfig = import('./src/renderer/vite.config')
}*/

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    plugins: [svelte()]
  }
})
