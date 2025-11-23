

import { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Platform } from 'react-native';
import { ListRenderItemInfo } from 'react-native';

import { ColorMode } from "./ui/color-mode-manager";
import { LoggerFactory } from '../internal/logger/logger';
import postService from '../services/post-service';

import Post from '../types/post';
import { Header } from './header';
import PostUI from './post';
import { OS } from '../internal/system';

const logger = LoggerFactory.getLogger('MainWindow');

interface Props {
  colorMode: ColorMode;
  height: number;
  width: number;
}

function MainWindow(props: Props) {
  const colorMode = props.colorMode;
  const indicatorStyle = colorMode === ColorMode.Dark ? 'white' : 'black';
  
  const [posts, setPosts] = useState<Array<Post>>([]);
  const fetchPosts = async () => {
    const posts = await postService.ReadAll();
    // await postService.Retain(4);
    setPosts(posts.slice().reverse());
    logger.info(`fetch ${posts.length} posts`);
  }
  
  useEffect(() => {
    // 隐藏滚动条
    if (Platform.OS === OS.Web) {
      const scrollView = document.getElementById('main-window-scroll-view');
      if (scrollView) {
        scrollView.style.overflow = 'auto';
        scrollView.style.scrollbarWidth = 'none';
      }
    }
    // 获取 posts
    fetchPosts().catch(error => logger.error("Failed to fetch posts.", error));
  }, []);

  const Item = (itemInfo: ListRenderItemInfo<Post>) => {
    const item = itemInfo.item;
    return <PostUI post={item} colorMode={colorMode} width={props.width} />
  };

  logger.trace(`height: ${props.height}, width: ${props.width}`);
  return <View style={[styles.body, styles[colorMode], {height: props.height, width: props.width}]}>
    <FlatList id='main-window-scroll-view' indicatorStyle={indicatorStyle}
      data={posts}
      renderItem={Item}
      keyExtractor={item => item.id.toString()}
      ListHeaderComponent={() => (
        <Header colorMode={colorMode} width={props.width} afterPost={fetchPosts} />
      )}
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