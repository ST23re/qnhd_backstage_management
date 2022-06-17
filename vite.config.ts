import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return defineConfig({
    plugins: [vue()],
    server: {
      host: '0.0.0.0',
      port: 8080,
      open: true,
      proxy: {//生产环境不生效
        '/api': {
          target: env.VITE_REQUEST_BASE_URL,
          changeOrigin: true,//跨域
          rewrite: (path) => path.replace(/^\/api/, '')//即在项目中可用'/api'代替target里面的地址
        }
      }
    },
    resolve: {
      alias: [
        {
          find: '@',
          replacement: resolve(__dirname, 'src')//@形式查找
        }
      ]
    }
  })
} 
