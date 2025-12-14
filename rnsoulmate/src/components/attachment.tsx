import React, { useEffect, useState } from "react";
import { Image, View } from "react-native";

import CustomImage from "./base/custom-image";
import type AttachmentType from "../types/attachment";

import { ColorMode } from "./ui/color-mode-manager";
import attachmentService from "../services/attachment-service";
import { LoggerFactory } from "../internal/logger/logger";

import DefaultImage from "./base/default-image-url";

interface Props {
  attachment: AttachmentType;
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
  const attachment: AttachmentType = props.attachment;
  const [imageSource, setImageSource] = useState(defaultImage)
  useEffect(() => {
    readAsDataURL(attachment).then(url => {
      Image.getSize(url, (width, height) => {
        logger.info(`image size: ${width}x${height}`)
        setImageSource({
          uri: url,
          width: width,
          height: height,
        });
      }, (error) => {
        logger.error(`load image error: ${error}`)
      });
    }).catch(error => {
      logger.error(`read attachment error: ${error}`)
    });
  }, [])

  return (
    <View key={attachment.path}>
      <CustomImage
        key={attachment.path}
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

async function readAsDataURL(attachment: AttachmentType): Promise<string> {
  const data = await attachmentService.Read(attachment);
  if (Object.prototype.toString.call(data.raw) === '[object String]') {
    return data.raw as string;
  }
  const readerPromise = new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = () => {
      reject(reader.error);
    }
    reader.readAsDataURL(data.raw as Blob);
  });
  return readerPromise as Promise<string>;
}

export default Attachment;
export { ImageWidth as AttachmentWidth };