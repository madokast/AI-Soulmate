import React from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';
import { Platform } from 'react-native';

import { LoggerFactory } from './src/internal/logger/logger';
import { LoggingView } from './src/internal/logger/logging-view';

const logger = LoggerFactory.getLogger('App');

const App = () => {
  // 获取当前操作系统
  const currentPlatform = Platform.OS;
  logger.info(`App is running on platform: ${currentPlatform}`);

  logger.warn('This is a warning message from App component.');
  logger.error('This is an error message from App component.');

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Hello, World!</Text>
      <Text style={styles.paragraph}>My React Native App is running on the {currentPlatform}!</Text>
      <LoggingView />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E1E', // 深灰色背景，适合深色模式
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E0E0E0', // 浅灰色文本，在深色背景上有良好对比度
  },
  paragraph: {
    fontSize: 16,
    color: '#E0E0E0', // 浅灰色文本，在深色背景上有良好对比度
  }
});

export default App;