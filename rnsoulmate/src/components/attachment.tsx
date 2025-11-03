import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image } from "react-native";
import { ImageURISource } from "react-native";

import type { Attachment } from "../types/post";
import { ColorMode } from "./ui/color-mode-manager";
import { ReadAttachment } from "../internal/filesystem/current";

import config from "../../config.json";
import { LoggerFactory } from "../internal/logger/logger";
import picLoading from "../asserts/images/pic-loading.svg";

interface Props {
  attachment: Attachment;
  colorMode: ColorMode;
}

const ImageWidth = config.imageWidth;
const logger = LoggerFactory.getLogger("Attachment");

function Attachment(props: Props) {
  const attachment: Attachment = props.attachment;
  const [imageSource, setImageSource] = useState({
    uri: picLoading,
    width: ImageWidth,
    height: ImageWidth,
  })
  useEffect(() => {
    ReadAttachment(attachment.path, attachment.media_type).then((blob) => {
      const reader = new FileReader();
      reader.onload = function () {
        const url = reader.result as string;
        Image.getSize(url, (width0, height0) => {
          const { width, height } = resizeImage(width0, height0)
          console.log(`image size: ${width0}x${height0} -> ${width}x${height}`)
          setImageSource({
            uri: url,
            width: width,
            height: height,
          });
        }, (error) => logger.error(`load image error: ${error}`));
      };
      reader.readAsDataURL(blob);
    })
  }, [])

  return (
    <View key={attachment.path}>
      <Image style={[styles.container, styles[props.colorMode]]} key={attachment.path}
        source={imageSource}
      />
    </View>
  );
}

function resizeImage(width0: number, height0: number) {
  let width = 0;
  let height = 0;
  if (width0 > height0) {
    width = ImageWidth;
    height = ImageWidth * height0 / width0;
    height = Math.ceil(height);
  } else {
    width = ImageWidth * width0 / height0;
    height = ImageWidth;
    width = Math.ceil(width0);
  }
  return { width, height };
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderRadius: 10,
  },
  light: {
    borderColor: 'rgb(230, 230, 230)', // 白色背景，适合浅色模式
  },
  dark: {
    borderColor: 'rgb(30, 30, 30)', // 深灰色背景，适合深色模式
  },
})

export default Attachment;