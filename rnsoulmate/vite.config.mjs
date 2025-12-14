// vite 配置文件，仅在 Web 环境使用

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  // 设置项目的模块解析
  root: 'web',
  // 配置插件
  plugins: [react(), viteSingleFile()],
  resolve: {
    // 添加别名，将 'react-native' 指向 'react-native-web'
    alias: {
      'react-native': 'react-native-web',
    },
    // 配置扩展名解析顺序
    // 确保 '.web.tsx' 和 '.web.js' 在通用扩展名之前
    extensions: [
      '.web.tsx',
      '.web.ts',
      '.web.jsx',
      '.web.js',
      '.tsx',
      '.ts',
      '.jsx',
      '.js',
      '.json',
    ],
    build: { // 构建单体 HTML
    // 1. Force Vite to inline assets (images, fonts, etc.) smaller than this limit.
    // Set to a large number (e.g., 100MB) to ensure everything is inlined.
    assetsInlineLimit: 100000000, // 100MB
    // 2. Ensure CSS code splitting is disabled so it can be inlined properly.
    cssCodeSplit: false,
  },
  },
});