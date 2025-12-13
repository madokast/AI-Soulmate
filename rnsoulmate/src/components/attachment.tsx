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
      Image.getSize(url, (width0, height0) => {
        const { width, height } = resizeImage(width0, height0)
        logger.info(`image size: ${width0}x${height0} -> ${width}x${height}`)
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

function resizeImage(width0: number, height0: number) {
  let width: number;
  let height: number;
  const maxOriginal = Math.max(width0, height0); // 原始尺寸的最大值

  // 等比缩放：缩放比例 = 目标最大值 / 原始最大值
  const scaleRatio = ImageWidth / maxOriginal;

  // 按比例计算新尺寸，并取整（确保整数尺寸）
  width = Math.round(width0 * scaleRatio);
  height = Math.round(height0 * scaleRatio);

  return { width, height };
}

export default Attachment;
export { ImageWidth as AttachmentWidth };