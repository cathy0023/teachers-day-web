import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // SPA 用 BrowserRouter,在任何 URL 下都从根加载 JS/CSS
  // 不写成 "./" 是因为那会让浏览器把相对路径拼到当前 URL 上
  base: '/',
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
})