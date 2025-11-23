import React from "react";
import { StyleSheet, TextInput, View, Platform, TextInputKeyPressEventData, NativeSyntheticEvent, TextInputContentSizeChangeEventData, Dimensions, DimensionValue } from "react-native";

import { LoggerFactory } from "../internal/logger/logger";
import CustomButton from "./base/custom-button";
import postService from '../services/post-service';
import attachmentService from "../services/attachment-service";

import { ColorMode } from "./ui/color-mode-manager";
import { OS } from "../internal/system";
import ImagePicker from "./base/image-picker";
import Attachment from "../types/attachment";
import Media from "../types/media";

const logger = LoggerFactory.getLogger("header");

interface Props {
  colorMode: ColorMode;
  width:number;
  afterPost: () => unknown;
}

const buttonWidth = 32;

function Header(props: Props) {
  const [inputText, setInputText] = React.useState('');
  const [inputHeight, setInputHeight] = React.useState(0);
  const [mediaInputShow, setMediaInputShow] = React.useState(false); // 控制媒体选择器显示
  const [pickedMedia, setPickedMedia] = React.useState<Media|null>(null); // 已选择的媒体

  const onContentSizeChange = (event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
    setInputHeight(event.nativeEvent.contentSize.height)
  }

  const switchMediaInputShow = () => setMediaInputShow(!mediaInputShow);

  const submit = () => {
    logger.info(`submit: ${inputText}`);
    const content = inputText.trim();
    if (content.length > 0) {
      const medias:Media[] = []
      if (pickedMedia) {
        medias.push(pickedMedia);
        logger.info(`pickedMedia: ${pickedMedia.name}`)
      }
      doPost(content, medias, false).then(props.afterPost);
    }
  }

 // 监听键盘按键，处理 Ctrl+Enter 组合键
  const handleKeyPress = (e:NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    const { key, ctrlKey, metaKey } = e.nativeEvent as {key:string, ctrlKey:boolean, metaKey:boolean};
    // 检测 Enter 键，且按下了 Ctrl（Windows/Linux）或 Command（Mac）
    if (key === 'Enter' && (ctrlKey || metaKey)) {
      // 触发确认逻辑
      submit();
      // 阻止默认行为（避免 Enter 键导致的换行）
      e.preventDefault?.();
    }
  };

  React.useEffect(() => {
    // 隐藏滚动条
    if (Platform.OS === OS.Web) {
      const scrollView = document.getElementById('header-text-input');
      if (scrollView) {
        scrollView.style.overflow = 'auto';
        scrollView.style.scrollbarWidth = 'none';
      }
    }
  }, []);

  
  const inputWidthRatio = Math.floor((props.width - buttonWidth*1.5) * 100 / props.width);
  const inputWidth:DimensionValue = `${inputWidthRatio}%`
  logger.trace(`inputWidth: ${inputWidth}, props.width: ${props.width}`);
  const inputStyles = {
    ...inputStyle.input, 
    ...inputStyle[props.colorMode], 
    ...{'height':inputHeight+5, 'width':inputWidth},
  }

  return (
    <View>
      {/* 文本输入和提交按钮 */}
      <View style={textInputting.container}>
        <TextInput id="header-text-input"
          style={inputStyles}
          placeholder=""
          value={inputText}
          onChangeText={setInputText} // 实时更新输入状态
          keyboardType="default" // 默认键盘类型
          autoCapitalize="none" // 不自动大写
          autoCorrect={false} // 关闭自动纠错
          multiline={true} // 关键：开启多行模式
          onKeyPress={handleKeyPress} // 绑定按键监听
          onContentSizeChange={onContentSizeChange} 
        />
        <CustomButton
          title="C"
          colorMode={props.colorMode}
          onPress={submit} // 点击时传递输入内容
          onLongPress={switchMediaInputShow} // 点击时切换图片选择器显示
          width={buttonWidth}
          />
      </View>
      {mediaInputShow && (
        <ImagePicker 
          id="header-image-picker" 
          colorMode={props.colorMode}
          picked={setPickedMedia}
        />)}
    </View>
  );
}

async function doPost(content:string, medias:Media[], encrypt:boolean) {
  const attachments:Attachment[] = []
  for (const media of medias) {
    const attachment = await attachmentService.Post(media, encrypt)
    attachments.push(attachment)
  }
  await postService.Post(content, attachments, encrypt)
}


const textInputting = StyleSheet.create({
  container: {
    flexDirection: 'row', // 关键：设置为水平排列
    padding: 5, // 整体内边距
    paddingLeft: 20,
    alignItems: 'center', // 垂直方向居中对齐（让输入框和按钮高度对齐）
    gap: 10, // 输入框和按钮之间的间距（也可用marginRight实现）
  },
});

const inputStyle = StyleSheet.create({
  input: {
    padding: 5,
    borderRadius: 20,
    borderWidth: 3,
    fontSize: 16,
    textAlignVertical: 'top', // 在Android上，确保文本从顶部开始，而不是垂直居中
  },
  light: {
    backgroundColor: 'rgb(210, 210, 210)', // 白色背景，适合浅色模式
    borderColor: 'rgb(255, 255, 255)',
    color: "rgb(20, 20, 20)",
  },
  dark: {
    backgroundColor: 'rgb(30, 30, 30)', // 深灰色背景，适合深色模式
    borderColor: 'rgb(20, 20, 20)',
    color: "rgb(200, 200, 200)",
  },
});

export { Header };
