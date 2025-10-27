import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { Platform } from 'react-native';

import { LoggerFactory } from './src/internal/logger/logger';
import { OS } from './src/internal/system';
import { AliOssFileSystem } from './src/internal/filesystem/ali-oss-fs';
import config from './config.json';

import MainWindow from './src/components/main-window';
import { ColorModeManager } from './src/components/ui/color-mode-manager';
import { WindowDimensionManager } from './src/components/ui/window-dimension-manager';

const logger = LoggerFactory.getLogger('App');

// 创建颜色模式管理器
const colorModeManager = new ColorModeManager();
// 创建窗口尺寸管理器
const windowDimensionManager = new WindowDimensionManager();

const fs = new AliOssFileSystem(config['ali-oss']);

const App = () => {
  const colorMode = colorModeManager.useValue();
  const windowDimension = windowDimensionManager.useValue();

  return (
    <SafeAreaView style={styles.body}>
        <MainWindow colorMode={colorMode} height={windowDimension.height} width={windowDimension.width} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'stretch',
    // 为安卓设备添加等于状态栏高度的上边距
    paddingTop: Platform.OS === OS.Android ? StatusBar.currentHeight : 0
  }
});

export default App;