import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, ColorSchemeName, Button } from 'react-native';
import { useColorScheme as useDeviceColorMode } from 'react-native';
import { Platform } from 'react-native';

import { LoggerFactory } from './src/internal/logger/logger';
import { LoggingView } from './src/internal/logger/logging-view';

import MainText from './src/components/main-text';
import { ColorMode } from './src/internal/system';

import { colorMode as settingColorMode } from './app.json';

const logger = LoggerFactory.getLogger('App');

const App = () => {
  // 获取当前操作系统
  const currentPlatform = Platform.OS;
  logger.info(`App is running on platform: ${currentPlatform}`);

  // 获取当前设备颜色模式
  const deviceColorMode = useDeviceColorMode();
  logger.info(`Device color mode: ${deviceColorMode}`);

  // 获取用户颜色模式（当前颜色模式为 auto 时，监听设备颜色，否则使用用户颜色模式）
  const [colorMode, setColorMode] = useState(userColorMode(deviceColorMode));
  useEffect(()=>{
    logger.info('Device color mode changed to ' + deviceColorMode)
    setColorMode(userColorMode(deviceColorMode));
  }, [deviceColorMode])
  logger.info(`User color mode: ${colorMode}`);

  const switchColorMode = () => {
    logger.info(`Switching color mode from ${colorMode}`)
    if (settingColorMode !== 'auto') {
      if (colorMode === ColorMode.Dark) {
        logger.info(`Switching color mode to ${ColorMode.Light}`);
        setColorMode(ColorMode.Light);
      } else {
        logger.info(`Switching color mode to ${ColorMode.Dark}`);
        setColorMode(ColorMode.Dark);
      }
    }
  }
  useEffect(()=>{
    if (Platform.OS === 'web') {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.ctrlKey && event.key === 'm') {
          logger.info('Ctrl+M pressed');
          switchColorMode();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [switchColorMode])

  return (
    <SafeAreaView style={[styles.body, styles[colorMode]]}>
      <MainText text='Hello, World!' colorMode={colorMode} />
      <MainText text={"My React Native App is running on the " + currentPlatform  + "!"} colorMode={colorMode} />
      <MainText text={"Current color mode is " + colorMode  + "!"} colorMode={colorMode} />
      <Button onPress={switchColorMode} title="Switch" />
      <LoggingView />
    </SafeAreaView>
  );
};

function userColorMode(deviceColorMode:ColorSchemeName): ColorMode {
  if (settingColorMode === ColorMode.Dark) {
    return ColorMode.Dark;
  } else if (settingColorMode === ColorMode.Light) {
    return ColorMode.Light;
  } else {
    if (deviceColorMode === ColorMode.Dark) {
      return ColorMode.Dark;
    } else {
      return ColorMode.Light;
    }
  }
}

const styles = StyleSheet.create({
  body: {
  }, 
  light: {
    backgroundColor: '#FFFFFF', // 白色背景，适合浅色模式
  },
  dark: {
    backgroundColor: '#1E1E1E', // 深灰色背景，适合深色模式
  }
});

export default App;