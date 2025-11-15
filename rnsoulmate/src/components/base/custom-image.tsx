import { StyleSheet, Image, Pressable } from "react-native";

import { ImageSourcePropType } from "react-native";

import { ColorMode } from "../ui/color-mode-manager";

interface Props {
  width:number;
  height:number;
  borderRadius?:number;
  borderWidth?:number;
  source: ImageSourcePropType;
  colorMode: ColorMode;
  onPress?:()=>void;
  onLongPress?:()=>void;
}

function CustomImage(props: Props) {
  const style = {
    ...styles.container,
    ...styles[props.colorMode],
    width: props.width ,
    height: props.height,
    borderRadius: props.borderRadius ?? 10,
    borderWidth: props.borderWidth ?? 2,
  }

  return (
    <Pressable style={style} onPress={props.onPress} onLongPress={props.onLongPress}>
      <Image style={style} source={props.source}/>
    </Pressable>
  );
}


const styles = StyleSheet.create({
  container: {

  },
  [ColorMode.Light]: {
    borderColor: 'rgb(230, 230, 230)', // 白色背景，适合浅色模式
  },
  [ColorMode.Dark]: {
    borderColor: 'rgb(30, 30, 30)', // 深灰色背景，适合深色模式
  },
})

export default CustomImage;