import React from 'react';
import { View, StyleSheet } from 'react-native';

import { ColorMode } from '../ui/color-mode-manager';
import { LoggerFactory } from '../../internal/logger/logger';
import CustomImage from './custom-image';
import SmallText from './small-text';
import Media from '../../types/media';

import DefaultImage from './default-image-url';
const logger = LoggerFactory.getLogger('ImagePicker');

interface Props {
  id:string,
  colorMode: ColorMode;
  picked?:(uri:Media|null)=>void;
}

const ImageWidth = 100;

function ImagePicker(props:Props) {
  const id = `image-picker-${props.id}`
  const inputId = `${id}-input`
  const [imageUri, setImageUri0] = React.useState<string>(DefaultImage);
  const [imageSize, setImageSize] = React.useState<number>(0);

  const setImageUri = (media:Media|null) => {
    const uri = media?.dataUrl;
    setImageUri0(uri ?? DefaultImage);
    setImageSize(uri ? uri.length : 0);
    props.picked?.(media); // 通知父组件图片已选择
  }

  React.useEffect(() => {
    const imagePicker = document.getElementById(id);
    if (imagePicker) {
      const input = document.createElement('input');
      input.id = inputId;
      input.type = 'file';
      input.setAttribute('label', 'choose an image');
      input.accept = 'image/*';
      input.style.display = 'none';
      input.addEventListener('change', (e) => {
        logger.debug(`change input: ${inputId}`);
        const files = (e.target as HTMLInputElement).files;
        if (files && files.length > 0) {
          const file = files[0];
          const reader = new FileReader();
          reader.onloadend = () => {
            logger.info(`read image: ${file.name}`);
            const dataURL = reader.result as string;
            setImageUri({
              name: file.name,
              blob: urltoBlob(dataURL),
              dataUrl: dataURL,
            });
          };
          reader.readAsDataURL(file);
        }
        // 重置输入框（下次选择同一文件可触发 change）
        input.value = '';
      });
      imagePicker.appendChild(input);
    }
    return () => {
      if (imagePicker) {
        const input = document.getElementById(inputId);
        if (input) {
          input.remove();
        }
      }
    }
  }, []);

  // select an image
  const pick = () => {
    const input = document.getElementById(inputId);
    if (input) {
      logger.debug(`click input: ${inputId}`);
      input.click();
    }
  }

  const source = {
    uri:imageUri,
    width:ImageWidth,
    height:ImageWidth,
  }

  const parentStyle = {
    ...styles.parent,
    width: ImageWidth,
    height: ImageWidth,
  };

  return (<View id={id} style={parentStyle}> 
      <CustomImage
        width={ImageWidth}
        height={ImageWidth}
        source={source}
        onPress={pick}
        onLongPress={()=>setImageUri(null)}
        colorMode={props.colorMode}
      />
      <SmallText
        styles={{
          position: 'absolute',
          bottom: 0,
          left: 5,
        }}
        text={`${(imageSize / 1024).toFixed(2)}KB`}
        colorMode={props.colorMode}
      />
    </View>
  )
}

async function urltoBlob(url: string): Promise<Blob> {
  const res = await fetch(url)
  return res.blob()
}

const styles = StyleSheet.create({
  parent: {
    position: 'relative',
  }
});


export default ImagePicker;