import { SafeAreaView, StyleSheet } from 'react-native';

import MainWindow from './src/components/main-window';
import { ColorModeManager } from './src/components/ui/color-mode-manager';
import { WindowDimensionManager } from './src/components/ui/window-dimension-manager';
import { LoggerFactory } from './src/internal/logger/logger';
import { HttpAliOssFileSystem } from './src/internal/filesystem/http-ali-oss-fs';
import config from './config.json';

const logger = LoggerFactory.getLogger('App');

// 创建颜色模式管理器
const colorModeManager = new ColorModeManager();
// 创建窗口尺寸管理器
const windowDimensionManager = new WindowDimensionManager();

const fs = new HttpAliOssFileSystem(config['ali-oss']);

const App = () => {
  const path = 'test/from-http-js-append-20251112.txt'
  fs.append(path, new Blob(["Hello"], {type: 'text/plain'})).then(()=>{ 
    logger.info('append success')
    fs.read({path: path}).then((blob) => {
      blob.text().then(text => {
        logger.info(`read success: ${text}`)
        fs.append(path, new Blob([", world!"], {type: 'text/plain'})).then(()=>{
          logger.info('append success 2')
          fs.read({path}).then((blob) => {
            blob.text().then(text => {
              logger.info(`read success: ${text}`)
            })
          })
        })
      })
    })
  })

  // fs.upload('test/from-http-js-20251112.txt', new Blob(["Hello Http JS"], {type: 'text/plain'})).then(() => {
  //   logger.info('upload success');
  // });
  // fs.read({ path: 'test/from-python-sdk-v2-202509282026.txt', mediaType: 'text/plain' }).then(data => {
  //   data.text().then(text => {
  //     logger.info("test/from-python-sdk-v2-202509282026.txt text: " + text);
  //   });
  // });

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
    paddingTop: 0, //Platform.OS === OS.Android ? StatusBar.currentHeight : 0
  }
});

export default App;