

import {useEffect} from 'react';
import { View, StyleSheet, FlatList, Platform } from 'react-native';
import { ListRenderItemInfo } from 'react-native';

import { ColorMode } from "./ui/color-mode-manager";

import { Post } from '../types/post';
import { ExamplePosts } from '../types/post';
import { Header } from './header';
import PostUI from './post';
import { OS } from '../internal/system';


interface Props {
  colorMode: ColorMode;
  height: number;
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

  const data: Array<Post> = ExamplePosts.slice().reverse();

  const Item = (itemInfo: ListRenderItemInfo<Post>) => {
    const item = itemInfo.item;
    return <PostUI post={item} colorMode={colorMode} />
  };

  return <View style={[styles.body, styles[colorMode], {height: props.height, width: props.width}]}>
    <Header colorMode={colorMode}/>
    <FlatList id='main-window-scroll-view' indicatorStyle={indicatorStyle}
      data={data}
      renderItem={Item}
      keyExtractor={item => item.id.toString()}
    />
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