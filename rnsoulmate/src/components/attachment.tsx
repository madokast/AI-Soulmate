import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { ImageURISource } from "react-native";

import type { Attachment } from "../types/post";
import { ColorMode } from "./ui/color-mode-manager";
import { ReadAttachment } from "../internal/filesystem/current";

import config from "../../config.json";

interface Props {
  attachment: Attachment;
  colorMode: ColorMode;
}

function Attachment(props: Props) {
  const attachment:Attachment = props.attachment;
  // ReadAttachment()

  return (
    <View style={[styles.container, styles[props.colorMode]]}>
      <Image
        source={{ 
          uri: config.loadingImg[props.colorMode], 
          width: config.imageWidth, 
          height: config.imageWidth
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
container: {
  borderWidth: 2,
  borderRadius: 2,
  },
  light: {
    borderColor: 'rgb(230, 230, 230)', // 白色背景，适合浅色模式
  },
  dark: {
    borderColor: 'rgb(30, 30, 30)', // 深灰色背景，适合深色模式
  },
})

export default Attachment;