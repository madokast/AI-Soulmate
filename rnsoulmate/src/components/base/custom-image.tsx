import React from "react";
import { StyleSheet, Image, Pressable } from "react-native";

import { ColorMode } from "../ui/color-mode-manager";

interface Source {
  uri:string;
  width:number;
  height:number;
}

interface Props {
  width:number;
  height:number;
  borderRadius?:number;
  borderWidth?:number;
  source: Source;
  colorMode: ColorMode;
  onPress?:()=>void;
  onLongPress?:()=>void;
}

function CustomImage(props: Props) {
  const [isLongPress, setIsLongPress] = React.useState<boolean>(false);

  const onLongPress = () => {
    if (props.onLongPress) {
      setIsLongPress(true);
      props.onLongPress();
    }
  }

  const onPress = () => {
    if (props.onPress && !isLongPress) {
      props.onPress();
    }
    setIsLongPress(false);
  }

  const style = {
    ...styles.container,
    ...styles[props.colorMode],
    width: props.width ,
    height: props.height,
    borderRadius: props.borderRadius ?? 10,
    borderWidth: props.borderWidth ?? 2,
  }

  const source = props.source;
  const { fitWidth, fitHeight } = calculateImageFitSize(source.width, source.height, props.width, props.height);
  const fitSource = {
    uri: source.uri,
    width: fitWidth,
    height: fitHeight,
  }

  return (
    <Pressable style={style} onPress={onPress} onLongPress={onLongPress}>
      <Image style={style} source={fitSource}/>
    </Pressable>
  );
}

function calculateImageFitSize(originalWidth:number, originalHeight:number, maxWidth:number, maxHeight:number):{fitWidth:number, fitHeight:number} {
    // 计算宽/高方向的缩放比
    const scaleX = maxWidth / originalWidth;
    const scaleY = maxHeight / originalHeight;

    // 取较大的缩放比（确保至少一个维度填满容器，另一个维度超出）
    const scale = Math.max(scaleX, scaleY);

    // 计算缩放后的尺寸（可根据需求保留小数/取整）
    const fitWidth = originalWidth * scale;
    const fitHeight = originalHeight * scale;

    // 可选：对结果取整（如UI渲染需要整数像素）
    // return { fitWidth: Math.round(fitWidth), fitHeight: Math.round(fitHeight) };

    return { fitWidth, fitHeight };
}


const styles = StyleSheet.create({
  container: {

  },
  [ColorMode.Light]: {
    borderColor: 'rgb(230, 230, 230)', // 白色背景，适合浅色模式
  },
  [ColorMode.Dark]: {
    borderColor: 'rgb(50, 50, 50)', // 深灰色背景，适合深色模式
  },
})

export default CustomImage;