

import {useEffect} from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';

import { ColorMode } from "./ui/color-mode-manager";

import {Header, HeaderHeight} from './header';
import Post from './post';
import { OS } from '../internal/system';


interface Props {
  colorMode: ColorMode;
  height: number
  width: number;
}

function MainWindow(props: Props) {
  const colorMode = props.colorMode;
  const indicatorStyle = colorMode === ColorMode.Dark ? 'white' : 'black';

  useEffect(() => {
    // 隐藏滚动条
    if (Platform.OS === OS.Web) {
      const scrollView = document.getElementById('main-window-scroll-view');
      if (scrollView) {
        scrollView.style.overflow = 'auto';
        scrollView.style.scrollbarWidth = 'none';
      }
    }
  }, []);

  return <View style={[styles.body, styles[colorMode], {height: props.height, width: props.width}]}>
    <Header colorMode={colorMode}/>
    <ScrollView id='main-window-scroll-view' indicatorStyle={indicatorStyle}>
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
        <Post content='This is a post!' attachments={[{ url: 'https://cdn.pixabay.com/photo/2025/05/23/06/35/sparrow-9617024_1280.jpg' }]}
        colorMode={colorMode} />
        <Post content='This is a post!' attachments={[{ url: 'https://cdn.pixabay.com/photo/2025/05/23/06/35/sparrow-9617024_1280.jpg' }]}
        colorMode={colorMode} />
        <Post content='This is a post!' attachments={[{ url: 'https://cdn.pixabay.com/photo/2025/05/23/06/35/sparrow-9617024_1280.jpg' }]}
        colorMode={colorMode} />
        <Post content='This is a post!' attachments={[{ url: 'https://cdn.pixabay.com/photo/2025/05/23/06/35/sparrow-9617024_1280.jpg' }]}
        colorMode={colorMode} />
        <Post content='This is a post!' attachments={[{ url: 'https://cdn.pixabay.com/photo/2025/05/23/06/35/sparrow-9617024_1280.jpg' }]}
        colorMode={colorMode} />
        <Post content='This is a post!' attachments={[{ url: 'https://cdn.pixabay.com/photo/2025/05/23/06/35/sparrow-9617024_1280.jpg' }]}
        colorMode={colorMode} />
        <Post content='This is a post!' attachments={[{ url: 'https://cdn.pixabay.com/photo/2025/05/23/06/35/sparrow-9617024_1280.jpg' }]}
        colorMode={colorMode} />
    </ScrollView>
  </View>
}

const styles = StyleSheet.create({
  body: {
    
  },
  light: {
    backgroundColor: 'rgb(255, 255, 255)', // 白色背景，适合浅色模式
  },
  dark: {
    backgroundColor: 'rgb(20, 20, 20)', // 深灰色背景，适合深色模式
  }
});

export default MainWindow;