import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useColorScheme as useDeviceColorMode } from 'react-native';
import { Platform } from 'react-native';

import { LoggerFactory } from './src/internal/logger/logger';
import { OS } from './src/internal/system';

import MainText from './src/components/main-text';
import Post from './src/components/post';
import { ColorModeManager } from './src/components/ui/color-mode-manager';

import { colorMode as settingColorMode } from './app.json';

const logger = LoggerFactory.getLogger('App');

// 创建颜色模式管理器
const colorModeManager = new ColorModeManager(settingColorMode);

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
      <MainText text='Hello, World!' colorMode={colorMode} />
      <MainText text={"My React Native App is running on the " + currentPlatform + "!"} colorMode={colorMode} />
      <MainText text={"Current color mode is " + colorMode + "!"} colorMode={colorMode} />
      <Post content='This is a post!' attachments={[{url:'https://cdn.pixabay.com/photo/2025/05/23/06/35/sparrow-9617024_1280.jpg'}]}
        colorMode={colorMode} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  light: {
    backgroundColor: 'rgb(255, 255, 255)', // 白色背景，适合浅色模式
  },
  dark: {
    backgroundColor: 'rgb(20, 20, 20)', // 深灰色背景，适合深色模式
  }
});

export default App;