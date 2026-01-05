import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      // 修正ポイント: ここに base: './' を追加
      base: './',
      
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      // AIを使わないなら define 部分は削除してもOKですが、そのままでも動きます
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
