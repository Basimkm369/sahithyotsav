import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

export default ({ mode }: any) => {
  process.env = Object.assign(process.env, loadEnv(mode, process.cwd()))

  return defineConfig({
    plugins: [
      TanStackRouterVite({ autoCodeSplitting: true }),
      react({
        babel: {
          // plugins: [['babel-plugin-react-compiler', {}]],
        },
      }),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '/src'),
      },
    },
    server: {
      port: +(process.env.VITE_PORT || 3001),
      host: true,
    },
    build: {
      outDir: 'build',
    },
  })
}
