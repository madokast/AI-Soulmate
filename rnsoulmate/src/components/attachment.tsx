import React, { useEffect, useState } from "react";
import { Image, View } from "react-native";

import CustomImage from "./base/custom-image";
import type { Attachment } from "../types/post";
import { ColorMode } from "./ui/color-mode-manager";
import { ReadAttachment } from "../internal/filesystem/current";

import { LoggerFactory } from "../internal/logger/logger";

import DefaultImage from "./base/default-image-url";

interface Props {
  attachment: Attachment;
  colorMode: ColorMode;
}

const ImageWidth = 100;
const logger = LoggerFactory.getLogger("Attachment");
const defaultImage = {
  uri: DefaultImage,
  width: ImageWidth,
  height: ImageWidth,
}

function Attachment(props: Props) {
  const attachment: Attachment = props.attachment;
  const [imageSource, setImageSource] = useState(defaultImage)
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
      {/* <Image style={[styles.container, styles[props.colorMode]]} key={attachment.path}
        source={imageSource}
      /> */}
      <CustomImage
        width={ImageWidth}
        height={ImageWidth}
        borderRadius={10}
        borderWidth={2}
        source={imageSource}
        colorMode={props.colorMode}
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

export default Attachment;