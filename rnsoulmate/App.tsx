import React, { useEffect, useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, ScrollView } from 'react-native';
import { useColorScheme as useDeviceColorMode } from 'react-native';
import { Platform } from 'react-native';

import { LoggerFactory } from './src/internal/logger/logger';
import { OS } from './src/internal/system';

import Post from './src/components/post';
import Header from './src/components/header';
import { ColorModeManager } from './src/components/ui/color-mode-manager';

const logger = LoggerFactory.getLogger('App');

// 创建颜色模式管理器
const colorModeManager = new ColorModeManager();

const App = () => {
  // 获取当前操作系统
  const currentPlatform = Platform.OS;
  logger.info(`App is running on platform: ${currentPlatform}`);

  // 获取当前设备颜色模式
  const deviceColorMode = useDeviceColorMode();

  // 获取用户颜色模式（当前颜色模式为 auto 时，监听设备颜色，否则使用用户颜色模式）
  const [colorMode, setColorMode] = useState(colorModeManager.current());
  useEffect(() => {
    setColorMode(colorModeManager.current());
  }, [deviceColorMode])

  const switchColorMode = () => setColorMode(colorModeManager.switch())

  // 注册监听 Ctrl+M 键，切换颜色模式
  useEffect(() => {
    if (Platform.OS === OS.Web) {
      logger.info('Ctrl+M to switch color mode');
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.ctrlKey && event.key === 'm') {
          switchColorMode();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [])

  return (
    <SafeAreaView style={[styles.body, styles[colorMode]]}>
        <Header colorMode={colorMode} />
        <ScrollView>
          <Post content='This is a post!如果子组件的 backgroundColor 与父组件相同，且边框宽度较细，可能会被背景色 “覆盖” 视觉效果（实际边框存在，但颜色与背景融合）。' attachments={[{ url: 'https://cdn.pixabay.com/photo/2025/05/23/06/35/sparrow-9617024_1280.jpg' }, { url: 'https://cdn.pixabay.com/photo/2025/05/23/06/35/sparrow-9617024_1280.jpg' }]}
            colorMode={colorMode} />
          <Post content='This is a post!' attachments={[{ url: 'https://cdn.pixabay.com/photo/2025/05/23/06/35/sparrow-9617024_1280.jpg' }, { url: 'https://cdn.pixabay.com/photo/2025/05/23/06/35/sparrow-9617024_1280.jpg' }]}
            colorMode={colorMode} />
          <Post content='This is a post!' attachments={[{ url: 'https://cdn.pixabay.com/photo/2025/05/23/06/35/sparrow-9617024_1280.jpg' }, { url: 'https://cdn.pixabay.com/photo/2025/05/23/06/35/sparrow-9617024_1280.jpg' }]}
            colorMode={colorMode} />
          <Post content='This is a post!' attachments={[{ url: 'https://cdn.pixabay.com/photo/2025/05/23/06/35/sparrow-9617024_1280.jpg' }]}
            colorMode={colorMode} />
          <Post content='This is a post!' attachments={[{ url: 'https://cdn.pixabay.com/photo/2025/05/23/06/35/sparrow-9617024_1280.jpg' }]}
            colorMode={colorMode} />
          <Post content='This is a post!' attachments={[{ url: 'https://cdn.pixabay.com/photo/2025/05/23/06/35/sparrow-9617024_1280.jpg' }]}
            colorMode={colorMode} />
        </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'stretch',
    // 为安卓设备添加等于状态栏高度的上边距
    paddingTop: Platform.OS === OS.Android ? StatusBar.currentHeight : 0
  },
  light: {
    backgroundColor: 'rgb(255, 255, 255)', // 白色背景，适合浅色模式
  },
  dark: {
    backgroundColor: 'rgb(20, 20, 20)', // 深灰色背景，适合深色模式
  }
});

export default App;